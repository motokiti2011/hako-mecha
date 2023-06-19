import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { user } from 'src/app/entity/user';
import { mcfcItem } from 'src/app/entity/mcfcItem';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { FormService } from 'src/app/page/service/form.service';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { messageDialogMsg } from 'src/app/entity/msg';
import { MatDialog } from '@angular/material/dialog';
import { ApiAuthService } from 'src/app/page/service/api-auth.service';

@Component({
  selector: 'app-factory-mechanic-contents-management',
  templateUrl: './factory-mechanic-contents-management.component.html',
  styleUrls: ['./factory-mechanic-contents-management.component.scss']
})
export class FactoryMechanicContentsManagementComponent implements OnInit {

  /** ユーザー情報 */
  user?: user
  /** 商品リスト */
  itemList: mcfcItem[] = [];
  /** サービスタイプ */
  serviceType: string = '';

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private router: Router,
    private cognito: CognitoService,
    private formService: FormService,
    private apiSerchService: ApiSerchService,
    private apiUniqService: ApiUniqueService,
    private activeRouter: ActivatedRoute,
    private overlay: Overlay,
    public modal: MatDialog,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.activeRouter.queryParams.subscribe(params => {
      this.serviceType = params['serviceType']
      // ログイン検証
      const authUser = this.cognito.initAuthenticated();
      if (authUser == null) {
        this.openMsgDialog(messageDialogMsg.LoginRequest, true);
        // ローディング解除
        this.overlayRef.detach();
        return;
      }
      this.apiSerchService.getUser(authUser).subscribe(res => {
        if (res != null) {
          // ユーザー情報を設定
          this.user = res[0];
          this.getMcFcItemList();
        } else {
          // ローディング解除
          this.overlayRef.detach();
          this.openMsgDialog(messageDialogMsg.ProblemOperation, true);
        }
      });
    });
  }

  /**
   * サービス選択時イベント
   * @param item 選択サービスコンテンツ
   * @return void
   */
  onItemSelect(item: mcfcItem): void {

    this.router.navigate(["servicedetail"],
      { queryParams: {
        serviceId: item.serviceId,
        searchTargetService: item.serviceType
      } });
  }


  /************ 以下内部処理 ***********/

  /**
   * メカニック・工場商品一覧を取得する
   * @returns
   */
  private getMcFcItemList() {
    let serchId = this.user?.mechanicId;
    if (this.serviceType == '1') {
      serchId = this.user?.officeId;
    }
    if (serchId == null) {
      // ローディング解除
      this.overlayRef.detach();
      return;
    }
    this.apiUniqService.getMcFcItemList(serchId, this.serviceType).subscribe(res => {
      const items: mcfcItem[] = []
      if(res.length > 0) {
        let mcfcItem: mcfcItem[] = res;
        mcfcItem.forEach(data => {
          const status = this.formService.setTransactionStatus(data.transactionStatus)
          data.transactionStatus = status;
          items.push(data);
        })
      }
      this.itemList = items;
      // ステータス変換

      // ローディング解除
      this.overlayRef.detach();
    });
  }

  /**
   * メッセージダイアログ展開
   * @param msg
   * @param locationDiv
   */
  private openMsgDialog(msg:string, locationDiv: boolean) {
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
      if(locationDiv) {
        // ローディング解除
        this.overlayRef.detach();
        this.router.navigate(["/main_menu"]);
      }
      return;
    });
  }


}

