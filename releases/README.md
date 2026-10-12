# Android install builds

Generated APK files stay local and are intentionally excluded from Git. The
source for every named build is preserved by its Git tag.

Current debug build: `islamona-android-v1.0-debug.apk`

SHA-256:
`c7f224642e2ec5ead98cec580296b1900ef06c74edd57430d2027d7bdd7b6a49`

- Package: `com.islamona.app`
- Minimum Android version: Android 7.0 (API 24)
- Install directly on a connected device:
  `adb install -r releases/islamona-android-v1.0-debug.apk`

The debug APK is suitable for direct device installation. Google Play release
requires a private release key and an Android App Bundle (`.aab`). Never commit
the release key or its passwords.
