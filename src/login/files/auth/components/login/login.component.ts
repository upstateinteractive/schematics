import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import { errorMessage } from '../../../reducers/user/user.reducer';

@Component({
  selector: 'tws-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  @Input() isLoading;
  @Input() hasError;
  @Input() errorMessage;
  @Output() login: EventEmitter<any> = new EventEmitter();
  clickedLogin = false;
  errorMessage$: Observable<any>;
  hasError$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromRoot.State>,
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginButton(form) {
    this.clickedLogin = true;
    if (this.form.valid) {
      this.login.emit(form);
    }
  }

  ngOnInit() {
  }

}
