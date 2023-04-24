import { Component, Inject,  OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-service-create-modal',
  templateUrl: './service-create-modal.component.html',
  styleUrls: ['./service-create-modal.component.scss']
})
export class ServiceCreateModalComponent implements OnInit {


  // 工場依頼ボタン表示区分
  officeBtnDiv = false;

  // 結果
  select = '';

  constructor(
    public _dialogRef: MatDialogRef<ServiceCreateModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      userId: string,
      mechanicId: string,
      officeId: string
    }
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    if(this.data.officeId != ''
    || this.data.officeId != null) {
      this.officeBtnDiv = true;
    } else {
      this.officeBtnDiv = false;
    }
  }

  onClick(result: string) {
    console.log(result);
    this.select = result;
    this._dialogRef.close(result);
  }


  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }

  onReturn() {
    this._dialogRef.close('');
  }

}
