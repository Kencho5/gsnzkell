import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import {
  ActivatedRoute, Router
} from '@angular/router';
import {
  Subscription
} from 'rxjs';
import {
  UserService
} from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss', '../responsive.css', '../profile/profile.component.scss']
})
export class UserComponent implements OnInit {
  userID: string;
  userData;
  posts;
  pfp;
  animal: string;
  pageIndex = 1;
  daysSelected = 1;
  pages = [];
  currentDate: Date = new Date();
  renewID: string;
  balanceMessage: string;
  expiredSort: boolean;


  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.userID = params['id'];

      this.getUserData();
    });
  }

  getUserData() {
    this.userService.getProfileData({"id": this.userID}).subscribe((res) => {
      if (res["code"] == 200) {
        this.userData = res['data'];

        this.loadPosts();
      }
    });
  }

  loadPosts() {
    this.userService.getPosts({email: this.userData.email, pageIndex: this.pageIndex}).subscribe((res) => {
      if (res["code"] == 200) {
        this.posts = res['data'];
        this.posts.forEach(post => {
          var remaining = new Date(post.expires).getTime() - new Date().getTime();

          post.expires = Math.floor(remaining / (1000 * 60 * 60 * 24));
          post.date = new Date(post.date).toDateString().slice(3);
        })
        this.pages = this.numToArray(Math.ceil(res['count'] / 5));
      }
    });
  }

  openPost(id) {
    this.router.navigate([`/post/${id}`]);
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
