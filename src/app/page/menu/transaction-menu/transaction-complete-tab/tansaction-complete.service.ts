import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpClientJsonpModule, HttpErrorResponse, } from '@angular/common/http';
import { tap, catchError, Observable, of, map, mergeMap } from 'rxjs';
import {
  find as _find,
  isNil as _isNil,
  sortBy as _sortBy,
  orderBy as _orderBy,
} from 'lodash';
import { transactionContents, TranStatus } from 'src/app/entity/transactionContents';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { completionSlip } from 'src/app/entity/completionSlip';
import { monthMap } from 'src/app/entity/month';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';


@Injectable({
  providedIn: 'root'
})
export class TansactionCompleteService {

  constructor(
    private http: HttpClient,
    private apiGsiService: ApiGsiSerchService,
    private apiUniqueService: ApiUniqueService
  ) { }

  /**
   * 取引完了後の伝票情報を取得する
   * @returns
   */
   public getTransactionCompSlip(userId: string): Observable<completionSlip[]> {
    return this.apiUniqueService.serchCompletionSlip(userId);
  }

  /**
   * 取引伝票情報を表示用に加工する。
   * @param slip
   */
  public dispContentsSlip(transactionSlip: completionSlip[]): any[] {
    let result: any[] = [];
    let count = 1;
    transactionSlip.forEach(slip => {
      const dispSlip = {
        id: count,
        slipNo: slip.slipNo,
        title: slip.title,
        price: slip.price,
        bidderId: slip.bidderId,
        bidEndDate: slip.bidEndDate,
        explanation: slip.explanation,
        endDate: this.getDispDate(Number(slip.transactionCompletionDate)),
      }
      result.push(dispSlip)
      count++;
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
   * 伝票状態を確認し取引ステータスを設定する
   * @param slip
   * @param userId
   */
  private slipStatusSet(slip: slipDetailInfo, userId: string): string {
    // 伝票管理者とアクセス者が一致する場合
    if (slip.slipAdminUserId === userId) {
      return 'サービス管理中';
    }
    // 上記以外（落札者の場合）
    return 'サービス取引中';
  }

/**
 * メッセージを設定する
 * @param status
 * @returns
 */
private setMessage(status: string): string | null {
  let result = null
  if(status == 'COMPLEAT') {
    result = 'かり'
  }

  return result;
}

}
