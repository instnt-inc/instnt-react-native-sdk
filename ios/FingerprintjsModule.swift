//
//  FingerprintjsModule.swift
//  FingerprintjsModule
//
//  Created by Denis Evgrafov on 01.02.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//
import FingerprintPro

@objc(FingerprintjsModule)
class FingerprintjsModule: NSObject {
    private var fpjsClient: FingerprintClientProviding?

    override init() {
        super.init()
    }

    @objc(init:)
    public required init(_ apiToken: String) {
        
        var passedRegion = "us"
        
        let extendedResponseFormat = false 
        let pluginVersion = "1.0.0"

        //let endpoint = nil // "https://api.fpjs.io"

        let region = FingerprintjsModule.parseRegion(passedRegion, endpoint: nil)
        let integrationInfo = [("fingerprint-pro-react-native", pluginVersion)]
        let configuration = Configuration(apiKey: apiToken, region: region, integrationInfo: integrationInfo, extendedResponseFormat: extendedResponseFormat)
        fpjsClient = FingerprintProFactory.getInstance(configuration)

    }

    /*
    @objc(init:region:endpoint:extendedResponseFormat:pluginVersion:)
    public required init(_ apiToken: String, _ region: String? = "us", _ endpoint: String? = "https://dev2-api.instnt.org/public/", _ extendedResponseFormat: Bool = false, _ pluginVersion: String) {
        let region = FingerprintjsModule.parseRegion(region, endpoint: endpoint)
        let integrationInfo = [("fingerprint-pro-react-native", pluginVersion)]
        let configuration = Configuration(apiKey: apiToken, region: region, integrationInfo: integrationInfo, extendedResponseFormat: extendedResponseFormat)
        fpjsClient = FingerprintProFactory.getInstance(configuration)
    }
    */

    @objc(testMethod:resolve:rejecter:)
    public func testMethod(key: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        resolve(key)
    }

    @objc(getVisitorId:linkedId:resolve:rejecter:)
    public func getVisitorId(tags: [String: Any]?, linkedId: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let metadata = FingerprintjsModule.prepareMetadata(linkedId, tags: tags)
        fpjsClient?.getVisitorId(metadata) { result in
            switch result {
            case let .failure(error):
                reject("Error: ", error.localizedDescription, error)
            case let .success(visitorId):
                // Prevent fraud cases in your apps with a unique
                // sticky and reliable ID provided by FingerprintJS Pro.
                resolve(visitorId)
            }
        }
    }

    // Created new function 
    @objc(getResponse:rejecter:)
    public func getResponse(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        //let metadata = nil
        fpjsClient?.getVisitorIdResponse(nil) { result in
                switch result {
                case let .failure(error):
                    reject("Error: ", error.localizedDescription, error)
                case let .success(visitorDataResponse):
        
                    let tuple = [
                        visitorDataResponse.requestId,
                        visitorDataResponse.confidence,
                        visitorDataResponse.asJSON()
                    ] as [Any]
                    resolve(visitorDataResponse.asJSON())
                    
                    // let jsonText = visitorDataResponse.asJSON()
                    //        var dictonary:NSDictionary?
                           
                    //        if let data = jsonText.data(using: String.Encoding.utf8) {
                               
                    //            do {
                    //                dictonary = try JSONSerialization.jsonObject(with: data, options: []) as? [String:AnyObject] as NSDictionary?
                               
                    //                if let myDictionary = dictonary
                    //                {
                    //                     print(" visitorFound: \(myDictionary["visitorFound"]!)")
                    //                    let response: [String: Any] = [
                    //                        "visitorId": visitorDataResponse.visitorId,
                    //                        "requestId": visitorDataResponse.requestId,
                    //                        "visitorFound": (myDictionary["visitorFound"]!) as! Int == 1 ? true : false
                    //                    ]

                    //                    let dictionary = response
                    //                    if let theJSONData = try? JSONSerialization.data(
                    //                        withJSONObject: dictionary,
                    //                        options: []) {
                    //                        let theJSONText = String(data: theJSONData,
                    //                                                   encoding: .ascii)
                    //                        print("JSON string = \(theJSONText!)")
                    //                        resolve(theJSONText)
                    //                    }
                                      
                    //                }
                    //            } catch let error as NSError {
                    //                print(error)
                    //            }
                    //        }

                }
            }
    }

    @objc(getVisitorData:linkedId:resolve:rejecter:)
        public func getVisitorData(tags: [String: Any]?, linkedId: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
            let metadata = FingerprintjsModule.prepareMetadata(linkedId, tags: tags)
            fpjsClient?.getVisitorIdResponse(metadata) { result in
                switch result {
                case let .failure(error):
                    reject("Error: ", error.localizedDescription, error)
                case let .success(visitorDataResponse):
                    let tuple = [
                        visitorDataResponse.requestId,
                        visitorDataResponse.confidence,
                        visitorDataResponse.asJSON()
                    ] as [Any]
                    resolve(tuple)
                }
            }
        }


    private static func parseRegion(_ passedRegion: String?, endpoint: String?) -> Region {
        var region: Region
        switch passedRegion {
        case "eu":
            region = .eu
        case "ap":
            region = .ap
        default:
            region = .global
        }

        if let endpointString = endpoint {
            region = .custom(domain: endpointString)
        }

        return region
    }
    
    private static func prepareMetadata(_ linkedId: String?, tags: Any?) -> Metadata? {
        guard
            let tags = tags,
            let jsonTags = JSONTypeConvertor.convertObjectToJSONTypeConvertible(tags)
        else {
            return nil
        }
        
        var metadata = Metadata(linkedId: linkedId)
        if let dict = jsonTags as? [String: JSONTypeConvertible] {
            dict.forEach { key, jsonType in
                metadata.setTag(jsonType, forKey: key)
            }
        } else {
            metadata.setTag(jsonTags, forKey: "tag")
        }
        return metadata
    }
}
