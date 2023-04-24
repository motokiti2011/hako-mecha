import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingSpinnerService } from './loading-spinner.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {

  /** スピナーの表示、非表示フラグ */
  public isLoading: Subject<boolean> = this.loadingSpinnerService.isLoading;

  constructor(private loadingSpinnerService: LoadingSpinnerService) {}

}
