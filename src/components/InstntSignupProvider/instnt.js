const submitSignupData = async (data = {}, instnttxnid, workflowId) => {
  //data['instnt_token'] = instnt.getToken();
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
  //data['instnt_token'] = instnt.getToken();
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
    const data = {};
    data['form_key'] = globalData.form_key;
    data['client_referer_url'] = window.location.href;
    data['client_referer_host'] = window.location.hostname;
    data['fingerprint'] = document.getElementById("fingerprint_txt")?.value;
    data['bdata'] = window.bw?.U();

    data['client_ip'] = '{{ data.client_ip }}';
    data['expires_on'] = '{{ data.expires_on }}';

    if (window.instnt && window.instnt.debug) {
      data['debug'] = window.instnt.debug;
    }
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