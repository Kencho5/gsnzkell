import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ProfileService } from './profile.service';
import { LoginService } from '../login/login.service';

import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../responsive.css']
})

export class ProfileComponent implements OnInit {

    profileForm = new FormGroup({
    name:  new FormControl(this.login.user['name'], Validators.required),
    email:  new FormControl(this.login.user['email'], Validators.required),
    phone:  new FormControl(this.login.user['phone'], Validators.required),
    city:  new FormControl(this.login.user['city'], Validators.required),
    facebook:  new FormControl(this.login.user['facebook'], Validators.required),
    instagram:  new FormControl(this.login.user['instagram'], Validators.required)
  });


  userData;
  posts;
  pfp;
  animal: string;
  pageIndex = 1;
  pages = [];

  constructor(
    private router: Router,
    private _profileService: ProfileService,
    private login: LoginService,
  ) {}

  getProfileData() {
    var user = this.login.user;

    this.userData = {
      id: user["id"],
      email: user["email"],
      name: user["name"],
      phone_number: user["phone"],
      facebook: user["facebook"],
      instagram: user["instagram"],
      city: user["city"],
      pfp: user['pfp']
    }
  }

  loadPosts() {
    this._profileService.getPosts({email: this.userData.email, pageIndex: this.pageIndex}).subscribe((res) => {
        if (res["code"] == 200) {
          this.posts = res['data'];
          this.pages = this.numToArray(Math.ceil(res['count'] / 4));
        }
      });
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

    this.loadPosts();
  }

  openPost(id) {
      this.router.navigate([`/post/${id}`]);
  }
  
  openModal() {
     document.querySelector('.user-modal').classList.toggle('active');
  }

  closeModal() {
    document.querySelector('.user-modal').classList.remove('active')
  }

  editProfile() {
    this._profileService.updateUserData(this.profileForm.value, this.userData.email, this.pfp, this.userData.id, this.userData.pfp).subscribe((res) => {
      if (res["code"] == 200) {
        localStorage.setItem('token', res['token'])
        this.login.user = jwtDecode(res['token']);

        this.getProfileData();
      }
    });
  this.closeModal();
  }

  deletePost(id) {
    this._profileService.deletePost({id: id}).subscribe((res) => {
      if (res["code"] == 200) {
        this.loadPosts();
      }
    });
  }

  changePfp(event) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
        this.pfp = event.target.result;
          document.getElementsByClassName('edit-profile-pfp')[0].setAttribute('src', event.target.result)
    }
  }

  pagination(event) {
    if(event.target.className == 'arrow-left' && this.pageIndex != 1) {
      this.pageIndex -= 1;
    } 

    else if(event.target.className == 'arrow-right' && this.pageIndex != this.pages.length) {
      this.pageIndex += 1;
    } 

    else if(event.target.classList[0] == 'pageNum') {
      this.pageIndex = parseInt(event.target.textContent);
    }

    this.loadPosts()
  }


  numToArray(x) {
    const result = [];
    for (let i = 1; i <= x; i++) {
      result.push(i);
    }
    return result;
  }


}
