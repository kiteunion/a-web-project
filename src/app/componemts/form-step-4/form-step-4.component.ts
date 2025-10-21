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
import {FormService} from '../../share/services/form.service';
import {Button} from 'primeng/button';
import {ProductService} from '../../share/services/product.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ApplicationData} from '../../share/interface/form.interface';
import {Subject} from 'rxjs';
import {Checkbox} from "primeng/checkbox";
import {Tooltip} from "primeng/tooltip";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Message} from "primeng/message";
import {FormOrderSummaryComponent} from "./form-order-summary/form-order-summary.component";
import {FormOrderTotalComponent} from "./form-order-total/form-order-total.component";


@Component({
    standalone: true,
    selector: 'app-form-step-4',
    imports: [
        Fieldset,
        IftaLabel,
        InputText,
        Card,
        Divider,
        Button,
        FormsModule,
        ReactiveFormsModule,
        Checkbox,
        Tooltip,
        Message,
        FormOrderSummaryComponent,
        FormOrderTotalComponent
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
    onNext: EventEmitter<void> = new EventEmitter();

    @Output()
    public onBack: EventEmitter<void> = new EventEmitter();

    readonly isLoading: WritableSignal<boolean> = signal(false);
    readonly isSubmitted: WritableSignal<boolean> = signal(false);
    public tooltipExpedited = "This option is recommended, especially if you are a startup and what to find out sooner than later if your brand is approved for registration within 14 working days. If the application comes back with descriptive issues, you can submit the “logo” mark for FREE if your logo is distinctive. And if the application is not accepted due to cited marks (potential infringement), you an submit another name for FREE! But you must have a second name ready within 4 working days or the offer is void.";

    private destroy$: Subject<void> = new Subject();

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


        const findEmail = this.formData.contacts.find((v) => v.email);
        if (this.formData.contact.ownershipType === 2 && !this.formData.contact.email && findEmail) {
            this.formData.contact.email = findEmail.email;
        }
    }


    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onChangeExpedited() {
        this.cd.detectChanges();
    }

    next() {
        this.onNext.emit();
    }
}
