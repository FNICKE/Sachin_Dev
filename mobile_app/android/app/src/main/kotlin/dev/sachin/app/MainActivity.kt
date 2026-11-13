package dev.sachin.app

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.FileProvider
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.io.File
import java.security.MessageDigest

/**
 * In-app updates: the Dart side (UpdateService) downloads the new APK into
 * [updateDir]; this activity checks it and hands it to Android's installer.
 * Android always shows its own "Install" confirmation — apps outside the
 * Play Store can't install silently.
 */
class MainActivity : FlutterActivity() {

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                // Folder the APK is downloaded to (shared with the installer through UpdateFileProvider).
                "updateDir" -> result.success(updateDir().absolutePath)

                // Has the user allowed this app to install updates ("Install unknown apps")?
                "canInstall" -> result.success(canInstallPackages())

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

                // Opens Android's installer for the downloaded APK.
                "install" -> {
                    val path = call.argument<String>("path")
                    when {
                        path == null -> result.error("BAD_ARGS", "path is required", null)
                        Build.VERSION.SDK_INT < Build.VERSION_CODES.N ->
                            result.error("UNSUPPORTED", "In-app install needs Android 7 or newer", null)
                        else -> try {
                            installApk(File(path))
                            result.success(true)
                        } catch (e: Exception) {
                            result.error("INSTALL_FAILED", e.message, null)
                        }
                    }
                }

                else -> result.notImplemented()
            }
        }
    }

    private fun updateDir(): File = File(cacheDir, "updates").apply { mkdirs() }

    private fun canInstallPackages(): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.O || packageManager.canRequestPackageInstalls()

    private fun installApk(file: File) {
        require(file.exists()) { "The downloaded update is missing" }
        require(file.canonicalPath.startsWith(updateDir().canonicalPath)) { "Not an update file" }
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
    }
}
