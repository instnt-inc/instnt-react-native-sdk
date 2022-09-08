import React from 'react';

import { StyleSheet, View } from 'react-native';
import { InstntSignupProvider, submitSignupData} from '@instnt/instnt-react-native-sdk';
import { FingerprintJsProAgent } from '@instnt/instnt-react-native-sdk';
import { Text , TextInput, ActivityIndicator, Button, Dialog, Portal, Modal, ProgressBar, List} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface SignupViewProps {
  config: any;
  setShowSignupForm: (showSignupForm: boolean) => void
}

type SignupDataType = {
  [key: string]: any; 
};

export default function SignupView({config, setShowSignupForm}: SignupViewProps){
  const workflowId = 'v1639687041590101';
  const serviceURL = 'https://dev2-api.instnt.org';
  const [result, setResult] = React.useState<number | undefined>();
  const [instnttxnid, setInstnttxnid] = React.useState<String>("");
  const [instntResponse, setInstntResponse] = React.useState({});
  const [data, setData] = React.useState<SignupDataType>();
  const [loading, setLoading] = React.useState(true);
  const [submitResponse, setSubmitResponse] = React.useState({});
  const [decision, setDecision] = React.useState<String>();
  const [waitingDecision, setWaitingDecision] = React.useState(false);


  const onInstntInit = (response: any) => {
    console.log("received Instnt init event");
    setInstntResponse(response);
    setInstnttxnid(response.instnttxnid);
    setLoading(false);
  }

  const handleSignup = async () => {
    console.log('Signup button Pressed');
    const tempData: any = {"city": "Natick", "country": "USA", "email": "soubhratra@instnt.org", "firstName": "Soubhratra", "mobileNumber": "+1508-494-8925", "physicalAddress": "9 Peterson Rd", "state": "MA", "surName": "Das", "zip": "01760"};
    //setData(tempData);
    //console.log(tempData);
    console.log("Instnttxnid: "+ instnttxnid);
    //setLoading(true);
    setWaitingDecision(true);
    const response: any = await submitSignupData(tempData, instnttxnid, workflowId);
    console.log("submit response: "+ JSON.stringify(response));
    setSubmitResponse(response);
    console.log("decision: " + response.data.decision);
    setWaitingDecision(false);
    setDecision(response.data.decision);
  }

  return (
    <InstntSignupProvider 
        workflowId={config.workflowId} 
        onInit={onInstntInit}
        serviceURL={config.serviceURL}
      >
      <KeyboardAwareScrollView style={{flex:1}}>
        <Portal>
          <Modal visible={loading} onDismiss={() => setLoading(false)} contentContainerStyle={{backgroundColor: 'gray', padding: 30}}>
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
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['firstName'] = text;
                    setData(newData);
                  }}
                />
                <TextInput label="Last Name" 
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
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['email'] = text;
                    setData(newData);
                  }}
                />  
                <TextInput label="Phone" 
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['mobileNumber'] = text;
                    setData(newData);
                  }}
                />
              </View>
            </List.Accordion>
            <List.Accordion title="Enter Your Address" id="3" left={() => <List.Icon icon="equal" />}>
              <View style={{marginTop: 10, marginBottom: 10}}>
                <TextInput label="Physical Address" 
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['physicalAddress'] = text;
                    setData(newData);
                  }}
                />
                <TextInput label="City" 
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['city'] = text;
                    setData(newData);
                  }}
                />
                <TextInput label="State" 
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['state'] = text;
                    setData(newData);
                  }}
                />
                <TextInput label="Country" 
                  onChangeText={text => {
                    const newData: SignupDataType = {...data};
                    newData['country'] = text;
                    setData(newData);
                  }}
                />
                <TextInput label="Zipcode" 
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
