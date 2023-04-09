import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { UploadService } from './upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss', '../responsive.css'],
})
export class UploadComponent implements OnInit {
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

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: UploadService,
    private router: Router,
    private login: LoginService
  ) {}

  ngOnInit(): void {
    this.login.isLoggedIn$.subscribe((res) => {
      if (res == false) {
        this.router.navigate(['/login']);
      }
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
    console.log(this.urls, this.uploadForm.value)
    if (this.urls.length != 3) {
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
