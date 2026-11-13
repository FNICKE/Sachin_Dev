package dev.sachin.app

import androidx.core.content.FileProvider

/**
 * Lets Android's installer read the update APK downloaded into the app's cache
 * (see res/xml/update_paths.xml). Its own class so it never clashes with a
 * FileProvider declared by a plugin.
 */
class UpdateFileProvider : FileProvider()
