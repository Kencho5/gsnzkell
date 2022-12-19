import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  postData = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    var type = this.activatedRoute.snapshot.paramMap.get("type");
    var text = this.activatedRoute.snapshot.paramMap.get("text");

    this.searchService.searchPost({'type': type, 'text': text}).subscribe((res) => {
      if(res['code'] == 200) {
        res['data'].forEach(post => {
            this.postData.push({
              id: post.id,
              type: post.postType,
              animal: post.animal,
              price: post.price,
              date: post.date.split('T')[0],
              img: post.imgs[0]
            });
        })
      }
    });
    console.log(this.postData)
  }

}
