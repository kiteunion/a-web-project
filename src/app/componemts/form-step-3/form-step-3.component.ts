import {Component, EventEmitter, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {Fieldset} from 'primeng/fieldset';
import {Select} from 'primeng/select';

import {Card} from 'primeng/card';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import {Checkbox} from 'primeng/checkbox';
import {Message} from 'primeng/message';
import {Button} from 'primeng/button';
import {FormService} from '../../share/services/form.service';
import {ApplicationData} from '../../share/interface/form.interface';
import {MessageService} from 'primeng/api';
import {Subject} from 'rxjs';
import {Tooltip} from "primeng/tooltip";
import {ContactsComponent} from "./contacts/contacts.component";
import {PartnershipContactsComponent} from "./partnership-contacts/partnership-contacts.component";
import {australianStatesAndTerritories, usStates} from "../../data/states";

@Component({
    standalone: true,
    selector: 'app-form-step-3',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        IftaLabel,
        InputText,
        Fieldset,
        Select,
        Card,
        NgxIntlTelInputModule,
        Checkbox,
        Message,
        Button,
        Tooltip,
        ContactsComponent,
        PartnershipContactsComponent
    ],
    templateUrl: './form-step-3.component.html',
    styleUrls: ['./form-step-3.component.scss', '../../../assets/scss/flags.scss']
})
export class FormStep3Component implements OnInit, OnDestroy {
    public stateOptions: any[] = [
        {label: 'Individual/ Sole Trader', value: 0},
        {label: 'Business/ Company', value: 1},
        {label: 'Partnership', value: 2},
        {label: 'Trustee', value: 3},
    ];
    public myFormContact?: NgForm;
    public myFormContacts?: NgForm;
    public states: any[] = [];
    readonly isLoading: WritableSignal<boolean> = signal(false);
    private destroy$: Subject<void> = new Subject();

    // public countries: any[] = counties;

    @Output()
    onNext: EventEmitter<void> = new EventEmitter();

    @Output()
    public onBack: EventEmitter<void> = new EventEmitter();

    get formData(): ApplicationData {
        return this.formService.applicationData;
    }

    constructor(
        public formService: FormService,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        this.onSelectCountry();
    }

    onSubmit($event: any, myForm: NgForm) {
        this.formService.onCheckForm$.next($event);
        this.messageService.clear();
        
        let contactForm = this.myFormContact;
        if (this.formData.contact.ownershipType === 2) {
            contactForm = this.myFormContacts;
        }
        if (contactForm) {
            contactForm.onSubmit($event);
        }

        if (myForm.invalid || contactForm?.invalid) {
            this.messageService.add({severity: 'error', summary: 'Attention', detail: 'Please fill out the form'});
            return;
        }
        this.onNext.emit();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSelectCountry() {
        if (this.formData.address.countryCode == 'AU') {
            this.states = australianStatesAndTerritories;
        }else if (this.formData.address.countryCode == 'US') {
            this.states = usStates;
        }else{
            this.states = [];
        }
    }
}
