import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { user } from 'src/app/entity/user';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  /** ユーザー情報 */
  @Input() acceseUser?: user

  /** メカニック区分 */
  mechaDiv = false;

  /** 工場区分 */
  factoryDiv = false;


  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.acceseUser != undefined) {
      this.dispMenuDiv();
    }
  }

  /**
   * 表示内容を設定する
   */
  private dispMenuDiv() {
    this.mechaDiv = false;
    if (this.acceseUser?.mechanicId != '0'
      && this.acceseUser?.mechanicId != null
      && this.acceseUser?.mechanicId != '') {
      this.mechaDiv = true;
    }

    this.factoryDiv = false;
    if (this.acceseUser?.officeId != '0'
      && this.acceseUser?.officeId != null
      && this.acceseUser?.officeId != '') {
      this.factoryDiv = true;
    }
  }

  /**
   * トップ
   */
  onTopBytton() {
    this.router.navigate(["/main_menu"]);
  }

  /**
   * 作業を依頼
   */
  onWorkRequest() {
    this.router.navigate(["service_create"],
    { queryParams:{ serviceType : '0'}});
  }

  /**
   * 作業を出品
   */
  onWorkExhibit(serviceType: string) {
    this.router.navigate(["service_create"],
    { queryParams:{ serviceType : serviceType}});
  }

  /**
   * 作業を探す
   */
  onWorkSerch() {
    this.router.navigate(["serchconditions"])
  }

  /**
   * プロフィールを編集
   */
  onProfileEdit() {
    this.router.navigate(["my-menu-component"]);
  }

  /**
   * メカニック情報を登録する
   */
  onMechaResister() {
    this.router.navigate(["mechanic-register"],
    {
      queryParams: {
        mechanicId: this.acceseUser?.mechanicId
      }
    });
  }

  /**
   * メカニック情報を編集する
   */
  onMechaProfileEdit() {
    this.router.navigate(["factory-mechanic-menu"],
    {
      queryParams: {
        mechanicId: this.acceseUser?.mechanicId
      }
    });
  }

  /**
   * 工場登録する
   */
  onFactoryProfileEdit() {
    this.router.navigate(["/factory-register"]);
  }


}
