import { Component, EventEmitter, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { Card } from 'primeng/card';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TableTargetProductsComponent } from './table-target-products/table-target-products.component';
import { TableSourceProductsComponent } from './table-source-products/table-source-products.component';
import { Button } from "primeng/button";
import { ProductService } from '../../share/services/product.service';
import { CurrencyPipe, NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FormService } from '../../share/services/form.service';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import {Tooltip} from "primeng/tooltip";

@Component({
  standalone: true,
  selector: 'app-form-step-2',
    imports: [
        Card,
        IconField,
        InputIcon,
        InputText,
        FloatLabel,
        FormsModule,
        ProgressSpinner,
        TableTargetProductsComponent,
        TableSourceProductsComponent,
        Button,
        NgIf,
        CurrencyPipe,
        Tooltip
    ],
  templateUrl: './form-step-2.component.html',
  styleUrl: './form-step-2.component.scss'
})
export class FormStep2Component implements OnInit, OnDestroy {
  @Output()
  onNext: EventEmitter<void> = new EventEmitter();

  @Output()
  public onBack: EventEmitter<void> = new EventEmitter();

  readonly isLoading: WritableSignal<boolean> = signal(false);

  readonly totalPrice: WritableSignal<number> = signal(0);

  private destroy$: Subject<void> = new Subject();

  q: string = '';
  private lastError: string = '';
  constructor(
    private formService: FormService,
    private messageService: MessageService,
    public productService: ProductService,
  ) {
  }

  ngOnInit() {
    this.calcTotal();
    this.productService.targetProductsChange$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        this.calcTotal();
        this.buildSelectedClasses();
        this.formService.update()
          .subscribe(() => {
            // this.onNext.emit();
            this.lastError = '';
          }, error => {
            console.log(error);
            this.lastError = error.error?.errors?.title || 'Server error!';
          })
      })
  }

  next() {
    this.messageService.clear();
    /*TODO if (this.lastError?.length > 0) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'An error occurred, please let us know'});
      return;
    }*/

    if (this.productService.targetProducts.length == 0) {
      this.messageService.add({severity: 'error', summary: 'Required', detail: 'Please add the products'});
      return;
    }
    if (this.formService.countries.length > 0) {
      this.onNext.emit();
      return;
    }
    this.isLoading.set(true);
    this.formService.getCountries()
      .pipe(debounceTime(500), takeUntil(this.destroy$), finalize(() => {
        this.isLoading.set(false);
      }))
      .subscribe((res) => {
        this.formService.countries = res.data.items;
        this.onNext.emit();
      }, error => {
        console.log(error);
      });

  }

  onLoaded() {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildSelectedClasses() {
    this.formService.applicationData.selectedClasses = [];
    this.productService.targetProducts.forEach((item) => {
      item.categories.forEach((category) => {
        this.formService.applicationData.selectedClasses.push({
          classNumber: 1,
          name: category.name,
          referenceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        })
      })
    })
  }

  private calcTotal() {
    this.totalPrice.set(
      this.productService.targetProducts.length * (this.formService.fees()?.classFee || 0)
    )
  }
}
