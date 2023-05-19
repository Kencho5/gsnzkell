import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-vip-posts',
  templateUrl: './vip-posts.component.html',
  styleUrls: ['../posts/posts.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class VipPostsComponent {
  constructor(private router: Router, public translate: TranslateService) {}

  @Input() vipPosts: any;

  openPost(id) {
    this.router.navigate([`/post/${id}`]);
  }
}
