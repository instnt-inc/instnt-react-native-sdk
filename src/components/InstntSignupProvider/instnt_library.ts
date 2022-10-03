import PropTypes from 'prop-types';
import { global }from './global';
import { Buffer } from 'buffer';
import { SDK_VERSION } from '../../version';

export const SUBMIT_VERIFY_END_POINT = '/public/transactions/verify/';
export const SUBMIT_SIGNUP_END_POINT = '/public/transactions/';
export const SEND_OTP = '/otp';


export const submitSignupData = async (data: { [key: string]: any; } | undefined, instnttxnid: string | undefined, workflowId: string) => {
  console.log(`On-boarding Instnt SIGNUP With React-Native SDK version ${SDK_VERSION}`)
  if(data){
    data['instnt_token'] = getToken();
    data['instnttxnid'] = instnttxnid;
    data['form_key'] = workflowId;
  }
  const BASE_URL = (global as any).instnt.serviceURL;
  const url =  `${BASE_URL}${SUBMIT_SIGNUP_END_POINT}` + instnttxnid;
  const header = new Headers();
  header.append('Content-Type', 'application/json');
  const formInput = JSON.stringify(data);
  const requestOptions = {
    method: 'PUT',
    headers: header,
    body: formInput,
    redirect: 'follow',
  };
  return await submitTransaction(url,requestOptions);
}

submitSignupData.propType = {
  data: PropTypes.object,
  instnttxnid: PropTypes.string,
  workflowId: PropTypes.string,
};

export const submitVerifyData = async (data:{[x:string]:any}, instnttxnid: string) => {
  data['instnt_token'] = getToken();
  data['instnttxnid'] = instnttxnid;
  const BASE_URL = (global as any).instnt.serviceURL;
  const url = `${BASE_URL}${SUBMIT_VERIFY_END_POINT}` + instnttxnid;
  const header = new Headers();
  header.append('Content-Type', 'application/json');
  const formInput = JSON.stringify(data);
  const requestOptions = {
    method: 'PUT',
    headers: header,
    body: formInput,
    redirect: 'follow',
  };
  return await submitTransaction(url,requestOptions);
}

submitVerifyData.propType = {
  data: PropTypes.object,
  instnttxnid: PropTypes.string,
};

export const getRequestUrl = (
  url: string | Request,
  data: { [key: string]: any; } | undefined
) =>new Request(url, {headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(data),
  });

getRequestUrl.propType = {
  url: PropTypes.string,
  data: PropTypes.object,
};


export const getToken = () => {
    const _g = (global as any)
    if(!_g.instnt || !_g.instnt.workflowId || !_g.instnt.instnttxnid) {
      throw new Error("Instnt not initialized properly. Please call appropriate SDK component/function to initialize Instnt.");
    }
    const data = ({} as any);
    data['form_key'] = _g.instnt.workflowId;
    data['fingerprint'] = '{"visitorId": "' + _g.instnt.visitorId + '"}';
   
    if (_g.instnt.debug) {
      data['debug'] = _g.instnt.debug;
    }
    console.log("instnt token before encoding: " + JSON.stringify(data));
    const token = Buffer.from(JSON.stringify(data)).toString('base64')
    return token;
  }

export const submitTransaction =  async ( url: any, requestOptions : any) => {
  try {
    const response = await fetch( url, requestOptions);
    if (!response && response['ok']) {
        throw new Error(`Error during submit data! status: ${response['status']}`);
    }
    const data = await response.json();
    console.log("submit success : " + JSON.stringify(data));
    return data;
  } catch (error) {
    console.log('error calling submitFormURL, URL: ', url);
    console.log(error);
    throw { error:error };
  }
}

export const sendOTP = async (mobileNumber: string | any[]) => {
    const _g = (global as any);
    const instnttxnid = _g.instnt.instnttxnid;
    const BASE_URL = _g.instnt.serviceURL;
    //Check is mobile number field available then validate it
    if (mobileNumber && mobileNumber.length < 1) {
        console.log('<------SEND OTP API END POINT-------> INVALID MOBILE NUMBER')
        return false;
    }
    const url = `${BASE_URL}${SUBMIT_SIGNUP_END_POINT}${instnttxnid}${SEND_OTP}`;
  
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
               return {ok:true,status:'success'}
            } 
        } 
    } catch (error) {
        //console.log("Error while connecting to " + url, error);
        return {ok:false,status:'error'}
    }
    return () => { }
  }
  
export const verifyOTP = async (mobileNumber: any, otpCode: string | any[]) => {
    const _g = (global as any);
    const instnttxnid = _g.instnt.instnttxnid;
    const BASE_URL = _g.instnt.serviceURL;
    const url = `${BASE_URL}${SUBMIT_SIGNUP_END_POINT}${instnttxnid}${SEND_OTP}`;
    
    if (typeof otpCode != "string" || otpCode.length != 6) {
        console.log('Received invalid otpCode ')
        return {ok:false,status:'error'}
    }
  
    const requestPayload = {
        "phone": mobileNumber,
        "otp": otpCode,
        "is_verify": true
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
                return {ok:true,status:'success'}
            }
        } 
    } catch (error) {
        return {ok:false,status:'error'}
    }
    return () => { }
  }
  


