import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PW1FormMainComponent } from './pw1-form-main.component';

describe('PW1FormMainComponent', () => {
  let component: PW1FormMainComponent;
  let fixture: ComponentFixture<PW1FormMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PW1FormMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PW1FormMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
