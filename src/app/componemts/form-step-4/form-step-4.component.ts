import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output, signal, WritableSignal} from '@angular/core';
import { Fieldset } from "primeng/fieldset";
import { IftaLabel } from "primeng/iftalabel";
import { InputText } from "primeng/inputtext";
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { Timeline } from 'primeng/timeline';
import { FormService } from '../../share/services/form.service';
import { CurrencyPipe, DecimalPipe, JsonPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { ProductService } from '../../share/services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationData } from '../../share/interface/form.interface';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import {Checkbox} from "primeng/checkbox";
import {Tooltip} from "primeng/tooltip";
import {PrimeTemplate} from "primeng/api";
import {ClassInterface} from "../../share/interface/product.interface";
import { trigger, state, style, animate, transition } from '@angular/animations';


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
    Button,
    FormsModule,
    ReactiveFormsModule,
    DecimalPipe,
    CurrencyPipe,
    Checkbox,
    Tooltip,
    JsonPipe,
    PrimeTemplate
],
  templateUrl: './form-step-4.component.html',
  styleUrl: './form-step-4.component.scss',
  animations: [
    trigger('numberChange', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void <=> *', animate('700ms ease-in-out')),
      transition(':increment, :decrement', [
        style({ opacity: 0.5, transform: 'scale(1.2)' }),
        animate('600ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class FormStep4Component implements OnDestroy {
  @Output()
  public onBack: EventEmitter<void> = new EventEmitter();
  readonly isLoading: WritableSignal<boolean> = signal(false);
  public tooltipExpedited = "This option is recommended, especially if you are a startup and what to find out sooner than later if your brand is approved for registration within 14 working days. If the application comes back with descriptive issues, you can submit the “logo” mark for FREE if your logo is distinctive. And if the application is not accepted due to cited marks (potential infringement), you an submit another name for FREE! But you must have a second name ready within 4 working days or the offer is void.";

  private destroy$: Subject<void> = new Subject();
  get targetProducts(): ClassInterface[] {
    this.productService.targetProducts.map((v, i) => {
      v.index = i;
    })
    return this.productService.targetProducts;
  };
  get classesCount(): number {
    return this.productService.targetProducts.length;
  }
  get subTotal() {
    return (this.classFee * this.classesCount);
  }

  get GST(): number {
    let total = this.subTotal - (this.classesCount * 250);
    if (this.formService.expedited) {
      total += (475 - 230) / 11;
    }
    return total;
  }
  get total(): number {
    let total = this.subTotal;
    if (this.formService.expedited) {
      total += 475;
    }
    console.log(this.formService.expedited);
    return total;
  }
  get classFee(): number {
    return this.formService.fees()?.classFee || 0;
  }

  constructor(
    public formService: FormService,
    public productService: ProductService,
    private cd: ChangeDetectorRef,
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

  onChangeExpedited() {
    this.cd.detectChanges();
  }
}
