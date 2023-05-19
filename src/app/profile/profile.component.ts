import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ProfileService } from './profile.service';
import { LoginService } from '../login/login.service';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm = new FormGroup({
    name: new FormControl(this.login.user['username'], Validators.required),
    email: new FormControl(this.login.user['email'], Validators.required),
    phone: new FormControl(this.login.user['phone'], Validators.required),
    city: new FormControl(this.login.user['city'], Validators.required),
    facebook: new FormControl(this.login.user['facebook'], Validators.required),
    instagram: new FormControl(
      this.login.user['instagram'],
      Validators.required
    ),
  });

  postForm = new FormGroup({
    id: new FormControl('', Validators.required),
    breed: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  vipForm = new FormGroup({
    id: new FormControl('', Validators.required),
    days: new FormControl('', Validators.required),
    authToken: new FormControl('', Validators.required),
  });

  userData;
  posts;
  pfp;
  animal: string;
  pageIndex = 1;
  daysSelected = 0;
  pages = [];
  currentDate: Date = new Date();
  renewID: string;
  balanceMessage: string;
  expiredSort: boolean;
  sortType;
  selectedPosts = 0;
  selected = [];
  deletePostId;

  constructor(
    private router: Router,
    private _profileService: ProfileService,
    private login: LoginService
  ) {}

  getProfileData() {
    this.userData = this.login.user;
  }

  loadPosts() {
    this._profileService
      .getPosts({
        email: this.userData.email,
        pageIndex: this.pageIndex,
        sort: this.sortType,
      })
      .subscribe((res) => {
        if (res['code'] == 200) {
          this.posts = res['data'];
          this.posts.forEach((post) => {
            var remaining =
              new Date(post.expires).getTime() - new Date().getTime();
            post.expires = Math.floor(remaining / (1000 * 60 * 60 * 24));

            post.percentage = post.expires * 5;
          });
          this.pages = this.numToArray(Math.ceil(res['count'] / 5));
        }
      });
  }

  ngOnInit(): void {
    this.login.isLoggedIn$.subscribe((res) => {
      if (res == false) {
        this.router.navigate(['/login']);
      } else {
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
    document.querySelector('.user-modal').classList.remove('active');
  }

  openVip(id) {
    document.querySelector('.vip-modal').classList.toggle('active');

    this.vipForm.controls['id'].setValue(id);
    this.vipForm.controls['authToken'].setValue(localStorage.getItem('token'));
  }

  closeVip() {
    document.querySelector('.vip-modal').classList.remove('active');
  }

  toggleRenew(id) {
    document.querySelector('.renew-modal').classList.toggle('active');

    this.renewID = id;
  }

  openEdit(post) {
    this.postForm.setValue({
      id: post._id,
      breed: post.breed,
      price: post.price,
      city: post.city,
      description: post.description,
      phone: post.phone,
    });
    document.querySelector('.edit-modal').classList.toggle('active');
  }

  closeEdit() {
    document.querySelector('.edit-modal').classList.remove('active');
  }

  editPost() {
    this._profileService
      .updatePostData({ details: this.postForm.value, token: localStorage.getItem('token') })
      .subscribe((res) => {
        if (res['code'] == 200) {
          this.loadPosts();
          this.closeEdit();
        }
      });
  }

  editProfile() {
    this._profileService
      .updateUserData(
        this.profileForm.value,
        this.userData.email,
        this.pfp,
        this.userData.id,
        this.userData.balance
      )
      .subscribe((res) => {
        if (res['code'] == 200) {
          localStorage.setItem('token', res['token']);
          this.login.user = jwtDecode(res['token']);

          this.getProfileData();
          location.reload();
        }
      });
    this.closeModal();
  }

  openDeleteModal(id) {
    document.querySelector('.delete-modal').classList.toggle('active');

    this.deletePostId = [id];
  }

  deletePost(id) {
    this._profileService.deletePost({ id: id, token: localStorage.getItem('token') }).subscribe((res) => {
      if (res['code'] == 200) {
        this.openDeleteModal(0);
        this.loadPosts();
      }
    });
  }

  changePfp(event) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.pfp = event.target.result;
      document
        .getElementsByClassName('edit-profile-pfp')[0]
        .setAttribute('src', event.target.result);
    };
  }

  pagination(event) {
    if (event.target.className == 'arrow-left' && this.pageIndex != 1) {
      this.pageIndex -= 1;
    } else if (
      event.target.className == 'arrow-right' &&
      this.pageIndex != this.pages.length
    ) {
      this.pageIndex += 1;
    } else if (event.target.classList[0] == 'pageNum') {
      this.pageIndex = parseInt(event.target.textContent);
    }

    this.loadPosts();
  }

  numToArray(x) {
    const result = [];
    for (let i = 1; i <= x; i++) {
      result.push(i);
    }
    return result;
  }

  buyVip() {
    if (this.vipForm.valid) {
      this._profileService.buyVip(this.vipForm.value).subscribe((res) => {
        if (res['code'] == 200) {
          this.userData.balance = jwtDecode(res['token'])['balance'];
          localStorage.setItem('token', res['token']);

          this.daysSelected = 0;
          this.closeVip();
          this.loadPosts();
        }
      });
    }
  }

  renewPost() {
    var token = localStorage.getItem('token');
    this._profileService
      .renewPost({ id: this.renewID, authToken: localStorage.getItem('token') })
      .subscribe((res) => {
        if (res['code'] == 200) {
          this.userData.balance = jwtDecode(res['token'])['balance'];
          localStorage.setItem('token', res['token']);

          this.loadPosts();
          this.toggleRenew(0);
        } else {
          this.balanceMessage = res['message'];
        }
      });
  }

  sort(event) {
    this.sortType = event.target.value;

    this.loadPosts();
  }

  selectPost(id, event) {
    if (event.target.src.includes('fill')) {
      this.selected = this.selected.filter((arrItem) => arrItem !== id);

      this.selectedPosts -= 1;
      return;
    }
    this.selectedPosts += 1;
    this.selected.push(id);
  }

  deleteMultiple() {
    if (this.selected.length == 0) {
      return;
    }

    this._profileService.deletePost({ id: this.selected, token: localStorage.getItem('token') }).subscribe((res) => {
      if (res['code'] == 200) {
        this.selectedPosts = 0;
        this.selected = [];
        this.loadPosts();
      }
    });
  }
  selectItem(item, type) {
    this.vipForm.controls[type].setValue(item);
  }

}
