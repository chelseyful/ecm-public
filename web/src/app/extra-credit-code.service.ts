import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponseBase
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettingsService } from './app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class ExtraCreditCodeService {

  constructor(
    private http: HttpClient,
    private settings: AppSettingsService
  ) { }

  get(): Observable<CodeEntry> {
    return this.http.get<CodeEntry>(`${this.getBaseUri()}/code`, {
      headers: {
        Authorization: this.getBearerToken()
      }
    })
      .pipe(map(response => {
        response.createdString = (new Date(response.created)).toLocaleString();
        response.maskedCode = response.code.substring(0, 2) + '******-********';
        return response;
      }));
  }

  remove(code: string): Observable<CodeEntry> {
    return this.http.delete<CodeEntry>(`${this.getBaseUri()}/code/${code}`, {
      headers: {
        Authorization: this.getBearerToken()
      }
    })
      .pipe(map(response => response));
  }

  claim(code: string, pid: string): Observable<ClaimResult> {
    return this.http.post<ClaimResult>(`${this.getBaseUri()}/code`, {
      code,
      pid
    })
      .pipe(map(response => response));
  }

  list(pid: string): Observable<ClaimedCode[]> {
    return this.http.get<ClaimedCode[]>(`${this.getBaseUri()}/pid/${pid}`, {
      params: {}
    })
      .pipe(map(response => {
        for (const item of response) {
          if (item.updated !== undefined) {
            item.updatedString = (new Date(item.updated)).toLocaleString();
          }
        }
        response.sort((left, right) => {
          if (left.updated === right.updated) {
            return 0;
          } else if (left.updated < right.updated) {
            return -1;
          } else {
            return 1;
          }
        });
        return response;
      }));
  }

  login(user: string, secret: string): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${this.getBaseUri()}/token`, {
      user,
      secret
    })
      .pipe(map(response => response));
  }

  private getBaseUri(): string {
    const opts = this.settings.getAll();
    return `https://${opts.api_prefix}.chelsey.codes/${opts.api_version}`;
  }

  private getBearerToken(): string {
    let bearer = this.settings.get('jwt');
    if (
      bearer !== undefined &&
      bearer !== ''
    ) {
      bearer = `Bearer ${bearer}`;
    } else {
      bearer = '';
    }
    return bearer;
  }
}

export interface CodeEntry {
  uuid: string;
  code: string;
  maskedCode: string;
  created: number;
  createdString?: string;
  error?: string;
}

export interface ClaimResult {
  uuid: string;
  error?: string;
}

export interface ClaimedCode {
  code: string;
  updated: number;
  updatedString?: string;
}

interface LoginResult extends HttpResponseBase {
  Authorization?: string;
  error?: string;
  message?: string;
}

interface UriParams {
  prefix: string;
  version: string;
  key: string;
}
