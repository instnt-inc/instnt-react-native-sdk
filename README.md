
# Instnt React Native SDK

This documentation covers the basics functionality of Instnt React-Native SDK. In simple terms, React-Native is an open-source library that helps to create native apps for Android and iOS using React. Instnt React-Natve SDK is intended to provide a streamlined and elegant integration with your company's/institutions customer sign-up workflows built using react-native library. For a more details on Instnt's products and integrations, visit
[Instnt's documentation library.](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview)

[![build status]]
[![npm version]]

### Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  * [Setup for InstntSignupProvider component](#setup-for-instntsignupprovider-component)
- [OTP verification](#otp-one-time-passcode)
  * [OTP workflow ](#otp-flow )
- [Resource links](#resource-links)
- [License](#license)
 
# Prerequisites

* Sign in to your account on the Instnt Accept's dashboard and create a customer signup workflow that works for your company. Refer [Quick start guide](https://support.instnt.org/hc/en-us/articles/4408781136909) and [Developer guide, ](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview) for more information.

* The integration of SDK depends on your workflow; read the [Instnt Accept integration process,](https://support.instnt.org/hc/en-us/articles/4418538578701-Instnt-Accept-Integration-Process) to understand the functionalities provided by Instnt and how to integrate SDK with your application.


# Getting Started

* Instnt React-Native SDK is comprised of React components and a set of Javascript library functions to facilitate communication between your React-native application, Instnt SDK, and Instnt's APIs. 

* To begin utilizing Instnt React SDK, open the terminal and enter the following command to install Instnt's React components:

```sh
npm install @instnt/instnt-react-native-sdk
```

## Setup for InstntSignupProvider component

After installing the Instnt npm package, import Instnt's React Workflow component called **InstntSignupProvider**.

```jsx
import { InstntSignUpProvider } from '@instnt/instnt-react-native-sdk'
```

* **InstntSignupProvider**- This component provides the functions to render and initiate the signup process. InstantSignupProvider acts as a top-level container component responsible for initiating the session and returning the accompanying Javascript functions and configurations that your application can use to perform different actions. It occurs during the mounting phase of this component.  

* A preferrable approach is to wrap up your signup components with InstntSignupProvider. In the reference app included in the SDK, the signup view components gets rendered under InstntSignupProvider component. This ensures that Instnt is initialized when any of your signup components render.

```java
<InstntSignupProvider
  workflowId={config.workflowId}
  onInit={onInstntInit}
  serviceURL={config.serviceURL}
>

  <<your components>>

</InstntSignupProvider>
```

* **InstntSignupProvider** works as follows:
  1. connects to Instnt’s backend API on mount and initiates a new signup session identified by a unique instnttxnid. 
  2. The calling application should pass the **workflowId**, **serviceURL** and a callback handler function **onInit** to this component.

  **workflowId** - This is the id of the workflow you created in the Instnt dashboard, and you want to be powered by Instnt.

  Example: workflowId= v766520100000

  **serviceURL** - This is the target Instnt environment that you want your app to connect. You need to specify a target environment like sandbox or production API root URL. Please refer [Instnt Environments and Pilot Process
](https://support.instnt.org/hc/en-us/articles/5165465750797-Instnt-Environments-and-Pilot-Process) document for more information.

* InstntSignupProvider invokes **onInit** callback function on successful initialization, passing the reference to the workflow and transaction attributes. The calling appliction can store this attributes and reference later. The key attribute is instnttxnid which is the reference id for this particular signup session. 

* Once Instnt SDK is initialized, The app can then render any subsequent components or act on the tasks associated with the signup process
* Once an end-user/applicant fills the signup form, the application can invoke Instnt JavaScript library funtion **submitSignupData** to process the signup request.

```jsx
import { submitSignupData } from '@instnt/instnt-react-native-sdk'

const response: any = await submitSignupData(data);
if(response && response.data && response.data.decision){
  setSubmitResponse(response);
  setWaitingDecision(false);
  setDecision(response.data.decision);
  return;
}

```
* Here the parameter **data** is is a JavaScript object with a key:value pair of user-entered data like firstName, surName, phone provided as a key, value pair. For more details about the supported fields please refer to [Field Data Dictionary
](#https://support.instnt.org/hc/en-us/articles/360045534591-Field-Data-Dictionary)

* Please refer to the reference application bundled with React-Native SDK for more detail code examples.

# OTP (One-Time Passcode)

OTP functionality can be enabled by logging in Instnt dashboard and enabling OTP in your workflow. Refer to the [OTP](https://support.instnt.org/hc/en-us/articles/4408781136909#heading-5) section of the Quickstart guide for more information.

Instnt SDK provides two Javascript library functions to enable OTP.

1. sendOTP (mobileNumber)

2. verifyOTP(mobileNumber, otpCode)

Please refer to the Library function listing below for more details. 

## OTP flow

* User enters mobile number as part of the signup screen.
* Your app calls send OTP() SDK function and pass the mobile number.
* Instnt SDK calls Instnt API and returns the response upon successful OTP delivery.
* Your app shows the user a screen to enter the OTP code.
* User enters the OTP code which they received.
* Your app calls verify the OTP() SDK function to verify the OTP and pass mobile number and OTP code.
* Instnt SDK calls Instnt API and returns the response upon successful OTP verification


# Resource links 
- [Quick start guide](https://support.instnt.org/hc/en-us/articles/4408781136909)
- [Developer guide](https://support.instnt.org/hc/en-us/articles/360055345112-Integration-Overview)
- [Instnt support](https://support.instnt.org/hc/en-us)

# License

The instnt-react-native SDK is under MIT license.
