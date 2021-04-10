import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { MatCardModule } from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    FlexLayoutModule
  ],
  bootstrap: [
    HomePageComponent
  ],
  exports: [
    HomePageComponent
  ]
})
export class HomePageModule { }
