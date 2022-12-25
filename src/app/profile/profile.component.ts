import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ProfileService } from './profile.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  userData;
  posts;

  constructor(
    private router: Router,
    private _profileService: ProfileService,
    private login: LoginService
  ) {}

  getProfileData() {
    var user = this.login.user;

    this._profileService.getPosts({email: user['email']}).subscribe((res) => {
      if (res["code"] == 200) {
       this.posts = res['data'];
      }
    });

    this.userData = {
      email: user["email"],
      name: user["name"],
      phone_number: user["phone"],
      facebook: user["facebook"],
      instagram: user["instagram"],
      counts: user["counts"],
      city: user["city"]
    }
  }

  ngOnInit(): void { 
    this.login.isLoggedIn$.subscribe(res => {
        if(res == false) {
           this.router.navigate(['/login']);
        }
        else { 
          this.getProfileData();
        }
    });
  }

  editable = "";
  editType = "";

  editDetails(event) {
    this.editType = event.target.parentNode.firstChild.id;
    this.editable = this.editType;
  }

  submitDetails(event) {
    var inputValue = event.target.parentNode.parentNode.firstChild.value;
    var inputName = event.target.parentNode.parentNode.firstChild.name;

    if (inputValue.length == 0) {
      this.getProfileData();
    } else if (this.editType == "phoneEdit" && inputValue.length < 9) {
      this.getProfileData();
    } else if (this.editType == "emailEdit" && this.validateEmail(inputValue) == null) {
      this.getProfileData();
    } else {
      this._profileService.updateUserData(inputValue, inputName, this.userData.email).subscribe((res) => {
        if (res["code"] == 200) {
          localStorage.setItem('token', res['token']);

          this.login.user = jwtDecode(res['token']);

          this.getProfileData();
        }
      });

      this.userData[inputName] = inputValue;

      this.editable = "";
    }
  }

  cancel () {
    this.editable = "";
  }

  validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

}
