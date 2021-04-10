import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import { ExtraCreditMachineRoutingModule } from './extra-credit-machine-routing.module';
import {
  ExtraCreditMachineComponent
} from './extra-credit-machine.component';
import {
  CodeRedeemerComponent
} from '../code-redeemer/code-redeemer.component';
import {
  CodeReporterComponent
} from '../code-reporter/code-reporter.component';
import {
  CodeGeneratorComponent
} from '../code-generator/code-generator.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {ClipboardModule} from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    ExtraCreditMachineComponent,
    CodeRedeemerComponent,
    CodeReporterComponent,
    CodeGeneratorComponent
  ],
  imports: [
    CommonModule,
    ExtraCreditMachineRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    FlexLayoutModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    ClipboardModule,
    MatTableModule
  ],
//  exports: [ExtraCreditMachineComponent],
//  bootstrap: [ExtraCreditMachineComponent]
})
export class ExtraCreditMachineModule { }
