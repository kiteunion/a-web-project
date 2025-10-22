import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    Output,
    signal,
    ViewChild,
    WritableSignal
} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';


import {injectStripe, StripeElementsDirective, StripePaymentElementComponent} from 'ngx-stripe';
import {StripeElementsOptions, StripePaymentElementOptions} from '@stripe/stripe-js';
import {environment} from "../../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {FormService} from "../../../share/services/form.service";
import {Button} from "primeng/button";
import {ProductService} from "../../../share/services/product.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {debounceTime, finalize} from "rxjs";

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

    @Output()
    public onBack: EventEmitter<void> = new EventEmitter();

    @ViewChild(StripePaymentElementComponent)
    paymentElement!: StripePaymentElementComponent;


    public elementsOptions: StripeElementsOptions = {
        locale: 'en',
         // clientSecret: null,
        // mode: 'payment',
        // paymentMethodTypes: ['card'],
        appearance: {
            // theme: 'flat'
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
        private cd: ChangeDetectorRef,
        private router: Router,
        private messageService: MessageService,
        public productService: ProductService,
        public formService: FormService,
        private http: HttpClient
    ) {
    }


    ngOnInit() {
        this.productService.buildSelectedClasses();
        this.formService.update()
            .subscribe(() => {
                this.getSecret();
            }, error => {
                console.log(error);
                alert('Error...');
            })

    }

    get orderItems(){
        const orderItems = this.productService.targetProductsList.map((v) => {
            return {
                amount: (v.price || 0) * 100,
                id: v.name
            }
        })
        orderItems.push({
            amount: Math.round(this.productService.creditCardSurcharges) * 100,
            id: "Credit Card surcharges"
        })

        return orderItems;
    }

    getSecret() {
        this.http.post<{ data: {clientSecret: string} }>(
            `${environment.backendApiUrl}/application/createPaymentIntent`,
            {
                data: {
                    orderItems: this.orderItems
                }
            }
        ).subscribe(res => {
            this.elementsOptions.clientSecret = res.data.clientSecret;
            this.cd.detectChanges();
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
                    console.error('Payment error', result);
                } else {
                    // The payment has been processed!
                    if (result.paymentIntent.status === 'succeeded') {
                        // Show a success message to your customer
                        console.log({success: true});
                        this.submit({
                            ...result,
                            ...{clientSecret: this.elementsOptions.clientSecret}
                        });
                        this.formService.clear();
                        this.productService.clear();
                        this.router.navigateByUrl('/success');
                    }
                }
            }, error => {
                this.paying.set(false);
                if (error.message.includes('clientSecret')) {
                    this.getSecret();
                    this.messageService.add({severity: 'error', summary: 'Payment error, please, retry', detail: ''});
                }
            });
    }

    submit(paymentData: any) {
        // this.isLoading.set(true);
        this.formService.submit(paymentData, this.orderItems)
            .pipe(debounceTime(500), finalize(() => {
                // this.isLoading.set(false);
            }))
            .subscribe(() => {
               /* if (!environment.production) {
                    alert('Payment functionality in development')
                }*/
            }, error => {
                console.log(error);
            });
    }
}
