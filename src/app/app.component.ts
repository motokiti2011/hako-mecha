import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderMenuComponent } from './page/menu/header-menu/header-menu.component';
import { MainMenuComponent } from './page/menu/main-menu/main-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /** タイトル */
  title = 'haco-mecha';
  heightDiv = false;
  /** 枠は準備するが非表示 */
  advertiementDiv = false;



  /** 子コンポーネントを読み込む */
  @ViewChild(HeaderMenuComponent) head!: HeaderMenuComponent;

  @ViewChild(MainMenuComponent) main!: MainMenuComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { };

  ngOnInit() {
    this.router.navigate(["/main_menu"])
  }

  /**
   * 遷移先
   */
  onActivate() {
    this.head.ngOnInit();
    const route = this.activatedRoute;
    const routeAny: any = route.snapshot;
    const pass: string = routeAny._routerState.url;
    const link: string[] = pass.split('?')
    if (link[0] !== '/transaction_menu'
      && link[0] !== '/factory-mechanic-menu'
      && link[0] !== '/service-transaction') {
      this.heightDiv = true;
    } else {
      this.heightDiv = false;
    }
    if (link[0] === '/main_menu') {
      this.main.ngOnInit();
      this.head.ngOnInit();
    }
  }

  /**
   * 認証状況変化に応じた初期化処理を実施する
   * @param authCheck
   */
  onAuthCheck(authCheck: boolean) {
    if(authCheck) {
      this.main.ngOnInit();
    }
  }

}
