import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsManagerComponent } from './settings-manager.component';

const routes: Routes = [{ path: '', component: SettingsManagerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsManagerRoutingModule { }
