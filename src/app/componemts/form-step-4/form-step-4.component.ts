import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    signal,
    WritableSignal
} from '@angular/core';
import {Fieldset} from "primeng/fieldset";
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {Card} from 'primeng/card';
import {Divider} from 'primeng/divider';
import {Timeline} from 'primeng/timeline';
import {FormService} from '../../share/services/form.service';
import {CurrencyPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {ProductService} from '../../share/services/product.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ApplicationData} from '../../share/interface/form.interface';
import {debounceTime, finalize, Subject, takeUntil} from 'rxjs';
import {Checkbox} from "primeng/checkbox";
import {Tooltip} from "primeng/tooltip";
import {PrimeTemplate} from "primeng/api";
import {ClassInterface} from "../../share/interface/product.interface";
import {trigger, state, style, animate, transition} from '@angular/animations';
import {StripePayComponent} from "./stripe-pay/stripe-pay.component";
import {environment} from "../../../environments/environment";
import {Message} from "primeng/message";


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
        CurrencyPipe,
        Checkbox,
        Tooltip,
        PrimeTemplate,
        StripePayComponent,
        Message
    ],
    templateUrl: './form-step-4.component.html',
    styleUrl: './form-step-4.component.scss',
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
export class FormStep4Component implements OnInit, OnDestroy {
    @Output()
    public onBack: EventEmitter<void> = new EventEmitter();
    readonly isLoading: WritableSignal<boolean> = signal(false);
    readonly isSubmitted: WritableSignal<boolean> = signal(false);
    public tooltipExpedited = "This option is recommended, especially if you are a startup and what to find out sooner than later if your brand is approved for registration within 14 working days. If the application comes back with descriptive issues, you can submit the “logo” mark for FREE if your logo is distinctive. And if the application is not accepted due to cited marks (potential infringement), you an submit another name for FREE! But you must have a second name ready within 4 working days or the offer is void.";

    private destroy$: Subject<void> = new Subject();
    get cartCount(): number {
        let count = this.productService.targetProducts.length;
        if (this.formService.expedited) {
            count += 1;
        }
        if (this.formService.privacy) {
            count += 1;
        }
        return count;
    }

    get formData(): ApplicationData {
        return this.formService.applicationData;
    }



    constructor(
        public formService: FormService,
        public productService: ProductService,
        private cd: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.formService.update()
            .subscribe(() => {
            }, error => {
                console.log(error);
                alert('Error...');
            })
    }

    submit() {
        this.isLoading.set(true);
        this.formService.submit()
            .pipe(debounceTime(500), takeUntil(this.destroy$), finalize(() => {
                this.isLoading.set(false);
            }))
            .subscribe(() => {
                this.isSubmitted.set(true);
                if (!environment.production) {
                    alert('Payment functionality in development')
                }
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
