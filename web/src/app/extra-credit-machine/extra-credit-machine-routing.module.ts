import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtraCreditMachineComponent } from './extra-credit-machine.component';

const routes: Routes = [{ path: '', component: ExtraCreditMachineComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraCreditMachineRoutingModule { }
