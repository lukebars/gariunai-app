import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { lightTheme } from "./src/constants/theme/light";
import { ThemeProvider } from "styled-components/native";
import { MainScreen } from "./src/screens/MainScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={lightTheme}>
        <MainScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
