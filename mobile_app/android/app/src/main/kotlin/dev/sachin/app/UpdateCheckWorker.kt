package dev.sachin.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequest
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.TimeUnit

/**
 * Update alerts. About twice a day (only when online, and even when the app is
 * closed) Android runs this check: if GitHub has a newer version than the one
 * installed, it shows "Update available". Tapping it opens the app, whose
 * update pop-up downloads and installs it. One notification per new version.
 *
 * Off in the Google Play build (meta-data dev.sachin.app.SELF_UPDATE = false),
 * where Play updates the app, and in debug builds.
 */
class UpdateCheckWorker(context: Context, params: WorkerParameters) : Worker(context, params) {

    override fun doWork(): Result {
        val context = applicationContext
        if (!selfUpdates(context) || isDebuggable(context)) return Result.success()
        try {
            val latest = fetchLatest() ?: return Result.success()
            val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            if (latest.build > installedBuild(context) && prefs.getInt(KEY_NOTIFIED_BUILD, 0) < latest.build) {
                if (showNotification(context, latest.version)) {
                    prefs.edit().putInt(KEY_NOTIFIED_BUILD, latest.build).apply()
                }
            }
        } catch (e: Exception) {
            // No connection or GitHub unreachable: the next scheduled check tries again.
        }
        return Result.success()
    }

    private class Latest(val version: String, val build: Int)

    private fun fetchLatest(): Latest? {
        val connection = URL("$VERSION_URL?t=${System.currentTimeMillis()}").openConnection() as HttpURLConnection
        connection.connectTimeout = 15_000
        connection.readTimeout = 15_000
        connection.instanceFollowRedirects = true
        try {
            if (connection.responseCode != 200) return null
            val json = JSONObject(connection.inputStream.bufferedReader().use { it.readText() })
            val build = json.optInt("build_number", 0)
            return if (build > 0) Latest(json.optString("version", ""), build) else null
        } finally {
            connection.disconnect()
        }
    }

    companion object {
        private const val VERSION_URL =
            "https://github.com/FNICKE/Sachin_Dev/releases/download/mobile-latest/version.json"
        private const val WORK_NAME = "update-check"
        private const val CHANNEL_ID = "app_updates"
        private const val NOTIFICATION_ID = 1001
        private const val PREFS = "update_alerts"
        private const val KEY_NOTIFIED_BUILD = "notified_build"
        private const val KEY_ASKED_PERMISSION = "asked_notification_permission"

        /** Schedules the twice-daily check (keeps an existing schedule, so it's safe to call on every start). */
        fun schedule(context: Context) {
            if (!selfUpdates(context)) return
            val request = PeriodicWorkRequest.Builder(UpdateCheckWorker::class.java, 12, TimeUnit.HOURS)
                .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
                .setInitialDelay(2, TimeUnit.HOURS) // the app checks by itself while it's open
                .build()
            WorkManager.getInstance(context)
                .enqueueUniquePeriodicWork(WORK_NAME, ExistingPeriodicWorkPolicy.KEEP, request)
        }

        /** Removes the notification (the app is open — its pop-up takes over). */
        fun clearNotification(context: Context) {
            NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID)
        }

        /** True the first time it's called (used to ask for notification permission only once). */
        fun firstPermissionAsk(context: Context): Boolean {
            val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            if (prefs.getBoolean(KEY_ASKED_PERMISSION, false)) return false
            prefs.edit().putBoolean(KEY_ASKED_PERMISSION, true).apply()
            return true
        }

        fun selfUpdates(context: Context): Boolean = try {
            @Suppress("DEPRECATION")
            val info = context.packageManager.getApplicationInfo(context.packageName, PackageManager.GET_META_DATA)
            info.metaData?.getBoolean("dev.sachin.app.SELF_UPDATE", true) ?: true
        } catch (e: Exception) {
            true
        }

        private fun isDebuggable(context: Context): Boolean =
            (context.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0

        /** The installed build number (= Android versionCode = the GitHub Actions run number). */
        private fun installedBuild(context: Context): Long {
            val info = context.packageManager.getPackageInfo(context.packageName, 0)
            return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                info.longVersionCode
            } else {
                @Suppress("DEPRECATION")
                info.versionCode.toLong()
            }
        }

        @SuppressLint("MissingPermission") // checked just above the notify() call
        private fun showNotification(context: Context, version: String): Boolean {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
                ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) !=
                PackageManager.PERMISSION_GRANTED
            ) {
                return false // notifications not allowed — the pop-up still appears when the app opens
            }
            if (!NotificationManagerCompat.from(context).areNotificationsEnabled()) return false

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val manager = context.getSystemService(NotificationManager::class.java)
                if (manager.getNotificationChannel(CHANNEL_ID) == null) {
                    manager.createNotificationChannel(
                        NotificationChannel(CHANNEL_ID, "App updates", NotificationManager.IMPORTANCE_DEFAULT).apply {
                            description = "Tells you when a new version of the app is ready."
                        }
                    )
                }
            }

            val open = Intent(context, MainActivity::class.java)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            var flags = PendingIntent.FLAG_UPDATE_CURRENT
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags = flags or PendingIntent.FLAG_IMMUTABLE
            val tap = PendingIntent.getActivity(context, 0, open, flags)

            val text = if (version.isNotEmpty()) "Version $version is ready — tap to update." else "A new version is ready — tap to update."
            val notification = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stat_update)
                .setColor(Color.parseColor("#FF5C26"))
                .setContentTitle("Update available")
                .setContentText(text)
                .setStyle(
                    NotificationCompat.BigTextStyle().bigText(
                        "$text The app downloads and installs it for you — your data stays."
                    )
                )
                .setContentIntent(tap)
                .setAutoCancel(true)
                .setCategory(NotificationCompat.CATEGORY_RECOMMENDATION)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .build()
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, notification)
            return true
        }
    }
}
