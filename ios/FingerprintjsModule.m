#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FingerprintjsModule, NSObject)

RCT_EXTERN_METHOD(init:(NSString *)apiToken)
RCT_EXTERN_METHOD(getVisitorId:(NSDictionary *)tags linkedId:(NSString *)linkedId resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getVisitorData:(NSDictionary *)tags linkedId:(NSString *)linkedId resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(testMethod:(NSString *)key resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end