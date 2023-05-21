import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { imgFile } from 'src/app/entity/imgFile';

/** 画像登録モーダル（1枚用） */
@Component({
  selector: 'app-single-image-modal',
  templateUrl: './single-image-modal.component.html',
  styleUrls: ['./single-image-modal.component.scss']
})
export class SingleImageModalComponent implements OnInit {


  title = '画像登録'

  /** イメージ */
  img: {file: File, url:any}[] = []

  /** ファイルリスト(一時) */
  fileList: File[] = []

  constructor(
    public _dialogRef: MatDialogRef<SingleImageModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: imgFile[]
    ) { }

  ngOnInit(): void {
    if(this.data.length != 0) {
      this.img = this.data;
    }

  }


  /**
   * 決定ボタン押下イベント
   */
  getResult() {
    this._dialogRef.close(this.img);    
  }

  // ダイアログを閉じる
  closeModal() {
    this.img = [];
    this._dialogRef.close(this.img);
  }


  /**
   * アップロードファイル選択時イベント
   * @param event
   */
  onInputChange(event: any) {
    const files = event.target.files[0];

    this.fileList.push(files);
    this.img.push(files);
  }

  /**
   * ドラッグインプット(参照もこちら)
   * @param event 
   */
  onChangeDragAreaInput(event: any) {
    // ファイルの情報はevent.target.filesにある
    let reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      const imgFileData: imgFile = {file:file, url: reader.result }
      this.img.push(imgFileData);
      // TODO
      // this.img.push(file);
      console.log(this.img)
    };
  }


  /**
   * 削除する押下イベント
   * @param i 
   */
  onRemove(i: any) {
    const hoge:any[] = []
    this.img.forEach(data => {
      if(data != i) {
        hoge.push(data);
      }
    });
    this.img = hoge;
    console.log(this.img)
  }


  dragOver(event: DragEvent) {
    // ブラウザで画像を開かないようにする
    event.preventDefault();
  }

  /**
   * イメージドロップイベント
   * @param event 
   * @returns 
   */
  imgDrop(event: DragEvent) {
    // ブラウザで画像を開かないようにする
    event.preventDefault();
    if (event.dataTransfer == null) {
      return;
    }
    const file:FileList = event.dataTransfer.files;
    this.fileList.push(file[0])
    const fileList = Object.entries(file).map(f => f[1]);
    console.log(fileList);

    fileList.forEach(f => {
      let reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => {
        const imgFileData: imgFile = {file:f, url: reader.result }
        this.img.push(imgFileData);
      };
    });
  }

}
