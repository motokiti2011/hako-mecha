import { Injectable } from '@angular/core';
import { serchCondition } from 'src/app/entity/serchCondition';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { filter as _filter } from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class ServiceSerchConditionsService {

  constructor() { }

  /**
   * 地図がクリックされた際に、座標から県名情報を取得する。
   * @param condition　画面クリック時の座標情報
   * @return 都道府県管理ID
   */
  public coordinateMap(condition :serchCondition) : string {
    condition.mapOffsetX

    const detailx = _filter(prefecturesCoordinateData, detail =>
      detail.xleft <= condition.mapOffsetX
      && detail.xright >= condition.mapOffsetX
      );

    if(detailx.length < 0) {
      return '0';
    }
    const detaily = _filter(detailx, detail =>
      detail.ytop <= condition.mapOffsetY
      && detail.ybottom >= condition.mapOffsetY
      );

    if(detaily.length < 0) {
      return '0';
    } else {
      return detaily[0].code;
    }

  }

}
