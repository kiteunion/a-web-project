import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Fieldset} from "primeng/fieldset";
import {FormsModule, NgForm} from "@angular/forms";
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {CountryISO, NgxIntlTelInputModule, SearchCountryField} from "ngx-intl-tel-input";
import {ApplicationData} from "../../../share/interface/form.interface";
import {FormService} from "../../../share/services/form.service";
import {JsonPipe} from "@angular/common";

@Component({
    standalone: true,
    selector: 'app-contacts',
    imports: [
        Fieldset,
        FormsModule,
        IftaLabel,
        InputText,
        Message,
        NgxIntlTelInputModule,
        JsonPipe
    ],
    templateUrl: './contacts.component.html',
    styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit, AfterViewInit {
    @ViewChild('myFormContact') myFormContact!: NgForm;
    @Output()
    onFormInit: EventEmitter<NgForm> = new EventEmitter();
    protected readonly CountryISO = CountryISO;
    protected readonly SearchCountryField = SearchCountryField;

    get formData(): ApplicationData {
        return this.formService.applicationData;
    }

    constructor(
        public formService: FormService
    ) {
    }
    ngAfterViewInit() {
        this.onFormInit.emit(this.myFormContact)
        console.log('Form in ViewChild:', this.myFormContact);
    }
    ngOnInit() {
    }
}
