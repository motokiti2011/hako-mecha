// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  Auth: {
    /** CognitoClientId */
    clientId: 'v6dbidcd9fad00hsdhlm65clc',
    /** CognitoIdentityPoolId */
    identityPoolId: 'us-east-1:65f9679a-9df3-4db7-b450-c88e9a0d7c4b',
    /** CognitoUserPoolId */
    userPoolId: 'us-east-1_V11hgi1jX',
    /** Region */
    region: 'us-east-1',
  },
  Buket: {
    /** S3UploadBucketName */
    bucketName: 'hako-mecha-s3-1b9pqtdaf7hch-s3bucket-1hkzpcineqf3r',
  },
  EndPoint: {
    apiVersion: '/v1',
    apiGsiVersion: '/v1',
    apiCheckVersion: '/v1',
    apiAuthVersion: '/v1',
    /** APIエンドポイント */
    apiEmdPoint: 'https://tsvbaecmcg.execute-api.us-east-1.amazonaws.com/dev',
    /** GsiAPIエンドポイント */
    apiEmdPointGsi: 'https://lk6012b72b.execute-api.us-east-1.amazonaws.com/dev',
    /** チェックエンドポイント */
    apiEmdPointCheck: 'https://ciqnicmq9k.execute-api.us-east-1.amazonaws.com/dev',
    /** 単体機能エンドポイント */
    apiEmdPointUNIQUE : 'https://64xstc9ek9.execute-api.us-east-1.amazonaws.com/dev',
    /** 伝票機能エンドポイント */
    apiEmdPointSLIPPROSESS : 'https://lkop86oys4.execute-api.us-east-1.amazonaws.com/dev',
    /** 認証エンドポイント */
    apiEmdAuth : 'https://k1myuz0h0k.execute-api.us-east-1.amazonaws.com/dev'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
