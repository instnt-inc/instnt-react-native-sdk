import { NativeModules, Platform } from 'react-native';
import InstntSignupProvider from './components/InstntSignupProvider/InstntSignupProvider';
import {submitSignupData, sendOTP, verifyOTP} from './components/InstntSignupProvider/instnt_library';
import { FingerprintJsProAgent } from './components/FingerprintJsPro/FingerprintJsProAgent'; ///FingerprintJsPro/FingerprintJsProAgent

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


export {InstntSignupProvider, submitSignupData, sendOTP,verifyOTP,FingerprintJsProAgent};
