import { Component, HostListener, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from './search.service';
// import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
  text: string;
  pageIndex = 1;
  count;
  time;
  filterError;
  pages = [];
  
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // pageEvent: PageEvent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) { }

  ngOnInit(): void {
    const bars = this.el.nativeElement.querySelector('.bars');
    const sidebar = this.el.nativeElement.querySelector('#Profile-sidebar');

    this.renderer.listen(bars, 'click', () => {
      sidebar.classList.toggle('active');
    });
    
    this.activatedRoute.params.subscribe(params => {
      this.text = params['text'];

      if(params['page']) {
        this.pageIndex = parseInt(params['page']);
      }

      this.searchPosts(this.pageIndex);
    });
  }

  searchPosts(pageIndex) {
    this.searchService.searchPost({
      text: this.text,
      filters: this.filterForm.value,
      pageIndex: this.pageIndex
    }).subscribe((res) => {
        if (res["code"] == 200) {
          this.posts = res['data'];
          this.count = res['count'];
          this.pages = this.numToArray(Math.ceil(res['count'] / 2));
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

      this.searchPosts(this.pageIndex);
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
    this.searchPosts(this.pageIndex);
  }

  closeFilter() {
    this.el.nativeElement.querySelector('#Profile-sidebar').classList.toggle('active');
  }

  changeInput(event) {
    var priceDiv = (document.getElementById('price-div') as HTMLDivElement);

    if(event.target.value != "Selling") {
      priceDiv.style.display = 'none';
    } else {
      priceDiv.style.display = 'block';
    }
  }

  pagination(event) {
    if(event.target.className == 'arrow-left' && this.pageIndex != 1) {
      this.pageIndex -= 1;
    } 

    else if(event.target.className == 'arrow-right' && this.pageIndex != this.pages.length) {
      this.pageIndex += 1;
    } 

    else if(event.target.classList[0] == 'pageNum') {
      this.pageIndex = parseInt(event.target.textContent);
    }
    
    this.searchPosts(this.pageIndex);
  
  }

  numToArray(x) {
    const result = [];
    for (let i = 1; i <= x; i++) {
      result.push(i);
    }
    return result;
  }

}
