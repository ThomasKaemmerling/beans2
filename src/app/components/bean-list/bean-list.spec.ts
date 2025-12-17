import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeanList } from './bean-list';

describe('BeanList', () => {
  let component: BeanList;
  let fixture: ComponentFixture<BeanList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeanList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeanList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
