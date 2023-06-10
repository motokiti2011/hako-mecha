import { Component, OnInit } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-factory-mechanic-impletion',
  templateUrl: './factory-mechanic-impletion.component.html',
  styleUrls: ['./factory-mechanic-impletion.component.scss']
})
export class FactoryMechanicImpletionComponent implements OnInit {

  /** 登録日 */
  createDate?: string;
  /** 累計お気に入り件数 */
  favoriteCount?: string;
  /** 取引件数 */
  transactionCount?: string;
  /** 評価平均 */
  evaluationAverage?: string;
  /** 今月の取引件数 */
  monthTransactionCount?: string;
  /** ローディングオーバーレイ */
  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  loading = false;

  constructor(
    private overlay: Overlay,
  ) { }

  ngOnInit(): void {
  }

  onEvaluationList() {

  }

}
