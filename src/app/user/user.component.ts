import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userID: string;

  userData = {
    name: '',
    phone_number: '',
    facebook: '',
    instagram: '',
  }

  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.userID = params['id'];
    });

    this.userService.getProfileData({'id': this.userID}).subscribe((res) => {
      if(res['code'] == 200) {
        this.userData = {
          name: res['data']["name"],
          phone_number: res['data']["phone"],
          facebook: res['data']["facebook"],
          instagram: res['data']["instagram"]
        }
      }
    });
  }

}
