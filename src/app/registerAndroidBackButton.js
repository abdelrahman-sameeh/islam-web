import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export const registerAndroidBackButton = () => {
  if (Capacitor.getPlatform() !== "android") return;

  void CapacitorApp.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
      return;
    }

    void CapacitorApp.exitApp();
  });
};
