import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-evaluation',
  templateUrl: './service-evaluation.component.html',
  styleUrls: ['./service-evaluation.component.scss']
})
export class ServiceEvaluationComponent implements OnInit {

  /** サービスタイトル */
  serviceTitle?: string;

  constructor() { }

  ngOnInit(): void {
  }


  /**
   * 決定ボタン押下イベント
   */
  onResister() {

  }

}
