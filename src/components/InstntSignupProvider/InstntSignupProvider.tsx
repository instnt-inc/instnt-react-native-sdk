import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
//import { SDK_VERSION } from '../../version';
//import { FingerprintJsProAgent } from '@fingerprintjs/fingerprintjs-pro-react-native';
//import { FingerprintJsProAgent } from '../FingerprintJsPro/FingerprintJsProAgent';
import {NativeModules} from 'react-native';
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
    console.log("isAsync: " + isAsync);
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

          if(! (global as any).instnt) {
            (global as any).instnt = {}
          }
          (global as any).instnt.workflowId = workflowId;
          (global as any).instnt.isAsync = isAsync;
          (global as any).instnt.serviceURL = serviceURL;

          (global as any).instnt.visitorId = myVisitorID;
          
          //(global as any).instnt.visitorId = fpJSVisitorId;
          (global as any).instnt.instnttxnid = data.instnttxnid;
          //console.log("visitorId: " + fpJSVisitorId);
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
