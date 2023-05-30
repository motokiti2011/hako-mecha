import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceSerchConditionsService } from './service-serch-conditions.service';
import { serchCondition } from 'src/app/entity/serchCondition';
import { SerchServiceModalComponent } from 'src/app/page/modal/serch-service-modal/serch-service-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';

import { ComponentPortal } from '@angular/cdk/portal';


@Component({
  selector: 'app-service-serch-conditions',
  templateUrl: './service-serch-conditions.component.html',
  styleUrls: ['./service-serch-conditions.component.scss']
})
export class ServiceSerchConditionsComponent implements OnInit {

  pageX = ''
  pageY = ''
  offsetX = ''
  offsetY = ''

  serviceType = '';

  /**
   * 検索条件
   */
  serchCondition: serchCondition = {
    mapOffsetX: 0,
    mapOffsetY: 0,
    areaNum: '0',
    category: 0,
  }

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  /** モーダルデータ */
  modalData?: { serchType: string, value: string };

  constructor(
    private location: Location,
    private service: ServiceSerchConditionsService,
    private router: Router,
    public modal: MatDialog,
    private overlay: Overlay,
  ) { }

  ngOnInit(): void {
  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }


  /**
   * mapがクリックされた場合に座標情報からクリック位置を決定する
   * @param e 座標情報
   */
  mapSelect(e: any) {
    this.offsetX = e.offsetX
    this.offsetY = e.offsetY

    this.serchCondition.mapOffsetX = e.offsetX;
    this.serchCondition.mapOffsetY = e.offsetY;
    const serchResult = this.service.coordinateMap(this.serchCondition);

    // 戻り値が0以外の場合検索結果を格納の上画面遷移
    if (serchResult != '0') {
      this.serchCondition.areaNum = serchResult;
      const serchData = { serchType: 'area', value: String(serchResult) }
      this.onSerchServiceModal(serchData);
    }
  }

  /**
   * 都道府県名エリアがクリックされた際に検索条件に組み込み
   * サービス一覧画面に遷移する。
   * @param i 件名管理ID
   */
  areaSelect(i: string) {
    // 検索条件の都道府県IDに選択地を設定する
    this.serchCondition.areaNum = i;
    const serchData = { serchType: 'area', value: String(i) }
    this.onSerchServiceModal(serchData);
  }

  /**
   * サービス内容から探すが選択された際の処理
   * @param i サービスカテゴリー選択値
   */
  contentsSelect(i: number) {
    // 検索条件のサービスカテゴリーIDに設定する
    this.serchCondition.category = i;
    const serchData = { serchType: 'category', value: String(i) }
    this.onSerchServiceModal(serchData);
  }


  /**
   * 検索サービスモーダルを展開する
   */
  private onSerchServiceModal(serchData: { serchType: string, value: string }) {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    const dialogRef = this.modal.open(SerchServiceModalComponent, {
      width: '400px',
      height: '450px',
      data: serchData
    });
    // モーダルクローズ後
    dialogRef.afterClosed().subscribe(
      result => {
        if (result !== null && result !== '') {
          if (result == undefined) {
            // ローディング解除
            this.overlayRef.detach();
            return;
          }
          this.serviceType = result;
          // ローディング解除
          this.overlayRef.detach();
          this.openSerchServiceList(result);
        } else {
          // ローディング解除
          this.overlayRef.detach();
          // 戻るボタンまたはモーダルが閉じられたのでなにもしない
          return;
        }
      }
    );
  }

  /**
   * 対象サービスタイプを設定しサービス一覧画面に遷移する
   * @param serviceType
   */
  private openSerchServiceList(serviceType: string) {
    this.router.navigate(["service_list"],
      {
        queryParams: {
          areaNum: this.serchCondition.areaNum,
          category: this.serchCondition.category,
          serviceType: serviceType
        }
      });
  }


}
