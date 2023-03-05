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
    postType:  new FormControl('', Validators.required),
    city:  new FormControl(''),
    ageMin:  new FormControl('', Validators.required),
    ageMax:  new FormControl('', Validators.required),
    ageType:  new FormControl('', Validators.required),
    priceMin:  new FormControl('', Validators.required),
    priceMax: new FormControl('', Validators.required)
  });

  posts = [];
  postsLength;
  text: string;
  count;
  time;
  filterError;
  
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
      this.searchPosts()
    });
  }

  searchPosts() {
    this.searchService.searchPost({text: this.text, filters: this.filterForm.value}).subscribe((res) => {
        if (res["code"] == 200) {
          this.posts = res['data'];
          this.count = res['count'];
          this.time = res['time'];
        }
      });
  }

  openPost(id) {
    window.open(`/post/${id}`)
  }

  filter() {
    if(this.filterForm.valid) {
      this.filterError = '';

      this.searchPosts();
    } else {
      let errors = [];
      for(const invalid in this.filterForm.controls) {
        if(this.filterForm.controls[invalid].invalid) {
          errors.push(invalid);
        }
      }
      this.filterError = `Please fill: ${errors}`;
    }
  }

  resetFilters() {
    this.filterForm.reset({
      'animal': '',
      'postType': '',
      'city': '',
      'ageType': '',
      'ageMin': '',
      'ageMax': '',
      'priceMin': '',
      'priceMax': '',
    });
    this.searchPosts();
  }

  closeFilter() {
    this.el.nativeElement.querySelector('#Profile-sidebar').classList.toggle('active');
  }

}
