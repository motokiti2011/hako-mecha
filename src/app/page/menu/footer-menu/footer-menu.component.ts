import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-menu',
  templateUrl: './footer-menu.component.html',
  styleUrls: ['./footer-menu.component.scss']
})
export class FooterMenuComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  /**
   * ハコメカリンククリックイベント
   */
  onHakomecha() {
    this.router.navigate(["main_menu"])
  }

  /**
   * 利用規約クリックイベント
   */
  onUseTerms() {
    this.router.navigate(["use-terms"])
  }

  /**
   * 個人情報取扱クリックイベント
   */
  onPersonalInfo() {
    this.router.navigate(["personal-information-handling"])
  }

  /**
   * お問い合わせクリックイベント
   */
  onInquiry() {
    this.router.navigate(["inquiry"])
  }

  // /**
  //  * サイトマップクリックイベント
  //  */
  // onSitMap() {
  //   this.router.navigate(["sit-map"])
  // }

  /**
   * ヘルプクリックイベント
   */
  onHelp() {
    this.router.navigate(["help"])
  }




}
