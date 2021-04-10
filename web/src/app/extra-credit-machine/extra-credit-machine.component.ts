import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from '../app-settings.service';

@Component({
  selector: 'cc-extra-credit-machine',
  templateUrl: './extra-credit-machine.component.html',
  styleUrls: ['./extra-credit-machine.component.scss']
})
export class ExtraCreditMachineComponent implements OnInit {

  hasAuth = false;
  constructor(
    private settings: AppSettingsService
  ) {
    this.hasAuth = this.settings.isTrue('jwt');
  }

  ngOnInit(): void {
  }

}
