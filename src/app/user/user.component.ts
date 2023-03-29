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
  pfp;
  animal: string;
  pageIndex = 1;
  daysSelected = 1;
  pages = [];
  currentDate: Date = new Date();
  renewID: string;
  balanceMessage: string;
  expiredSort: boolean;
  sortType;


  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
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
        console.log(res)
      }
    });
  }


}
