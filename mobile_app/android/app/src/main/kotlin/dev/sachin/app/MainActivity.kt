package dev.sachin.app

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInstaller
import android.net.ConnectivityManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.FileProvider
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.io.File
import java.lang.ref.WeakReference
import java.security.MessageDigest

/**
 * In-app updates. The Dart side (UpdateService) downloads the new APK into
 * [updateDir]; this activity checks it and installs it with Android's
 * PackageInstaller:
 * - Android 12+: the app updates itself without asking (needs "Install unknown
 *   apps" allowed once, and UPDATE_PACKAGES_WITHOUT_USER_ACTION).
 * - Older Android, or when Android decides to ask: its "Install" screen opens.
 * Results come back through InstallStatusReceiver -> "installStatus" on the channel.
 */
class MainActivity : FlutterActivity() {

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        val updater = MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
        channel = updater
        updater.setMethodCallHandler { call, result ->
            when (call.method) {
                // Folder the APK is downloaded to.
                "updateDir" -> result.success(updateDir().absolutePath)

                // Has the user allowed this app to install updates ("Install unknown apps")?
                "canInstall" -> result.success(canInstallPackages())

                // Can the update be installed without Android's "Install" screen?
                "canInstallSilently" -> result.success(
                    Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && canInstallPackages()
                )

                // Wi-Fi or another unmetered connection (updates download by themselves there).
                "isUnmetered" -> {
                    val connectivity = getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
                    result.success(connectivity != null && !connectivity.isActiveNetworkMetered)
                }

                // Opens the system screen where that permission is switched on.
                "openInstallSettings" -> {
                    try {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            startActivity(
                                Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:$packageName"))
                            )
                        }
                        result.success(true)
                    } catch (e: Exception) {
                        result.error("SETTINGS_FAILED", e.message, null)
                    }
                }

                // SHA-256 of the downloaded file, so a broken download is never installed.
                "sha256" -> {
                    val path = call.argument<String>("path")
                    if (path == null) {
                        result.error("BAD_ARGS", "path is required", null)
                    } else {
                        Thread {
                            val hash = try { sha256Of(File(path)) } catch (e: Exception) { null }
                            runOnUiThread { result.success(hash) }
                        }.start()
                    }
                }

                // Installs the downloaded APK. Returns "session" (PackageInstaller; the
                // outcome arrives as installStatus) or "viewer" (Android's install screen).
                "install" -> {
                    val path = call.argument<String>("path")
                    val background = call.argument<Boolean>("background") ?: false
                    if (path == null) {
                        result.error("BAD_ARGS", "path is required", null)
                    } else {
                        val file = File(path)
                        Thread {
                            val sessionError = try {
                                installWithSession(file)
                                null
                            } catch (e: Exception) {
                                e
                            }
                            runOnUiThread {
                                when {
                                    sessionError == null -> result.success("session")
                                    // An activity can't be opened while the app is in the background.
                                    background -> result.error("INSTALL_FAILED", sessionError?.message, null)
                                    else -> try {
                                        installWithViewer(file)
                                        result.success("viewer")
                                    } catch (e: Exception) {
                                        result.error("INSTALL_FAILED", e.message ?: sessionError?.message, null)
                                    }
                                }
                            }
                        }.start()
                    }
                }

                else -> result.notImplemented()
            }
        }
    }

    override fun onResume() {
        super.onResume()
        current = WeakReference(this)
        // Android asked to confirm an install while the app was in the background: show it now.
        pendingConfirmation?.let {
            pendingConfirmation = null
            launchConfirmation(this, it)
        }
    }

    override fun onPause() {
        if (current?.get() === this) current = null
        super.onPause()
    }

    override fun cleanUpFlutterEngine(flutterEngine: FlutterEngine) {
        channel = null
        super.cleanUpFlutterEngine(flutterEngine)
    }

    private fun updateDir(): File = File(cacheDir, "updates").apply { mkdirs() }

    private fun canInstallPackages(): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.O || packageManager.canRequestPackageInstalls()

    private fun checkUpdateFile(file: File) {
        require(file.exists()) { "The downloaded update is missing" }
        require(file.canonicalPath.startsWith(updateDir().canonicalPath)) { "Not an update file" }
    }

    /** Streams the APK into a PackageInstaller session and commits it (runs off the main thread). */
    private fun installWithSession(file: File) {
        checkUpdateFile(file)
        val installer = packageManager.packageInstaller
        val params = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL)
        params.setAppPackageName(packageName)
        params.setSize(file.length())
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // The app updating itself: Android 12+ installs it without asking.
            params.setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_NOT_REQUIRED)
        }
        val sessionId = installer.createSession(params)
        try {
            installer.openSession(sessionId).use { session ->
                session.openWrite("base.apk", 0, file.length()).use { out ->
                    file.inputStream().use { input -> input.copyTo(out, 64 * 1024) }
                    session.fsync(out)
                }
                val statusIntent = Intent(this, InstallStatusReceiver::class.java).setAction(ACTION_INSTALL_STATUS)
                var flags = PendingIntent.FLAG_UPDATE_CURRENT
                // Android fills the result into this intent, so it must be mutable (Android 12+).
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) flags = flags or PendingIntent.FLAG_MUTABLE
                val pending = PendingIntent.getBroadcast(this, sessionId, statusIntent, flags)
                session.commit(pending.intentSender)
            }
        } catch (e: Exception) {
            try { installer.abandonSession(sessionId) } catch (ignored: Exception) { }
            throw e
        }
    }

    /** Fallback: Android's install screen via the APK file (Android 7+). */
    private fun installWithViewer(file: File) {
        checkUpdateFile(file)
        require(Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) { "Install screen fallback needs Android 7+" }
        val uri = FileProvider.getUriForFile(this, "$packageName.updates", file)
        val intent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, "application/vnd.android.package-archive")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        startActivity(intent)
    }

    private fun sha256Of(file: File): String {
        val digest = MessageDigest.getInstance("SHA-256")
        file.inputStream().use { input ->
            val buffer = ByteArray(64 * 1024)
            while (true) {
                val read = input.read(buffer)
                if (read < 0) break
                digest.update(buffer, 0, read)
            }
        }
        return digest.digest().joinToString("") { "%02x".format(it) }
    }

    companion object {
        private const val CHANNEL = "dev.sachin.app/updater"
        const val ACTION_INSTALL_STATUS = "dev.sachin.app.INSTALL_STATUS"

        private var channel: MethodChannel? = null
        private var current: WeakReference<MainActivity>? = null
        private var pendingConfirmation: Intent? = null

        /** Called on the main thread by [InstallStatusReceiver] with PackageInstaller's result. */
        fun onInstallStatus(status: Int, message: String?, confirmation: Intent?) {
            if (status == PackageInstaller.STATUS_PENDING_USER_ACTION && confirmation != null) {
                val activity = current?.get()
                if (activity != null) launchConfirmation(activity, confirmation) else pendingConfirmation = confirmation
            }
            channel?.invokeMethod("installStatus", mapOf("status" to status, "message" to message))
        }

        private fun launchConfirmation(activity: MainActivity, confirmation: Intent) {
            try {
                activity.startActivity(confirmation)
            } catch (e: Exception) {
                channel?.invokeMethod(
                    "installStatus",
                    mapOf("status" to PackageInstaller.STATUS_FAILURE, "message" to e.message)
                )
            }
        }
    }
}
