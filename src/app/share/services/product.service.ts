import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClassInterface, ProductResultInterface } from '../interface/product.interface';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  readonly sourceProducts: WritableSignal<ClassInterface[]> = signal([]);
  readonly sourceProductsBuffer: WritableSignal<ClassInterface[]> = signal([]);
  public targetProducts: ClassInterface[] = [];
  public targetProductsChange$: Subject<void> = new Subject<void>();

  constructor(
    private http: HttpClient
  ) {
    this.restore();
  }

  restore() {
    const targetProducts = localStorage.getItem('target-products');
    if (targetProducts) {
      this.targetProducts = JSON.parse(targetProducts);
      this.targetProductsChange$.next();
    }
  }

  save() {
    console.debug('Save products');
    this.targetProductsChange$.next();
    localStorage.setItem('target-products', JSON.stringify(this.targetProducts));
  }

  findKeywords(region: string, searchWord: string): Observable<ProductResultInterface> {
    const url = `${environment.backendApiUrl}/search/find-keywords`;
    return this.http.post<ProductResultInterface>(url, {
      data: {
        region,
        searchWord
      }
    });
  }

  removeDuplicateCategories(sourceProducts: ClassInterface[], targetProducts: ClassInterface[]): ClassInterface[] {
    // Создаем Set с именами категорий из targetProducts для быстрого поиска
    const targetCategories = new Set<string>();
    targetProducts.forEach(product => {
      product.categories.forEach(category => {
        targetCategories.add(category.name);
      });
    });

    // Создаем новый массив с отфильтрованными категориями
    const filteredProducts: ClassInterface[] = sourceProducts.map(product => {
      return {
        ...product,
        categories: product.categories.filter(category =>
          !targetCategories.has(category.name)
        )
      };
    });

    // Удаляем классы, у которых не осталось категорий
    return filteredProducts.filter(product => product.categories.length > 0);
  }

}
