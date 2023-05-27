import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRequestModalComponent } from './transaction-request-modal.component';

describe('TransactionRequestModalComponent', () => {
  let component: TransactionRequestModalComponent;
  let fixture: ComponentFixture<TransactionRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionRequestModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
