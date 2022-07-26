import { NativeModules, Platform } from 'react-native';
import HelloWorld from './components//InstntSignupProvider/HelloWorld';
import InstntSignupProvider from './components/InstntSignupProvider/InstntSignupProvider';
import {submitSignupData} from './components/InstntSignupProvider/instnt';

const LINKING_ERROR =
  `The package '@instnt/instnt-react-native-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const InstntReactNativeSdk = NativeModules.InstntReactNativeSdk  ? NativeModules.InstntReactNativeSdk  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

function multiply(a: number, b: number): Promise<number> {
  return InstntReactNativeSdk.multiply(a, b);
}

export {multiply, InstntSignupProvider, submitSignupData};
