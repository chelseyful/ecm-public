import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsManagerRoutingModule } from './settings-manager-routing.module';
import { SettingsManagerComponent } from './settings-manager.component';


import {
  MatFormFieldModule
} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';



@NgModule({
  declarations: [SettingsManagerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsManagerRoutingModule,
    MatFormFieldModule,
    MatCardModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule
  ]
})
export class SettingsManagerModule { }
