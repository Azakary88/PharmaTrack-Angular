import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineForm } from './medicine-form';

describe('MedicineForm', () => {
  let component: MedicineForm;
  let fixture: ComponentFixture<MedicineForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicineForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
