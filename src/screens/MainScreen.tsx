import { useEffect, useRef, useState } from "react";
import { FetchLoader } from "../components/indicators/LoadingIndicator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { styled } from "styled-components/native";
import * as SplashScreen from "expo-splash-screen";
import { BackHandler, Platform } from "react-native";

const INJECTED_JAVASCRIPT = `(function() {
  const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
})();`;

export const MainScreen = () => {
  const edges = useSafeAreaInsets();

  const webViewRef = useRef<WebView>(null);

  const [autoIncrementingNumber, setAutoIncrementingNumber] = useState(0);
  const [isInitialLoad, setInitialLoad] = useState(true);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  function showLoader() {
    setLoading(true);
  }

  function hideLoader() {
    if (isInitialLoad) {
      SplashScreen.hideAsync();

      setInitialLoad(false);
    }

    setLoading(false);
  }

  const onAndroidBackPress = (): boolean => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  };

  useEffect((): (() => void) | undefined => {
    if (Platform.OS === "android") {
      const listener = BackHandler.addEventListener(
        "hardwareBackPress",
        onAndroidBackPress,
      );
      return (): void => {
        listener.remove();
      };
    }
  }, []);

  return (
    <>
      <FetchLoader showing={loading} height={edges.top + 4} />

      <StyledWebView
        key={autoIncrementingNumber}
        source={{ uri: "https://gariunai.lt/" }}
        automaticallyAdjustsScrollIndicatorInsets={true}
        originWhitelist={["https://gariunai.lt"]}
        contentInsetAdjustmentBehavior="scrollableAxes"
        onLoadEnd={hideLoader}
        onLoadStart={showLoader}
        onNavigationStateChange={(e) => setUrl(e.url)}
        allowsFullscreenVideo={false}
        allowsInlineMediaPlayback={true}
        allowsLinkPreview={false}
        allowUniversalAccessFromFileURLs={true}
        automaticallyAdjustContentInsets={false}
        bounces={false}
        allowsBackForwardNavigationGestures
        domStorageEnabled={true}
        hideKeyboardAccessoryView={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled={true}
        mixedContentMode={"compatibility"}
        scalesPageToFit={false}
        scrollEnabled={true}
        setBuiltInZoomControls={false}
        startInLoadingState={true}
        thirdPartyCookiesEnabled={true}
        // prevent blank screen
        onRenderProcessGone={() => {
          setAutoIncrementingNumber((prev) => prev + 1);
        }}
        onContentProcessDidTerminate={() =>
          setAutoIncrementingNumber((prev) => prev + 1)
        }
      />
    </>
  );
};

const StyledWebView = styled(WebView)`
  flex: 1;
  background-color: #1e8a35;
`;
