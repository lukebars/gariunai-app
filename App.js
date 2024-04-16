import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { lightTheme } from "./src/constants/theme/light";
import { ThemeProvider } from "styled-components/native";
import { MainScreen } from "./src/screens/MainScreen";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={lightTheme}>
        <MainScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
