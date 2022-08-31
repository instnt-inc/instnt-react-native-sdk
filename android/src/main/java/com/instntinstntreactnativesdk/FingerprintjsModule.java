package com.instntinstntreactnativesdk;

import android.content.Context;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.fingerprintjs.android.fpjs_pro.Configuration;
import com.fingerprintjs.android.fpjs_pro.FingerprintJS;
import com.fingerprintjs.android.fpjs_pro.FingerprintJSFactory;
import com.fingerprintjs.android.fpjs_pro.FingerprintJSProResponse;

import org.json.JSONException;
import org.json.JSONObject;

import kotlin.Unit;
import kotlin.jvm.functions.Function1;

public class FingerprintjsModule extends ReactContextBaseJavaModule {

  private Context context;
  private FingerprintJSProResponse fingerprintJSProResponse;

  FingerprintjsModule(ReactApplicationContext context) {
    super(context);
    this.context = context;
  }

  @Override
  public String getName() {
    return "FingerprintjsModule";
  }

  @ReactMethod
  public void init(String fingerprintJsBrowserToken, Promise promise) {
    try {
      FingerprintJSFactory factory = new FingerprintJSFactory(this.context);
      Configuration configuration = new Configuration(fingerprintJsBrowserToken);
      FingerprintJS fpjsClient = factory.createInstance(configuration);
      FingerprintjsModule fingerprintjsModule = this;
      fpjsClient.getVisitorId(new Function1<FingerprintJSProResponse, Unit>() {
        @Override
        public Unit invoke(FingerprintJSProResponse result) {
          fingerprintjsModule.fingerprintJSProResponse = result;
          promise.resolve("Fingerprintjs initialized successfully");
          return null;
        }
      });
    } catch (Exception e) {
      e.printStackTrace();
      promise.reject("500", e.getMessage());
    }
  }

  @ReactMethod
  public void getResponse(Promise promise) {
    if(this.fingerprintJSProResponse == null) {
      promise.reject("500", "Something went wrong, please initialize fingeprintjs first by calling FingerprintjsModule.initFingerprintjs().");
      return;
    }

    try {
      JSONObject fingerMap = new JSONObject();
      fingerMap.put("requestId", this.fingerprintJSProResponse.getRequestId());
      fingerMap.put("visitorId", this.fingerprintJSProResponse.getVisitorId());
      fingerMap.put("visitorFound", this.fingerprintJSProResponse.getVisitorFound());
      promise.resolve(fingerMap.toString());
    } catch (JSONException e) {
      e.printStackTrace();
      promise.reject("500", "Something went wrong, Please contact admin. Exception : " + e.getMessage());
    }
  }
}
