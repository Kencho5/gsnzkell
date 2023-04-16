import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss', '../../responsive.css'],
})
export class PostsComponent {
  constructor(private router: Router, public translate: TranslateService) {}

  @Input() posts: any;

  openPost(id) {
    this.router.navigate([`/post/${id}`]);
  }
}
