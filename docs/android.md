# Android workflow

Islamona uses Capacitor to package the same responsive React production build
used by the desktop website. Android is additive; `npm start` and `npm run
build` keep working as before.

## Requirements

- Node.js 22 or newer
- Java 21
- Android SDK Platform 36
- Android SDK Build Tools 35 or newer

Set `JAVA_HOME` and `ANDROID_HOME` (or configure the SDK through Android
Studio) before using the command-line build.

## Commands

- `npm run mobile:sync`: build the website and copy it into Android.
- `npm run mobile:android`: sync and open the native project in Android Studio.
- `npm run android:apk`: sync and create a signed debug APK.

Gradle writes the APK to
`android/app/build/outputs/apk/debug/app-debug.apk`. Copy named install builds
to `releases/`; that directory keeps its README in Git but ignores APK files.

## Storage

Web and desktop continue to use the existing `localStorage` keys. Android uses
Capacitor Preferences for the same lightweight theme, city, and daily-session
values. Removing the Android app clears its native stored values.

## Android back button

The native back button follows the React Router history. It returns to the
previous page when one exists and exits the app only from the first history
entry. Keep this behavior in `src/app/registerAndroidBackButton.js`; page
components must not register competing native back listeners.
