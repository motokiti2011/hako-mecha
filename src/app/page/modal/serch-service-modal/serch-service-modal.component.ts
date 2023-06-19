import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { serchCategoryData } from 'src/app/entity/serchCategory';
import {
  find as _find
} from 'lodash';
@Component({
  selector: 'app-serch-service-modal',
  templateUrl: './serch-service-modal.component.html',
  styleUrls: ['./serch-service-modal.component.scss']
})


export class SerchServiceModalComponent implements OnInit {

    serchTypeMsg: string = '';
    serchValueMsg: string = '';

    constructor(
    public _dialogRef: MatDialogRef<SerchServiceModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public serchData: {serchType: string,value: string},
  ) { }

  ngOnInit(): void {
    if(this.serchData.serchType == 'area') {
      this.areaMsgSet();
    } else {
      this.categoryMsgSet();
    }

  }


  onClick(result: string) {
    this._dialogRef.close(result);
  }


  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }

  onReturn() {
    this.closeModal();
  }


  /**
   * 表示するエリア検索条件をメッセージにする
   */
  private areaMsgSet() {
    const res = _find(prefecturesCoordinateData, area => area.id === Number(this.serchData.value))
    if(res == undefined) {
      return;
    }
    this.serchTypeMsg = 'エリア'
    this.serchValueMsg = res.prefectures;


  }

  /**
   * 表示するカテゴリー検索条件をメッセージにする
   */
  private categoryMsgSet() {
    const res = _find(serchCategoryData, category => category.id === this.serchData.value)
    if(res == undefined) {
      return;
    }
    this.serchTypeMsg = 'カテゴリー'
    this.serchValueMsg = res.category;
  }

}
