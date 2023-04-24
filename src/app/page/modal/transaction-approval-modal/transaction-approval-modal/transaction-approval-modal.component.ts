import { Component, Inject,  OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { serviceTransactionRequest } from 'src/app/entity/serviceTransactionRequest';

@Component({
  selector: 'app-transaction-approval-modal',
  templateUrl: './transaction-approval-modal.component.html',
  styleUrls: ['./transaction-approval-modal.component.scss']
})
export class TransactionApprovalModalComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<TransactionApprovalModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: serviceTransactionRequest[]
  ) { }

  dispData:serviceTransactionRequest[] = [];

  ngOnInit(): void {
    console.log(this.data);
    this.dispData = this.data;
  }

  /**
   * 取引ユーザーを選択した場合
   * @param item
   */
  approvalUser(item: serviceTransactionRequest) {
    this._dialogRef.close(item);
  }

  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }


}
