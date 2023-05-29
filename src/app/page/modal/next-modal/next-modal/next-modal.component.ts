import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalData, nextAction } from 'src/app/entity/nextActionButtonType';

/**
 * 次の作業へモーダル
 */
@Component({
  selector: 'app-next-modal',
  templateUrl: './next-modal.component.html',
  styleUrls: ['./next-modal.component.scss']
})
export class NextModalComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<NextModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ModalData
    ) { }

  ngOnInit(): void {

  }

  nextAction(selected: nextAction) {
    this.data.resultAction = selected.nextId;
    this._dialogRef.close(this.data);
  }
  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }

}
