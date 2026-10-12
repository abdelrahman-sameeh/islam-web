import { Capacitor } from "@capacitor/core";

export const registerServiceWorker = () => {
  if (
    process.env.NODE_ENV !== "production" ||
    Capacitor.isNativePlatform() ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(
      `${process.env.PUBLIC_URL}/service-worker.js`
    );
  });
};
