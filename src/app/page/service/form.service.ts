import { Injectable } from '@angular/core';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { TranStatus } from 'src/app/entity/transactionContents';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
} from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  /** 地域情報 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);

  constructor() { }

  /**
   * 電話番号を分割する
   * @param telNo
   * @returns
   */
  public splitTelNo(telNo: string): { tel1: string, tel2: string, tel3: string } {
    const spritTelNo = telNo.split('-');
    const result = { tel1: spritTelNo[0], tel2: spritTelNo[1], tel3: spritTelNo[2] }
    return result;
  }

  /**
   * 電話番号を作成する
   * @returns
   */
  public setTelNo(telNo1: string, telNo2: string, telNo3: string): string {
    return telNo1 + '-' + telNo2 + '-' + telNo3;
  }


  /**
   * 郵便番号を分割する
   * @param postCode
   * @returns
   */
  public splitPostCode(postCode: string): { post1: string, post2: string } {
    const spritTelNo = postCode.split('-');
    const result = { post1: spritTelNo[0], post2: spritTelNo[1] }
    return result;
  }

  /**
   * 郵便番号を作成する
   * @returns
   */
  public setPostCode(postCode1: string, postCode2: string): string {
    return postCode1 + '-' + postCode2
  }


  /**
   * 時間を分割する
   * @param Hour
   * @returns
   */
  public splitHour(Hour: string): { hourS: string, hourE: string } {
    const spritHour = Hour.split(':');
    const result = { hourS: spritHour[0], hourE: spritHour[1] }
    return result;
  }

  /**
   * 時間をさらに分割する
   * @param Hour
   * @returns
   */
  public splitHourMonth(Hour: string): { hour: string, month: string } {
    const spritHour = Hour.split(':');
    const result = { hour: spritHour[0], month: spritHour[1] }
    return result;
  }


  /**
   * 時間を作成する
   * @returns
   */
  public setHour(HourS: string, HourE: string): string {
    return HourS + '-' + HourE
  }


  /**
   * 地域情報からIDを取得する
   * @returns
   */
  public setAreaId(area: string): string {
    const select = _find(this.areaData, data => data.prefectures === area)
    if (select) {
      return String(select.id);
    }
    return ''
  }


  /**
   * IDから地域情報を取得する
   * @returns
   */
  public setAreaName(areaId: string): string {
    const select = _find(this.areaData, data => data.id === Number(areaId))
    if (select) {
      return select.prefectures;
    }
    return ''
  }

  /**
   * 取引ステータスをIDから取得する
   */
  public setTransactionStatus(statusCode: string): string {

    switch (statusCode) {
      case '1':
        statusCode = TranStatus.ServiceManegement;
        break;
      case '2':
        statusCode = TranStatus.ServiceTransaction;
        break;
      case '3':
        statusCode = TranStatus.MessageFrom;
        break;
      case '4':
        statusCode = TranStatus.MessageExchange;
        break;
      case '5':
        statusCode = TranStatus.Answered;
        break;
      case '6':
        statusCode = TranStatus.Question;
        break;
    }

    return statusCode;
  }




}
