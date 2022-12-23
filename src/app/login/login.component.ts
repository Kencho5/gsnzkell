import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isRegistered = localStorage.getItem('isRegistered');
  loggedIn: boolean;
  message: string;
  
  loginForm = this.formBuilder.group({
    email: '',
    password: ''
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private _loginService: LoginService,
    private router: Router
    ) { }
    
  ngOnInit(): void {
    localStorage.removeItem('isRegistered');
    
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  loginRequest() {
    if(this.loginForm.valid) {
      this._loginService.getLoginData(this.loginForm.value).subscribe((res) => {
        if(res['status'] == 200) {
          localStorage.setItem("token", res['token']);
          this.router.navigate(['/profile']);
          
        } else {
          this.message = "Email Or Password Incorrect.";
        }
      });
    } else {
      this.message = "Please fill out the form.";
    }

  }

}
