import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
  uniq as _uniq,
} from 'lodash';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, distinct, map, switchMap, tap } from "rxjs/operators";
import { serchCategoryData } from 'src/app/entity/serchCategory';
import { prefecturesCoordinateData, cityApiDate } from 'src/app/entity/prefectures';
import { serviceContents } from 'src/app/entity/serviceContents';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { loginUser } from 'src/app/entity/loginUser';
import { userFavorite } from 'src/app/entity/userFavorite';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { ServiceListcomponentService } from '../../service-listcomponent.service';
import { Router } from '@angular/router';
import { serchSidAmount } from 'src/app/entity/serchSid';
import { noUndefined } from '@angular/compiler/src/util';
import { cityData } from 'src/app/entity/area1SelectArea2';
import { serchServiceCombination } from 'src/app/entity/serchCondition';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';

@Component({
  selector: 'app-service-list-side-menu',
  templateUrl: './service-list-side-menu.component.html',
  styleUrls: ['./service-list-side-menu.component.scss']
})
export class ServiceListSideMenuComponent implements OnInit {


  /** 検索条件：地域 */
  @Input() serchArea1: string = '0';
  /** 検索条件：カテゴリー  */
  @Input() serchCategory: string = '0';
  /** お気に入り表示情報*/
  @Input() favoriteList: userFavorite[] = [];
  /** アクセスユーザー */
  @Input() acseccUser: string = '';
  // /** 閲覧履歴表示情報*/
  // @Input() browsingHistoryList: serviceContents[] = [];
  /** エリア操作時のイベント */
  @Output() chengeArea = new EventEmitter<string>();
  /** カテゴリー操作時のイベント */
  @Output() chengeCateogry = new EventEmitter<string>();
  /** 金額操作時のイベント */
  @Output() chengeAmount = new EventEmitter<serchSidAmount[]>();
  /** 認証中ユーザー情報 */
  @Output() chengeAuth = new EventEmitter<Observable<loginUser>>();
  /** 検索値 */
  @Output() serviceSerchValue = new EventEmitter<serchServiceCombination>();


  // 表示用お気に入り情報
  displayFavorite: userFavorite[] = [];
  // 表示用閲覧履歴情報
  displayBrowsing: browsingHistory[] = [];
  /** ユーザー認証済フラグ */
  userCertificationDiv = false;
  /** 地域情報選択状態初期値 */
  areaSelect = '';
  /** カテゴリー選択状態初期値 */
  categorySelect = '';
  /** 地域情報データ一覧 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  /** 地域２（市町村）データ */
  areaCityData: cityData[] = []
  /** 地域２（市町村）選択 */
  citySelect = '';
  /** カテゴリーデータ一覧 */
  categoryData = serchCategoryData;
  /** 検索条件値 */
  serchValue: serchServiceCombination = { area1: '', area2: '', category: '', amount1: 0, amount2: 0, amountSerchDiv: false };

  // 金額1
  amount1 = new FormControl('', [
    Validators.pattern('[0-9 ]*')
  ]);


  // 金額2
  amount2 = new FormControl('', [
    Validators.pattern('[0-9 ]*')
  ]);

  /** 金額チェックボックスデータ */
  serchAmount = { label: '指定なし', selected: false };


  constructor(
    private auth: AuthUserService,
    private service: ServiceListcomponentService,
    private router: Router,
    private apiService: ApiSerchService,
  ) { }

  ngOnInit(): void {
    // 地域のセレクトボックス初期選択処理
    if (this.serchArea1 != '0') {
      this.areaSelect = this.serchArea1;
      this.serchValue.area1 = this.serchArea1;
      this.onArea();
    }

    // 作業内容のセレクトボックス初期選択処理
    if (this.serchCategory != '0') {
      this.categorySelect = this.serchCategory
      this.serchValue.category = this.serchCategory;
    }
    // 認証ユーザー取得
    if (this.acseccUser !== null && this.acseccUser != '') {
      // 認証情報がない場合、お気に入り、閲覧履歴は非表示
      this.userCertificationDiv = true;
    } else {
      this.userCertificationDiv = false;
    }
    if (this.userCertificationDiv) {
      // 閲覧履歴情報を取得
      this.initListDisplay(this.acseccUser);
    }

  }

  /**
   * 初期処理：閲覧履歴情報を取得し画面表示する
   */
  private initListDisplay(userId: string | undefined): void {
    if (userId === undefined) {
      return;
    }
    console.log(this.favoriteList)
    // 閲覧履歴情報を取得
    this.service.getBrowsingHistory(userId).subscribe(data => {
      this.displayBrowsing = this.service.browsingHistoryUnuq(data);
    });
  }

  /**
   * エリア押下時
   * 選択した地域情報をイベント発火させ親へと戻す
   */
  onArea() {
    if (this.areaSelect == undefined) {
      this.areaCityData = [];
    } else {
      this.serchValue.area1 = this.areaSelect;
      this.getCityInfo();
    }
  }

  /**
   * 地域２（市町村）選択イベント
   */
  onAreaCity() {
    console.log(this.citySelect)
    this.serchValue.area2 = this.citySelect;
  }


  /**
   * 作業内容押下時
   * 選択した作業内容をイベント発火させ親へと戻す
   */
  onWorkContents() {
    console.log(this.serchValue.category);
    this.serchValue.category = this.categorySelect;
    console.log(this.serchValue.category);
  }

  /**
   * 金額押下時
   */
  onAmount() {
    if (this.serchAmount.selected) {
      this.amount1.disable();
      this.amount2.disable();
    } else {
      this.amount1.enable();
      this.amount2.enable();
    }
    this.serchValue.amount1 = this.amount1.value;
    this.serchValue.amount2 = this.amount2.value;
    this.serchValue.amountSerchDiv = this.serchAmount.selected;

  }

  /**
   * お気に入り、閲覧履歴コンテンツ押下時イベント
   */
  onContentsDetail(slipNo: string) {
    console.log(slipNo);
    this.router.navigate(["service-detail-component"], { queryParams: { serviceId: slipNo } });
  }

  /**
   * 一覧へ押下時
   */
  listMenu() {
    console.log(323);
  }

  /**
   * 検索するボタン押下イベント
   */
  onSerch() {
    console.log(this.serchValue);
    this.serviceSerchValue.emit(this.serchValue);
  }

  /**
 * 都道府県から市町村データを取得し設定する
 */
  private getCityInfo() {
    const areaa = _find(this.areaData, data => data.code === this.areaSelect);
    console.log(areaa)
    if (areaa) {
      this.apiService.serchArea(areaa.prefectures)
        .subscribe(data => {
          // console.log(data);
          // console.log(data.response);
          console.log(data.response.location);
          if (data.response.location.length > 0) {
            this.areaCityData = data.response.location;
          }
        });
    }
  }


}
