import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts = [];

  searchForm = this.formBuilder.group({
    text:  new FormControl()
  });

  constructor(
    private homeService: HomeService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.latestPosts();

    this.searchForm = new FormGroup({
      text: new FormControl('', [Validators.required])
   });
  }

  search() {
    if(this.searchForm.valid) {
      this.router.navigate(['/search', {text: this.searchForm.value.text}]);
    }
  }

  latestPosts() {
    this.homeService.latestPosts().subscribe((res) => {
      if (res["code"] == 200) {
        this.posts = res['data'];
      }
    });
  }

  
  scrollLeft() {
    var div = document.getElementsByClassName("latest-posts")[0] as HTMLImageElement;

    div.scrollLeft -= 250;
  }

  scrollRight() {
    var div = document.getElementsByClassName("latest-posts")[0] as HTMLImageElement;

    div.scrollLeft += 250;
  }

  openPost(event) {
    var id = event.path[2]['id'];

    window.open(`/post/${id}`)
  }

}
