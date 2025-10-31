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
import {PaymentIntentResult, StripeElementsOptions, StripePaymentElementOptions} from '@stripe/stripe-js';
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

    orderItems(isExpedite = true, isPrivate = true, cardSurcharges = true) {
        const orderItems = this.productService.targetProductsList(isExpedite, isPrivate)
            .map((v) => {
                return {
                    amount: (v.price || 0) * 10000,
                    id: v.name
                }
            })
        if (cardSurcharges) {
            orderItems.push({
                amount: Math.round(this.productService.creditCardSurcharges) * 10000,
                id: "Credit Card surcharges"
            })
        }

        return orderItems;
    }

    getSecret() {
        this.http.post<{ data: { clientSecret: string } }>(
            `${environment.backendApiUrl}/application/createPaymentIntent`,
            {
                data: {
                    applicationRef: this.formService.applicationRef,
                    order: this.order
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
            .subscribe((paymentIntentResult: PaymentIntentResult) => {
                this.paying.set(false);
                if (paymentIntentResult.error) {
                    // Show error to your customer (e.g., insufficient funds)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: paymentIntentResult.error.message
                    });
                    console.error('Payment error', paymentIntentResult);
                } else {
                    // The payment has been processed!
                    if (paymentIntentResult.paymentIntent.status === 'succeeded') {
                        // Show a success message to your customer
                        console.log({success: true});
                        this.submit(paymentIntentResult);
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

    get order() {
        const order: any = {
            "orderSummary": {
                "total": Math.round(this.productService.total + this.productService.creditCardSurcharges),
                "surcharges": Math.round(this.productService.creditCardSurcharges) * 100,
                "subtotal": Math.round(this.productService.total),
                "gst": Math.round(this.productService.GST)
            },
            "orderExtras": [],
            "orderItems": this.orderItems(false, false, false)
        };
        if (this.formService.formData.isExpedite) {
            order.orderExtras.push({
                amount: Math.round(this.formService.fees()?.expenditureFee || 0),
                id: "Expedite the trade mark application",
            })
        }

        if (this.formService.formData.isPrivate) {
            order.orderExtras.push({
                amount: Math.round(this.formService.fees()?.postalFee || 0),
                id: "Privacy option",
            })
        }
        return order;
    }

    submit(paymentData: PaymentIntentResult) {

        // this.isLoading.set(true);
        this.formService.submit({
            paymentStatus: paymentData?.paymentIntent?.status,
            paymentIntentId: paymentData?.paymentIntent?.id,
        }, this.order)
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
