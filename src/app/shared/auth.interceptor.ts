import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs/operators';
import { AppState } from '../store/app.reducers';
import { AuthState } from '../auth/store/auth.reducers';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private store: Store<AppState>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.pipe(select('auth'), take(1), switchMap((authState: AuthState) => {
      const copiedReq = req.clone({
        params: req.params.set('auth', authState.token)
      });
      return next.handle(copiedReq);
    }));
  }

}
