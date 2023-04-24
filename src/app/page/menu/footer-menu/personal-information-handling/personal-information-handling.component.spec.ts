import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInformationHandlingComponent } from './personal-information-handling.component';

describe('PersonalInformationHandlingComponent', () => {
  let component: PersonalInformationHandlingComponent;
  let fixture: ComponentFixture<PersonalInformationHandlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalInformationHandlingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInformationHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
