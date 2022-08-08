import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Text , TextInput, Button,} from 'react-native-paper';

interface SignupConfigProps {
  setConfig: (config: any) => void;
  setLoading: (loading: boolean) => void;
}

export default function SignupConfig({setConfig, setLoading}: SignupConfigProps) {
  const [workflowId, setWorkflowId] = React.useState('v1639687041590101');
  const [serviceURL, setServiceURL] = React.useState('https://dev2-api.instnt.org');

  return (
    <View style={{flex:1, justifyContent:"center"}}>
      <View style={{width: "85%", alignSelf:"center"}}>
        <TextInput label="Workflow Id" value={workflowId} onChangeText={newId => setWorkflowId(newId)}/>
        <TextInput label="Service URL" value={serviceURL} onChangeText={newURL => setServiceURL(newURL)}/>
        <Button 
          style={{marginTop:10}}
          mode="contained" 
          onPress={() => {
            setConfig({'workflowId': workflowId, 'serviceURL': serviceURL})
            setLoading(false);
          }}
        >
          Getting Started
        </Button>
      </View>
    </View>
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
