import { Injectable } from '@angular/core';
import { serviceContents } from 'src/app/entity/serviceContents';
import { Observable } from 'rxjs';
import {
  find as _find,
  isNil as _isNil,
  sortBy as _sortBy,
  orderBy as _orderBy,
} from 'lodash';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures'
import { monthMap } from 'src/app/entity/month';
import { serchCategoryData } from 'src/app/entity/serchCategory';
import { user } from 'src/app/entity/user';
import { ApiSerchService } from '../../service/api-serch.service';


@Injectable()
export class TransactionMenuService {


  constructor(
    private apiService: ApiSerchService,
  ) { }

  /**
   * ユーザー情報を取得
   * @param userId
   * @returns
   */
  public getUser(userId: string):Observable<any> {
    return this.apiService.getUser(userId);
  }


  /**
   * 画面表示する地域名を設定する
   * @param areaId
   * @returns
   */
  public areaDisp(areaId: string): string {
    const area = _find(prefecturesCoordinateData, detail => detail.code === areaId);
    if (_isNil(area)) {
      return '';
    }
    return area.prefectures;
  }


  // /**
  //  * 画面表示するカテゴリーを設定する
  //  * @param categoryId
  //  * @returns
  //  */
  // public categoryDisp(categoryId: string): string {
  //   const category = _find(serchCategoryData, detail => detail.id === categoryId);
  //   if (_isNil(category)) {
  //     return '';
  //   }
  //   return category.category;
  // }

  /**
   * 画面表示する金額を設定する
   * @param content
   * @returns
   */
  public priceDisp(content: serviceContents): string {
    // 入札方式によって表示を切り替える
    if (content.bidMethod !== '3') {
      return String(content.price.toLocaleString());
    }
    //　価格を決めてもらう場合は表示しない。
    return '価格は詳細画面へ'
  }

  /**
   * サービスの希望日から残り期間を設定します。
   * @param content
   * @returns
   */
  public getWhet(content: serviceContents): string {

    if (content.preferredDate === 0) {
      return '詳細へ'
    }

    // 現在日時を数値に変換
    const today = new Date();
    const toTime = today.getTime();

    // 希望日を数値に変換
    const dayStr = String(content.preferredDate);

    const targetDate = new Date(Number(dayStr.slice(0, 4)), Number(dayStr.slice(4, 6)) - 1, Number(dayStr.slice(6, 8)))
    console.log(targetDate);
    const targetTime = targetDate.getTime();

    // 引き算して残日数を計算
    const diffTime = targetTime - toTime;
    const diffDay = diffTime / (1000 * 60 * 60 * 24);
    const result = Math.ceil(diffDay);

    if (result === 0) {
      // 当日の場合残り時間を表示
      return this.getTimeLeft(content.preferredTime);
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
  public getDispDate(dayDate: number): string {
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
   * 並び順変更時、表示されているリストを並び替える
   */
  public sortOrder(contents:serviceContents[], order:number):serviceContents[] {
    const result = contents;
    //並び順かの判定を行う
    if(order === 1) {
      // 期間が短い順
      return _orderBy(contents,'preferredDate','asc');
    } else if (order === 2) {
      // 期間が長い順
      return _orderBy(contents,'preferredDate','desc');
    } else if (order === 3) {
      // 価格が安い順
      return _orderBy(contents,'price','asc');
    } else {
      // 価格が高い順
      return _orderBy(contents,'price','desc');
    }
  }

  /**
   * 並び順変更時、表示されているリストを並び替える
   */
   public sortOrderList(contents:serviceContents[], order:number):serviceContents[] {
    const result = contents;
    //並び順かの判定を行う
    if(order === 1) {
      // 期間が短い順
      return _orderBy(contents,'endDate','asc');
    } else if (order === 2) {
      // 期間が長い順
      return _orderBy(contents,'endDate','desc');
    } else if (order === 3) {
      // 価格が安い順
      return _orderBy(contents,'price','asc');
    } else {
      // 価格が高い順
      return _orderBy(contents,'price','desc');
    }
  }





}
