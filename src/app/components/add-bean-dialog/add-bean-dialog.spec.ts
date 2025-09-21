import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBeanDialog } from './add-bean-dialog';

describe('AddBeanDialog', () => {
  let component: AddBeanDialog;
  let fixture: ComponentFixture<AddBeanDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBeanDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBeanDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
