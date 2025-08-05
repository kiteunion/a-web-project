import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApplicationData, FormInterface, SelectedClass } from '../interface/form.interface';
import { NgForm, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProductResultInterface } from '../interface/product.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FeeResultInterface, FeesDataInterface } from '../interface/fee.interface';
import { CountriesItem, CountriesResultInterface } from '../interface/countries.interface';

@Injectable({
  providedIn: 'root'
})

export class FormService {
  public agree = undefined;
  public applicationRef: string | null = null;
  public fees: WritableSignal<FeesDataInterface | null> = signal(null);
  public applicationData: ApplicationData = {
    source: 'site',
    word: {
      word: ""
    },
    image: {
      imageRef: null
    },
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
      citizenCountryCode: 'AU',
      businessNumber: '',
      phoneNumber: ''
    },
    selectedClasses: []
  };
  countries: CountriesItem[] = [];

  constructor(
    private http: HttpClient
  ) {
    this.restore();
  }

  restore() {
    const applicationData = localStorage.getItem('applicationData');
    if (applicationData) {
      this.applicationData = JSON.parse(applicationData);
    }
  }

  save() {
    localStorage.setItem('applicationData', JSON.stringify(this.applicationData));
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
    const url = `${environment.backendApiUrl}/application/update`;
    return this.http.post<ProductResultInterface>(url, {
      data: {
        applicationRef: this.applicationRef,
        applicationData: this.applicationData,
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
}
