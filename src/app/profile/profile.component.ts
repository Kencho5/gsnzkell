import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ProfileService } from './profile.service';
import { LoginService } from '../login/login.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../responsive.css']
})

export class ProfileComponent implements OnInit {

  userData;
  posts;
  animal: string;

  postCount: string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  pageEvent: PageEvent;

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler() {
    localStorage.removeItem('postCount');
  }

  constructor(
    private router: Router,
    private _profileService: ProfileService,
    private login: LoginService,
    public dialog: MatDialog
  ) {}

  getProfileData() {
    var user = this.login.user;

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

  loadPosts(start) {
    this._profileService.getPosts({email: this.login.user['email'], start: start}).subscribe((res) => {
      if (res["code"] == 200) {
       this.posts = res['data'];
        console.log(this.posts)

        if(res['count']) {
          localStorage.setItem("postCount", res['count']);
        }
        this.postCount = localStorage.getItem("postCount");
      }
    });
  }

  ngOnInit(): void { 
    // this.paginator.page.subscribe(() => this.loadPage());

    this.login.isLoggedIn$.subscribe(res => {
        if(res == false) {
           this.router.navigate(['/login']);
        }
        else { 
          this.getProfileData();
        }
    });

    this.loadPosts(0);
  }

  loadPage() {
    var div = document.getElementsByClassName('user-posts')[0] as HTMLElement;
    div.classList.toggle('posts-fade');

    var start = this.paginator.pageIndex * this.paginator.pageSize;

    this.loadPosts(start);
  }

  // openDialog() {
  //   let dialogRef = this.dialog.open(EditProfileComponent, {
  //     width: '600px',
  //     panelClass: 'custom-container',
  //     data: this.userData
  //     
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result != "cancel") {
  //       this._profileService.updateUserData(result, this.userData.email, this.login.user.counts).subscribe((res) => {
  //         if (res["code"] == 200) {
  //           localStorage.setItem('token', res['token'])
  //           this.login.user = jwtDecode(res['token']);

  //           this.getProfileData();
  //         }
  //       });
  //     }
  //   });
  // }

  openPost(id) {
    console.log(id)
      this.router.navigate([`/post/${id}`]);
  }
  
  openModal() {
     document.querySelector('.user-modal').classList.toggle('active');
  }

  closeModal() {
       document.querySelector('.user-modal').classList.remove('active')
  }

}
