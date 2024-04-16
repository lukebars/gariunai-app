import { useEffect, useState } from "react";
import { FetchLoader } from "../components/indicators/LoadingIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { styled } from "styled-components/native";
import * as SplashScreen from "expo-splash-screen";

const INJECTED_JAVASCRIPT = `(function() {
  const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
})();`;

function isLoginPage(url: string) {
  return url.includes("wp-login");
}

export const MainScreen = () => {
  const [isInitialLoad, setInitialLoad] = useState(true);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const isInitialScreen = isLoginPage(url);

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

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={isInitialScreen ? ["top"] : ["top", "bottom"]}
    >
      <FetchLoader showing={loading} />
      <StyledWebView
        onLoadEnd={hideLoader}
        onLoadStart={showLoader}
        onNavigationStateChange={(e) => setUrl(e.url)}
        source={{ uri: "https://shop.porsche-club.lt/" }}
        allowsFullscreenVideo={false}
        allowsInlineMediaPlayback={true}
        allowsLinkPreview={false}
        allowUniversalAccessFromFileURLs={true}
        automaticallyAdjustContentInsets={false}
        bounces={false}
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
      />
    </SafeAreaView>
  );
};

const StyledWebView = styled(WebView)`
  flex: 1;
`;
