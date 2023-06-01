// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  Auth: {
    /** CognitoClientId */
    clientId: '1nv523knj4pid8jns5ipod905i',
    /** CognitoIdentityPoolId */
    identityPoolId: 'us-east-1:adff3a5a-96ad-4e1e-96b0-7b3468aecdaa',
    /** CognitoUserPoolId */
    userPoolId: 'us-east-1_hMnGA9jm1',
    /** Region */
    region: 'us-east-1',
  },
  Buket: {
    /** S3UploadBucketName */
    bucketName: 'hako-mecha-s3-1ex93yihre8l2-s3bucket-kmdf49l190qn',
  },
  EndPoint: {
    apiVersion: '/v1',
    apiGsiVersion: '/v1',
    apiCheckVersion: '/v1',
    apiAuthVersion: '/v1',
    /** APIエンドポイント */
    apiEmdPoint: 'https://c5pf226ksi.execute-api.us-east-1.amazonaws.com/dev',
    /** GsiAPIエンドポイント */
    apiEmdPointGsi: ' https://kfl3jkx3y6.execute-api.us-east-1.amazonaws.com/dev',
    /** チェックエンドポイント */
    apiEmdPointCheck: 'https://n5jd4c194i.execute-api.us-east-1.amazonaws.com/dev',
    /** 単体機能エンドポイント */
    apiEmdPointUNIQUE : 'https://4esxr3t3t6.execute-api.us-east-1.amazonaws.com/dev',
    /** 伝票機能エンドポイント */
    apiEmdPointSLIPPROSESS : 'https://yyvnn0tfl9.execute-api.us-east-1.amazonaws.com/dev',
    /** 認証エンドポイント */
    apiEmdAuth : ' https://wtj87p282f.execute-api.us-east-1.amazonaws.com/dev'
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
