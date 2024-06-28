import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProductListComponent } from './product-list.component';
import { ProductsService } from '../../services/products/products.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Product } from '../../models/product-model';
import { of } from 'rxjs';
import { ToastComponent } from '../../components/toast/toast.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productsService: jasmine.SpyObj<ProductsService>
  const products: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo-url',
      date_release: new Date(),
      date_revision: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logo-url',
      date_release: new Date(),
      date_revision: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Product 3',
      description: 'Description 3',
      logo: 'logo-url',
      date_release: new Date(),
      date_revision: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      name: 'Product 4',
      description: 'Description 4',
      logo: 'logo-url',
      date_release: new Date(),
      date_revision: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    },
    {
      id: '5',
      name: 'Product 5',
      description: 'Description 5',
      logo: 'logo-url',
      date_release: new Date(),
      date_revision: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [ProductListComponent, ToastComponent],
      providers: [
        {
          provide: ProductsService,
          useValue: jasmine.createSpyObj('ProductsService', ['getProducts', 'deleteProduct']),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // F3. Cantidad de registros:
  it('should call getProducts on init', () => {
    productsService.getProducts.and.returnValue(of({ permProducts: products, totalCount: 5 }));
    fixture.detectChanges();
    expect(component.permProducts).toEqual(products);
    expect(component.totalProducts).toBe(5);
  });

  // F2: Búsqueda de productos financieros:
  it('should search products when query is changed', () => {
    productsService.getProducts.and.returnValue(of({ permProducts: products, totalCount: 5 }));
    fixture.detectChanges();
    component.query = 'Product 1';
    component.searchProducts();
    expect(component.products).toEqual([products[0]]);
  });



});
