import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import { CognitoService } from '../auth/cognito.service';


@Injectable({
  providedIn: 'root'
})
export class UploadService {


  private s3: AWS.S3;

  constructor(
    private cognito: CognitoService
  ) {
    this.cognito.getCredentials().then((data) => {
      AWS.config.credentials = data;
    }).catch((err) => {
      console.log(err);
    });
    const clientParams: any = {
      region: environment.Auth.region,
      credentials: new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.Auth.identityPoolId }),
      apiVersion: '2006-03-01',
      params: { Bucket: environment.Buket.bucketName }
    };
    this.s3 = new AWS.S3(clientParams);
  }

  /**
   * ファイルアップロード
   * @file 
   */
  uploadFile(file: any): Promise<any> {
    const params = {
      Bucket: environment.Buket.bucketName,
      Key: file.name,
      ContentType: file.type,
      Body: file
      ,
      StorageClass: 'STANDARD',
      ACL: 'public-read'
    };
    return this.s3.upload(params).promise();
  }

  getFileList(): Promise<AWS.S3.ListObjectsOutput> {
    const params = { Bucket: environment.Buket.bucketName };
    return this.s3.listObjects(params).promise();
  }

  getFile(key: string): Promise<AWS.S3.GetObjectOutput> {
    const params = { Bucket: environment.Buket.bucketName, Key: key };
    return this.s3.getObject(params).promise();
  }

  /**
     * @desc AWS.S3
     */
  public onManagedUpload(file: File): Promise<AWS.S3.ManagedUpload.SendData> {
    
    let params: AWS.S3.Types.PutObjectRequest = {
      Bucket: environment.Buket.bucketName,
      Key: file.name,
      Body: file,
      ACL: 'public-read', // インターネットから誰でもダウンロードできるように
      ContentType: 'text/plain',
    };
    let options: AWS.S3.ManagedUpload.ManagedUploadOptions = {
      params: params,
      partSize: 64 * 1024 * 1024,
    };
    let handler: AWS.S3.ManagedUpload = new AWS.S3.ManagedUpload(options);
    return handler.promise();
  }


}
