import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
