import { Component, OnInit } from '@angular/core';
import {
  ExtraCreditCodeService,
  CodeEntry
} from '../extra-credit-code.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'cc-code-generator',
  templateUrl: './code-generator.component.html',
  styleUrls: ['./code-generator.component.scss']
})
export class CodeGeneratorComponent {

  codes: CodeEntry[];
  isLoading: boolean;
  isMasking: boolean;

  constructor(
    private ecService: ExtraCreditCodeService
    ) {
      this.codes = [];
      this.isLoading = false;
      this.isMasking = true;
    }

    getCode(): void {
      this.isLoading = true;
      this.ecService.get()
      .subscribe(
        next => {
          this.codes.push(next);
          this.codes.sort((left, right) => {
            if (left.created === right.created) {
              return 0;
            } else if (left.created < right.created) {
              return 1;
            } else {
              return -1;
            }
          });
          this.isLoading = false;
        },
        err => {
          console.log(err);
          this.isLoading = false;
        }
      );
    }

    trackBy(index: number, code: CodeEntry): string {
      return code.uuid;
    }

    invalidate(code: CodeEntry): void {
      this.ecService.remove(code.code)
      .subscribe(
        next => {
          this.clear(code);
        },
        err => {
          console.log(err);
        }
      );
    }

    clear(code: CodeEntry): void {
      this.codes = this.codes.filter(value => {
          if (value.uuid === code.uuid) {
            return 0;
          } else {
            return 1;
          }
      })
    }
}
