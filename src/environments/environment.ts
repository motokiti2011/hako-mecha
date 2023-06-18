// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  Auth: {
    /** CognitoClientId */
    clientId: '2kd0m167ovc5stq02hpt1flavr',
    /** CognitoIdentityPoolId */
    identityPoolId: 'us-east-1:7c0b69b8-2fe1-4b06-a1a7-2be6972e74d5',
    /** CognitoUserPoolId */
    userPoolId: 'us-east-1_EsGCTkkjn',
    /** Region */
    region: 'us-east-1',
  },
  Buket: {
    /** S3UploadBucketName */
    bucketName: 'hako-mecha-s3-1m9uk0fpkmmei-s3bucket-54uuedx5zpm5',
  },
  EndPoint: {
    apiVersion: '/v1',
    apiGsiVersion: '/v1',
    apiCheckVersion: '/v1',
    apiAuthVersion: '/v1',
    /** APIエンドポイント */
    apiEmdPoint: 'https://1ikfbv1yfa.execute-api.us-east-1.amazonaws.com/dev',
    /** GsiAPIエンドポイント */
    apiEmdPointGsi: 'https://czic46435m.execute-api.us-east-1.amazonaws.com/dev',
    /** チェックエンドポイント */
    apiEmdPointCheck: 'https://r7ezp3f2bh.execute-api.us-east-1.amazonaws.com/dev',
    /** 単体機能エンドポイント */
    apiEmdPointUNIQUE : 'https://9i0xnha9w0.execute-api.us-east-1.amazonaws.com/dev',
    /** 伝票機能エンドポイント */
    apiEmdPointSLIPPROSESS : 'https://pjwmf2jbak.execute-api.us-east-1.amazonaws.com/dev',
    /** 認証エンドポイント */
    apiEmdAuth : 'https://9jdqqqzcsk.execute-api.us-east-1.amazonaws.com/dev'
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
