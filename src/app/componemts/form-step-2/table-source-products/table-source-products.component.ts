import {
  Component, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core';
import { FormService } from '../../../share/services/form.service';
import { TableModule } from 'primeng/table';

import { Tag } from 'primeng/tag';
import { ProductService } from '../../../share/services/product.service';
import { BehaviorSubject, debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { CategoryInterface, ClassInterface } from '../../../share/interface/product.interface';

@Component({
  standalone: true,
  selector: 'app-table-source-products',
  imports: [
    TableModule,
    Tag
],
  templateUrl: './table-source-products.component.html',
  styleUrl: './table-source-products.component.scss'
})
export class TableSourceProductsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isLoading!: WritableSignal<boolean>;
  @Input() q!: string;
  @Output() public onLoad: EventEmitter<void> = new EventEmitter();
  onSearch$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private destroy$: Subject<void> = new Subject();

  constructor(public productService: ProductService) {
  }

  ngOnInit() {
    this.onSearch$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((q) => {
        this.search(q);
      })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onSearch$.next(this.q);
  }

  search(q: string) {
    if (!q) {
      return;
    }
    this.productService.findKeywords('AU', q)
      .pipe(finalize(() => {
        this.isLoading.set(false);
        this.onLoad.emit();
      }))
      .subscribe((res) => {
        this.productService.sourceProductsBuffer.set(res.data.classes);

        res.data.classes = this.productService.removeDuplicateCategories(
          res.data.classes,
          this.productService.targetProducts
        )
        this.productService.sourceProducts.set(res.data.classes);
      }, error => {
        // this.errorHandle(error)
      })
  }

  showAll(item: any) {
    item.open = true;
  }

  add(category: CategoryInterface, item: ClassInterface) {
    item.categories = item.categories.filter((v: any) => v.name != category.name);
    let targetProducts = [...this.productService.targetProducts];
    this.productService.targetProducts = [];

    const foundClass = targetProducts.find((targetItem: ClassInterface) => item.name == targetItem.name);
    if (foundClass) {
      foundClass.categories.push(category);
    } else {
      const newItem = {...item};
      newItem.categories = [category]
      targetProducts.push(newItem);
    }
    this.productService.targetProducts = targetProducts;
    this.productService.save();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
