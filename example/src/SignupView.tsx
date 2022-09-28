import React from 'react';

import { StyleSheet, View } from 'react-native';
import { InstntSignupProvider, submitSignupData, sendOTP, verifyOTP } from '@instnt/instnt-react-native-sdk';
import { FingerprintJsProAgent } from '@instnt/instnt-react-native-sdk';
import { Text , TextInput, ActivityIndicator, Button, Dialog, Portal, Modal, ProgressBar, List} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SDK_VERSION } from '../../src/version';
import { showMessage, hideMessage } from "react-native-flash-message";

interface SignupViewProps {
  config: any;
  setShowSignupForm: (showSignupForm: boolean) => void
}

type SignupDataType = {
  [key: string]: any;
};

const SIGN_UP_ERROR = "Getting Some Error While SignUp Data";
export default function SignupView({config, setShowSignupForm}: SignupViewProps){
  const workflowId = 'v1639687041590101';
  const serviceURL = 'https://dev2-api.instnt.org';
  const [result, setResult] = React.useState<number | undefined>();
  const [instnttxnid, setInstnttxnid] = React.useState<string>();
  const [instntResponse, setInstntResponse] = React.useState({});
  const [data, setData] = React.useState<SignupDataType>();
  const [loading, setLoading] = React.useState(true);
  const [submitResponse, setSubmitResponse] = React.useState({});
  const [decision, setDecision] = React.useState<String>();
  const [waitingDecision, setWaitingDecision] = React.useState(false);
  const [signupError, setSignUpError] = React.useState<String>();
  const [isOtpEnableInWorkflow,setIsOtpEnableInWorkflow] = React.useState(false);
  const [isOtpEnable, setIsOtpEnable] = React.useState(false);
  const [otpVerify,setOtpVerify] = React.useState(false);
  const [otpVerified,setOtpVerified] = React.useState(false);


  const onInstntInit = (response: any) => {
    console.log("received Instnt init event");
    console.log('response :' ,response);
    setLoading(!loading);
    setIsOtpEnableInWorkflow(response.form.otp_verification);
    setIsOtpEnable(response.form.otp_verification)
    setInstntResponse(response);
    setInstnttxnid(response.instnttxnid);
  }

  const handleSignup = async () => {
    console.log('Signup button Pressed');
    console.log(`On-boarding Instnt SIGNUP With React-Native SDK version ${SDK_VERSION}`)
    //const tempData: any = {"city": "Natick", "country": "USA", "email": "soubhratra@instnt.org", "firstName": "Soubhratra", "mobileNumber": "+1508-494-8925", "physicalAddress": "9 Peterson Rd", "state": "MA", "surName": "Das", "zip": "01760"};
    console.log('SignUp Form Data :',data)
    setWaitingDecision(true);
    const response: any = await submitSignupData(data, instnttxnid, workflowId);
    if(response && response.data && response.data.decision){
      console.log("submit response: "+ JSON.stringify(response));
      setSubmitResponse(response);
      console.log("decision: " + response.data.decision);
      setWaitingDecision(false);
      setDecision(response.data.decision);
      return;
    }
    setWaitingDecision(false);
    setSignUpError(response.errorMessage || SIGN_UP_ERROR );

  }

  const hideLoadingSection = ()=> {
    /** No need to hide loading section on outer click that should be depend only on response of InstntSignupProvider onInit response */
    //setLoading(false)
  }

  const sendOTPCallback = async () =>{
    console.log('SendOTP button Pressed');
    const mobileNumber = data?.['mobileNumber'];
    const response: any = await sendOTP(mobileNumber);
    if(response.ok && response.status === 'success'){
      setIsOtpEnable(!isOtpEnable);
      setOtpVerify(!otpVerify);  
      showMessage({
        message: "Success Message",
        description: "OTP sent successfully.",
        type: "success",
      });
    }else{
      showMessage({
        message: "Error Message",
        description: "Error in send OTP, please check mobile number it should be in proper format.",
        type: "danger",
      });
    }
  }

  const verifyOTPCallback = async () => {
    console.log('VerifyOtp button Pressed');
    const mobileNumber = data?.['mobileNumber'];
    const verifyOtp = data?.['verifyOTP'];
    const response:any = await verifyOTP(mobileNumber,verifyOtp);
    if(response.ok && response.status === 'success'){
      setOtpVerify(!otpVerify);
      setOtpVerified(!otpVerified);
      showMessage({
        message: "Success Message",
        description: "OTP verified successfully.",
        type: "success",
      });
    }else{
      showMessage({
        message: "Error Message",
        description: "Error in verify OTP, please enter correct OTP.",
        type: "danger",
      });
    }
  }
  
  return (
    <InstntSignupProvider
        workflowId={config.workflowId}
        onInit={onInstntInit}
        serviceURL={config.serviceURL}
      >
      <KeyboardAwareScrollView style={{flex:1}}>
        <Portal>
          <Modal visible={loading} onDismiss={hideLoadingSection} contentContainerStyle={{backgroundColor: 'gray', padding: 30}}>
            <Text> Loading Instnt</Text>
            <ActivityIndicator animating={loading}/>
          </Modal>
        </Portal>
        <Portal>
          <Modal visible={waitingDecision} onDismiss={() => setWaitingDecision(false)} contentContainerStyle={{backgroundColor: 'gray', padding: 30}}>
          <Text style={{fontSize:16, fontWeight:"600"}}> Submitting data</Text>
          <ProgressBar indeterminate={true} visible={waitingDecision} />
          </Modal>
        </Portal>
        <View style={{width: "85%", alignSelf:"center", justifyContent:"center"}}>
          <List.AccordionGroup>
            <List.Accordion title="Enter Your Name" id="1" left={() => <List.Icon icon="equal" />}>
              <View style={{marginTop: 10, marginBottom: 10}}>
                <TextInput label="First Name"
                  value={data?.['firstName']}
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['firstName'] = text;
                    setData(newData);
                  }}
                />
                <TextInput label="Last Name"
                  value={data?.['surName']}
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['surName'] = text;
                    setData(newData);
                  }}
                />
              </View>
            </List.Accordion>
            <List.Accordion title="Enter Your contact" id="2" left={() => <List.Icon icon="equal"/>}>
              <View style={{marginTop: 10, marginBottom: 10}}>
                <TextInput label="Email"
                  value={data?.['email']}
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['email'] = text;
                    setData(newData);
                  }}
                />
                <TextInput label="Phone"
                  value={data?.['mobileNumber']}
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['mobileNumber'] = text;
                    setData(newData);
                  }}
                />
                {isOtpEnable && <View style={{flex: 1, flexDirection: "row", justifyContent:'flex-end'}}>
                  <Button
                  style={{marginTop:10}}
                  mode="contained"
                  onPress={sendOTPCallback}
                  >
                  Send OTP
                  </Button>
                </View>}
                {otpVerify && <>
                <TextInput label="Enter OTP"
                value={data?.['verifyOTP']}
                onChangeText={text => {
                  const newData: SignupDataType = {...data};
                  newData['verifyOTP'] = text;
                  setData(newData);
                }}/>
              <View style={{flex: 1, flexDirection: "row", justifyContent:'flex-end'}}>
              <Button
              style={{marginTop:10}}
              mode="contained"
              onPress={verifyOTPCallback}
              >
              Verify OTP
              </Button>
            </View></>
              
                }
              </View>
            </List.Accordion>
            <List.Accordion title="Enter Your Address" id="3" left={() => <List.Icon icon="equal" />}>
              <View style={{marginTop: 10, marginBottom: 10}}>
                <TextInput label="Physical Address"
                  value={data?.['physicalAddress']}
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['physicalAddress'] = text;
                    setData(newData);
                  }}
                />
                <TextInput label="City"
                  value={data?.['city']}
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['city'] = text;
                    setData(newData);
                  }}
                />
                <TextInput label="State"
                  value={data?.['state']}
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['state'] = text;
                    setData(newData);
                  }}
                />
                <TextInput label="Country"
                  value={data?.['country']}
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['country'] = text;
                    setData(newData);
                  }}
                />
                <TextInput label="Zipcode"
                  value={data?.['zip']}
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['zip'] = text;
                    setData(newData);
                  }}
                />
              </View>
            </List.Accordion>
          </List.AccordionGroup>
          <View style={{flex: 1, justifyContent: "space-evenly", flexDirection: "row", margin: 20}}>
            <Button
              style={{marginTop:10}}
              mode="contained"
              disabled={isOtpEnableInWorkflow && !otpVerified}
              onPress={handleSignup}
            >
              Signup
            </Button>
            <Button
              style={{marginTop:10}}
              mode="contained"
              onPress={() => setShowSignupForm(false)}
            >
              Cancel
            </Button>

          </View>
        </View>
      </KeyboardAwareScrollView>
      {decision != undefined &&
        <Portal>
        <Dialog visible={decision != null}>
          <Dialog.Title>Result</Dialog.Title>
          <Dialog.Content>
            <Text>Decision: {decision}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setDecision(undefined);
              setShowSignupForm(false);
            }}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      }
      {signupError !== undefined && signupError.length &&
      <Portal>
      <Dialog visible={signupError.length > 0 }>
        <Dialog.Title>Error</Dialog.Title>
        <Dialog.Content>
          <Text>Decision : {signupError}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => {
            setDecision(undefined);
            setSignUpError(undefined);
          }}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
      }
    
    </InstntSignupProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
