import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
//import { SDK_VERSION } from '../../version';
import { FingerprintJsProAgent } from '@fingerprintjs/fingerprintjs-pro-react-native';


const LIVE_SERVICE_URL = 'https://api.instnt.org';

const propTypes = {
  workflowId: PropTypes.string.isRequired,
  isAsync: PropTypes.bool,
  onInstntInit: PropTypes.func,
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
  const [visitorId, setVisitorId] = useState('');

  useEffect(() => {

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
          console.log("response:");
          console.log(data);
          onInit?.(data);
          //Initializing FingerprintJS
          //await getVisitorId();
          return;
        } 
      } catch (error: any) {
        console.log('Error while connecting to ' + url, error);
        throw { error: error.status };
      }

      async function getVisitorId() {
        try {
          const FingerprintJSClient = new FingerprintJsProAgent('uC2jNKwTbd1PbA22aLDr', 'us'); // Region may be 'us', 'eu', or 'ap'
          const visitorId = await FingerprintJSClient.getVisitorId();
          console.log("FPJS visitorId: " + visitorId);
          setVisitorId(visitorId);
        } catch (e: any) {
          console.error('Error: ', e);
          throw { error: e.status };
        }
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
