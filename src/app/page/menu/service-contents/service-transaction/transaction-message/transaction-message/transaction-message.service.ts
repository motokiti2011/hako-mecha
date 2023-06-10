import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { slipMessageInfo, dispSlipComment } from 'src/app/entity/slipMessageInfo';
import { user } from 'src/app/entity/user';
import { sortBy as _sortBy } from 'lodash';
import { slipMegPrmUser } from 'src/app/entity/slipMegPrmUser';
import { formatDate } from '@angular/common';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiCheckService } from 'src/app/page/service/api-check.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { slipManegement } from 'src/app/entity/slipManegement';

@Injectable({
  providedIn: 'root'
})
export class TransactionMessageService {

  constructor(
    private http: HttpClient,
    private apiSerchService: ApiSerchService,
    private apiGsiSerchService: ApiGsiSerchService,
    private apiCheckService: ApiCheckService,
    private apiUniqueService: ApiUniqueService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  /**
   * 伝票情報のメッセージ情報を取得する
   */
  public getSlipMessage(slipNo: string): Observable<slipMessageInfo[]> {
    return this.apiGsiSerchService.serchSlipMessage(slipNo);
  }

  /**
   * ユーザー情報を取得する
   * @param acsessId 
   * @returns 
   */
  public getUser(acsessId: string): Observable<user[]> {
    return this.apiSerchService.getUser(acsessId);
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
   *
   * @param userName
   * @param slipNo
   * @param sendText
   * @returns
   */
  public sernderMessage(userId:string, userName: string, slipNo: string, sendId: string, sendText: string): Observable<any> {
    // 伝票情報からマイリスト情報登録用データを生成する

    const comment: slipMessageInfo = {
      messageId: '0',
      slipNo: slipNo,
      displayOrder: '0',
      userId: userId,
      sendUserName: userName,
      comment: sendText,
      sendAdressId: sendId,
      logicalDeleteDiv: '0',
      sendDate: String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale)),
      created: '',
      // 更新日時
      updated: '',
    }
    return this.apiUniqueService.sendMessage(comment);
  }


  /**
   * 管理者チェック
   * @param slipNo
   * @param userId
   * @returns
   */
  public checkAdminSlip(slipNo:string, userId: string): Observable<boolean> {
    return this.apiCheckService.checkSlipPrm(slipNo, userId)
  }

  /**
   * 管理者メッセージ表示設定を行う。
   * @param comment
   */
  public adminDispSetting(comment: slipMessageInfo[], userId: string): dispSlipComment[] {
    let resultList: dispSlipComment[] = [];
    comment.forEach(data => {
      // コメントが管理者投稿の場合
      if (data.userId = userId) {
        // (true → 左)
        resultList.push(this.setDispMsg(data, true));
      } else {
        // 管理者以外の場合(false → 右)
        resultList.push(this.setDispMsg(data, false));
      }
    });
    // 表示順でソートして返却
    return _sortBy(resultList, 'displayOrder');
  }

  /**
   * ゲストアクセス用メッセージ表示設定を行う
   * @param comment
   * @param userId
   */
  public gestDispSetting(comment: slipMessageInfo[], userId: string): dispSlipComment[] {
    let resultList: dispSlipComment[] = [];
    // 宛先がゲストか全体メッセージのみを設定する
    comment.forEach(data => {
      if (data.userId == userId) {
        // 自身投稿メッセージの場合(true → 左)
        resultList.push(this.setDispMsg(data, true));
      } else if (data.sendAdressId == userId) {
        // 宛先が自身の場合(false → 右)
        resultList.push(this.setDispMsg(data, false));
      } else if (data.sendAdressId == '') {
        // 宛先が全体の場合(false → 右)
        resultList.push(this.setDispMsg(data, false));
      }
    });
    // 表示順でソートして返却
    return _sortBy(resultList, 'displayOrder');
  }


  /**
   * 表示コメント情報を作成する。
   * @param data
   * @param position
   * @returns
   */
  private setDispMsg(data: slipMessageInfo, position: boolean): dispSlipComment {
    const dispComment: dispSlipComment = {
      // コメントID
      messageId: data.messageId,
      // 表示位置
      position: position,
      // 伝票番号
      slipNo: data.slipNo,
      // 表示順
      displayOrder: data.displayOrder,
      // 投稿ユーザーID
      userId: data.userId,
      // 投稿ユーザー名
      sendUserName: data.sendUserName,
      // コメント
      comment: data.comment,
      // 投稿宛先
      sendAdressId: data.sendAdressId,
      // 論理削除フラグ
      logicalDeleteDiv: data.logicalDeleteDiv,
      // 投稿日時
      sendDate: data.sendDate
    }
    return dispComment;
  }

  /**
   * ゲストユーザー時の宛先情報設定する
   */
  public sendAdressSetting(): { sendId: string, name: string }[] {
    let returnList: { sendId: string, name: string }[] = [];
    returnList.push({ sendId: '0', name: '伝票管理者宛' });
    returnList.push({ sendId: '', name: '全体' })
    return returnList;
  }

  /**
   * 伝票許可ユーザー情報を取得し宛先リストを生成する
   * @param slipNo
   */
  public getSendAdress(slipNo: string): Observable<slipMegPrmUser[]> {
    return this.apiSerchService.getSlipMegPrmUser(slipNo);
  }

  /**
   * 伝票管理者の宛先設定を行う
   * @param userId
   *
   */
  public setAdminAdress(userId: string, megPrmUser: slipMegPrmUser): { sendId: string, name: string }[] {
    let returnList: { sendId: string, name: string }[] = [];
    returnList.push({ sendId: '0', name: '伝票管理者宛' });
    returnList.push({ sendId: '', name: '全体' })
    megPrmUser.permissionUserList.forEach(user => {
      if (user.parmissionDiv != '1') {
        returnList.push({ sendId: user.userId, name: user.userName });
      }
    });
    return returnList;
  }


}
