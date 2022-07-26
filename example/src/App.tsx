import * as React from 'react';

import SignupConfig from './SignupConfig';
import SignupView from './SignupView';
import {Appbar} from 'react-native-paper';

export default function App() {
  const workflowId = 'v1639687041590101';
  const serviceURL = 'https://dev2-api.instnt.org';
  const [signupConfig, setSignupConfig] = React.useState({'workflowId': workflowId, 'serviceURL': serviceURL});
  const [isSetup, setIsSetup] = React.useState(true);


  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Instnt Signup Demo" />
      </Appbar.Header>
      { isSetup 
        ? <SignupConfig setConfig={setSignupConfig} setLoading={setIsSetup}/>
        : <SignupView config={signupConfig} setShowSignupForm={(showForm) => setIsSetup(!showForm)}/> 
      }
    </>
  );
}
