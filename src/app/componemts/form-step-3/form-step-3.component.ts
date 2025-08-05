import { Component, EventEmitter, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { SelectButton } from "primeng/selectbutton";
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Fieldset } from 'primeng/fieldset';
import { Select } from 'primeng/select';
import { counties } from '../../data/counties';
import { NgIf } from '@angular/common';
import { Card } from 'primeng/card';
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from 'ngx-intl-tel-input';
import { Checkbox } from 'primeng/checkbox';
import { Message } from 'primeng/message';
import { Button } from 'primeng/button';
import { FormService } from '../../share/services/form.service';
import { ApplicationData } from '../../share/interface/form.interface';
import { MessageService } from 'primeng/api';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-form-step-3',
  imports: [
    ReactiveFormsModule,
    SelectButton,
    FormsModule,
    IftaLabel,
    InputText,
    Fieldset,
    Select,
    NgIf,
    Card,
    NgxIntlTelInputModule,
    Checkbox,
    Message,
    Button
  ],
  templateUrl: './form-step-3.component.html',
  styleUrls: ['./form-step-3.component.scss', '../../../assets/scss/flags.scss']
})
export class FormStep3Component implements OnInit, OnDestroy {
  public stateOptions: any[] = [
    {label: 'Individual', value: 0},
    {label: 'Business', value: 1}
  ];
  readonly isLoading: WritableSignal<boolean> = signal(false);
  private destroy$: Subject<void> = new Subject();

  // public countries: any[] = counties;

  @Output()
  onNext: EventEmitter<void> = new EventEmitter();

  @Output()
  public onBack: EventEmitter<void> = new EventEmitter();

  protected readonly CountryISO = CountryISO;
  protected readonly SearchCountryField = SearchCountryField;
  phoneValue: any;

  get formData(): ApplicationData {
    return this.formService.applicationData;
  }

  constructor(
    public formService: FormService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    if (localStorage.getItem('form-phone')) {
      this.phoneValue = this.formData.contact.phone;
    }
  }

  onPhoneChange(phone: any) {
    localStorage.setItem('form-phone', JSON.stringify(phone));
    if (phone && phone.e164Number) {
      this.formData.contact.phone = phone.e164Number; // Сохраняем только e164Number
    } else {
      this.formData.contact.phone = ''; // Если номер некорректен
    }
    this.formService.save();
  }

  onSubmit($event: any, myForm: NgForm) {
    this.messageService.clear();
    if (myForm.invalid) {
      this.messageService.add({severity: 'error', summary: 'Attention', detail: 'Please fill out the form'});
      return;
    }
    this.onNext.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
