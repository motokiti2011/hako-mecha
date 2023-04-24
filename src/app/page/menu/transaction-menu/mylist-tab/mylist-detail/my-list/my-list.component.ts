import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {
  find as _find,
  cloneDeep as _cloneDeep,
  pull as _pull,
  remove as _remove,
  difference as _difference,
  isNil as _isNil
} from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { loginUser } from 'src/app/entity/loginUser';
import { dispUserMyList } from 'src/app/entity/userMyList';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { MyListService } from './my-list.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { messageDialogMsg } from 'src/app/entity/msg';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss']
})
export class MyListComponent implements OnInit {

  HEAD = {
    readDiv: '既読/未読',
    msgPage: 'メッセージページ',
    adlessMsg: '宛先・メッセージ内容',
    messageDate: '日付',
  };

  /** 表示用リスト */
  detailList: dispUserMyList[] = [];

  // /** チェックリスト */
  // selectionList: any = [];

  /** 一括選択チェック */
  hedSelection: boolean = false;

  /** 削除ボタン活性フラグ */
  checkbutton: boolean = true;

  selected = '';

  orderMenu = [
    { id: '1', value: '未読のみ' },
    { id: '2', value: '既読のみ' },
    { id: '3', value: '新しい順' },
    { id: '4', value: '古い順' },
  ];

  /** 取引中件数 */
  transactionCountMsg = '';
  /** メッセージ通知 */
  messageAlert = '';
  /** ログインユーザー情報 */
  loginUser = '';
  // ページング表示開始位置
  begin = 0;
  // ページング最大件数
  maxLength = 25;
  /** インデックス*/
  pageIndex: { page: string, index: number }[] = [];
  /** 現在のページ*/
  currentIndex: number = 0;
  /** 総ページ数*/
  totalPage: number = 1;
  /** 最大フラグ */
  maxPageDisp: boolean = false;
  /** 最小フラグ */
  minPageDisp: boolean = false;

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private location: Location,
    private router: Router,
    private mylistservice: MyListService,
    private auth: AuthUserService,
    public modal: MatDialog,
    private overlay: Overlay,
    private cognito: CognitoService,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    this.setListSetting();
  }

  /**
   * 表示リストの初期設定を行います。
   */
  private setListSetting() {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    const user = this.cognito.initAuthenticated();
    // ユーザー情報取得できない場合前画面へ戻る
    if (user == null) {
      this.apiAuth.authenticationExpired();
      // ローディング解除
      this.overlayRef.detach();
      // this.openMsgDialog(messageDialogMsg.LoginRequest, true);
      return;
    }
    // ユーザー情報を設定する
    this.loginUser = user;
    // データを取得
    this.mylistservice.getMyList(this.loginUser, '0').subscribe(data => {
      console.log(data);
      if (data.length !== 0) {
        this.detailList = this.mylistservice.displayFormatdisplayFormat(data);
        this.setServiceContents();
      }
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }

  // /**
  //  * チェックボックス選択時イベント
  //  * @param title
  //  * @param check
  //  */
  // deleteSelection(title: String, check: boolean) {

  //   // チェック状態の場合リストに追加
  //   if (check) {
  //     this.selectionList.push(title);
  //   } else {
  //     _pull(this.selectionList, title);
  //   }

  //   // 削除ボタンの制御
  //   if (this.selectionList.length > 0) {
  //     this.checkbutton = false;
  //   } else {
  //     this.checkbutton = true;
  //   }

  // }


  // /**
  //  * 一括選択チェックボックスイベント
  //  */
  // bulkSelection() {
  //   console.log(this.hedSelection)
  //   const dispList: detailList[] = _cloneDeep(this.detailList);

  //   dispList.forEach((content) => {
  //     // check をすべてヘッダと同じ状態にする
  //     content.check = this.hedSelection;

  //     if (this.hedSelection) {
  //       this.selectionList.push(content.id)
  //     } else {
  //       _pull(this.selectionList, content.id)
  //     }
  //   });
  //   this.detailList = dispList;

  //   // 削除ボタンの制御
  //   if (this.selectionList.length > 0) {
  //     this.checkbutton = false;
  //   } else {
  //     this.checkbutton = true;
  //   }

  // }

  // /** 削除ボタン押下時のイベント */
  // deleteCheck() {
  //   const List: [] = _cloneDeep(this.selectionList);
  //   const deleteList: detailList[] = []

  //   List.forEach((select) => {
  //     // 削除対象を取得する
  //     if (_find(this.detailList, disp => disp.id === select)) {
  //       deleteList.push(_find(this.detailList, disp => disp.id === select));
  //     }
  //   });

  //   // 差集合を抽出
  //   const dispList = _difference(this.detailList, deleteList);
  //   // 表示リストを書き換える。
  //   this.detailList = _cloneDeep(dispList);

  //   // 削除するデータをＡＰＩへ
  //   /**  */

  // }

  /**
   * タイトルクリック時、詳細画面へ遷移する
   * @param content
   */
  contentsDetail(content: dispUserMyList) {
    this.router.navigate(["service-detail-component"], { queryParams: { serviceId: content.slipNo, searchTargetService: content.serviceType } });
  }

  /**
   *  並び順変更イベント
   *
   */
  changeOrderSort() {
    console.log(this.selected)
    // const order = _find(this.orderMenu, order => order.value === this.selected)

    // if (!_isNil(order)) {
    //   this.detailList = this.service.sortOrderList(this.detailList, order.id);
    //   console.log(this.detailList);
    // }
  }



  /**
   * 前へボタン押下イベント
   * @return void
   */
  onContentsForward(): void {
    // 1ページ目の場合何もしない
    if (this.currentIndex == 0) {
      return;
    }
    const beforIndex = this.currentIndex - 1;
    this.onContentsIndex(beforIndex)
  }
  /**
   * 次へボタン押下イベント
   * @return void
   */
  onContentsNext(): void {
    // 最終ページの場合何もしない
    if (this.currentIndex == this.totalPage - 1) {
      return;
    }
    const nextIndex = this.currentIndex + 1;

    this.onContentsIndex(nextIndex)
  }

  /**
   * Indexボタン押下イベント
   * @return void
   */
  onContentsIndex(index: number): void {
    this.currentIndex = index;
    this.begin = this.maxLength * index;
  }


  /**
   * 前画面に戻る
   */
  onReturn() {
    this.location.back();
  }

  /********************* 内部処理 ************************/

  /**
   * ページ数設定を行う
   */
  private setServiceContents(): void {
    this.totalPage = Math.ceil(this.detailList.length / 25);
    this.pageSetting();
  }


  /**
   * 初回ページ設定を行う
   * @return void
   */
  private pageSetting() {
    // 初回のみ初期化
    this.pageIndex = [];
    let count = 1;
    const maxIndex = this.totalPage;

    // ページ数は最大6個表示のためそれ以上であれば6個までの表示を行う
    if (this.totalPage > 25) {
      // 1ページのみの場合次、前は非表示
      this.maxPageDisp = true;
      this.minPageDisp = true;
    }
    // ページ数は最大6表示
    for (var i = 0; i < this.totalPage; i++) {
      // if (count > 8) {
      //   return;
      // }
      const pageData = { page: String(count), index: count - 1 }
      this.pageIndex.push(pageData);
      count++;
    }
    // ローディング解除
    this.overlayRef.detach();
    this.loading = false;
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
      console.log(result);
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
      return;
    });
  }



}
