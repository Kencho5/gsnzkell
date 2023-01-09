import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ProfileService } from './profile.service';
import { LoginService } from '../login/login.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  userData;
  posts;

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
    private login: LoginService
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

        if(res['count']) {
          localStorage.setItem("postCount", res['count']);
        }
        this.postCount = localStorage.getItem("postCount");
      }
    });
  }

  ngOnInit(): void { 
    this.paginator.page.subscribe(() => this.loadPage());

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
    var start = this.paginator.pageIndex * this.paginator.pageSize;

    this.loadPosts(start);
  }

}
