import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import {
  ActivatedRoute
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
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userID: string;

  userData;
  posts;
  postCount = 0;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  pageEvent: PageEvent;

  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

    loadUserData(start) {
      this.userService.getProfileData({
        'id': this.userID, 'start': start
      }).subscribe((res) => {
        if (res['code'] == 200) {
          this.userData = res['data'];
          this.posts = res['posts'];

          for (var i in this.userData.counts) {
            this.postCount += this.userData.counts[i];
          }
        }
      });
    }

  ngOnInit(): void {
    this.paginator.page.subscribe(() => this.loadPage());
    
    this.routeSub = this.route.params.subscribe(params => {
      this.userID = params['id'];
    });
    
    this.loadUserData(0);
  }

  loadPage() {
    var start = this.paginator.pageIndex * this.paginator.pageSize;

    this.loadUserData(start);
  }

}
