import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import SafeScreen from "@/components/SafeScreen";
import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toastConfig";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
        <Toast config={toastConfig} />
      </SafeScreen>
    </ClerkProvider>
  );
}
