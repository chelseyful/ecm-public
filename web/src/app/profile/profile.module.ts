import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

import {
  MatFormFieldModule
} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileLoginComponent } from '../profile-login/profile-login.component';
import { ProfileLogoutComponent } from '../profile-logout/profile-logout.component';

@NgModule({
  declarations: [ProfileComponent, ProfileLoginComponent, ProfileLogoutComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    FlexLayoutModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ]
})
export class ProfileModule { }
