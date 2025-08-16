import {Component} from '@angular/core';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {Card} from 'primeng/card';
import {FormStep1Component} from '../form-step-1/form-step-1.component';
import {FormStep3Component} from '../form-step-3/form-step-3.component';
import {FormStep2Component} from '../form-step-2/form-step-2.component';
import {FormStep4Component} from '../form-step-4/form-step-4.component';
import {FormService} from "../../share/services/form.service";

@Component({
    standalone: true,
    selector: 'app-form',
    imports: [Stepper, Card, StepList, StepPanels, StepPanel, Step, FormStep1Component, FormStep3Component, FormStep2Component, FormStep4Component],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss'
})
export class FormComponent {
    public activeStep: number | undefined = 1;

    constructor(
        public formService: FormService
    ) {
    }

    onStepChange(step: number | undefined) {
        this.activeStep = step || 1;
        this.formService.maxStepReached = Math.max(this.formService.maxStepReached, this.activeStep);
    }
}
