import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Product } from '../../models/product-model';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService  {
  public productsEndpoint = '/products';

  constructor(private http: HttpClient) {}

  // F1. Listado de productos financieros:
  getProducts(): Observable<{ permProducts: Product[]; totalCount: number }> {
    return this.http
      .get<{ data: Product[] }>(environment.api + this.productsEndpoint)
      .pipe(
        map((response) => {
          return {
            permProducts: response.data,
            totalCount: response.data.length,
          };
        })
      );
  }

  // F2. Búsqueda de productos financieros:
  searchProducts(query: string, products: Product[]): Observable<Product[]> {
    const filteredProducts = products.filter(
      (product) =>
        product.id.toLowerCase().includes(query.toLowerCase()) ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    return of(filteredProducts); // Utilizamos Of para simular un observable que emite un valor único
  }


  // F4. Agregar producto:
  createProduct(product: Product): Observable<{message: string, data: Product}> {
    try {
      return this.http.post(
        `${environment.api}${this.productsEndpoint}`,
        product
      ).pipe(
        map(response => {
          return response as {message: string, data: Product};
        })
      )
    } catch (error) {
      console.log('Error al crear el producto:', error);
      throw error;
    }
  }

  // F5. Editar producto:
  updateProduct(product: Product): Observable<any> {
    try {
      return this.http.put(
        `${environment.api}${this.productsEndpoint}/${product.id}`,
        product
      );
    } catch (error) {
      console.log('Error al actualizar el producto:', error);
      throw error;
    }
  }

  // F6. Eliminar producto:
  deleteProduct(id: string): Observable<{message: string}> {
    try {
      return this.http.delete(
        `${environment.api}${this.productsEndpoint}/${id}`
      ).pipe(
        map(response => response as {message: string})
      );
    } catch (error) {
      console.log('Error al eliminar el producto:', error);
      throw error;
    }
  }

  // Get product By ID
  getOneProduct(id: string): Observable<Product> {
    return this.http
      .get<Product>(`${environment.api}${this.productsEndpoint}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  // Validar ID
  async isIdValid(id: string): Promise<boolean> {
    return this.http
      .get<Product>(`${environment.api}${this.productsEndpoint}/${id}`)
      .toPromise()
      .then(() => false) // Si encuentra el id retorna falso (ya existe)
      .catch((error: HttpErrorResponse) => true); //  Si no lo encuentra retorna verdadero (no existe)
  }
}
