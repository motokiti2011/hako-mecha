import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalData, nextAction } from 'src/app/entity/nextActionButtonType';

/**
 * 公開設定モーダル
 */
@Component({
  selector: 'app-open-level',
  templateUrl: './open-level.component.html',
  styleUrls: ['./open-level.component.scss']
})
export class OpenLevelComponent implements OnInit {

  title: string = 'メッセージ公開レベルを設定できます。'

  // buttonList = [
  //   { id: 1, value: '全体に公開', class: 'open' },
  //   { id: 2, value: '一部に公開', class: 'partially' },
  //   { id: 3, value: '非公開', class: 'private' }
  // ];

  openFlg = false;
  partiallyFlg = false;
  privateFlg = false;


  constructor(
    public _dialogRef: MatDialogRef<OpenLevelComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: string
  ) { }

  ngOnInit(): void {

  }

  nextAction(selected: any) {
    this.data = String(selected);
    this._dialogRef.close(this.data);
  }

  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }

  onOpenenter() {
    this.openFlg = true;
  }

  onOpenleave() {
    this.openFlg = false;
  }

  onPartiallyenter() {
    this.partiallyFlg = true;
  }

  onPartiallyleave() {
    this.partiallyFlg = false;
  }

  onPrivateenter() {
    this.privateFlg = true;
  }

  onprivateleave() {
    this.privateFlg = false;
  }



}
