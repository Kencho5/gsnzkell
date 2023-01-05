import { Component } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { LoginService } from './login/login.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  searchForm = this.formBuilder.group({
    text:  new FormControl()
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public loginService: LoginService
    ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      text: new FormControl('', [Validators.required])
   });

    if(localStorage.getItem('token')) {
      var ts = jwtDecode(localStorage.getItem('token'))['exp'];
      var exp = new Date(ts * 1000).getDate() - new Date().getDate();
  
      if(exp == 0) {
        localStorage.removeItem('token');
      }
    }
  }

 search() {
    if(this.searchForm.valid) {
      this.router.navigate(['/search', {text: this.searchForm.value.text}]);
    }
  }

  logoutFunction() {
    localStorage.removeItem('token');
  }
}
