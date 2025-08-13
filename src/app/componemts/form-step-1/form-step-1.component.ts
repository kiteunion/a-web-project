import {Component, EventEmitter, Output, signal, ViewChild, WritableSignal} from '@angular/core';
import {MessageService} from 'primeng/api';
import {FileUpload} from 'primeng/fileupload';
import {Message} from 'primeng/message';
import {NgIf} from '@angular/common';
import {SelectButton} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {IftaLabel} from 'primeng/iftalabel';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {Fieldset} from 'primeng/fieldset';
import {FormService} from '../../share/services/form.service';
import {finalize, forkJoin} from 'rxjs';
import {ProductService} from '../../share/services/product.service';

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
  @ViewChild('fileUpload') fileUpload!: FileUpload; // Reference to p-fileupload component

  readonly isLoading: WritableSignal<boolean> = signal(false);

  stateOptions: any[] = [
    {label: "Word or Words", value: 'words'},
    {label: "Logo or Graphic", value: 'logo'}
  ];

  constructor(
    public formService: FormService,
    private messageService: MessageService,
    public productService: ProductService
  ) {
  }

  onSelect(event: any) {
    for (let file of event.files) {
      console.log(file)
      this.formService.uploadedLogoUri = URL.createObjectURL(file);
      this.formService.uploadedLogo = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.formService.formData.logo = reader.result as string;
      };
      reader.readAsDataURL(file);
    }

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  reset() {
    delete this.formService.uploadedLogo;
    delete this.formService.uploadedLogoUri;
    this.formService.formData.logo = '';
    this.formService.applicationData.word.word = '';
    this.fileUpload.clear();
  }

  next(): void {
    this.messageService.clear();
    if (this.formService.trademarkType == 'words' && !this.formService.formData.word.word) {
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
      // TODO
      localStorage.setItem('applicationRef', this.formService.applicationRef);
      this.onNext.emit();
    }, error => {
      console.error(error);
    });
  }
}
