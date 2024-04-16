import { useState } from "react";
import { FetchLoader } from "../components/indicators/LoadingIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { styled } from "styled-components/native";

const INJECTED_JAVASCRIPT = `(function() {
  const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
})();`;

function isLoginPage(url: string) {
  return url.includes("wp-login");
}

export const MainScreen = () => {
  const [url, setUrl] = useState("");

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={isLoginPage(url) ? [] : ["top", "bottom"]}
    >
      <StyledWebView
        onNavigationStateChange={(e) => setUrl(e.url)}
        source={{ uri: "https://shop.porsche-club.lt/" }}
        originWhitelist={["*.porsche-club.lt*"]}
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
