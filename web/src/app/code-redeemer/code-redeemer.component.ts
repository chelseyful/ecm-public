import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExtraCreditCodeService, ClaimResult } from '../extra-credit-code.service';
import { AppSettingsService } from '../app-settings.service';

@Component({
  // tslint:disable-next-line
  selector: 'cc-code-redeemer',
  templateUrl: './code-redeemer.component.html',
  styleUrls: ['./code-redeemer.component.scss']
})
export class CodeRedeemerComponent implements OnInit {

  // tslint:disable-next-line
  form!: FormGroup;
  state: FormState;
  result: ClaimResult;

  constructor(
    private ecService: ExtraCreditCodeService,
    private settings: AppSettingsService
    ) {
    this.state = FormState.OPEN;
    this.result = {
      uuid: ''
    };
  }

  // Observers for form data changes
  oRememberPID = {
    next: (newVal: boolean) => {
      this.settings.set('remember_pid', newVal ? 'true' : 'false');
      if (!newVal) {
        this.settings.set('pid', '');
      }
    }
  };

  ngOnInit(): void {
    this.state = FormState.OPEN;
    this.form = new FormGroup({
      ecCode:  new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-z0-9]{8}-[A-Za-z0-9]{8}$')
      ])
      ,
      pid:  new FormControl(
        this.settings.get('remember_pid') === 'true' ?
        this.settings.get('pid') :
        '', [
        Validators.required,
        Validators.pattern('^[0-9]{4}-[0-9]{3}$')
      ]),
      remember_pid: new FormControl(
        this.settings.get('remember_pid') === 'true'
      ),
    });
    // tslint:disable-next-line
    this.form.controls['remember_pid'].valueChanges.subscribe(this.oRememberPID);
  }

  onSubmit(redeemCode: RedeemFormValue): void {
    this.state = FormState.LOADING;
    this.ecService.claim(redeemCode.ecCode, redeemCode.pid)
      .subscribe(
        result => {
          this.state = FormState.RESULTS;
          this.result.uuid = result.uuid;
      },
      error => {
        this.state = FormState.RESULTS;
        this.result.uuid = '';
        if (error.error && typeof(error.error) === 'string') {
          this.result.error = error.error;
        }
      });
    if (this.settings.isTrue('remember_pid')) {
      this.settings.set('pid', redeemCode.pid);
    } else {
      this.settings.set('pid', '');
    }
  }

  reset(): void {
    this.result = {
      uuid: '',
      error: undefined
    };
    this.ngOnInit();
  }

}

interface RedeemFormValue {
  ecCode: string;
  pid: string;
  remember_pid: string;
}

enum FormState {
  OPEN = 0,
  LOCKED = 1,
  LOADING = 2,
  RESULTS = 3
}
