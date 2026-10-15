import { Capacitor, registerPlugin } from "@capacitor/core";

const QuranAudio = registerPlugin("QuranAudio");

export const isAndroidNativeRuntime = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";

export default QuranAudio;
