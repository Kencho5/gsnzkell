import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../login/login.service';
import { UploadFormService } from './upload-form.service';
import { TranslateService } from '@ngx-translate/core';
import jwtDecode from 'jwt-decode';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss', '../../responsive.css'],
})
export class UploadFormComponent {
  uploadForm = new FormGroup({
    animal: new FormControl('', Validators.required),
    breed: new FormControl('', Validators.required),
    price: new FormControl(''),
    ageYears: new FormControl(),
    ageMonths: new FormControl(),
    description: new FormControl('', Validators.maxLength(200)),
    postType: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    imgs: new FormControl(''),
    city: new FormControl('', Validators.required),
    days: new FormControl('', Validators.required),
  });

  urls = [];
  message: string;
  form_msg: string;
  cities;
  loggedIn: boolean;
  daysSelected = 0;
  vipSum = 0;

  customOptions: OwlOptions = {
    items: 1,
    dots: true,
    nav: true,
    loop: true,
    navText: ['<', '>'],
    autoplay: true,
    autoplayTimeout: 4500,
  };

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: UploadFormService,
    private router: Router,
    private login: LoginService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.login.user) {
      this.loggedIn = true;
    }
    this.uploadForm.get('days').disable();
  }

  selectFiles(event) {
    const files = event.target.files;
    if (!files) return;

    const urlsToLoad = Math.min(files.length, 3 - this.urls.length);
    for (let i = 0; i < urlsToLoad; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = (event: any) => {
        this.urls.push(event.target.result);
        if (this.urls.length === 3) {
          this.message = '';
        }
      };
    }
  }

  removeImage(event) {
    var tmp = [];
    this.urls.forEach((url) => {
      if (url != event.target.classList[2]) {
        tmp.push(url);
      }
    });
    this.urls = tmp;
  }

  upload() {
    const controls = this.uploadForm.controls;
    for (const name in controls) {
      const control = controls[name];
      const element = document.getElementById(name);
      const style = control.invalid ? '2px solid red' : '2px solid #54a0b2';
      element.style.border = style;
    }

    const ageYears = this.uploadForm.value.ageYears || 0;
    const ageMonths = this.uploadForm.value.ageMonths || 0;

    if (ageYears === 0 && ageMonths === 0) {
      this.form_msg = 'Fill Out The Form';
      return;
    }

    if (this.urls.length !== 3) {
      this.message = 'Only 3 Photos Required!';
      return;
    }

    if (this.uploadForm.valid) {
      const data = {
        user: localStorage.getItem('token'),
        form: this.uploadForm.value,
        urls: this.urls,
      };
      this.uploadService.uploadPost(data).subscribe((res) => {
        if (res['code'] === 200) {
          if (res['token']) {
            localStorage.setItem('token', res['token']);
          }
          this.router.navigate(['/post', res['id']]);
        } else {
          this.form_msg = 'Not Enough Balance!';
        }
      });
    } else {
      this.form_msg = 'Fill Out The Form';
    }
  }

  changeInput(event) {
    var priceInput = document.getElementById('price') as HTMLInputElement;
    if (event.target.value != 'Selling') {
      priceInput.style.display = 'none';
      this.uploadForm.value.price = '';
    } else {
      priceInput.style.display = 'block';
    }
  }

  unlockDays(event) {
    const daysSelector = document.getElementsByClassName(
      'days-selector'
    )[0] as HTMLElement;

    if (!event.target.checked) {
      this.uploadForm.get('days').disable();
      this.daysSelected = 0;
      daysSelector.style.display = 'none';

      return;
    }
    this.uploadForm.get('days').enable();
    daysSelector.style.display = 'block';
  }
}
