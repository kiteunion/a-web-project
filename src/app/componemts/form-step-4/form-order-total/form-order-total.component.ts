import {Component} from '@angular/core';
import {CurrencyPipe, DecimalPipe} from "@angular/common";
import {Fieldset} from "primeng/fieldset";
import {ProductService} from "../../../share/services/product.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormService} from "../../../share/services/form.service";

@Component({
    selector: 'app-form-order-total',
    imports: [
        CurrencyPipe,
        Fieldset,
        DecimalPipe
    ],
    templateUrl: './form-order-total.component.html',
    styleUrl: './form-order-total.component.scss',
    animations: [
        trigger('numberChange', [
            state('void', style({opacity: 0, transform: 'translateY(20px)'})),
            state('*', style({opacity: 1, transform: 'translateY(0)'})),
            transition('void <=> *', animate('700ms ease-in-out')),
            transition(':increment, :decrement', [
                style({opacity: 0.5, transform: 'scale(1.2)'}),
                animate('600ms ease-in-out', style({opacity: 1, transform: 'scale(1)'})),
            ]),
        ]),
    ],

})
export class FormOrderTotalComponent {

    constructor(
        public productService: ProductService,
        public formService: FormService) {
    }
}
