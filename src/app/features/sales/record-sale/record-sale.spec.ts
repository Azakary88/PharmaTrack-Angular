import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSale } from './record-sale';

describe('RecordSale', () => {
  let component: RecordSale;
  let fixture: ComponentFixture<RecordSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordSale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
