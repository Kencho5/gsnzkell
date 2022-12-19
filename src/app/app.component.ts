import { Component } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(
    public loginService: LoginService
    ) { }

  ngOnInit(): void {
    if(localStorage.getItem('token')) {
      var ts = jwtDecode(localStorage.getItem('token'))['exp'];
      var exp = new Date(ts * 1000).getDate() - new Date().getDate();
  
      if(exp == 0) {
        localStorage.removeItem('token');
      }
    }
  }

  logoutFunction() {
    localStorage.removeItem('token');
  }
}
