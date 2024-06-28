import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { environment } from 'src/environment/environment';
import { Product } from '../../models/product-model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
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
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    }).compileComponents();
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); //  Verify that there are no outstanding requests.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  // F1. Listado de productos financieros:
  it('should get products', () => {
    const expectedResponse = {
      data: products,
    };
    service.getProducts().subscribe((response) => {
      expect(response.totalCount).toBe(5);
      expect(response.permProducts[2].id).toEqual('3');
      expect(response.permProducts[3].id).toEqual('4');
    });

    const req = httpMock.expectOne(environment.api + service.productsEndpoint);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  // F2. Búsqueda de productos financieros:
  it('should search products', () => {
    const query = 'Product 2';

    service.searchProducts(query, products).subscribe((response) => {
      expect(response.length).toBe(1);
      expect(response[0].id).toBe('2');
    });

    service.searchProducts('', products).subscribe((response) => {
      expect(response.length).toBe(products.length);
    });

    service
      .searchProducts('Non existent product', products)
      .subscribe((response) => {
        expect(response.length).toBe(0);
      });

    service.searchProducts('Product', products).subscribe((response) => {
      expect(response.length).toBe(products.length);
    });
  });


  // F4. Creación de productos financieros:
  it('should create a product', () => {
    const product: Product = {
      id: '6',
      name: 'Product 6',
      description: 'Description 6',
      logo: 'logo-url',
      date_release: new Date(),
      date_revision: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    };
    service.createProduct(product).subscribe((response) => {
      console.error(response);
      expect(response).toBeTruthy();
      expect(response.data.id).toEqual(product.id);
    });
    const req = httpMock.expectOne(environment.api + service.productsEndpoint);
    expect(req.request.method).toBe('POST');
    req.flush({ data: product });
  });

  // F5. Editar producto:
  it('should update a product', () => {
    const product: Product = {
      id: '2',
      name: 'Updated Product 2',
      description: 'Updated Description 2',
      logo: 'logo-url',
      date_release: new Date(),
      date_revision: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    };

    service.updateProduct(product).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.api}${service.productsEndpoint}/${product.id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush({ data: product });
  });
  it('should throw an error when updating a product that does not exist', () => {
    const product: Product = {
      id: '9999',
      name: 'Nonexistent Product',
      description: 'This product does not exist',
      logo: 'logo-url',
      date_release: new Date(),
      date_revision: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    };
  
    service.updateProduct(product).subscribe({
      next: () => {
        fail('Expected an error, not a success response');
      },
      error: (errorResponse) => {
        console.error('Error:', errorResponse);
        expect(errorResponse).toBeTruthy();
        expect(errorResponse.status).toBe(404);
        expect(errorResponse.error).toEqual('Not product found with that identifier');
      }
    });
  
    const req = httpMock.expectOne(`${environment.api}${service.productsEndpoint}/${product.id}`);
    expect(req.request.method).toBe('PUT');
    
    req.flush('Not product found with that identifier', { status: 404, statusText: 'Not Found' });
  });
  

  // F6. Eliminar producto:
  it('should delete a product', () => {
    const id = '2';
    service.deleteProduct(id).subscribe((response) => {
      console.log(response)
      expect(response).toBeTruthy();
      expect(response.message).toEqual('Product removed successfully');
    });

    const expectedResponse = { message: 'Product removed successfully' };

    const req = httpMock.expectOne(
      `${environment.api}${service.productsEndpoint}/${id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(expectedResponse);
  });

  it('should throw an error when deleting a product that does not exist', () => {
    const id = '9999';
    
    service.deleteProduct(id).subscribe({
      next: () => {
        fail('Expected an error, not a success response');
      },
      error: (errorResponse) => {
        console.error('Error:', errorResponse);
        expect(errorResponse).toBeTruthy();
        expect(errorResponse.status).toBe(404);
        expect(errorResponse.error).toEqual('Not product found with that identifier');
      }
    });
  
    const req = httpMock.expectOne(`${environment.api}${service.productsEndpoint}/${id}`);
    expect(req.request.method).toBe('DELETE');
    
    req.flush('Not product found with that identifier', { status: 404, statusText: 'Not Found' });
  });
  
  

  // Get product By ID
  it('should get a product by ID', () => {
    const id = '2';

    service.getOneProduct(id).subscribe((response) => {
      console.error('response', response);
      console.error('product', products[1]);
      expect(response).toEqual(products[1]);
    });

    const req = httpMock.expectOne(
      `${environment.api}${service.productsEndpoint}/${id}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(products[1]);
  });

  it('should handle error when getting a product by ID that does not exist', () => {
    const id = '9999';
  
    service.getOneProduct(id).subscribe({
      next: () => {
        fail('Expected an error, not a success response');
      },
      error: (errorResponse) => {
        console.error('Error:', errorResponse);
        expect(errorResponse).toBeTruthy();
        expect(errorResponse.status).toBe(404);
        expect(errorResponse.error).toEqual('Not product found with that identifier');
      }
    });
  
    const req = httpMock.expectOne(`${environment.api}${service.productsEndpoint}/${id}`);
    expect(req.request.method).toBe('GET');
    
    req.flush('Not product found with that identifier', { status: 404, statusText: 'Not Found' });
  });
  


  // Validar ID
  it('should validate an ID', fakeAsync(() => {
    const id = '2';
    let result: boolean | undefined;

    service.isIdValid(id).then((res) => (result = res));

    const req = httpMock.expectOne(
      `${environment.api}${service.productsEndpoint}/${id}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(products[1]);

    tick(); // Simula  el tiempo
    expect(result).toBe(false);
  }));

  it('should validate a non-existent ID', fakeAsync(() => {
    const id = '999';
    let result: boolean | undefined;

    service.isIdValid(id).then((res) => (result = res));

    const req = httpMock.expectOne(
      `${environment.api}${service.productsEndpoint}/${id}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(
      { status: 404, error: 'Not Found' },
      { status: 404, statusText: 'Not Found' }
    );

    tick();
    expect(result).toBe(true);
  }));
});
