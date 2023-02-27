import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { PostService } from './post.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss', '../responsive.css']
})
export class PostComponent implements OnInit {
  postID: string;
  post;
  similarPosts;

  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.postID = params['id'];
    });

    this.getPostData();
  }

  getPostData() {
      this.postService.getPostData({'id': this.postID}).subscribe((res) => {
    if(res['code'] == 200) {
      this.post = res['data'];
      this.getSimilarPosts();

      this.post['date'] = new Date(res['data']['date']).toDateString().slice(3);
      this.post.postType = this.post.postType.toUpperCase();
      
    } else {
      this.router.navigate(['']);
    }
  });
  }

  getSimilarPosts() {
      this.postService.getSimilarPosts({
      'breed': this.post.breed,
      'city': this.post.city,
      'postType': this.post.postType
    })
      .subscribe((res) => {
    if(res['code'] == 200) {
      this.similarPosts = res['data'];
    }
  });
  }

  openProfile() {
    this.postService.getUserID({'email': this.post.email}).subscribe((res) => {
      if(res['code'] == 200) {
        this.router.navigate(['user', res['data']]);
      } else {
        this.router.navigate(['']);
      }
    });
  }

  openPost(id) {
    window.open(`/post/${id}`)
  }


 customOptions: OwlOptions = {
    items: 1,
    dots: true,
    nav: true,
    loop: true,
    navText: ['<', '>'],
    autoplay: true,
    autoplayTimeout: 2500,
  }
}
