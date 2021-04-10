import {
  Inject,
  Injectable,
  EventEmitter
} from '@angular/core';
import {
  LOCAL_STORAGE,
  StorageService,
} from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  STORAGE_KEY = 'app_settings';
  settings: Settings;
  public settingsChanges = new EventEmitter<SettingsChange>(true);
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {

    // Initialize default settings if storage endpoint is empty
    this.settings = this.storage.has(this.STORAGE_KEY) ?
      this.storage.get(this.STORAGE_KEY) :
      defaultSettings;
    this.storage.set(this.STORAGE_KEY, this.settings);
  }

  get(key: keyof Settings): string {
    return this.settings[key];
  }

  getAll(): Settings {
    return this.settings;
  }

  set(key: keyof Settings, value: string): void {
    const oldVal = this.settings[key];
    if (oldVal !== value) {
      this.settings[key] = value;
      this.storage.set(this.STORAGE_KEY, this.settings);
      this.settingsChanges.emit({
        name: key,
        from: oldVal,
        to: value
      });
    }
  }

  setMany(settingsList: GenericSetting[]): void {
    for (const aSetting of settingsList) {
      this.set(aSetting.name, aSetting.value);
    }
  }

  isTrue(key: keyof Settings): boolean {
    const val = this.settings[key];
    if (
      !val || val === 'false' || val.length === 0
    ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * @returns The subject name from the stored JWT. If there is no stored JWT,
   *          or the system fails to decode the token, an empty string is
   *          returned.
   */
  getSubjectName(): string {
    let retStr = '';
    const decodedTkn = this.decodeJWT();
    if (decodedTkn.sub !== undefined) {
      retStr = decodedTkn.sub;
    }
    return retStr;
  }

  private decodeJWT(): AuthToken {
    let newToken = {};
    const tknDecoder =
      /^[A-Za-z0-9-_=]+\.([A-Za-z0-9-_=]+)\.?[A-Za-z0-9-_.+/=]*$/;
    if (
      this.settings.jwt &&
      this.settings.jwt !== '' &&
      tknDecoder.test(this.settings.jwt)
    ) {
      const base64jwt = tknDecoder.exec(this.settings.jwt);
      let decodedJwt = '';
      if (base64jwt && base64jwt[1]) {
        try {
          decodedJwt = atob(base64jwt[1]);
          const tknObject = JSON.parse(decodedJwt);
          if (tknObject && tknObject.sub) {
            newToken = tknObject;
          }
        } catch (err) {
          console.log('unable to decode JWT');
        }
      }
    }
    return newToken;
  }
}

export interface Settings {
  pid: string;
  remember_pid: string;
  api_key: string;
  api_version: string;
  api_prefix: string;
  jwt: string;
}
export interface SettingsChange {
  name: keyof Settings;
  from?: string;
  to: string;
}

interface GenericSetting {
  name: keyof Settings;
  value: string;
}

interface AuthToken {
  sub?: string;
  iat?: number;
  exp?: number;
  pri?: number;
}

const defaultSettings: Settings = {
  pid: '',
  remember_pid: 'false',
  api_key: '',
  api_version : 'v1',
  api_prefix : 'api',
  jwt : '',
};
