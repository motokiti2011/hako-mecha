import { Component, OnInit } from '@angular/core';
import { serviceContents } from 'src/app/entity/serviceContents';
import { detailList } from 'src/app/entity/detailList';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { TransactionMenuService } from '../transaction-menu.service';
import { TansactionCompleteService } from './tansaction-complete.service';
import {
  find as _find,
  cloneDeep as _cloneDeep,
  pull as _pull,
  remove as _remove,
  difference as _difference,
  isNil as _isNil
} from 'lodash';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { messageDialogMsg } from 'src/app/entity/msg';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';


@Component({
  selector: 'app-tansaction-complete',
  templateUrl: './tansaction-complete.component.html',
  styleUrls: ['./tansaction-complete.component.scss']
})
export class TansactionCompleteComponent implements OnInit {

  HEAD = {
    check: '',
    title: 'タイトル',
    contents: '内容',
    area: '地域',
    category: 'カテゴリー',
    price: '価格',
    whet: '期間',
    endDate: '終了日',
    message: 'メッセージ'
  };

  /** 表示用リスト */
  detailList: any = [];

  /** チェックリスト */
  selectionList: any = [];

  /** 一括選択チェック */
  hedSelection: boolean = false;

  /** 削除ボタン活性フラグ */
  checkbutton: boolean = true;

  selected = '';

  orderMenu = [
    { id: 1, value: '残り期間が短い順' },
    { id: 2, value: '残り期間が長い順' },
    { id: 3, value: '価格が安い順' },
    { id: 4, value: '価格が高い順' },
  ];

  /** ログインユーザー情報 */
  loginUser = '';

  selectType = '0';

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private location: Location,
    private router: Router,
    private service: TransactionMenuService,
    private compService: TansactionCompleteService,
    public modal: MatDialog,
    private overlay: Overlay,
    private cognito: CognitoService,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    this.setListSetting();
  }


  /**
   * 対象の伝票タイトルクリックイベント
   * @param item
   */
  onItemClick(item: any) {
    this.router.navigate(["servicedetail"], { queryParams: { serviceId: item.slipNo, searchTargetService: item.serviceType } });
  }

  /**
   * 一括選択チェックボックスイベント
   */
  bulkSelection() {
    const dispList: detailList[] = _cloneDeep(this.detailList);

    dispList.forEach((content) => {
      // check をすべてヘッダと同じ状態にする
      content.check = this.hedSelection;

      if (this.hedSelection) {
        this.selectionList.push(content.id)
      } else {
        _pull(this.selectionList, content.id)
      }
    });
    this.detailList = dispList;

    // 削除ボタンの制御
    if (this.selectionList.length > 0) {
      this.checkbutton = false;
    } else {
      this.checkbutton = true;
    }

  }


  /**
   * タイトルクリック時、詳細画面へ遷移する
   * @param content
   */
  contentsDetail(content: serviceContents) {
    this.router.navigate(["servicedetail"], { queryParams: { serviceId: content.id } });
  }

  /**
   *  並び順変更イベント
   *
   */
  changeOrder() {
    const order = _find(this.orderMenu, order => order.value === this.selected)

    if (!_isNil(order)) {
      this.detailList = this.service.sortOrderList(this.detailList, order.id);
    }
  }

  /**
   * 前画面に戻る
   */
  onReturn() {
    this.location.back();
  }

  /**
   * 評価を行う
   * @param item
   */
  onEvo(item: serviceContents) {
    this.router.navigate(["service-evaluation"], { queryParams: { serviceId: item.id } });
  }

  /******************************* 以下内部処理 *************************************/

  /**
   * 表示リストの初期設定を行います。
   */
  private setListSetting() {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    const user = this.cognito.initAuthenticated();
    // 未認証の場合前画面へ戻る
    if (user == null) {
      this.apiAuth.authenticationExpired();
      this.openMsgDialog(messageDialogMsg.LoginRequest, true);
      return;
    }
    // ユーザー情報を設定する
    this.loginUser = user;
    // データを取得
    this.compService.getTransactionCompSlip(this.loginUser).subscribe(data => {
      this.detailList = this.compService.dispContentsSlip(data)
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }


  /**
   * メッセージダイアログ展開
   * @param msg
   * @param locationDiv
   */
  private openMsgDialog(msg: string, locationDiv: boolean) {
    // ダイアログ表示（ログインしてください）し前画面へ戻る
    const dialogData: messageDialogData = {
      massage: msg,
      closeFlg: false,
      closeTime: 0,
      btnDispDiv: true
    }
    const dialogRef = this.modal.open(MessageDialogComponent, {
      width: '300px',
      height: '150px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (locationDiv) {
        this.router.navigate(["/main_menu"]);
      }
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
      return;
    });
  }



}
