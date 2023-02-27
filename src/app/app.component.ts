import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { LoginService } from './login/login.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './responsive.css']
})
export class AppComponent {

  searchForm = this.formBuilder.group({
    text:  new FormControl()
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public loginService: LoginService,
    private el: ElementRef,
    private renderer: Renderer2
    ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      text: new FormControl('', [Validators.required])
   });

    const filterIcon = this.el.nativeElement.querySelector('.filterIcon');
    const searchFilter = this.el.nativeElement.querySelector('.search-filter');
    
    this.renderer.listen(filterIcon, 'click', () => {
      searchFilter.classList.toggle('active');
    });


    if(localStorage.getItem('token')) {
      var ts = jwtDecode(localStorage.getItem('token'))['exp'];
      var exp = new Date(ts * 1000).getDate() - new Date().getDate();
  
      if(exp == 0) {
        localStorage.removeItem('token');
      }
    }
  }

 search() {
    if(this.searchForm.valid) {
      this.router.navigate(['/search', {text: this.searchForm.value.text}]);
    }
  }

  logoutFunction() {
    localStorage.removeItem('token');
  }

  openModal() {
     document.querySelector('.profile-dropdown').classList.toggle('active')
  }
}
