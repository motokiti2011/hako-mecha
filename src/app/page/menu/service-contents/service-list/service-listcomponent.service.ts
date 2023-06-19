import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  find as _find,
  findIndex as _findIndex,
  isNil as _isNil,
  filter as _filter,
} from 'lodash';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { serviceContents } from 'src/app/entity/serviceContents';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { serchCategoryData } from 'src/app/entity/serchCategory';
import { userFavorite } from 'src/app/entity/userFavorite';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { serchSidAmount } from 'src/app/entity/serchSid';
import { monthMap } from 'src/app/entity/month';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { salesServiceInfo } from 'src/app/entity/salesServiceInfo';

@Injectable({
  providedIn: 'root'
})
export class ServiceListcomponentService {


  targetUrl = 'slipdetail'

  constructor(
    private apiService: ApiSerchService,
    private apiGsiService: ApiGsiSerchService,
  ) { }


  /**
   * 伝票情報を画面表示データに変換する
   * @param slipData
   * @returns
   */
  convertSlipServiceContents(slipData: slipDetailInfo[]): serviceContents[] {
    let resultData: serviceContents[] = [];
    slipData.forEach(slip => {
      if (slip.thumbnailUrl == '') {
        slip.thumbnailUrl = 'assets/images/noimage.png';
      }
      let vehicleInfo = null;
      if(slip.targetVehicleInfo) {
        vehicleInfo = slip.targetVehicleInfo;
      }
      const result: serviceContents = {
        id: slip.slipNo,
        userId: slip.slipAdminUserId,
        userName: slip.slipAdminUserName,
        mechanicId: '',
        mechanicName: '',
        officeId: '',
        officeName: '',
        title: slip.title,
        workArea: slip.workAreaInfo,
        price: Number(slip.price),
        area1: slip.areaNo1,
        area2: slip.areaNo2,
        category: slip.category,
        targetVehcle: vehicleInfo,
        vehicleDiv: slip.targetVehicleDiv,
        bidMethod: slip.bidMethod,
        explanation: slip.explanation,
        bidderId: Number(slip.bidderId),
        favoriteFlg: false,
        registeredDate: Number(slip.created),
        preferredDate: Number(slip.preferredDate),
        preferredTime: Number(slip.preferredTime),
        logicalDeleteFlag: 0,
        msgLv: slip.messageOpenLebel,
        thumbnailUrl: slip.thumbnailUrl,
        imageUrlList: null,
        serviceType: '0'
      }
      resultData.push(result);
    });
    return resultData;
  }


  /**
   * サービス商品情報を画面表示データに変換する
   * @param service
   * @returns
   */
  public convertServiceContents(serviceData: salesServiceInfo[]): serviceContents[] {
    let resultData: serviceContents[] = [];
    serviceData.forEach(service => {
      if (service.thumbnailUrl == '') {
        service.thumbnailUrl = 'assets/images/noimage.png';
      }
      let vehicleInfo = null;
      if(service.targetVehicleInfo) {
        vehicleInfo = service.targetVehicleInfo;
      }

      const result: serviceContents = {
        id: service.slipNo,
        userId: service.slipAdminUserId,
        userName: service.slipAdminUserName,
        mechanicId: service.slipAdminMechanicId,
        mechanicName: service.slipAdminMechanicName,
        officeId: service.slipAdminOfficeId,
        officeName: service.slipAdminOfficeName,
        title: service.title,
        workArea: service.workAreaInfo,
        price: Number(service.price),
        area1: service.areaNo1,
        area2: service.areaNo2,
        category: service.category,
        targetVehcle: vehicleInfo,
        vehicleDiv: service.targetVehicleDiv,
        bidMethod: service.bidMethod,
        explanation: service.explanation,
        bidderId: Number(service.bidderId),
        favoriteFlg: false,
        registeredDate: Number(service.created),
        preferredDate: Number(service.preferredDate),
        preferredTime: Number(service.preferredTime),
        logicalDeleteFlag: 0,
        msgLv: service.messageOpenLebel,
        thumbnailUrl: service.thumbnailUrl,
        imageUrlList: null,
        serviceType: service.serviceType
      }
      resultData.push(result)
    });
    return resultData;
  }




  /**
   * 画面表示するページ数を算出する。
   * @param totalPage 総ページ数
   * @param currentPage 現在のページ
   */
  setPage(totalPage: number, currentPage: number): number[] {
    let resultIndex: number[] = [];
    let count = 1;
    // 総ページ数が7ページ以下の場合
    if (totalPage < 7) {
      // 総ページ分のページ表示数を返却
      for (var i = 0; i < totalPage + 1; i++) {
        resultIndex.push(count);
        count++;
      }
    } else if (totalPage == currentPage) {
      // 最終ページの場合 現在のページ含めた前7ページを表示
      count = currentPage - 7;
      // 総ページ分のページ表示数を返却
      for (var i = 0; i < 6; i++) {
        resultIndex.push(count);
        count++;
      }
    } else if (currentPage == 1) {
      // 1ページ目の場合
      count = 1;
      // 総ページ分のページ表示数を返却
      for (var i = 0; i < 6; i++) {
        resultIndex.push(count);
        count++;
      }
    } else {
      // それ以外の場合
      if (totalPage <= currentPage + 3) {
        // 現在のページから最終ページまでが+3以内の場合

        // 合計ページ　- 現在のページ　=　後端のページ数
        const rearIndex = totalPage - currentPage;
        // 7 - 後端のページ数 =
        const centerIndex = 7 - rearIndex;
        // 現在のページ - 現在のページから前方の表示数 = 開始ページ数
        const frontIndex = currentPage - centerIndex;
        // 最終ページの場合 現在のページ含めた前7ページを表示
        count = frontIndex;
        // 7ページ表示数を返却
        for (var i = 0; i < 6; i++) {
          resultIndex.push(count);
          count++;
        }
      } else if (1 >= currentPage - 3) {
        // 現在のページから1ページまでが-3以内の場合
        count = 1;
        // 7ページ表示数を返却
        for (var i = 0; i < 6; i++) {
          resultIndex.push(count);
          count++;
        }
      } else {
        // 現在のページ - 3 = 開始ページ数
        const frontIndex = currentPage - 3;
        // 最終ページの場合 現在のページ含めた前7ページを表示
        count = frontIndex;
        // 7ページ表示数を返却
        for (var i = 0; i < 6; i++) {
          resultIndex.push(count);
          count++;
        }
      }
    }
    return resultIndex;
  }

  /**
   * エリアIDから地域名を取得
   * @param areaId
   * @returns 地域名
   */
  areaSelect(areaId: number): string {
    const areaData = _find(prefecturesCoordinateData, data => data.id == areaId);
    if (areaData == undefined) {
      return '';
    }
    return areaData.prefectures;
  }

  /**
   * カテゴリーIDから作業内容を取得
   * @param cotegoryId
   * @returns カテゴリー名
   */
  categorySelect(cotegoryId: string): string {
    const categoryData = _find(serchCategoryData, data => data.id == cotegoryId);
    if (categoryData == undefined) {
      return '';
    }
    return categoryData.category;
  }

  /**
   * お気に入りされたフラグを操作する。
   * @param id
   * @param contentsList
   */
  favoriteSetting(id: string, contentsList: serviceContents[]): serviceContents[] {
    const index = _findIndex(contentsList, content => content.id == id);
    // 対象のサービスのお気に入りフラグを切り替える
    if (contentsList[index].favoriteFlg) {
      contentsList[index].favoriteFlg = false;
    } else {
      contentsList[index].favoriteFlg = true;
    }
    return contentsList;
  }

  /**
   * 金額情報と一致するコンテンツを取得
   * @param standardSlip
   * @param amount
   */
  public serchAmtContent(standardSlip: slipDetailInfo[], amount: serchSidAmount[]): slipDetailInfo[] {
    let result: slipDetailInfo[] = [];
    // 絞り込み条件分絞り込みを行う
    amount.forEach(data => {
      let sbList = this.amtBetween(data, standardSlip);
      if (sbList.length > 0) {
        sbList.forEach(data => {
          result.push(data);
        });
      }
    });
    return this.slipUniq(result);
  }

  /**
   * 金額絞り込み範囲の伝票情報を取得
   * @param amt
   * @param slip
   */
  private amtBetween(amt: serchSidAmount, slipDetail: slipDetailInfo[]): slipDetailInfo[] {
    let list: slipDetailInfo[] = [];
    slipDetail.forEach(slip => {
      let price = Number(slip.price)
      if (price >= amt.value1
        && price <= amt.value2) {
        list.push(slip);
      }
    });
    return list;
  }

  /**
   * サービスの希望日から残り期間を設定します。
   * @param content
   * @returns
   */
  private getWhet(content: serviceContents): string {

    if (content.preferredDate === 0) {
      return '詳細へ'
    }

    // 現在日時を数値に変換
    const today = new Date();
    const toTime = today.getTime();

    // 希望日を数値に変換
    const dayStr = String(content.preferredDate);

    const targetDate = new Date(Number(dayStr.slice(0, 4)), Number(dayStr.slice(4, 6)) - 1, Number(dayStr.slice(6, 8)))
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
   * 伝票情報の重複を排除する
   * @param slipDetail
   */
  private slipUniq(slipDetail: slipDetailInfo[]): slipDetailInfo[] {
    let list: slipDetailInfo[] = [];
    slipDetail.forEach(slip => {
      if (!_find(list, l => l.slipNo === slip.slipNo)) {
        list.push(slip);
      }
    });
    return list;
  }











  /***************************API関係*******************************************/

  /**
   * サイドメニュー変更時の伝票取得処理
   * @param area
   * @param category
   */
  getSidSerchSlip(area: string, category: string): Observable<slipDetailInfo[]> {
    return this.apiGsiService.indexSerchSlip(area, '0', category, 'AREANO1ANDCATEGORY-INDEX');
  }

  /**
   * 重複削除：お気に入り
   */
  public favoriteUnuq(list: userFavorite[]): userFavorite[] {
    let result: userFavorite[] = [];
    list.forEach(l => {
      if (result.length == 0) {
        result.push(l);
      }
      if (!(_find(result, data => data.slipNo === l.slipNo))) {
        result.push(l);
      }
    })
    return result;
  }

  /**
   * 重複削除：閲覧履歴
   */
  public browsingHistoryUnuq(list: browsingHistory[]): browsingHistory[] {
    let result: browsingHistory[] = [];
    list.forEach(l => {
      if (result.length == 0) {
        result.push(l);
      }
      if (!(_find(result, data => data.slipNo === l.slipNo))) {
        result.push(l);
      }
    });
    return result;
  }


  /**
   * お気に入り情報を更新する
   * @param serviceContents
   */
  public postFavorite(favoriteList: userFavorite[], contents: serviceContents, userid: string) {
    const data = this.createFavorite(contents, userid);
    // お気に入り情報がない場合
    if (favoriteList.length == 0) {
      this.apiService.postFavorite(data).subscribe(st => {
      });
    } else {
      // 既存のお気に入りに存在するかをチェック
      if (_find(favoriteList, data => data.slipNo == contents.id)) {
        const id = _find(favoriteList, data => data.slipNo == contents.id)?.id
        // 存在する場合解除が必用なため削除する。
        if (id !== undefined && id !== null) {
          this.apiService.deleteFavorite(id).subscribe(st => {
            console.log(st);
          });
        }
      } else {
        // 存在しないので追加する
        this.apiService.postFavorite(data).subscribe(st => {
          console.log(st);
        });
      }
    }
  }

  /**
   * 更新用にお気に入り情報を作成する
   * @param slipNo
   * @param userid
   * @returns
   */
  private createFavorite(contents: serviceContents, userid: string): userFavorite {
    return {
      id: '0',
      userId: userid,
      slipNo: contents.id,
      title: contents.title,
      price: contents.price,
      whet: this.getWhet(contents),
      endDate: contents.preferredDate,
      imageUrl: contents.thumbnailUrl,
      serviceType: contents.serviceType,
      created: '',
      updated: '',
    }
  }

  /**
   * 表示リスト内容にお気に入り情報を設定する。
   * @param slip
   * @param favorite
   */
  public setFavorite(serviceSlip: serviceContents[], favorite: userFavorite[]): serviceContents[] {
    serviceSlip.forEach(slip => {
      if (_find(favorite, f => f.slipNo == slip.id)) {
        slip.favoriteFlg = true;
      }
    });
    return serviceSlip;
  }

  /**
   * 閲覧履歴情報を取得
   * @param userId
   * @returns
   */
  public getBrowsingHistory(userId: string): Observable<browsingHistory[]> {
    return this.apiGsiService.serchBrowsingHistory(userId);
  }

  /**
   * 更新用に閲覧履歴情報を作成する
   * @param contents
   * @param userid
   * @returns
   */
  private createBrowsingHistory(contents: serviceContents, userid: string): browsingHistory {
    return {
      id: '0',
      userId: userid,
      slipNo: contents.id,
      title: contents.title,
      price: String(contents.price),
      whet: this.getWhet(contents),
      endDate: String(contents.preferredDate),
      imageUrl: contents.thumbnailUrl,
      serviceType: contents.serviceType,
      created: '',
      updated: '',
    }
  }

  /**
   * 閲覧履歴情報更新
   * @param contents
   * @returns
   */
  public postBrowsingHistory(contents: serviceContents, userId: string): Observable<any> {
    return this.apiService.postHistory(this.createBrowsingHistory(contents, userId));
  }

}
