import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { PostService } from './post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  postID: string;
  icon: string;

  post;

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

    this.postService.getPostData({'id': this.postID}).subscribe((res) => {
      if(res['code'] == 200) {
        this.post = res['data'];

        this.post['date'] = new Date(res['data']['date']).toDateString().slice(3);
        this.post.postType = this.post.postType.toUpperCase();

        if(this.post.postType == "SELLING") {
          this.icon = 'sell'
        } else if(this.post.postType == "MEETING") {
          this.icon = 'favorite'
        } else {
          this.icon = 'home';
        }
        
      } else {
        this.router.navigate(['']);
      }
    });
  }

  openProfile() {

    this.postService.getUserID({'email': this.post.email}).subscribe((res) => {
      if(res['code'] == 200) {
        this.router.navigate(['user', jwtDecode(res['token'])['id']]);
      } else {
        this.router.navigate(['']);
      }
    });

  }

  changeImage(event) {
    var active = document.getElementsByClassName("active")[0] as HTMLImageElement;

    active.src = event.target.src;
  }

  scrollLeft() {
    var active = document.getElementsByClassName("active")[0] as HTMLImageElement;
    var current = active.src.slice(-5);

    var nextIndex = this.post.imgs.indexOf(current);

    if(nextIndex - 1 >= 0) {
      active.src = `/postImages/${this.post.id}-${this.post.imgs[nextIndex - 1]}`;
    } else {
      active.src = `/postImages/${this.post.id}-${this.post.imgs[this.post.imgs.length - 1]}`;
    }
  }

  scrollRight() {
    var active = document.getElementsByClassName("active")[0] as HTMLImageElement;
    var current = active.src.slice(-5);

    var nextIndex = this.post.imgs.indexOf(current);

    if(nextIndex + 1 < this.post.imgs.length) {
      active.src = `/postImages/${this.post.id}-${this.post.imgs[nextIndex + 1]}`;
    } else {
      active.src = `/postImages/${this.post.id}-${this.post.imgs[0]}`;
    }

  }

}
