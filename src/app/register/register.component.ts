import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  codeForm: FormGroup;
  httpError: string;
  isRegistered = 'Successfully Registered!';
  step = 1;

  constructor(
    private formBuilder: FormBuilder,
    private _registerService: RegisterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      city: [null, Validators.required],
      password: [null, Validators.required],
    });

    this.codeForm = this.formBuilder.group({
      code: [null, Validators.required],
    });
  }

  changeStep() {
    if (this.registerForm.valid) {
      this.httpError = '';
      this.step = 2;

      this.sendCode();
    } else {
      this.httpError = 'Please Fill Out The Form';
    }
  }

  sendCode() {
    if(!this.registerForm.valid) {
      this.httpError = 'Please Fill Out The Form';
      return;
    }
    this._registerService
      .sendCode({
        email: this.registerForm.value.email,
        register: true,
      })
      .subscribe((res) => {
        if (res['code'] == 404) {
          this.httpError = 'Email Already Exists';
          this.step = 1;
        } else {
          this.step = 2;
        }
      });
  }

  registerRequest() {
    if (this.registerForm.valid) {
      this.httpError = '';

      this._registerService
        .insertRegisterData({
          data: this.registerForm.value,
          code: this.codeForm.value.code,
        })
        .subscribe((res) => {
          if (res['code'] == 200) {
            localStorage.setItem('isRegistered', this.isRegistered);
            this.router.navigate(['/login']);
          } else {
            this.httpError = "Incorrect Code";
          }
        });
    } else {
      this.httpError = 'Please Fill Out The Form';
    }
  }
}
