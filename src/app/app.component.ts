import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { LoginService } from './login/login.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from './search/search.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './responsive.css'],
})
export class AppComponent {
  filterForm = new FormGroup({
    animal: new FormControl(''),
    postType: new FormControl('', Validators.required),
    city: new FormControl(''),
    ageMin: new FormControl('', Validators.required),
    ageMax: new FormControl('', Validators.required),
    ageType: new FormControl('', Validators.required),
    priceMin: new FormControl('', Validators.required),
    priceMax: new FormControl('', Validators.required),
  });

  searchForm = this.formBuilder.group({
    text: new FormControl(),
  });

  posts = [];
  postsLength;
  text: string;
  count;
  time;
  filterError;
  isLoading = true;
  supportedLanguages = ['en', 'ge'];
  currentLanguage: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public loginService: LoginService,
    private el: ElementRef,
    private renderer: Renderer2,
    private searchService: SearchService,
    private translate: TranslateService
  ) {
    // Set the default language
    translate.setDefaultLang('ge');
  }

  ngOnInit(): void {
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', 'ge');
    }

    this.searchForm = new FormGroup({
      text: new FormControl('', [Validators.required]),
    });

    if (localStorage.getItem('token')) {
      var ts = jwtDecode(localStorage.getItem('token'))['exp'];
      var exp = new Date(ts * 1000).getDate() - new Date().getDate();

      if (exp == 0) {
        localStorage.removeItem('token');
      }
    }
  }

  ngAfterViewInit() {
    this.isLoading = false;
  }

  search() {
    if (this.searchForm.valid) {
      this.router.navigate(['/search', { text: this.searchForm.value.text }]);
    }
  }

  filter() {
    if (this.filterForm.valid) {
      this.filterError = '';

      this.searchService
        .searchPost({ text: this.text, filters: this.filterForm.value })
        .subscribe((res) => {
          if (res['code'] == 200) {
            this.posts = res['data'];
            this.count = res['count'];
            this.time = res['time'];
          }
        });
    } else {
      let errors = [];
      for (const invalid in this.filterForm.controls) {
        if (this.filterForm.controls[invalid].invalid) {
          errors.push(invalid);
        }
      }
      this.filterError = `Please fill: ${errors}`;
    }
  }

  logoutFunction() {
    localStorage.removeItem('token');
  }

  openModal() {
    document.querySelector('.profile-dropdown').classList.toggle('active');
  }

  closeFilter() {
    this.el.nativeElement
      .querySelector('.search-filter')
      .classList.remove('active');
  }
}
