import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { PostService } from './post.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  postID: string;
  post;
  similarPosts;
  userID: string;
  userPfp: string;

  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.postID = params['id'];
    });

    this.getPostData();
    window.scrollTo(0, 0);
  }

  getPostData() {
    this.postService.getPostData({ id: this.postID }).subscribe((res) => {
      if (res['code'] == 200) {
        this.post = res['data'];
        this.getSimilarPosts();

        this.post['date'] = new Date(res['data']['date'])
          .toDateString()
          .slice(3);

        this.getID();
      } else {
        this.router.navigate(['']);
      }
    });
  }

  getSimilarPosts() {
    this.postService
      .getSimilarPosts({
        id: this.post.id,
        breed: this.post.breed,
        city: this.post.city,
        postType: this.post.postType,
      })
      .subscribe((res) => {
        if (res['code'] == 200) {
          this.similarPosts = res['data'];
        }
      });
  }

  getID() {
    this.postService.getUserID({ id: this.postID }).subscribe((res) => {
      this.userID = res['id'];
      this.userPfp = res['pfp'];
    });
  }

  openProfile() {
    this.router.navigate(['user', this.userID]);
  }

  openPost(id) {
    window.open(`/post/${id}`);
  }

  customOptions: OwlOptions = {
    items: 1,
    dots: true,
    nav: true,
    loop: true,
    navText: ['<', '>'],
    autoplay: true,
    autoplayTimeout: 3000,
  };
}
