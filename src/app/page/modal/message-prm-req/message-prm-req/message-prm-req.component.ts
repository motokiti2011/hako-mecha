import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-prm-req',
  templateUrl: './message-prm-req.component.html',
  styleUrls: ['./message-prm-req.component.scss']
})
export class MessagePrmReqComponent implements OnInit {

  /** 申請済フラグ */
  requestDiv = false;

  constructor(
    public _dialogRef: MatDialogRef<MessagePrmReqComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: boolean
    ) { }

  ngOnInit(): void {
    console.log(this.data)
    if(this.data) {
      this.requestDiv = true;
    }
  }

  btnAction(result: boolean) {
    this.data = result;
    this._dialogRef.close(this.data);
  }
  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }
}
