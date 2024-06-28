import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { Product } from 'src/app/products/models/product-model';
import { ProductsService } from '../../services/products/products.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastComponent } from '../../components/toast/toast.component';

/**
 * Componente que muestra la lista de productos
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = []; // Lista para mostrar
  permProducts: Product[] = []; // Lista para buscar y paginar
  pagination = {
    pageSizeOptions: [5, 10, 20],
    pageSize: 5,
    currentPage: 1,
  };
  pages: number[] = [];
  totalProducts = 0;

  public query: string = '';
  private subscriptions: Subscription[] = [];

  public showModal: boolean = false;
  public selectedProduct: Product | null = null;
  public activeProduct: any = null;

  @ViewChild(ToastComponent)
  customToast: ToastComponent = new ToastComponent();

  constructor(
    private _productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getProducts(): void {
    const getProductsSubscription = this._productsService
      .getProducts()
      .subscribe((products) => {
        this.permProducts = products.permProducts; // Todos los productos
        this.totalProducts = products.totalCount;
        this.updateProductList();
      });
    this.subscriptions.push(getProductsSubscription);
  }

  searchProducts(): void {
    if (this.query !== '') {
      const filteredProducts = this.permProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(this.query.toLowerCase()) ||
          product.description.toLowerCase().includes(this.query.toLowerCase())
      );
      this.products = filteredProducts.slice(0, this.pagination.pageSize);
      this.totalProducts = filteredProducts.length;
      this.pagination.currentPage = 1; // Resetea a la pagina 1
      this.pagination.currentPage = 1; // Reiniciar a la página 1
      this.calculatePages();
    } else {
      this.pagination.currentPage = 1;
      this.getProducts();
    }
  }

  deleteProduct(id: string) {
    const deleteSubscription = this._productsService
      .deleteProduct(id)
      .subscribe((res) => {
        if(res.message === 'Product removed successfully'){
          this.customToast.showToastMessage('Producto eliminado correctamente', 'success', 'top-right');
          this.getProducts();
        } else {
          this.customToast.showToastMessage('Error al eliminar el producto', 'error', 'top-right');
        }
        this.toggleModal();

      });

    this.subscriptions.push(deleteSubscription);
    this.calculatePages();
  }

  //Actualiza la lista de productos según la paginación y la búsqueda
  updateProductList(): void {
    const startIndex =
      (this.pagination.currentPage - 1) * this.pagination.pageSize;
    const endIndex = Math.min(
      startIndex + this.pagination.pageSize,
      this.totalProducts
    );

    if (this.query !== '') {
      const filteredProducts = this.permProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(this.query.toLowerCase()) ||
          product.description.toLowerCase().includes(this.query.toLowerCase())
      );
      this.products = filteredProducts.slice(startIndex, endIndex);
    } else {
      this.products = this.permProducts.slice(startIndex, endIndex);
    }
    this.calculatePages();
  }

  changePage(page: number): void {
    this.pagination.currentPage = page;
    this.updateProductList();
  }

  // Cambia el tamaño de los  productos por página y vuelve a la página 1
  changePageSize(event: any): void {
    this.pagination.pageSize = event.target.value;
    this.pagination.currentPage = 1;
    this.getProducts();
  }

  // Calcula el número de páginas disponibles de acuerdo al tamaño de la página y el número total de productos
  calculatePages(): void {
    this.pages = [];
    for (
      let i = 1;
      i <= Math.ceil(this.totalProducts / this.pagination.pageSize);
      i++
    ) {
      this.pages.push(i);
    }
  }

  // Devuelve el índice de inicio de la página actual
  get startIndex(): number {
    return (this.pagination.currentPage - 1) * this.pagination.pageSize + 1;
  }
  // Devuelve el índice de fin de la página actual
  get endIndex(): number {
    return Math.min(
      this.pagination.currentPage * this.pagination.pageSize,
      this.totalProducts
    );
  }

  goToAdd() {
    this.router.navigate(['/products-form']);
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }
  toggleMenu(event: Event, product: Product) {
    event.stopPropagation();
    if (this.activeProduct === product) {
      this.activeProduct = null;
    } else {
      this.activeProduct = product;
    }
  }

  editProduct(product: Product) {
    this.activeProduct = null;
    this.router.navigate(['/products-form'], {
      queryParams: { id: product.id },
    });
  }

  deleteProductWarning(product: Product) {
    this.activeProduct = null;
    this.selectedProduct = product;
    this.toggleModal();
  }

  // Cierra el select al hacer clic fuera del menú desplegable
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-menu') && !target.closest('.menu-icon')) {
      this.activeProduct = null;
    }
  }
  // Ayuda a mantener la relación de los elementos en el DOM con los objetos en el arreglo
  fnTrack: TrackByFunction<Product> = (index: number, item: Product) => item.id;
}
