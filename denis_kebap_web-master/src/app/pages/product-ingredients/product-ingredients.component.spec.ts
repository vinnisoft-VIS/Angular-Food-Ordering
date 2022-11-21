import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIngredientsComponent } from './product-ingredients.component';

describe('ProductIngredientsComponent', () => {
  let component: ProductIngredientsComponent;
  let fixture: ComponentFixture<ProductIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductIngredientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
