import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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
  let visitorId = "";

  useEffect(() => {
    (async () => {
      let url = serviceURL + '/public/transactions?format=json&sdk=react-native';
      console.log('URL', url)
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
        if(response.ok) {
          
          try {
            setInstnttxnid(data.instnttxnid);
            console.log('instnttxnid', data.instnttxnid)
            console.log("Instnt response:");
            console.log(data);

          await FingerprintjsModule.init(data.fingerprintjs_browser_token);
          
          const fingerPrintResponse = await FingerprintjsModule.getResponse();

          console.log("fingerPrintResponse", fingerPrintResponse);

            const jsonResponse = JSON.parse(fingerPrintResponse);
            visitorId = jsonResponse['visitorId'];
            console.log('visitorId', visitorId)

          } catch (error) {
            console.log('Fingeprintjs response is not correct json. Response : ' + response);
          }

          if(! (global as any).instnt) {
            (global as any).instnt = {}
          }
          (global as any).instnt.workflowId = workflowId;
          (global as any).instnt.isAsync = isAsync;
          (global as any).instnt.serviceURL = serviceURL;
          (global as any).instnt.visitorId = visitorId;

          (global as any).instnt.instnttxnid = data.instnttxnid;
          console.log("Instnt initialized. instnttxnid: " + data.instnttxnid);
          onInit && onInit?.(data);
        } 
      } catch (error: any) {
        console.log('Error while connecting to ' + url, error);
        throw { error: error.status };
      }
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
