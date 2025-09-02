import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {StripePayComponent} from "../form-step-4/stripe-pay/stripe-pay.component";
import {Card} from "primeng/card";
import {Button} from "primeng/button";
import {Fieldset} from "primeng/fieldset";
import {FormService} from "../../share/services/form.service";
import {ApplicationData} from "../../share/interface/form.interface";
import {MessageService} from "primeng/api";
import {ProductService} from "../../share/services/product.service";
import {Avatar} from "primeng/avatar";
import {FormOrderSummaryComponent} from "../form-step-4/form-order-summary/form-order-summary.component";
import {Divider} from "primeng/divider";
import {FormOrderTotalComponent} from "../form-step-4/form-order-total/form-order-total.component";

@Component({
  selector: 'app-form-step-5',
  imports: [
    StripePayComponent,
    Card,
    Button,
    Fieldset,
    Avatar,
    FormOrderSummaryComponent,
    Divider,
    FormOrderTotalComponent
  ],
  templateUrl: './form-step-5.component.html',
  styleUrl: './form-step-5.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormStep5Component {
  @Output()
  public onBack: EventEmitter<void> = new EventEmitter();

  get formData(): ApplicationData {
    return this.formService.applicationData;
  }

  constructor(
      public formService: FormService,
      private messageService: MessageService,
      public productService: ProductService
  ) {
  }

  getCountryName(countryCode: string) {
    return this.formService.countries.find((v) => v.Code2 == countryCode)?.Name;
  }

  displayPhone(phone: any) {
    return phone?.e164Number || phone;
  }

  protected readonly Boolean = Boolean;

  editContacts() {
    this.formService.activeStep = 3;
  }
}
