import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpClientJsonpModule, HttpErrorResponse, } from '@angular/common/http';
import { tap, catchError, Observable, of, map, mergeMap } from 'rxjs';
import {
  find as _find,
  isNil as _isNil,
  sortBy as _sortBy,
  orderBy as _orderBy,
} from 'lodash';
import { transactionContents, dispTransactionContents, TranStatus } from 'src/app/entity/transactionContents';
import { transactionSlip, SlipRelation } from 'src/app/entity/transactionSlip';

import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { slipMessageInfo } from 'src/app/entity/slipMessageInfo';
import { slipQuestion } from 'src/app/entity/slipQuestion';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';

import { monthMap } from 'src/app/entity/month';

@Injectable({
  providedIn: 'root'
})
export class TransactionListService {

  constructor(
    private http: HttpClient,
    private apiGsiService: ApiGsiSerchService,
  ) { }

  /**
   * 取引中、管理中の伝票情報を取得する
   * @returns
   */
  public getTransactionSlip(id: string, serviceType: string): Observable<transactionSlip[]> {
    return this.apiGsiService.serchTransactionSlip(id, serviceType);
  }


  /**
   * 取引伝票情報を表示用に加工する。
   * @param slip
   */
  public dispContentsSlip(transactionSlip: transactionSlip[]): transactionSlip[] {
    let result: transactionSlip[] = [];
    let count = 1;
    transactionSlip.forEach(slip => {
      const dispSlip: transactionSlip = {
        id: slip.id,
        // ユーザーID
        userId: slip.userId,
        // メカニックID
        mechanicId: slip.mechanicId,
        // 工場ID
        officeId: slip.officeId,
        // サービスタイプ
        serviceType: slip.serviceType,
        // 伝票番号
        slipNo: slip.slipNo,
        // サービスタイトル
        serviceTitle: slip.serviceTitle,
        // 伝票関係性
        slipRelation: this.setRelation(slip.slipRelation),
        // 伝票管理者ID
        slipAdminId: slip.slipAdminId,
        // 伝票管理者名
        slipAdminName: slip.slipAdminName,
        // 入札者ID
        bidderId: slip.bidderId,
        // 削除区分
        deleteDiv: slip.deleteDiv,
        // 完了予定日
        completionScheduledDate: this.getDispDate(Number(slip.completionScheduledDate)),
        // 作成日時
        created: slip.created,
        // 更新日時
        updated: slip.updated,
      }
      result.push(dispSlip)
    });
    return result;
  }



  /**
   * 取引ステータス情報を設定する
   * @param data
   */
  public setSlipStatus(status: string): string {

    switch (status) {
      case '1':
        status = TranStatus.ServiceManegement;
        break;
      case '2':
        status = TranStatus.ServiceTransaction;
        break;
      case '3':
        status = TranStatus.MessageFrom;
        break;
      case '4':
        status = TranStatus.MessageExchange;
        break;
      case '5':
        status = TranStatus.Answered;
        break;
      case '6':
        status = TranStatus.Question;
        break;
    }

    return status;
  }

  /**
   * サービスの希望日から残り期間を設定します。
   * @param content
   * @returns
   */
  public getWhet(preferredDate: number, preferredTime: number): string {

    if (preferredDate === 0) {
      return '詳細へ'
    }

    // 現在日時を数値に変換
    const today = new Date();
    const toTime = today.getTime();

    // 希望日を数値に変換
    const dayStr = String(preferredDate);

    const targetDate = new Date(Number(dayStr.slice(0, 4)), Number(dayStr.slice(4, 6)) - 1, Number(dayStr.slice(6, 8)))
    console.log(targetDate);
    const targetTime = targetDate.getTime();

    // 引き算して残日数を計算
    const diffTime = targetTime - toTime;
    const diffDay = diffTime / (1000 * 60 * 60 * 24);
    const result = Math.ceil(diffDay);

    if (result === 0) {
      // 当日の場合残り時間を表示
      return this.getTimeLeft(preferredTime);
    } else if (result < 0) {
      return '終了しました。'
    }
    return '残り' + result + '日';

  }

  /** 残り時間を取得する
   * @param preferredTime
   * @return string
   */
  private getTimeLeft(preferredTime: number): string {

    const toDate = new Date();
    const toTime = toDate.getTime();

    const toStr = String(toDate);
    const len = toStr.split(' ');
    console.log(len);
    const mon = _find(monthMap, month => month.month === len[1])
    if (_isNil(mon)) {
      return '';
    }

    const targetDate = new Date(Number(len[3]), Number(mon.monthNum), Number(len[2]), preferredTime);
    const targetTime = targetDate.getTime()

    // 引き算して残時間を計算
    const diffTime = targetTime - toTime;
    const diffDay = diffTime / (1000 * 60 * 60 * 24 * 60);
    const result = Math.ceil(diffDay);
    console.log(result);

    if (result === 1) {
      return '残り' + result + '時間未満';
    }
    return '残り' + result + '時間';
  }

  /**
   * 日付を表示用に加工
   * @param dayDate
   * @returns
   */
  private getDispDate(dayDate: number): string {
    if (dayDate === 0) {
      return '詳細へ'
    }

    // 希望日を数値に変換
    const dayStr = String(dayDate);
    const year = dayStr.slice(0, 4)
    const month = Number(dayStr.slice(4, 6))
    const day = Number(dayStr.slice(6, 8))

    return year + '年' + month + '月' + day + '日'
  }



  /**
   * 伝票関係性を表示用に設定する
   * @param relation 
   * @returns 
   */
  private setRelation(relation: string): string {
    const result = SlipRelation.Admin;
    if(relation == '1') {
      return SlipRelation.RequestRelation;
    } else if(relation == '1') {
      return SlipRelation.ReceivedRelation;
    }
    return result
  }




}



