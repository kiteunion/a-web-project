import { Component, EventEmitter, OnDestroy, Output, signal, WritableSignal } from '@angular/core';
import { Fieldset } from "primeng/fieldset";
import { IftaLabel } from "primeng/iftalabel";
import { InputText } from "primeng/inputtext";
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { Timeline } from 'primeng/timeline';
import { FormService } from '../../share/services/form.service';
import { CurrencyPipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { ProductService } from '../../share/services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationData } from '../../share/interface/form.interface';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-form-step-4',
  imports: [
    Fieldset,
    IftaLabel,
    InputText,
    Card,
    Divider,
    Timeline,
    NgForOf,
    Button,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    DecimalPipe,
    CurrencyPipe
  ],
  templateUrl: './form-step-4.component.html',
  styleUrl: './form-step-4.component.scss'
})
export class FormStep4Component implements OnDestroy {
  @Output()
  public onBack: EventEmitter<void> = new EventEmitter();
  readonly isLoading: WritableSignal<boolean> = signal(false);

  private destroy$: Subject<void> = new Subject();
  get subTotal() {
    return this.productService.targetProducts.length
      * (this.formService.fees()?.classFee || 0)
      + (this.formService.fees()?.baseFee || 0);
  }

  constructor(
    public formService: FormService,
    public productService: ProductService
  ) {
  }

  get formData(): ApplicationData {
    return this.formService.applicationData;
  }

  submit() {
    this.isLoading.set(true);
    this.formService.submit()
      .pipe(debounceTime(500), takeUntil(this.destroy$), finalize(() => {
        this.isLoading.set(false);
      }))
      .subscribe(() => {
        alert('Payment functionality in development')
      }, error => {
        console.log(error);
      });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
