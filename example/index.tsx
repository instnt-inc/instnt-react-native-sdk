import * as React from 'react';
import { AppRegistry,View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';
import App from './src/App';

export default function Main() {
  return (
    <PaperProvider>
      <View style={{ flex:1 }}>
        <App />
        <FlashMessage position="top" />
      </View>
    </PaperProvider>
  );
}

AppRegistry.registerComponent('main', () => Main);
