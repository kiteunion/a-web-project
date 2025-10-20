import {Injectable, signal, WritableSignal} from '@angular/core';
import {ApplicationData, Contact, FormInterface, PartnershipContact, SelectedClass} from '../interface/form.interface';
import {NgForm, NgModel} from '@angular/forms';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ProductResultInterface} from '../interface/product.interface';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {FeeResultInterface, FeesDataInterface} from '../interface/fee.interface';
import {CountriesItem, CountriesResultInterface} from '../interface/countries.interface';
import {ProductService} from "./product.service";
import {MessageService} from "primeng/api";

@Injectable({
    providedIn: 'root'
})

export class FormService {
    public activeStep: number | undefined = 1;
    onCheckForm$: Subject<any> = new Subject();
    public maxStepReached: number = 1;
    public q: string = '';
    public agree?: boolean = undefined;
    public expedited: boolean = false;
    public privacy?: boolean = false;
    public trademarkType: 'logo' | 'words' = 'words';
    public uploadedLogo?: File;
    public uploadedLogoUri?: any;
    public tabActive: number = 0;

    public applicationRef: string | null = null;
    public fees: WritableSignal<FeesDataInterface | null> = signal(null);

    public applicationData!: ApplicationData;
    public applicationDataBuffer: ApplicationData = {
        source: 'site',
        word: {
            word: ""
        },
        logo: '',
        image: {
            imageRef: null
        },
        contacts: [
            {
                email: '',
                phone: '',
                businessNumber: '',
                businessName: ''
            }
        ],
        contact: {
            firstName: '',
            lastName: 'Undefined',
            email: '',
            phone: '',
            declaration: true,
            ownershipType: 0
        },
        address: {
            city: '',
            address: '',
            suburb: '',
            postCode: '',
            region: '',
            countryCode: 'AU'
        },
        company: {
            businessName: '',
            nameOfTrust: '',
            citizenCountryCode: 'AU',
            businessNumber: '',
            australianCompanyNumber: '',
            phoneNumber: ''
        },
        selectedClasses: []
    };
    countries: CountriesItem[] = [];

    get formData(): ApplicationData {
        return this.applicationData;
    }

    constructor(
        private messageService: MessageService,
        private http: HttpClient
    ) {
        this.applicationData = JSON.parse(JSON.stringify(this.applicationDataBuffer));
        this.restore();
    }

    restore() {
        const applicationData = localStorage.getItem('applicationDataV2');
        if (applicationData) {
            this.applicationData = JSON.parse(applicationData);
        }
    }

    save() {
        localStorage.setItem('applicationDataV2', JSON.stringify(this.applicationData));
    }

    isValidField(field: NgModel, myForm: NgForm): boolean {
        return myForm.submitted && myForm.invalid && field.errors?.['required']
    }

    start(word: string, imageRef?: string): Observable<FormInterface> {
        const url = `${environment.backendApiUrl}/application/start`;
        return this.http.post<FormInterface>(url, {
            data: {
                word,
                imageRef
            }
        });
    }

    update(): Observable<ProductResultInterface> {
        const applicationData: ApplicationData = JSON.parse(JSON.stringify(this.applicationData));
        const url = `${environment.backendApiUrl}/application/update`;
        if (this.trademarkType === 'logo') {
            applicationData.word.word = '';
        }else{
            applicationData.logo = '';
        }

        if (this.formData.contact.ownershipType !== 2) {
            applicationData.contacts = [];
        }
        if (typeof applicationData.contact.phone === "object") {
            // applicationData.contact.phone = (applicationData.contact.phone as any).e164Number;
        }
        applicationData.contacts.forEach((contact) => {
            const e164Number = (contact.phone as any)?.e164Number;
            if (typeof contact.phone === "object" && e164Number) {
                contact.phone = e164Number;
            }
            if (!applicationData.contact.phone) {
                applicationData.contact.phone = contact.phone;
            }
        });


        return this.http.post<ProductResultInterface>(url, {
            data: {
                applicationRef: this.applicationRef,
                applicationData: applicationData,
            }
        });
    }

    submit(): Observable<ProductResultInterface> {
        const url = `${environment.backendApiUrl}/application/submit`;
        return this.http.post<ProductResultInterface>(url, {
            data: {
                applicationRef: this.applicationRef
            }
        });
    }

    getFees(): Observable<FeeResultInterface> {
        const url = `${environment.backendApiUrl}/content/get-fees`;
        return this.http.get<FeeResultInterface>(url);
    }

    getCountries(): Observable<CountriesResultInterface> {
        const url = `${environment.backendApiUrl}/content/get-countries`;
        return this.http.get<CountriesResultInterface>(url);
    }


    onPhoneChange(phone: any, contact: Contact | PartnershipContact) {
        /*if (phone && phone.e164Number) {
            contact.phone = phone.e164Number; // Сохраняем только e164Number
        } else {
            contact.phone = ''; // Если номер некорректен
        }*/
        this.save();
    }


    removeContact(index: number) {
        if (this.formData.contacts.length == 1) {
            return;
        }
        this.formData.contacts.splice(index, 1);
        this.tabActive = this.formData.contacts.length - 1;
    }

    addContact() {
        if (this.formData.contacts.length >= 5) {
            this.messageService.clear();
            this.messageService.add({
                severity: 'error',
                summary: 'Attention',
                detail: 'The maximum number of contacts has been reached.'
            });
            return;
        }
        this.formData.contacts.push({
            email: '', phone: '', businessName: ''
        })
        this.tabActive = this.formData.contacts.length - 1;
    }

    onSelectType() {
        if (this.formData.contact.ownershipType === 2) {
            while (this.formData.contacts.length < 2) {
                this.addContact();
            }
        }
        if (this.formData.contact.ownershipType != 2) {
            this.formData.contacts.length = 1;
        }
    }

    clear() {
        this.maxStepReached = 1;
        this.activeStep = 1;
        /*if (!environment.production) {
            alert('Clear imitate dev');
            return;
        }*/
        this.privacy = false;
        this.expedited = false;
        delete this.agree;
        delete this.uploadedLogoUri;
        this.applicationData = JSON.parse(JSON.stringify(this.applicationDataBuffer));
        this.save();
    }
}
