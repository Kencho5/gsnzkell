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

  post = {
    id: '',
    name: '',
    email: '',
    phone: '',
    animal: '',
    breed: '',
    price: '',
    age: '',
    ageType: '',
    description: '',
    postType: '',
    date: '',
    imgs: ''
  }

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
        this.post = {
          id: res['data']['id'],
          name: res['data']['name'],
          email: res['data']['email'],
          phone: res['data']['phone'],
          animal: res['data']['animal'],
          breed: res['data']['breed'],
          price: res['data']['price'],
          age: res['data']['age'],
          ageType: res['data']['ageType'],
          description: res['data']['description'],
          postType: res['data']['postType'].toUpperCase(),
          date: res['data']['date'].split('T')[0],
          imgs: res['data']['imgs']
        }

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

}
