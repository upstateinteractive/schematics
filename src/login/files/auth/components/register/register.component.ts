import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers';

@Component({
  selector: 'ui-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  @Input() isLoading;
  @Input() hasError;
  @Input() errorMessage;
  @Output() register: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private store: Store<fromRoot.State>,
  ) {
    this.form = this.fb.group({
      title: ['', ],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
      password: ['', Validators.required],
      company: ['', Validators.required],
      primary: [
        null, [ Validators.required]
      ],
      secondary: ['', ],
    });
  }

  registerButton(form) {
    if (this.form.valid) {
      this.register.emit(form);
    }
  }

  ngOnInit() {
  }

}
