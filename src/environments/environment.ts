// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  Auth: {
    /** CognitoClientId */
    clientId: 'rkpefqltajnhj1php7lpdlq0c',
    /** CognitoIdentityPoolId */
    identityPoolId: 'us-east-1:876a0538-a5d3-476b-a681-8fb0fe9b7113',
    /** CognitoUserPoolId */
    userPoolId: 'us-east-1_nSql6y3fB',
    /** Region */
    region: 'us-east-1',
  },
  Buket: {
    /** S3UploadBucketName */
    bucketName: 'hako-mecha-s3-1mbsyt4apbcm8-s3bucket-1pbr66mgb5duk',
  },
  EndPoint: {
    apiVersion: '/v1',
    apiGsiVersion: '/v1',
    apiCheckVersion: '/v1',
    apiAuthVersion: '/v1',
    /** APIエンドポイント */
    apiEmdPoint: 'https://8jqw3fjkcd.execute-api.us-east-1.amazonaws.com/dev',
    /** GsiAPIエンドポイント */
    apiEmdPointGsi: 'https://t29r0c6zd4.execute-api.us-east-1.amazonaws.com/dev',
    /** チェックエンドポイント */
    apiEmdPointCheck: 'https://5enkik1t7i.execute-api.us-east-1.amazonaws.com/dev',
    /** 単体機能エンドポイント */
    apiEmdPointUNIQUE : 'https://thi659mj6c.execute-api.us-east-1.amazonaws.com/dev',
    /** 伝票機能エンドポイント */
    apiEmdPointSLIPPROSESS : 'https://97fsswwv8d.execute-api.us-east-1.amazonaws.com/dev',
    /** 認証エンドポイント */
    apiEmdAuth : 'https://k629cqw9sc.execute-api.us-east-1.amazonaws.com/dev'
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
