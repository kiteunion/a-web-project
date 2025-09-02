import {Component} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {Divider} from "primeng/divider";
import {PrimeTemplate} from "primeng/api";
import {Timeline} from "primeng/timeline";
import {Tooltip} from "primeng/tooltip";
import {ApplicationData} from "../../../share/interface/form.interface";
import {FormService} from "../../../share/services/form.service";
import {ProductService} from "../../../share/services/product.service";

@Component({
  selector: 'app-form-order-summary',
    imports: [
        CurrencyPipe,
        Divider,
        PrimeTemplate,
        Timeline,
        Tooltip
    ],
  templateUrl: './form-order-summary.component.html',
  styleUrl: './form-order-summary.component.scss'
})
export class FormOrderSummaryComponent {
    get formData(): ApplicationData {
        return this.formService.applicationData;
    }

    constructor(
        public formService: FormService,
        public productService: ProductService
    ) {
    }
}
