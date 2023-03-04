import { Component, HostListener, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from './search.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss', '../responsive.css']
})
export class SearchComponent implements OnInit {
  filterForm = new FormGroup({
    animal:  new FormControl(''),
    postType:  new FormControl(''),
    city:  new FormControl(''),
    ageMin:  new FormControl(''),
    ageMax:  new FormControl(''),
    ageType:  new FormControl(''),
    priceMin:  new FormControl(''),
    priceMax: new FormControl('')
  });

  posts = [];
  postsLength;
  text: string;
  count;
  time;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  pageEvent: PageEvent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    const bars = this.el.nativeElement.querySelector('.bars');
    const sidebar = this.el.nativeElement.querySelector('#Profile-sidebar');

    this.renderer.listen(bars, 'click', () => {
      sidebar.classList.toggle('active');
    });
    
    this.activatedRoute.params.subscribe(params => {
      this.text = params['text'];
      this.searchService.searchPost({text: this.text}).subscribe((res) => {
      if (res["code"] == 200) {
        this.posts = res['data'];
        console.log(this.posts)
        this.count = res['count'];
        this.time = res['time'];
      }
    });
    });
    
  }

  openPost(id) {
    window.open(`/post/${id}`)
  }

  filter() {
    console.log(this.filterForm.value)
  }

  closeFilter() {
    this.el.nativeElement.querySelector('#Profile-sidebar').classList.toggle('active');
  }

}
