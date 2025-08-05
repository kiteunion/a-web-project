import { Component, EventEmitter, Output, signal, WritableSignal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Message } from 'primeng/message';
import { NgIf } from '@angular/common';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { IftaLabel } from 'primeng/iftalabel';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Fieldset } from 'primeng/fieldset';
import { FormService } from '../../share/services/form.service';
import { debounceTime, finalize, forkJoin, takeUntil } from 'rxjs';
import { ProductService } from '../../share/services/product.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-form-step-1',
  standalone: true,
  imports: [
    FileUpload,
    Message,
    NgIf,
    SelectButton,
    FormsModule,
    InputText,
    IftaLabel,
    Card,
    Button,
    Fieldset
  ],
  templateUrl: './form-step-1.component.html',
  styleUrl: './form-step-1.component.scss'
})
export class FormStep1Component {
  @Output()
  onNext: EventEmitter<void> = new EventEmitter();

  readonly isLoading: WritableSignal<boolean> = signal(false);

  uploadedLogo?: File;
  uploadedLogoUri?: any;
  stateOptions: any[] = [
    {label: 'A word or words', value: 'words'},
    {label: 'Graphic or logo', value: 'logo'}
  ];

  value: 'logo' | 'words' = 'words';

  constructor(
    public formService: FormService,
    private messageService: MessageService,
    public productService: ProductService
  ) {
  }

  onUpload(event: any) {
    for (let file of event.files) {
      console.log(file)
      this.uploadedLogoUri = URL.createObjectURL(file);
      this.uploadedLogo = file;
    }

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  reset() {
    delete this.uploadedLogo;
    delete this.uploadedLogoUri;
    this.formService.applicationData.word.word = '';
  }

  next(): void {
    this.messageService.clear();
    if (this.value == 'words' && !this.formService.applicationData.word.word) {
      this.messageService.add({
        severity: 'error',
        summary: 'Required field',
        detail: 'Please fill in the Trademark field'
      });
      return;
    }
    this.isLoading.set(true);

    /*if (this.formService.fees()) {
      this.onNext.emit();
      return;
    }*/

    forkJoin({
      fees: this.formService.getFees(),
      start: this.formService.start(
        this.formService.applicationData.word.word,
        undefined,
      )
    }).pipe(
      finalize(() => {
        this.isLoading.set(false);
        if (this.productService.targetProducts.length > 0) {
          this.productService.targetProductsChange$.next();
        }
      })
    ).subscribe(({ fees, start }) => {
      this.formService.fees.set(fees.data);
      this.formService.applicationRef = start.data.applicationRef;
      this.onNext.emit();
    }, error => {
      console.error(error);
    });
  }
}
