# Android install builds

Generated APK files stay local and are intentionally excluded from Git. The
source for every named build is preserved by its Git tag.

Current installable build: `daqaeq-noor-android-v1.4.2.apk`

The APK and its SHA-256 file are generated and attached automatically to the
GitHub release tagged `redesign-android-v1.4.2`.

- Package: `com.islamona.app`
- Minimum Android version: Android 7.0 (API 24)
- Install directly on a connected device:
  `adb install -r daqaeq-noor-android-v1.4.2.apk`

The debug APK is suitable for direct device installation. Google Play release
requires a private release key and an Android App Bundle (`.aab`). Never commit
the release key or its passwords.
