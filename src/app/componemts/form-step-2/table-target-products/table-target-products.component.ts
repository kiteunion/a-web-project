import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ProductService } from '../../../share/services/product.service';
import { CategoryInterface, ClassInterface } from '../../../share/interface/product.interface';

@Component({
  standalone: true,
  selector: 'app-table-target-products',
  imports: [
    TableModule,
    Tag
  ],
  templateUrl: './table-target-products.component.html',
  styleUrl: './table-target-products.component.scss'
})
export class TableTargetProductsComponent {
  constructor(
    public productService: ProductService
  ) {
  }

  remove(category: CategoryInterface, item: ClassInterface) {
    const sourceProducts = this.productService.sourceProducts();
    const findClass = sourceProducts.find((v) => v.name === item.name);
    if (findClass) {
      findClass.categories.push(category);
      this.productService.sourceProducts.set(sourceProducts);
    }

    //
    item.categories = item.categories.filter((v) => v.name !== category.name);
    this.productService.save();
    this.productService.targetProducts = this.productService.targetProducts.filter(product => product.categories.length > 0);
  }
}
