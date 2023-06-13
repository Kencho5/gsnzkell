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
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  searchForm = this.formBuilder.group({
    text: new FormControl(),
  });

  posts = [];
  text: string;
  count;
  time;
  supportedLanguages = ['en', 'ge'];
  currentLanguage: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public loginService: LoginService,
    private el: ElementRef,
    private renderer: Renderer2,
    private searchService: SearchService,
    private translate: TranslateService,
    private elementRef: ElementRef
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

    const bar = this.elementRef.nativeElement.querySelector('#bar');
    const nav = this.elementRef.nativeElement.querySelector('.nav');

    this.renderer.listen(bar, 'click', () => {
      bar.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }

  search() {
    if (this.searchForm.valid) {
      // this.router.navigate(['/search', { text: this.searchForm.value.text }]);
      window.open(`/search;text=${this.searchForm.value.text}`, '_self');
    }
  }


  logoutFunction() {
    localStorage.removeItem('token');
  }

  openModal() {
    document.querySelector('.profile-dropdown').classList.toggle('active');
  }

}
