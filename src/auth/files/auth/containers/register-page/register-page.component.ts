import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import { UserActions, UserActionTypes, Register} from '../../../actions/user/user.actions';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CMSActions } from '../../../services/dispatcher.service';

import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ui-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  complete$: Observable<any>;
  isLoading$: Observable<any>;
  errorMessage$: Observable<any>;
  hasError$: Observable<any>;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store: Store<fromRoot.State>,
    private actions$: CMSActions,
    private router: Router,
  ) {
    this.complete$ = this.actions$.ofType(UserActionTypes.REGISTER_COMPLETE);
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
        this.router.navigate(['../../../auth/login']);
    });
  }

  onRegister(form) {
    this.store.dispatch(new Register(form));
  }

}
