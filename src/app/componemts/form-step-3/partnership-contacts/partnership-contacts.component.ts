import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {Fieldset} from "primeng/fieldset";
import {FormsModule, NgForm} from "@angular/forms";
import {IftaLabel} from "primeng/iftalabel";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {CountryISO, NgxIntlTelInputModule, SearchCountryField} from "ngx-intl-tel-input";
import {FormService} from "../../../share/services/form.service";
import {MessageService} from "primeng/api";
import {ApplicationData} from "../../../share/interface/form.interface";
import {ProductService} from "../../../share/services/product.service";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "primeng/tabs";
import {RouterLink} from "@angular/router";

@Component({
    standalone: true,
    selector: 'app-partnership-contacts',
    imports: [
        Button,
        Fieldset,
        FormsModule,
        IftaLabel,
        InputText,
        Message,
        NgxIntlTelInputModule,
        Tabs,
        TabList,
        Tab,
        RouterLink,
        TabPanels,
        TabPanel
    ],
    templateUrl: './partnership-contacts.component.html',
    styleUrl: './partnership-contacts.component.scss'
})
export class PartnershipContactsComponent implements OnInit, OnDestroy {
    @Input() myForm!: NgForm;
    protected readonly CountryISO = CountryISO;
    protected readonly SearchCountryField = SearchCountryField;
    private destroy$: Subject<void> = new Subject();

    get formData(): ApplicationData {
        return this.formService.applicationData;
    }

    constructor(
        private messageService: MessageService,
        public formService: FormService
    ) {
    }

    ngOnInit() {

    }


    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
