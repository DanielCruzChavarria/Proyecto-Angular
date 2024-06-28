import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsComponent,
        ProductListComponent,
        ProductFormComponent,
        HeaderComponent,
      ],
      imports: [
        RouterTestingModule,

      ]
    });
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
