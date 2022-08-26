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
  const token = btoa(JSON.stringify(data));
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

export {
  submitSignupData
}