import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from './search.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  posts = [];
  displayedPosts = [];
  postsLength;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  pageEvent: PageEvent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.paginator.page.subscribe(() => this.loadPage());

    var text = this.activatedRoute.snapshot.paramMap.get("text");

    this.searchService.searchPost({'text': text}).subscribe((res) => {
      if(res['code'] == 200) {
        res['data'].forEach(post => {
            this.posts.push({
              id: post._id,
              type: post.postType,
              breed: post.breed,
              age: post.age,
              ageType: post.ageType,
              animal: post.animal,
              description: post.description,
              postType: post.postType.toUpperCase(),
              price: post.price,
              date: post.date.split('T')[0],
              img: post.img_path[0]
            });
            console.log(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize)

            var start = this.paginator.pageIndex * this.paginator.pageSize;

            this.displayedPosts = this.posts.slice(start, start + this.paginator.pageSize);

            this.postsLength = this.posts.length;
        })
      }
    });
  }

  loadPage() {
    var start = this.paginator.pageIndex * this.paginator.pageSize;

    this.displayedPosts = this.posts.slice(start, start + this.paginator.pageSize)
  }

}
