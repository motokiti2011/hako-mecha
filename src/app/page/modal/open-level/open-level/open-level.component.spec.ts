import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenLevelComponent } from './open-level.component';

describe('OpenLevelComponent', () => {
  let component: OpenLevelComponent;
  let fixture: ComponentFixture<OpenLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
