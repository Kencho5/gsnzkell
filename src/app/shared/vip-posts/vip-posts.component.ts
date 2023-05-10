import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vip-posts',
  templateUrl: './vip-posts.component.html',
  styleUrls: ['../posts/posts.component.scss']
})
export class VipPostsComponent {
  constructor(private router: Router, public translate: TranslateService) {}

  @Input() vipPosts: any;

  openPost(id) {
    this.router.navigate([`/post/${id}`]);
  }

}
