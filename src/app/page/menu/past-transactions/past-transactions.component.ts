import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { forkJoin, Observable, of } from 'rxjs';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { completionSlip } from 'src/app/entity/completionSlip';
import { ApiCheckService } from '../../service/api-check.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { CognitoService } from '../../auth/cognito.service';
import { user } from 'src/app/entity/user';
import { ApiAuthService } from '../../service/api-auth.service';
import { ApiSerchService } from '../../service/api-serch.service';
/**
 * 過去取引コンポーネント
 */
@Component({
  selector: 'app-past-transactions',
  templateUrl: './past-transactions.component.html',
  styleUrls: ['./past-transactions.component.scss']
})
export class PastTransactionsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkService: ApiCheckService,
    private uniqueService: ApiUniqueService,
    private cognito: CognitoService,
    private overlay: Overlay,
    private apiAuth: ApiAuthService,
    private apiSerch: ApiSerchService,
  ) { }

  /** 表示情報 */
  dispInfo: completionSlip[] = [];
  /** 管理者ID */
  adminId: string = '';
  /** サービスタイプ */
  serviceType: string = '';
  /** 管理者区分 */
  authDiv = false;
  /** アクセス者情報 */
  userInfo?:user;
  /** 参照モード取引非表示メッセージ */
  emptyMessage = '過去の取引はありません。';

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;


  ngOnInit(): void {
    // urlパラメータ取得
    this.route.queryParams.subscribe(params => {
      this.adminId = params['adminId'];
      this.serviceType = params['serviceType'];
      // ローディング開始
      this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
      this.loading = true;
      // ログインユーザー情報取得
      const authUser = this.cognito.initAuthenticated();
      let accessUser = '';
      if (authUser !== null) {
        // ログイン状態の場合
        accessUser = authUser
        this.setUserInfo(accessUser);
      }
      // 非同期で表示データ取得とアクセス者の管理対象判定を行う
      forkJoin(
        this.uniqueService.getPastTransaction(this.adminId,this.serviceType, accessUser),
        this.checkService.checkAcceseAdmin(this.adminId,this.serviceType, accessUser)
      ).subscribe(resultList => {
        console.log(resultList);
        const list = resultList[0];
        this.setDispList(list);
        if(resultList[1]) {
          this.authDiv = resultList[1];
        }
      });
      // ローディング解除
      this.overlayRef.detach();
      this.loading = false;
    });

  }

  /**
   * 取得データを表示用に格納する。
   * @param list
   * @returns
   */
  private setDispList(list: completionSlip[]) {
    if(list.length == 0) {
      return;
    }
    this.dispInfo = list;

  }

  /**
   * アクセス者情報取得
   * @param accessUser 
   */
  private setUserInfo(accessUser: string) {
    this.apiSerch.getUser(accessUser).subscribe(user => {
      if(user) {
        this.userInfo = user[0];
      }
    })
  }





}
