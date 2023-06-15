import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { userMyList, dispUserMyList, MylistCategory, MylistCategoryMessage } from 'src/app/entity/userMyList';
import { formatDate } from '@angular/common';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { mylistMessages } from 'src/app/entity/mylistMessage';
import {
  find as _find,
} from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class MyListService {

  constructor(
    private http: HttpClient,
    private apiSerchService: ApiSerchService,
    private apiGsiService: ApiGsiSerchService,
    @Inject(LOCALE_ID) private locale: string
  ) { }


  /**
   * マイリスト情報を取得
   * @param userId
   * @returns
   */
  public getMyList(id: string, serviceType: string): Observable<userMyList[]> {
    return this.apiGsiService.serchMyList(id, serviceType);
  }

  /**
   * 取得したマイリスト情報を表示用に加工する
   * @param userMyList
   * @returns
   */
  public displayFormatdisplayFormat(userMyList: userMyList[]): dispUserMyList[] {
    let resultList: dispUserMyList[] = [];
    let count = 1;

    userMyList.forEach(data => {
      let dispContents: dispUserMyList = {
        no: count,
        id: data.id,
        userId: data.userId,
        mechanicId: data.mechanicId,
        officeId: data.officeId,
        serviceType:  data.serviceType,
        slipNo: data.slipNo,
        serviceTitle: data.serviceTitle,
        category: data.category,
        dispCategory: this.dispCategoryFormat(data.category),
        message: this.setMessage(data.category, data.message),
        readDiv: data.readDiv,
        dispRead: this.readOrNoread(data.readDiv),
        messageDate: data.messageDate,
        dispMessageDate: String(formatDate(data.messageDate, "yy/MM/dd HH:mm", this.locale)),
        messageOrQuastionId: data.messageOrQuastionId,
        bidderId: data.bidderId,
        deleteDiv: data.deleteDiv
      }
      resultList.push(dispContents);
      count++;
    });
    return resultList;
  }


  /**
   * 既読・未読を切替
   * @param data
   * @returns
   */
  private readOrNoread(data: string): string {
    if (data == '0') {
      return '未読';
    }
    return '既読';
  }

  /**
   * カテゴリーを表示用に加工する
   * @param category
   */
  public dispCategoryFormat(category: string): string {
    let msg = '';
    switch (category) {
      case MylistCategory.operationMessage:
        return MylistCategoryMessage.OPERATION_MSG;
      case MylistCategory.fromMessage:
        return MylistCategoryMessage.FORM_MSG;
      case MylistCategory.anserMessage:
        return MylistCategoryMessage.ANSER_MSG;
      case MylistCategory.adminQuestion:
        return MylistCategoryMessage.ADMIN_QA;
      case MylistCategory.adminSlipBid:
        return MylistCategoryMessage.ADMIN_SLIP_BIT;
      case MylistCategory.adminSlipQuote:
        return MylistCategoryMessage.ADMIN_SLIP_QUOTO;
      default:
        return '';
    }
  }

  /**
   * 未読状態のメッセージを既読に更新する
   * @param id
   * @param myList
   */
  public putReadMsg(id: string, myList: userMyList[]) : Observable<any> {
    if (myList.length == 0) {
      return of(500);
    }
    const data = _find(myList , list => list.id === id);
    if(!data) {
      return of(500);
    }
    data.readDiv = '1'
    return this.apiSerchService.putMyList(data);

  }




  /**
   * 表示メッセージを設定する
   * @param category
   * @param message
   * @returns
   */
  private setMessage(category: string, message: string):string {
    if(category == '' ) {
      return message;
    }
    const messageList = Object.values(mylistMessages);
    return messageList[Number(category)];
  }

}
