import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';
import { TimeService } from '../../services/time/time.service';
import { formatDate } from '@angular/common';
import { DateTime } from 'luxon';
import { ToastComponent } from '../../components/toast/toast.component';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  public product: Product = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: DateTime.now().toJSDate(),
    date_revision: DateTime.now().plus({ years: 1 }).toJSDate(),
  };
  public productForm: FormGroup = new FormGroup({});

  public isEdit = false;
  public submitted = false;
  public minDate: string = '';

  @ViewChild(ToastComponent)
  customToast: ToastComponent = new ToastComponent();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _productService: ProductsService,
    private _timeService: TimeService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm(this.product);

    const routeParams = this.route.snapshot.queryParams;
    const productID = routeParams['id'];
    if (productID) {

      await this.getProductByID(productID);

    }

  }

  initForm(product: Product): void {
    this.minDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.productForm = new FormGroup({
      id: new FormControl({ value: product.id, disabled: this.isEdit }, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
      name: new FormControl(product.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
      description: new FormControl(product.description, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
      ]),
      logo: new FormControl(product.logo, Validators.required),
      date_release: new FormControl(
        this._timeService.toLocalDate(product.date_release),
        [Validators.required]
      ),
      date_revision: new FormControl(
        {
          value: this._timeService.toLocalDate(product.date_revision),
          disabled: true,
        },
        [Validators.required]
      ),
    });
    this.f['date_release']?.valueChanges.subscribe((newValue) => {
      this.updateRevisionDate(newValue);
    });
  }

  // Obtiene los controladores del form
  get f() {
    return this.productForm.controls;
  }

  async idValidator(id: string): Promise<void> {
    const isValid = await this._productService.isIdValid(id);
    if (!isValid && !this.isEdit) {
      this.f['id'].setErrors({ invalidId: true });
      this.customToast.showToastMessage('ID ya existe.', 'error', 'top-right');
    }
  }

  minDateValidator(date: string) {
    const currentDate = DateTime.now().startOf('day');
    if (currentDate > DateTime.fromISO(date)) {
      this.f['date_release'].setErrors({ minDate: true });
    }
  }

  updateRevisionDate(newDate: string): void {
    const reviewDateControl = this.f['date_revision'];
    if (newDate) {
      const newReviewDate = DateTime.fromISO(newDate, {
        zone: this._timeService.timeZone,
      }).plus({ years: 1 });
      reviewDateControl?.setValue(
        this._timeService.toLocalDate(newReviewDate.toString())
      );
    }
  }

  onCancel(): void {
    if (this.isEdit) {
      const idValue = this.f['id']?.value;
      this.productForm.reset();
      this.f['id'].setValue(idValue);
    } else {
      this.productForm.reset();
    }
    this.submitted = false;
  }

  async onSubmit() {
    this.submitted = true;
    this.minDateValidator(this.f['date_release']?.value);
    await this.idValidator(this.f['id']?.value);

    if (!this.productForm.valid) return;

    const product: Product = {
      ...this.productForm.value,
      id: this.f['id'].value,
      date_release: DateTime.fromISO(this.f['date_release'].value).toJSDate(),
      date_revision: DateTime.fromISO(this.f['date_revision'].value).toJSDate(),
    };

    this.isEdit ? this.updateProduct(product) : this.createProduct(product);
  }

  updateProduct(product: Product) {
    this._productService.updateProduct(product).subscribe((res) => {
      this.customToast.showToastMessage(
        'Producto editado',
        'success',
        'center'
      );
      setTimeout(() => {
        this.router.navigate(['/products']);
      }, 2000);
    });
  }

  createProduct(product: Product) {
    this._productService.createProduct(product).subscribe((res) => {
      console.log(res);
      if (res.message === 'Product added successfully') {
        this.customToast.showToastMessage(
          'Producto agregado!',
          'success',
          'center'
        );
        this.onCancel();
      }
    });
  }

  async getProductByID(id: string): Promise<void> {
    try {
      const product = await this._productService.getOneProduct(id).toPromise();
      if (!product) {
        return;
      }
      console.log(product);
      this.product = product;
      this.isEdit = true;
      this.initForm(product);
    } catch (error) {
      this.customToast.showToastMessage(
        'Error al obtener el producto',
        'error',
        'center'
      );
      // limpia la url si no encuentra el producto
      this.router.navigate(['/products-form']);
    }
  }
}
