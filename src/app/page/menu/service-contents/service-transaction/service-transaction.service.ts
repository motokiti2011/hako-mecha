import { Injectable } from '@angular/core';
import { Observable, map, mergeMap} from 'rxjs';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { find as _find } from 'lodash';
import { slipManegement } from 'src/app/entity/slipManegement';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiCheckService } from 'src/app/page/service/api-check.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { ApiSlipProsessService } from 'src/app/page/service/api-slip-prosess.service';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';
import { slipRelation } from 'src/app/entity/slipRelation';

@Injectable({
  providedIn: 'root'
})
export class ServiceTransactionService {


  constructor(
    private apiService: ApiSerchService,
    private apGsiService: ApiGsiSerchService,
    private apiCheckService: ApiCheckService,
    private apiUniqeService: ApiUniqueService,
    private apiSlipService: ApiSlipProsessService,
  ) { }

  /**
   * 詳細表示する伝票情報を取得する
   * @param slipNo
   * @returns
   */
  public getService(slipNo: string, serviceType: string): Observable<any> {
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
    return this.apiCheckService.checkAdminUserSlip(slipId, adminId, serviceType);
  }

  /**
   * アクセスユーザーと伝票の関係性をチェックする
   */
  public accessUserAdminCheck(slipNo: string, accessUserId: string, serviceType: string):Observable<boolean> {
    return this.apiCheckService.checkAccessUserSlip(slipNo, accessUserId, serviceType)
  }


  /**
   * メッセージ許可済ユーザー情報かを判定する
   * @param slipNo
   * @param userId
   * @returns
   */
  public isSlipUserPermission(slipNo: string, userId: string): Observable<boolean> {
    return this.apiCheckService.checkSlipPrm(slipNo, userId);
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
   * @param slipNo
   * @param serviceType
   * @param userId
   * @param serviceUserType
   * @returns
   */
  public transactionReq(slipNo: string, serviceType: string, userId: string, serviceUserType: string): Observable<any> {
      return this.apiSlipService.sendTransactionReq(slipNo, serviceType, userId, serviceUserType);
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
  public approvalTransaction(req: serviceTransactionRequest, adminId: string, serviceType: string): Observable<any> {
    return this.apiSlipService.approvalTransaction(req, adminId, serviceType);
  }


  /**
   * 取引依頼中ユーザーかを判定する
   * @param slipNo
   * @param requestUserId
   * @param serviceType
   * @returns
   */
  public transactionReqUserCheck(slipNo:string, requestUserId: string, serviceType: string): Observable<boolean> {
    return this.apiCheckService.checkTransactionReq(slipNo, requestUserId, serviceType);
  }


  /**
   * 取引中ユーザーかを判定する
   * @param slipNo
   * @param userId
   * @param serviceType
   * @returns
   */
  public transactionUserCheck(slipNo:string, userId: string, serviceType: string): Observable<boolean> {
    return this.apiCheckService.checkTransaction(slipNo, userId, serviceType);
  }

  /**
   * 取引依頼済かを確認する
   * @param slipNo
   * @param userId
   * @returns
   */
  public sentTranReqCheck(slipNo: string, userId: string):Observable<serviceTransactionRequest> {
    return this.apiCheckService.sentTranReqCheck(slipNo, userId);
  }

  /**
   * 取引依頼を承認
   * @param request
   * @param userId
   * @returns
   */
  public approvalRequest(request:serviceTransactionRequest, userId: string, serviceType: string): Observable<number> {
    return this.apiSlipService.approvalTransaction(request, userId, serviceType);
  }

  /**
   * 取引を完了する
   * @param slipNo
   * @param serviceType
   * @param acceseUser
   */
  public completedTransaction(slipNo: string, serviceType: string, acceseUser: string) :Observable<any> {
    return this.apiSlipService.compTransaction(slipNo, serviceType, acceseUser)
  }

  /**
   * 取引中伝票情報に対してのアクセスチェックを行う
   * @param slipNo
   * @param serviceType
   * @param userId
   */
  public transactionCheck(slipNo: string, serviceType: string, userId: string): Observable<string> {
    // 管理者チェック
    return this.accessUserAdminCheck(slipNo, userId, serviceType).pipe(
      mergeMap((res: boolean) => {
        if (res) {
          // 伝票関係　管理者
          return slipRelation.ADMIN;
        } else {
          return this.transactionReqUserCheck(slipNo, userId, serviceType).pipe(
            map((res: boolean) => {
              if (res) {
                // 伝票関係　管理者
                return slipRelation.TRADER;
              } else {
                // いずれも該当なしの場合、関係なし
                return slipRelation.OTHERS;
              }
            })
          );
        }
      })
    )
  }




}
