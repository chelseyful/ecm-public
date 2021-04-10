import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppSettingsService } from '../app-settings.service';

@Component({
  selector: 'cc-settings-manager',
  templateUrl: './settings-manager.component.html',
  styleUrls: ['./settings-manager.component.scss']
})
export class SettingsManagerComponent implements OnInit {

  isDeveloper = false;
  form!: FormGroup;

  constructor(
    private settings: AppSettingsService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      api_key: new FormControl(
        this.settings.get('api_key'),
      [
        Validators.pattern('^[a-zA-Z0-9]{40}$')
      ]),
      api_version: new FormControl(
        this.settings.get('api_version'),
      [
        Validators.required,
        Validators.pattern('^[a-z]{1,4}[0-9]?$')
      ]),
      api_prefix: new FormControl(
        this.settings.get('api_prefix'),
      [
        Validators.required,
        Validators.pattern('^[a-z]{3,8}$')
      ]),
    });
  }

  onSubmit(formData: SettingsForm): void {
    this.settings.setMany([
      {name: 'api_key', value: formData.api_key},
      {name: 'api_prefix', value: formData.api_prefix},
      {name: 'api_version', value: formData.api_version}
    ]);
  }

  makeDeveloper(): void {
    this.isDeveloper = true;
  }

}

interface SettingsForm {
  api_key: string;
  api_prefix: string;
  api_version: string;
}
