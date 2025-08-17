import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, Validators} from '@angular/forms';


import {
    injectStripe, StripeElementsDirective,
    StripePaymentElementComponent, StripeService
} from 'ngx-stripe';
import {
    StripeElementsOptions,
    StripePaymentElementOptions
} from '@stripe/stripe-js';
import {environment} from "../../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {FormService} from "../../../share/services/form.service";
import {Button} from "primeng/button";
import {ProductService} from "../../../share/services/product.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
    selector: 'app-stripe-pay',
    templateUrl: './stripe-pay.component.html',
    styleUrl: './stripe-pay.component.scss',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        StripePaymentElementComponent,
        StripeElementsDirective,
        Button
    ]
})
export class StripePayComponent implements OnInit {
    private readonly fb = inject(UntypedFormBuilder);

    @ViewChild(StripePaymentElementComponent)
    paymentElement!: StripePaymentElementComponent;


    public elementsOptions: StripeElementsOptions = {
        locale: 'en',
         // clientSecret: null,

        appearance: {
            theme: 'flat'
        }
    };

    public paymentElementOptions: StripePaymentElementOptions = {
        layout: {
            type: 'tabs',
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: false
        },
        // paymentMethodOrder: ['amex']
    };

    // Replace with your own public key
    public stripe = injectStripe(environment.stripePublicKey);
    public paying = signal(false);

    constructor(
        private router: Router,
        private messageService: MessageService,
        public productService: ProductService,
        public formService: FormService,
        private http: HttpClient,
        private stripeService: StripeService) {
    }


    ngOnInit() {
        const orderItems = this.productService.targetProductsList.map((v) => {
            return {
                amount: v.price,
                id: v.name
            }
        })
        orderItems.push({
            amount: this.productService.creditCardSurcharges,
            id: "Credit card surcharges"
        })

        this.http.post<{ data: {clientSecret: string} }>(
            `${environment.backendApiUrl}/application/createPaymentIntent`,
            {
                data: {
                    orderItems: orderItems
                }
            }
        ).subscribe(res => {
            this.elementsOptions.clientSecret = res.data.clientSecret;
        });
    }

    pay() {
        if (this.paying()) return;
        this.paying.set(true);
        const countryCode = this.formService.formData.address.countryCode;
        let address = this.formService.countries.find((v) => v.Code2 == countryCode)?.Name;
        address += `, ${this.formService.formData.address.region}`;
        address += `, ${this.formService.formData.address.address}`;
        address += `, ${this.formService.formData.address.city}`;

        let name = this.formService.formData.contact.firstName;
        let email = this.formService.formData.contact.email;

        /*if (this.formService.formData.contact.ownershipType === 2) {
            name = this.formService.formData.contacts[0].businessName;
            email = this.formService.formData.contacts[0].email;
        }*/
        this.stripe
            .confirmPayment({
                elements: this.paymentElement.elements,
                confirmParams: {
                    payment_method_data: {
                        billing_details: {
                            name: name as string,
                            email: email as string,
                            address: {
                                line1: address as string,
                                postal_code: this.formService.formData.address.countryCode,
                                city: this.formService.formData.address.city
                            }
                        }
                    }
                },
                redirect: 'if_required'
            })
            .subscribe(result => {
                this.paying.set(false);
                if (result.error) {
                    // Show error to your customer (e.g., insufficient funds)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: result.error.message
                    });
                    console.log({success: false, error: result.error.message});
                } else {
                    // The payment has been processed!
                    if (result.paymentIntent.status === 'succeeded') {
                        // Show a success message to your customer
                        console.log({success: true});
                        this.formService.clear();
                        this.productService.clear();
                        this.router.navigateByUrl('/success');
                    }
                }
            });
    }


}
