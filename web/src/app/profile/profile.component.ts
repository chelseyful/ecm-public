import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  AppSettingsService,
  SettingsChange
} from '../app-settings.service';
import { ProfileLoginComponent } from '../profile-login/profile-login.component';
import { ProfileLogoutComponent } from '../profile-logout/profile-logout.component';
@Component({
  selector: 'cc-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: string;
  isLoading: boolean;
  private settingsSub: any = null;

  constructor(
    private settings: AppSettingsService
  ) {
    this.user = this.settings.getSubjectName();
    this.isLoading = false;
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
