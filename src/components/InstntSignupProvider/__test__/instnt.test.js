import {
    SUBMIT_VERIFY_END_POINT,
    SUBMIT_SIGNUP_END_POINT,
    getRequestUrl,
    submitSignupData,
    submitVerifyData,
    submitTransaction,
    sendOTP,
    verifyOTP,
  } from '../instnt_library';
import { setGlobalVar,globalVarModel} from '../global';
import { data, instnttxnid, workflowId } from '../__mock__/instnt.mock';

const BASE_URL = 'https://dev2-api.instnt.org';

const requestedUrlObject = (url,data)=>{
    if(url && url.length){
        return {
            url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'PUT',
            mode: 'cors',
            cache: 'default',
            data:JSON.stringify(data)}
    }
    return null;
}

describe('Get Request Url', () => {
    it('should call requested url for submit signup data', () => {
        const url = `${BASE_URL}${SUBMIT_SIGNUP_END_POINT}` + instnttxnid;
        window.Request = jest.fn().mockImplementation(() => { return requestedUrlObject(url,data)});//we do for mocking constructor
        expect(getRequestUrl(url, data)).toMatchObject(requestedUrlObject(url,data));
        expect(window.Request).toBeCalledTimes(1);
    });
    it('should call requested url for submit verify data', () => {
        const url = `${BASE_URL}${SUBMIT_VERIFY_END_POINT}` + instnttxnid;
        window.Request=jest.fn().mockImplementation(() => { return requestedUrlObject(url,data)});//we do for mocking constructor
        expect(getRequestUrl(url, data)).toMatchObject(requestedUrlObject(url,data));
        expect(window.Request).toBeCalledTimes(1);
    });
    it('should return requested url object as {}', () => {
        const url = null;
        window.Request=jest.fn().mockImplementation(() => { return requestedUrlObject(url,data)});//we do for mocking constructor
        expect(getRequestUrl(url, data)).toEqual({});
        expect(window.Request).toBeCalledTimes(1);
    });
});

describe('Get Submit Transaction When Getting Response From API Calling ', ()=>{
    describe('Getting Response from API Calling',()=>{
        const apiSuccessResponse = {instnt: {},ok:200};
        const unmockedFetch = global.fetch;
        const unmockedHeaders = global.Headers;
        beforeEach(()=>{
            // adding mock for fetch request
            global.fetch = jest.fn(()=>
                Promise.resolve({
                    json: ()=>Promise.resolve(apiSuccessResponse)
                })
            );
            // define `append` as a mocked fn
            const append = jest.fn();
            // set test `Headers`
            global.Headers = () => ({
                append: append,
            });
        })

        it('should call submit transaction from submit signup data', async ()=>{
            const url = `${BASE_URL}${SUBMIT_SIGNUP_END_POINT}` + instnttxnid;
            const header = new Headers();
            header.append('Content-Type', 'application/json');
            const formInput = JSON.stringify(data);
            const requestOptions = {
                method: 'PUT',
                headers: header,
                body: formInput,
                redirect: 'follow',
            };
            const submitSignupData = await submitTransaction(url,requestOptions);
            expect(submitSignupData).toMatchObject(apiSuccessResponse);
            expect(fetch).toHaveBeenCalledTimes(1);
        })

        it('should call submit transaction from submit verify data', async ()=>{
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
            const submitVerifyData = await submitTransaction(url,requestOptions);
            expect(submitVerifyData).toMatchObject(apiSuccessResponse);
            expect(fetch).toHaveBeenCalledTimes(1);
        })
        afterAll(()=>{
            global.fetch = unmockedFetch;
            global.Headers = unmockedHeaders;
        })
    });
})

describe('Get Submit Transaction When Getting No Response From API Calling ',()=>{
    describe('Getting No Response from API Calling',()=>{
        const apiErrorMessage = {error:'Error During Submit Transaction'};
        const unmockedErrorFetch = global.fetch;
        const unmockedHeaders = global.Headers;
        beforeEach(async ()=>{
            // adding mock for fetch request
            global.fetch = jest.fn(() => Promise.reject({
                error: apiErrorMessage.error
            }));
            // define `append` as a mocked fn
            const append = jest.fn();
            // set test `Headers`
            global.Headers = () => ({
                append: append,
            });
        })

        it('should call submit transaction from submit signup data', async ()=>{
            const url = `${BASE_URL}${SUBMIT_SIGNUP_END_POINT}` + instnttxnid;
            const header = new Headers();
            header.append('Content-Type', 'application/json');
            const formInput = JSON.stringify(data);
            const requestOptions = {
                method: 'PUT',
                headers: header,
                body: formInput,
                redirect: 'follow',
            };
            try{
                await submitTransaction(url,requestOptions);
            }catch(error){
                expect(error.error).toMatchObject(apiErrorMessage);
            }
            expect(fetch).toHaveBeenCalledTimes(1);
        })

        it('should call submit transaction from submit verify data', async ()=>{
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
            try{
                await submitTransaction(url,requestOptions);
            }catch(error){
                expect(error.error).toMatchObject(apiErrorMessage);
            }
            expect(fetch).toHaveBeenCalledTimes(1);
        })
        afterAll(()=>{
            global.fetch = unmockedErrorFetch;
            global.Headers = unmockedHeaders;
        })
    });

})

describe('SubmitSignupData',()=>{

    beforeEach(()=>{
        globalVarModel.instnt.workflowId = '123';
        globalVarModel.instnt.isAsync = true;
        globalVarModel.instnt.serviceURL = 'https://test/';
        globalVarModel.instnt.visitorId = '1';
        globalVarModel.instnt.instnttxnid = '1234';
        setGlobalVar(globalVarModel);
    })
    it('should return proper response after submit transaction',()=>{
        const apiSuccessResponse = {instnt: {},ok:200};
        //window.Request =jest.fn().mockImplementation(()=>{return {}})
        // adding mock for fetch request
        global.fetch=jest.fn(()=>
        Promise.resolve({
            json: ()=>Promise.resolve(apiSuccessResponse)
        }));
        // define `append` as a mocked fn
        const append = jest.fn();
        // set test `Headers`
        global.Headers = () => ({
            append: append,
        });
        const submitSignupDataResponse= submitSignupData(data,instnttxnid,workflowId);
        expect(submitSignupDataResponse).toBeDefined();
        //expect(window.Request).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledTimes(1);
        fetch.mockClear();
    })

    it('should return error response after submit transaction',()=>{
        const apiErrorMessage = {error:'Error During Submit Transaction'};
        //window.Request =jest.fn().mockImplementation(()=>{return {}})
        // adding mock for fetch request
        global.fetch = jest.fn(() => Promise.reject({
            error: apiErrorMessage.error
        }));
        // define `append` as a mocked fn
        const append = jest.fn();
        // set test `Headers`
        global.Headers = () => ({
            append: append,
        });
        try{
            submitSignupData(data,instnttxnid,workflowId);
        }catch(error){
            expect(error).toBeDefined()
        }
        //expect(window.Request).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledTimes(1);
        fetch.mockClear();
    })

    afterEach(()=>{
        setGlobalVar({})
    })
})

describe('SubmitVerifyData',()=>{

    beforeEach(()=>{
        globalVarModel.instnt.workflowId = '123';
        globalVarModel.instnt.isAsync = true;
        globalVarModel.instnt.serviceURL = 'https://test/';
        globalVarModel.instnt.visitorId = '1';
        globalVarModel.instnt.instnttxnid = '1234';
          setGlobalVar(globalVarModel);
    })
    it('should return proper response after submit transaction',()=>{
        const apiSuccessResponse = {instnt: {},ok:200};
        //window.Request =jest.fn().mockImplementation(()=>{return {}})
        // adding mock for fetch request
        global.fetch=jest.fn(()=>
        Promise.resolve({
            json: ()=>Promise.resolve(apiSuccessResponse)
        }))
        // define `append` as a mocked fn
        const append = jest.fn();
        // set test `Headers`
        global.Headers = () => ({
            append: append,
        });
        const submitVerifyDataResponse= submitVerifyData(data,instnttxnid,workflowId);
        expect(submitVerifyDataResponse).toBeDefined();
        //expect(window.Request).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledTimes(1);
        fetch.mockClear();
    })

    it('should return error response after submit transaction',()=>{
        const apiErrorMessage = {error:'Error During Submit Transaction'};
        //window.Request =jest.fn().mockImplementation(()=>{return {}})
        // adding mock for fetch request
        global.fetch = jest.fn(() => Promise.reject({
            error: apiErrorMessage.error
        }));
        // define `append` as a mocked fn
        const append = jest.fn();
        // set test `Headers`
        global.Headers = () => ({
            append: append,
        });
        try{
            submitVerifyData(data,instnttxnid,workflowId);
        }catch(error){
            expect(error).toBeDefined()
        }
        //expect(window.Request).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledTimes(1);
        fetch.mockClear();
    })

    afterEach(()=>{
        setGlobalVar({})
    })
})

describe('Send OTP',()=>{
    beforeEach(()=>{
        globalVarModel.instnt.workflowId = '123';
        globalVarModel.instnt.isAsync = true;
        globalVarModel.instnt.serviceURL = 'https://test/';
        globalVarModel.instnt.visitorId = '1';
        globalVarModel.instnt.instnttxnid = '1234';
        setGlobalVar(globalVarModel);
    })

    it('should return proper response after send OTP',()=>{
        const apiSuccessResponse = {instnt: {},ok:200};
        const mobileNumber = '1234567891';
        global.fetch=jest.fn(()=>
        Promise.resolve({
            json: ()=>Promise.resolve(apiSuccessResponse)
        }))
        const sendOTPResponse= sendOTP(mobileNumber);
        expect(sendOTPResponse).toBeDefined();
        expect(fetch).toHaveBeenCalledTimes(1);
        fetch.mockClear();
    })

    it('should return error response after send OTP',()=>{
        const mobileNumber = '1234567891';
        const apiErrorMessage = {error:'Error During Submit Transaction'};
        // adding mock for fetch request
        global.fetch = jest.fn(() => Promise.reject({
            error: apiErrorMessage.error
        }));
        try{
            sendOTP(mobileNumber);
        }catch(error){
            expect(error).toBeDefined()
        }
        expect(fetch).toHaveBeenCalledTimes(1);
        fetch.mockClear();
    })

    afterEach(()=>{
        setGlobalVar({})
    })
})

describe('Verify OTP',()=>{
    beforeEach(()=>{
        globalVarModel.instnt.workflowId = '123';
        globalVarModel.instnt.isAsync = true;
        globalVarModel.instnt.serviceURL = 'https://test/';
        globalVarModel.instnt.visitorId = '1';
        globalVarModel.instnt.instnttxnid = '1234';
        setGlobalVar(globalVarModel);
    })

    it('should return proper response after verify OTP',()=>{
        const apiSuccessResponse = {instnt: {},ok:200};
        const mobileNumber = '1234567891';
        const otpCode = '123456';
        global.fetch=jest.fn(()=>
        Promise.resolve({
            json: ()=>Promise.resolve(apiSuccessResponse)
        }))
        const sendOTPResponse= verifyOTP(mobileNumber,otpCode);
        expect(sendOTPResponse).toBeDefined();
        expect(fetch).toHaveBeenCalledTimes(1);
        fetch.mockClear();
    })

    it('should return error response after send OTP',()=>{
        const mobileNumber = '1234567891';
        const otpCode = '123456';
        const apiErrorMessage = {error:'Error During Submit Transaction'};
        // adding mock for fetch request
        global.fetch = jest.fn(() => Promise.reject({
            error: apiErrorMessage.error
        }));
        try{
            verifyOTP(mobileNumber,otpCode);
        }catch(error){
            expect(error).toBeDefined()
        }
        expect(fetch).toHaveBeenCalledTimes(1);
        fetch.mockClear();
    })

    afterEach(()=>{
        setGlobalVar({})
    })
})
