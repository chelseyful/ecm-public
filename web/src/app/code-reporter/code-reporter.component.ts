import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExtraCreditCodeService, ClaimedCode } from '../extra-credit-code.service';
import { AppSettingsService } from '../app-settings.service';

@Component({
  // tslint:disable-next-line
  selector: 'cc-code-reporter',
  templateUrl: './code-reporter.component.html',
  styleUrls: ['./code-reporter.component.scss']
})
export class CodeReporterComponent implements OnInit {
  displayedColumns: string[] = ['code', 'updated'];
  isLoading = false;
  hasData = false;
  codes: ClaimedCode[];
  form!: FormGroup;

  constructor(
    private ecs: ExtraCreditCodeService,
    private settings: AppSettingsService
  ) {
    this.codes = [];
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      pid:  new FormControl(
        this.settings.get('remember_pid') === 'true' ?
        this.settings.get('pid') :
        '', [
        Validators.required,
        Validators.pattern('^[0-9]{4}-[0-9]{3}$')
      ]),
    });
  }

  onSubmit(formData: QueryForm): void {
    this.isLoading = true;
    this.ecs.list(formData.pid)
      .subscribe(
        result => {
          this.codes = result;
          this.isLoading = false;
      },
      error => {
        // TODO: impliment error state
      });
  }
}

interface QueryForm {
  pid: string;
}
