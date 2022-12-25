import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { UploadService } from './upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  uploadForm = new FormGroup({
    animal:  new FormControl('', Validators.required),
    breed:  new FormControl('', Validators.required),
    price:  new FormControl(''),
    age:  new FormControl('', Validators.required),
    ageType:  new FormControl('', Validators.required),
    description:  new FormControl('', Validators.maxLength(200)),
    postType:  new FormControl('', Validators.required),
    phone:  new FormControl('', Validators.required),
    imgs:  new FormControl('', Validators.required),
    city:  new FormControl('', Validators.required)
  });

  urls = [];
  message: boolean;
  form_msg: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: UploadService,
    private router: Router,
    private login: LoginService
    ) { }

  ngOnInit(): void {
    this.login.isLoggedIn$.subscribe(res => {
      if(res == false) {
         this.router.navigate(['/login']);
      }
  });
  }

  selectFiles(event) {
    if(event.target.files) {
      if(event.target.files.length > 3 || this.urls.length > 3) {
        this.message = true;
        return;
      }
      this.message = false;
      for(var i = 0; i <= File.length; i++) {
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (event: any) => {
          this.urls.push(event.target.result)
        }
      }
    }
  }

  removeImage(event) {
    var tmp = [];
    this.urls.forEach(url => {
      if(url != event.target.classList[2]) {
        tmp.push(url)
      }
    });
    this.urls = tmp;
  }

  upload() {
    if(this.uploadForm.valid) {
      const data = {
        user: localStorage.getItem('token'),
        form: this.uploadForm.value,
        urls: this.urls
      }

      this.uploadService.uploadPost(data).subscribe((res) => {
        if (res["code"] == 200) {
          this.router.navigate(['/post', res['id']]);
        }
      });
    } else {
      this.form_msg = true;
    }
  }

  changeInput(event) {
    if(event.target.value != "selling") {
      event.path[2][3].style.display = 'none';
    } else {
      event.path[2][3].style.display = 'block';
    }
  }

}
