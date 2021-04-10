import { Component, OnInit } from '@angular/core';
import {
  AppSettingsService,
} from '../app-settings.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExtraCreditCodeService, ClaimResult } from '../extra-credit-code.service';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'cc-profile-login',
  templateUrl: './profile-login.component.html',
  styleUrls: ['./profile-login.component.scss']
})
export class ProfileLoginComponent implements OnInit {

  // tslint:disable-next-line
  form!: FormGroup;
  isLoading: boolean;
  hasError: string;

  constructor(
    private ecService: ExtraCreditCodeService,
    private settings: AppSettingsService
    ) {
    this.isLoading = false;
    this.hasError = '';
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      user:  new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9]{5,}$')
      ])
      ,
      secret:  new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z0-9]{4,}$')
      ]),
    });
  }

  onSubmit(creds: FormData): void {
    this.isLoading = true;
    this.ecService.login(creds.user, creds.secret)
      .subscribe(
        next => {

          // Validate server returned expected result
          if (
            next.Authorization !== undefined &&
            next.Authorization !== '' &&
            !next.error
          ) {
            this.settings.set('jwt', next.Authorization);
            this.reset();
          } else if (next.error !== undefined) {
            this.hasError = next.error;
          } else {
            this.hasError =
              `Unknown process error returned code ${next.status}`;
            console.log(next);
          }
        },
        error => {
          if (error.error !== undefined) {
            this.hasError = error.error;
          } else if (error.message !== undefined) {
            this.hasError = error.message;
          } else {
            this.hasError =
              `Unknown call error returned code ${error.status}`;
            console.log(error);
          }
        }
      );
  }

  reset(): void {
    this.form.reset();
    this.hasError = '';
    this.isLoading = false;
  }
}

interface FormData {
  user: string;
  secret: string;
}
