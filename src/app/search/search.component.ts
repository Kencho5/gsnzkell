import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  postData = {
    id: '',
    phone_number: '',
    facebook: '',
    instagram: '',
  }

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
            console.log(post)
        })
      }
    });
  }

}
