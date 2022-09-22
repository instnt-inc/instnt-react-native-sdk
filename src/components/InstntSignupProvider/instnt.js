import { Buffer } from 'buffer';

const submitSignupData = async (data = {}, instnttxnid, workflowId) => {
  data['instnt_token'] = getToken();
  data['instnttxnid'] = instnttxnid;
  data['form_key'] = workflowId;
  const url = 'https://dev2-api.instnt.org/public/submitformdata/v1.0';
  console.log('payload body', data)

  let headers = new Headers();
  headers.append("Content-Type", "application/json");

  let formInput = JSON.stringify(data);

  let requestOptions = {
    method: 'POST',
    headers: headers,
    body: formInput,
    redirect: 'follow'
  };
  return await submitTransaction(url, requestOptions);
}

const submitVerifyData = async (data = {}, instnttxnid) => {
  data['instnt_token'] = getToken();
  data['instnttxnid'] = instnttxnid;
  const url = 'https://dev2-api.instnt.org/public/transactions/verify/' + instnttxnid;
  const submitRequest = new Request(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(data),
  });
  return await submitTransaction(submitRequest);
};

const getToken = () => {
  if (!global.instnt || !global.instnt.workflowId || !global.instnt.instnttxnid) {
    throw new Exception("Instnt not initialized properly. Please call appropriate SDK component/function to initialize Instnt.");
  }
  const data = {};
  data.form_key = global.instnt.workflowId;
  data.fingerprint = '{"visitorId": "' + global.instnt.visitorId + '"}';
  if (global.instnt.debug) {
    data.debug = global.instnt.debug;
  }
  console.log('instnt token before encoding: ' + JSON.stringify(data));
  const token = Buffer.from(JSON.stringify(data)).toString('base64');
  return token;
};

const submitTransaction = async (url, requestOptions) => {
  try {
    const response = await fetch(url, requestOptions);
    console.log('fetch response', response)
    if (!response.ok) {
      throw new Error(`Error during submit data! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('submit success : ' + JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('error calling submitFormURL, URL: ', url);
    console.error(error);
    throw { error: error.status };
  }
};

export { submitSignupData };
