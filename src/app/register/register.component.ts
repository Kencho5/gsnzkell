import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  displayError: boolean;
  httpError: boolean;
  isRegistered = "Successfully Registered!";

  constructor(
    private formBuilder: FormBuilder,
    private _registerService: RegisterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  registerRequest() {
    if(this.registerForm.valid) {
      this.displayError = false;

      this._registerService.insertRegisterData(this.registerForm.value).subscribe((res) => {
        if(res["code"] == 500) {
          this.httpError = true;
        } else {
          localStorage.setItem('isRegistered', this.isRegistered);
          this.router.navigate(['/login']);
        }
      });
      
    } else {
      this.displayError = true;
    }

  }

}
