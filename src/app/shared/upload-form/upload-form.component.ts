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

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss', '../../responsive.css']
})
export class UploadFormComponent {
  uploadForm = new FormGroup({
    animal: new FormControl('', Validators.required),
    breed: new FormControl('', Validators.required),
    price: new FormControl(''),
    age: new FormControl('', Validators.required),
    ageType: new FormControl('', Validators.required),
    description: new FormControl('', Validators.maxLength(200)),
    postType: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    imgs: new FormControl(''),
    city: new FormControl('', Validators.required),
  });

  urls = [];
  message: string;
  form_msg: string;
  uploadLoading: boolean;
  cities;
  loggedIn: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: UploadFormService,
    private router: Router,
    private login: LoginService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getCities();

    if(this.login.user) {
      this.loggedIn = true;
    }
  }

  getCities() {
    this.uploadService.getCities().subscribe((res) => {
      this.cities = res.cities[this.translate.currentLang];
    });
  }

  selectFiles(event) {
    if (event.target.files) {
      for (var i = 0; i <= File.length; i++) {
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
        };
      }
      if (this.urls.length == 3) {
        this.message = '';
      }
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
    console.log(this.uploadForm.value.city)
    this.uploadLoading = false;

    if (this.urls.length != 3) {
      this.message = 'Only 3 Photos Required!';
      return;
    }

    if (this.uploadForm.valid) {
      this.uploadLoading = true;

      const data = {
        user: localStorage.getItem('token'),
        form: this.uploadForm.value,
        urls: this.urls,
      };

      this.uploadService.uploadPost(data).subscribe((res) => {
        if (res['code'] == 200) {
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
    } else {
      priceInput.style.display = 'block';
    }
  }

}
