import { Buffer } from 'buffer';

const submitSignupData = async (data = {}, instnttxnid, workflowId) => {
  data['instnt_token'] = getToken();
  data['instnttxnid'] = instnttxnid;
  data['form_key'] = workflowId;
  const url = 'https://dev2-api.instnt.org/public/transactions/' + instnttxnid;
  const submitRequest = new Request(url, {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      method: 'PUT',
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(data),
  });
  return await submitTransaction(submitRequest);
}

const submitVerifyData = async (data = {}, instnttxnid) => {
  data['instnt_token'] = getToken();
  data['instnttxnid'] = instnttxnid;
  const url = 'https://dev2-api.instnt.org/public/transactions/verify/' + instnttxnid;
  const submitRequest = new Request(url, {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      method: 'PUT',
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(data),
  });
  return await submitTransaction(submitRequest);
}

const getToken = () => {
  if(!global.instnt || !global.instnt.workflowId || !global.instnt.instnttxnid) {
    throw new Exception("Instnt not initialized properly. Please call appropriate SDK component/function to initialize Instnt.");
  }
  const data = {};
  data['form_key'] = global.instnt.workflowId;
  data['fingerprint'] = "{visitorId: " + global.instnt.visitorId + "}";
  //data['bdata'] = window.bw?.U();

  //data['client_ip'] = '{{ data.client_ip }}';
  //data['expires_on'] = '{{ data.expires_on }}';

  if (global.instnt.debug) {
    data['debug'] = global.instnt.debug;
  }
  console.log("instnt token before encoding: " + JSON.stringify(data));
  const token = Buffer.from(JSON.stringify(data)).toString('base64');
  return token;
}

const submitTransaction =  async (submitRequest) => {
  try {
    const response = await fetch(submitRequest);
    if (!response.ok) {
        throw new Error(`Error during submit data! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("submit success : " + JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('error calling submitFormURL, URL: ', submitRequest.url);
    console.error(error);
    throw { error: error.status };
  }
}

const sendOTP = async (mobileNumber) => {
  const serviceURL = 'https://dev2-api.instnt.org';
  //Check is mobile number field available then validate it
  if (mobileNumber && mobileNumber.length < 1) {
      console.log('<------SEND OTP API END POINT-------> INVALID MOBILE NUMBER')
      return false;
  }
  const url = serviceURL + '/public/transactions/' + global.instnt.instnttxnid + '/otp';

  const requestPayload = {
      "phone": mobileNumber
  }
  console.log("sendOTP requestPayload: ", requestPayload);
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestPayload)
      });
      const data = await response.json();
      if (response.ok) {
          if (data && data.response && data.response.errors && data.response.errors.length == 0) {
             console.log('OTP SENT SUCCESSFULLY')
          } 
      } else {
        console.log('OTP SENT SUCCESSFULLY')
      }
  } catch (error) {
      console.log("Error while connecting to " + url, error);
  }
  return () => { }
}

const verifyOTP = async (mobileNumber, otpCode) => {
  
  const serviceURL = 'https://dev2-api.instnt.org';
  const url = serviceURL + '/public/transactions/' + global.instnt.instnttxnid + '/otp';
  
  if (typeof otpCode != "string" || otpCode.length != 6) {
      console.log('Received invalid otpCode ')
      return;
  }

  const requestPayload = {
      "phone": mobileNumber,
      "otp": otpCode,
      "isVerify": true
  }
  console.log("verifyOTP requestPayload: ", requestPayload);
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestPayload)
      });
      const data = await response.json();
      if (response.ok) {
          if (data && data.response && data.response.errors && data.response.errors.length == 0) {
              console.log('OTP Verified Successfully ')
          }
      } 
  } catch (error) {
      console.log("Error while connecting to " + url, error);
  }
}

export {
  submitSignupData,
  sendOTP,
  verifyOTP
}