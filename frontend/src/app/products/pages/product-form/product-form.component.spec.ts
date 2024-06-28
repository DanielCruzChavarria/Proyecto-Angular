import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductsService } from '../../services/products/products.service';
import { TimeService } from '../../services/time/time.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastComponent } from '../../components/toast/toast.component';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: ProductsService;
  let timeService: TimeService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent, ToastComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      providers: [
        ProductsService,
        TimeService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                id: null,
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductsService);
    timeService = TestBed.inject(TimeService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    component.initForm(component.product);
    expect(component.productForm).toBeTruthy();
    expect(component.productForm.controls['id'].value).toEqual('');
  });

  it('should reset the form on cancel', () => {
    component.isEdit = false;
    component.productForm.setValue({
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'logo-url',
      date_release: '2023-01-01',
      date_revision: '2024-01-01',
    });

    component.onCancel();

    expect(component.productForm.value).toEqual({
      id: null,
      name: null,
      description: null,
      logo: null,
      date_release: null,
    });
  });

  it('should not reset the product ID on cancel if in edit mode', () => {
    component.isEdit = true;
    component.productForm.setValue({
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'logo-url',
      date_release: '2023-01-01',
      date_revision: '2024-01-01',
    });

    component.onCancel();

    expect(component.productForm.controls['id'].value).toEqual('123');
  });

  it('should handle error when getting a product by ID that does not exist', async () => {
    spyOn(productService, 'getOneProduct').and.returnValue(
      throwError('Error obteniendo producto.')
    );
    spyOn(router, 'navigate');

    await component.getProductByID('9999');

    expect(router.navigate).toHaveBeenCalledWith(['/products-form']);
  });
});