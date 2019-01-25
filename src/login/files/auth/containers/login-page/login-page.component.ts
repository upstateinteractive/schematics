import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import { UserActions, UserActionTypes, Login, LoginComplete} from '../../../actions/user/user.actions';
import { User } from '../../../models/user';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CMSActions } from '../../../services/dispatcher.service';

import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tws-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  complete$: Observable<any>;
  isLoading$: Observable<any>;
  errorMessage$: Observable<any>;
  hasError$: Observable<any>;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store: Store<fromRoot.State>,
    private actions$: CMSActions,
    private router: Router,
    private zone: NgZone,
  ) {
    this.complete$ = this.actions$.ofType(UserActionTypes.LOGIN_COMPLETE);
    this.isLoading$ = this.store.select(fromRoot.userIsLoading);
    this.errorMessage$ = this.store.select(fromRoot.userErrorMessage);
    this.hasError$ = this.store.select(fromRoot.userHasError);
  }

  ngOnInit() {
    this.complete$
    .pipe(
      takeUntil(this.unsubscribe)
    )
    .subscribe(() => {
        this.router.navigate(['../../../dashboard/home']);
    });
  }

  onLogin(form) {
    this.store.dispatch(new Login(form));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
