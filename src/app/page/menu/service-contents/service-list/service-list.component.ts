import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  find as _find,
  isNil as _isNil,
  uniq as _uniq,
  cloneDeep as _cloneDeep,
  orderBy as _orderBy,
  includes as _includes
} from 'lodash';
import { serviceContents } from 'src/app/entity/serviceContents';
import { ServiceListcomponentService } from './service-listcomponent.service';
import { userFavorite } from 'src/app/entity/userFavorite';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { serchInfo, serchParam } from 'src/app/entity/serchInfo';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { serchServiceCombination } from 'src/app/entity/serchCondition';


@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {


  // ページング表示開始位置
  begin = 0;
  // ページング最大件数
  maxLength = 8;
  /** 現在のページ*/
  currentIndex: number = 0;
  /** 総ページ数*/
  totalPage: number = 1;
  /** インデックス*/
  pageIndex: { page: string, index: number }[] = [];
  // NoImageURL
  noImage = "assets/images/noimage.png";

  /** タイトル */
  serviceTitle = 'サービス一覧画面'
  /** コンテンツリスト*/
  contentsList: serviceContents[] = [];
  /** 画面表示コンテンツリスト*/
  displayContentsList: serviceContents[] = [];
  /** 退避用画面表示コンテンツリスト*/
  serchSbDisplayContentsList: serviceContents[] = [];

  /** 検索件数 */
  displayCount: number = 1;
  /** 最大件数表示フラグ */
  maxPageDisp: boolean = false;
  /** 表示順セレクトボタン */
  selected = 'defult';
  /** 検索条件：対象サービス */
  searchTargetService = '';

  /** 検索条件：地域 */
  serchArea1 = '0';
  /** 検索条件：詳細地域 */
  serchArea2 = '0';
  /** 検索条件：カテゴリー  */
  serchCategory = '0';
  /** 検索情報 */
  serchInfo: serchInfo = serchParam;
  /** アクセスユーザー */
  acseccUser = '';
  /** 認証ユーザー情報有無フラグ */
  userCertificationDiv: boolean = false;
  /** お気に入り取得情報 */
  favoriteList: userFavorite[] = [];
  /** ユーザー情報 */
  authUser = '';

  /** 絞り込みボタン表示 */
  serchBtnValue = '絞り込み'
  /** 絞り込みボタン表示区分 */
  serchBtnDiv = false;
  /** 検索キーワード */
  serchKeyWord = '';

  displayData = [
    { label: '表示順', value: 'defult', order: 'asc', disabled: false },
    { label: '日付が新しいものから表示', value: 'registeredDate', order: 'asc', disabled: false },
    { label: '日付が古いものから表示', value: 'registeredDate', order: 'desc', disabled: false },
    { label: '残り日付が長いものから表示', value: 'preferredDate', order: 'asc', disabled: false },
    { label: '残り日付が短いものから表示', value: 'preferredDate', order: 'desc', disabled: false },
  ];

  url = '';

  /** ユーザーID */
  userId = '0';

  /** お気に入り */
  favorteStyles = {
    favorite: false,
    anfavorite: false
  };

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private location: Location,
    private service: ServiceListcomponentService,
    private cognito: CognitoService,
    private apiGsiService: ApiGsiSerchService,
    private apiUniqueService: ApiUniqueService,
    private overlay: Overlay,

  ) { }

  ngOnInit() {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    // 検索条件画面からの条件から展開するサービス内容を抽出する
    this.activeRouter.queryParams.subscribe(params => {
      // this.loading.show();
      // 検索条件取得
      this.serchInfo.areaNo1 = params['areaNum'];
      this.serchInfo.category = params['category'];
      this.searchTargetService = params['serviceType'];

      this.serchArea1 = this.serchInfo.areaNo1;
      this.serchCategory = this.serchInfo.category;

      if (this.searchTargetService !== '0') {
        this.getServiceContents();
      } else {
        this.getSlip();
      }

      // 認証有無状態を判定する
      const authUser = this.cognito.initAuthenticated();
      if (authUser === null) {
        // 認証情報がない場合、お気に入り、閲覧履歴は非表示
        this.userCertificationDiv = false;
        // ローディング解除
        this.overlayRef.detach();
        this.loading = false;
      } else {
        // ユーザー情報を基にお気に入り情報を取得
        this.userCertificationDiv = true;
        this.authUser = authUser;
        this.acseccUser = authUser;
        // ユーザー情報ある場合
        this.apiGsiService.serchFavorite(authUser).subscribe(data => {
          this.favoriteList = this.service.favoriteUnuq(data);
          if (data.length > 0) {
            this.setFavorite();
          }
        });
      }
    });
  }

  /**
   * 検索情報を元に伝票情報を取得する
   */
  private getSlip() {
    this.apiUniqueService.serchSlip(this.serchInfo).subscribe(slip => {
      // 表示用にデータ加工
      this.displayContentsList = this.service.convertSlipServiceContents(slip);
      this.initSetServiceContents();
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }

  /**
   * 検索条件を元にサービス商品情報を取得する
   */
  getServiceContents() {
    this.apiUniqueService.serchServiceContents(this.serchInfo).subscribe(salesService => {
      this.displayContentsList = this.service.convertServiceContents(salesService);
      this.initSetServiceContents();
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }


  /**
   * 初回表示するサービスを取得し設定する
   * @return void
   */
  private initSetServiceContents(): void {
    // // 初回のみ初期化
    // this.displayContentsList;
    // コンテンツ全体から総ページ数を算出する(切上げ)
    this.totalPage = Math.ceil(this.displayContentsList.length / 8);
    // 現在のページを設定する
    this.currentIndex = 0;
    // 初期ページ設定を行う
    this.initPageSetting();
  }

  /********************* 画面操作イベント ************************/

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
   * サービス選択時イベント
   * @param content 選択サービスコンテンツ
   * @return void
   */
  onContentsSelect(content: serviceContents): void {
    if (this.userCertificationDiv) {
      // 認証されている場合は閲覧履歴情報に登録
      this.service.postBrowsingHistory(content, this.authUser).subscribe(d => {
      });
    }

    this.router.navigate(["servicedetail"],
      {
        queryParams: {
          serviceId: content.id,
          searchTargetService: this.searchTargetService
        }
      });
  }

  /**
   * お気に入り登録処理
   * @param contents
   */
  onContentFavorite(contents: serviceContents) {
    // サービス一覧のお気に入りFlgを制御する
    this.contentsList = this.service.favoriteSetting(contents.id, this.displayContentsList);
    // 画面表示のお気に入りFlgを制御する
    this.displayContentsList = this.contentsList;
    // 認証情報取得
    if (this.authUser) {
      // お気に入り登録有無を判定し更新する。
      this.service.postFavorite(this.favoriteList, contents, this.authUser);
    }
  }

  /******************* トップイベント **************************/

  /**
   * 表示順セレクトボックス選択時
   */
  onDisplayList() {
    if (this.selected == 'defult') {
      return;
    }

    const selectData = _find(this.displayData, disp => disp.value == this.selected)
    if (selectData == undefined) {
      this.selected = 'defult';
      return;
    }
    if (selectData.order == 'asc') {
      const sortData = _orderBy(this.displayContentsList, selectData.value, 'asc')
      this.displayContentsList = _cloneDeep(sortData);
    } else {
      const sortData = _orderBy(this.displayContentsList, selectData.value, 'desc')
      this.displayContentsList = _cloneDeep(sortData);
    }
    this.initSetServiceContents();
  }


  /******************* サイドメニューイベント **************************/


  /**
   * サイドメニューの検索押下イベント
   * @param event
   */
  onServiceSerch(event: serchServiceCombination) {
    if (this.searchTargetService !== '0') {
      this.serchServiceContents(event);
    } else {
      this.serchSlip(event);
    }
  }


  /**
   * 絞り込みボタン押下時
   */
  onSerch() {
    if (this.serchBtnDiv) {
      // リセットボタン押下時
      this.serchBtnDiv = false;
      this.serchBtnValue = '絞り込む'
      this.serchKeyWord = '';
      // 退避用リストを戻す
      this.displayContentsList = _cloneDeep(this.serchSbDisplayContentsList);
      this.serchSbDisplayContentsList = [];
      this.initSetServiceContents();
    } else {
      if (_isNil(this.serchKeyWord)) {
        return;
      }
      // 絞り込みボタン押下時
      this.serchBtnDiv = true;
      this.serchBtnValue = 'リセット'
      // 表示用リストを退避
      this.serchSbDisplayContentsList = _cloneDeep(this.displayContentsList);
      this.serchKeyWordInc();
    }
  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }


  /******************* 以下内部処理 **************************/

  /**
   * 初回ページ設定を行う
   * @return void
   */
  private initPageSetting() {
    // 初回のみ初期化
    this.pageIndex = [];
    let count = 1;
    const maxIndex = this.totalPage;

    // ページ数は最大6個表示のためそれ以上であれば6個までの表示を行う
    if (this.totalPage > 8) {
      this.maxPageDisp = true;
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
   * お気に入り情報を設定する
   */
  private setFavorite() {
    const dList = this.displayContentsList;
    this.displayContentsList = this.service.setFavorite(dList, this.favoriteList);
    // ローディング解除
    this.overlayRef.detach();
    this.loading = false;
  }


  /**
   * 検索結果をもとにサービス商品を検索する
   * @param event
   */
  private serchServiceContents(event: serchServiceCombination) {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.apiGsiService.serviceSerchCombination(event).subscribe(salesService => {
      // this.displayContentsList = this.service.convertServiceContents(salesService);
      // this.initSetServiceContents();
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }

  /**
   * 検索結果をもとに伝票情報を取得する
   * @param event
   */
  private serchSlip(event: serchServiceCombination) {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.apiGsiService.slipSerchCombination(event).subscribe(slip => {
      // this.displayContentsList = this.service.convertSlipServiceContents(slip);
      // this.initSetServiceContents();
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });
  }

  /**
   * 検索キーワードに応じた表示リストを抽出する。
   */
  private serchKeyWordInc() {
    const serchResult: serviceContents[] = [];
    this.displayContentsList.forEach(listData => {
      // 部分一致or完全一致の場合
      if (_includes(listData.title, this.serchKeyWord)
        || _includes([listData.title], this.serchKeyWord)) {
        serchResult.push(listData);
      }
    });
    this.displayContentsList = _cloneDeep(serchResult);
    this.initSetServiceContents();
  }

}
