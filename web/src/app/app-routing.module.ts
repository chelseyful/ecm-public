import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  {
    path: 'ecm',
    loadChildren: () => import('./extra-credit-machine/extra-credit-machine.module').then(m => m.ExtraCreditMachineModule)
  },
  {
    path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings-manager/settings-manager.module').then(m => m.SettingsManagerModule)
  },
  {
    path: '',
    component: HomePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
