import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
//import { SDK_VERSION } from '../../version';
//import { FingerprintJsProAgent } from '@fingerprintjs/fingerprintjs-pro-react-native';
//import { FingerprintJsProAgent } from '../FingerprintJsPro/FingerprintJsProAgent';
import {NativeModules} from 'react-native';
import { setGlobalVar , globalVarModel} from './global';
import { SDK_VERSION } from '../../version';
const {FingerprintjsModule} = NativeModules;

const LIVE_SERVICE_URL = 'https://api.instnt.org';

const propTypes = {
  workflowId: PropTypes.string.isRequired,
  isAsync: PropTypes.bool,
  onInit: PropTypes.func,
  serviceURL: PropTypes.string,
  children: PropTypes.node,
};

interface InstntSignupProviderProps {
  workflowId: String;
  isAsync?: Boolean;
  onInit?: Function;
  serviceURL?: String;
  children?: React.ReactNode;
}

const InstntSignupProvider = ({
  workflowId,
  isAsync = false,
  onInit,
  serviceURL = LIVE_SERVICE_URL,
  children,
}: InstntSignupProviderProps) => {

  const [instnttxnid, setInstnttxnid] = useState('');
  const instnttxnidRef = useRef(instnttxnid);

  const [visitorId, setVisitorId] = useState('');
  const visitorIdRef = useRef(visitorId);


  useEffect(() => {
    console.log(`On-boarding Instnt Initialization With React-Native SDK version ${SDK_VERSION}`)
    console.log("isAsync: " + isAsync);
    setGlobalVar({});
    (async () => {
      let url = serviceURL + '/public/transactions?format=json&sdk=react-native';
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form_key: workflowId,
            hide_form_fields: true,
            redirect: false,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setInstnttxnid(data.instnttxnid);
          console.log("Instnt response:");
          console.log(data);
          //Initializing FingerprintJS
          //const fpJSVisitorId = await getVisitorId(data.fingerprintjs_browser_token);
          //setVisitorId(fpJSVisitorId);

          //let testVar = await FingerprintjsModule.testMethod("test")
          //console.log("testVar", testVar);

          //console.log("browser_token", data.fingerprintjs_browser_token);

          let initResponse = await FingerprintjsModule.init(data.fingerprintjs_browser_token);
          
          let response = await FingerprintjsModule.getResponse();

          console.log("getResponse -", response);

          var myVisitorID = "";
          try {
            const jsonResponse = JSON.parse(response);
            setVisitorId(jsonResponse['visitorId']);
            myVisitorID = jsonResponse['visitorId'];

          } catch (error) {
            console.log('Fingeprintjs response is not correct json. Response : ' + response);
          }


          if(! (globalVarModel as any).instnt) {
            (globalVarModel as any).instnt = {}
          }
          (globalVarModel as any).instnt.workflowId = workflowId;
          (globalVarModel as any).instnt.isAsync = isAsync;
          (globalVarModel as any).instnt.serviceURL = serviceURL;

          (globalVarModel as any).instnt.visitorId = myVisitorID;
          
          //(global as any).instnt.visitorId = fpJSVisitorId;
          (globalVarModel as any).instnt.instnttxnid = data.instnttxnid;
          //console.log("visitorId: " + fpJSVisitorId);
          setGlobalVar(globalVarModel);
          console.log("Instnt initialized. instnttxnid: " + data.instnttxnid);
          onInit && onInit?.(data);
        }
      } catch (error: any) {
        console.log('Error while connecting to ' + url, error);
        throw { error: error.status };
      }


/*
      async function getVisitorId(fingerprintjs_browser_token: string) {
        try {
          const FingerprintJSClient = new FingerprintJsProAgent(fingerprintjs_browser_token, 'us'); // Region may be 'us', 'eu', or 'ap'
          const fpJSVisitorId = await FingerprintJSClient.getVisitorId();
          setVisitorId(fpJSVisitorId);
          return fpJSVisitorId;
        } catch (e: any) {
          console.error('Error: ', e);
          throw { error: e.status };
        }
      } */
      
    })();
    return () => {
      // do any cleanup like script unloading etc
    };
  }, []);
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

InstntSignupProvider.propTypes = propTypes;

export default InstntSignupProvider;
