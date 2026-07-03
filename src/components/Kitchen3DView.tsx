import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { KITCHEN3D_HTML } from '../generated/kitchen3dHtml';

export interface Kitchen3DViewHandle {
  postConfig: (config: unknown) => void;
}

interface Props {
  onReady?: () => void;
}

let NativeWebView: any = null;
if (Platform.OS !== 'web') {
  NativeWebView = require('react-native-webview').WebView;
}

const WebIframe: any = 'iframe';

const Kitchen3DView = forwardRef<Kitchen3DViewHandle, Props>(({ onReady }, ref) => {
  const webviewRef = useRef<any>(null);
  const iframeRef = useRef<any>(null);
  const loadedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    postConfig: (config: unknown) => {
      const payload = JSON.stringify(config);
      if (Platform.OS === 'web') {
        iframeRef.current?.contentWindow?.postMessage(payload, '*');
      } else {
        webviewRef.current?.postMessage(payload);
      }
    },
  }));

  const handleLoad = () => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    onReady?.();
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.fill}>
        <WebIframe
          ref={iframeRef}
          srcDoc={KITCHEN3D_HTML}
          onLoad={handleLoad}
          style={{ border: 'none', width: '100%', height: '100%', backgroundColor: '#eef1f4' }}
        />
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <NativeWebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: KITCHEN3D_HTML }}
        onLoadEnd={handleLoad}
        javaScriptEnabled
        domStorageEnabled
        style={styles.fill}
        scrollEnabled={false}
        bounces={false}
      />
    </View>
  );
});

Kitchen3DView.displayName = 'Kitchen3DView';

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

export default Kitchen3DView;
