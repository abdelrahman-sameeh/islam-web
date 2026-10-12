# iOS workflow

Islamona uses Capacitor 8 to package the responsive React production build as
a native iPhone and iPad application. The iOS project lives only on the
`mobile/ios` branch.

## Requirements on macOS

- Node.js 22 or newer
- macOS
- Xcode 26 or newer
- Xcode Command Line Tools
- An Apple ID for simulator/device development
- Apple Developer Program membership for TestFlight or App Store distribution

Capacitor 8 uses Swift Package Manager by default, so CocoaPods is not needed
for the current plugin set.

## Commands

- `npm run ios:sync`: build React and copy it into the Xcode project.
- `npm run ios:open`: sync and open the native project in Xcode.
- `npm run ios:run`: sync and select a simulator or connected device.
- `npm run ios:assets`: regenerate the iOS icon and light/dark launch images.

Run `ios:sync` after every web-code or dependency change. Generated web assets
inside `ios/App/App/public/` are managed by Capacitor and must not be edited by
hand.

## Xcode setup

1. Open `ios/App/App.xcodeproj` through `npm run ios:open`.
2. Select the `App` target, then `Signing & Capabilities`.
3. Select the owner's Apple development team and keep automatic signing on.
4. Confirm the bundle identifier is `com.islamona.app`.
5. Run on an iPhone simulator and a physical device before archiving.

The initial release is version `1.0`, build `1`, and targets iOS 15 or newer.
Increment the build number for every upload to App Store Connect.

## TestFlight and App Store

In Xcode select a generic iOS device, then use `Product > Archive`. In the
Organizer choose `Distribute App`, followed by `TestFlight & App Store`.
Creating the signed archive or IPA requires macOS, Xcode, and the owner's Apple
signing credentials; it cannot be completed from Linux.
