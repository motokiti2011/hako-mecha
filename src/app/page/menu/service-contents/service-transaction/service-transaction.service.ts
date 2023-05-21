import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { find as _find } from 'lodash';
import { slipManegement } from 'src/app/entity/slipManegement';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiCheckService } from 'src/app/page/service/api-check.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { ApiSlipProsessService } from 'src/app/page/service/api-slip-prosess.service';
import { slipMegPrmUser } from 'src/app/entity/slipMegPrmUser';
import { user } from 'src/app/entity/user';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';

@Injectable({
  providedIn: 'root'
})
export class ServiceTransactionService {


  constructor(
    private apiService: ApiSerchService,
    private apGsiService: ApiGsiSerchService,
    private apCheckService: ApiCheckService,
    private apiUniqeService: ApiUniqueService,
    private apiSlipService: ApiSlipProsessService,
  ) { }

  /**
   * 詳細表示する伝票情報を取得する
   * @param slipNo
   * @returns
   */
  public getService(slipNo: string, serviceType: string): Observable<any> {
    console.log('getService:'+ serviceType )
    if(serviceType !== '0') {
      return this.apiUniqeService.getServiceContents(slipNo);
    }
    return this.apiUniqeService.getSlip(slipNo);
  }

  /**
   * アクセス者情報取得
   * @param userId
   */
  public getSendName(userId: string): Observable<any> {
    return this.apiService.getUser(userId);
  }

  /**
   * 画面表示する地域名を取得する。
   * @param areaId
   * @returns
   */
  public areaNameSetting(areaId: string): string {
    const areaName = _find(prefecturesCoordinateData, data => data.id == Number(areaId))?.prefectures
    if (areaName === undefined) {
      return '';
    }
    return areaName;
  }

  /**
   * 伝票の管理者判定を行う
   * @param slipId
   * @param userId
   * @param serviceType
   */
  public slipAuthCheck(slipId: string, adminId: string, serviceType: string): Observable<slipManegement[]> {
    return this.apCheckService.checkAdminUserSlip(slipId, adminId, serviceType);
  }

  /**
   * メッセージ許可済ユーザー情報かを判定する
   * @param slipNo
   * @param userId
   * @returns
   */
  public isSlipUserPermission(slipNo: string, userId: string): Observable<boolean> {
    return this.apCheckService.checkSlipPrm(slipNo, userId);
  }

  /**
   * 伝票情報のメッセージレベルを更新する。
   * @param slipNo
   * @param messsageLevele
   * @returns 更新後伝票情報
   */
  public postMessageLevel(slip: slipDetailInfo, messsageLevele: string): Observable<any> {
    let data:slipDetailInfo = slip;
    data.messageOpenLebel = messsageLevele;
    return this.apiService.postSlip(data);
  }

  /**
   * メッセージ許可申請を行う
   */
  public messagePrmReq(userId:string, userName:string, slipNo:string) {
    return this.apiUniqeService.postMessageReq(userId, userName, slipNo);
  }


  /**
   * 取引開始依頼を行う
   * @param slip
   * @param userId
   * @param serviceType
   * @returns
   */
  public transactionReq(slip: slipDetailInfo,
    userId: string, name: string, serviceType: string ): Observable<any> {
      return this.apiSlipService.sendTransactionReq(
        slip.slipNo, userId, name, serviceType);
  }

  /**
   * 取引依頼を取得
   * @param slipNo
   */
  public getTranReq(slipNo: string): Observable<any> {
    return this.apGsiService.serchTransactionRequest(slipNo);
  }


  /**
   * 取引確定を行う
   * @param req
   * @returns
   */
  public approvalTransaction(req: serviceTransactionRequest, adminId: string): Observable<any> {
    return this.apiSlipService.approvalTransaction(req, adminId);
  }


  /**
   * 取引依頼中ユーザーかを判定する
   * @param slipNo 
   * @param requestUserId 
   * @param serviceType
   * @returns 
   */
  public transactionReqUserCheck(slipNo:string, requestUserId: string, serviceType: string): Observable<boolean> {
    return this.apCheckService.checkTransactionReq(slipNo, requestUserId, serviceType);
  }


  /**
   * 取引中ユーザーかを判定する
   * @param slipNo 
   * @param userId 
   * @param serviceType
   * @returns 
   */
  public transactionUserCheck(slipNo:string, userId: string, serviceType: string): Observable<boolean> {
    return this.apCheckService.checkTransaction(slipNo, userId, serviceType);
  }



}
