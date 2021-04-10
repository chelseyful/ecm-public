import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  AppSettingsService,
  SettingsChange
} from '../app-settings.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'cc-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  user = '';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  private settingsSub: any = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private settings: AppSettingsService
    ) {

    }

    ngOnInit(): void {
      this.user = this.settings.getSubjectName();
      this.settingsSub = this.settings.settingsChanges.subscribe(
        (data: SettingsChange) => {

          // listen for changes to the JWT
          if (data.name === 'jwt') {
            this.user = this.settings.getSubjectName();
          }
        }
      );
    }

    ngOnDestroy(): void {
      if (this.settingsSub && this.settingsSub.unsubscribe) {
        this.settingsSub.unsubscribe();
      }
    }
}
