import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRecorder } from './sales-recorder';

describe('SalesRecorder', () => {
  let component: SalesRecorder;
  let fixture: ComponentFixture<SalesRecorder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesRecorder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesRecorder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
