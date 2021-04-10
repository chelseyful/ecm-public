import { Component, OnInit } from '@angular/core';
import {
  AppSettingsService,
} from '../app-settings.service';

@Component({
  selector: 'cc-profile-logout',
  templateUrl: './profile-logout.component.html',
  styleUrls: ['./profile-logout.component.scss']
})
export class ProfileLogoutComponent implements OnInit {

  message: string;

  constructor(
    private settings: AppSettingsService
    ) {
      this.message = '';
    }

    ngOnInit(): void {
      const userName = this.settings.getSubjectName();
      if (userName !== '') {
        this.message =
          `You are currently logged in as ${userName}`;
      }
    }

    logOut(): void {
      this.settings.set('jwt', '');
    }
}
