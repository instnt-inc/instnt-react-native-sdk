import * as React from 'react';

import SignupConfig from './SignupConfig';
import SignupView from './SignupView';
import { Appbar } from 'react-native-paper';

export default function App() {
  const workflowId = 'v626673100000';
  const serviceURL = 'https://sandbox-api.instnt.org';
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
