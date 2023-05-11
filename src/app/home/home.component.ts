import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { UploadService } from '../upload/upload.service';
import { TranslateService } from '@ngx-translate/core';
import citiesJson from '../../assets/i18n/cities.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
      

  }
  // posts = [];
  // vipPosts = [];
  // urls = [];
  // message: boolean;
  // form_msg: boolean;
  // cities = citiesJson.cities[this.translate.currentLang];

  // uploadForm = new FormGroup({
  //   animal: new FormControl('', Validators.required),
  //   breed: new FormControl('', Validators.required),
  //   price: new FormControl(''),
  //   age: new FormControl('', Validators.required),
  //   ageType: new FormControl('', Validators.required),
  //   description: new FormControl('', Validators.maxLength(200)),
  //   postType: new FormControl('', Validators.required),
  //   phone: new FormControl('', Validators.required),
  //   imgs: new FormControl('', Validators.required),
  //   city: new FormControl('', Validators.required),
  // });

  // searchForm = this.formBuilder.group({
  //   text: new FormControl(),
  // });

  // constructor(
  //   private homeService: HomeService,
  //   private formBuilder: FormBuilder,
  //   private router: Router,
  //   private uploadService: UploadService,
  //   public translate: TranslateService
  // ) {}

  // ngOnInit(): void {
  //   this.latestPosts();

  //   this.searchForm = new FormGroup({
  //     text: new FormControl('', [Validators.required]),
  //   });
  // }

  // latestPosts() {
  //   this.homeService.latestPosts().subscribe((res) => {
  //     if (res['code'] == 200) {
  //       this.posts = res['posts'];
  //       this.vipPosts = res['vipPosts'];
  //     }
  //   });
  // }

  // scrollLeft() {
  //   var div = document.getElementsByClassName(
  //     'latest-posts'
  //   )[0] as HTMLImageElement;

  //   div.scrollLeft -= div.offsetWidth;
  // }

  // scrollRight() {
  //   var div = document.getElementsByClassName(
  //     'latest-posts'
  //   )[0] as HTMLImageElement;

  //   div.scrollLeft += div.offsetWidth;
  // }

  // changeInput(event) {
  //   var priceInput = document.getElementById('price') as HTMLInputElement;
  //   if (event.target.value != 'Selling') {
  //     priceInput.style.display = 'none';
  //   } else {
  //     priceInput.style.display = 'block';
  //   }
  // }

  // selectFiles(event) {
  //   if (event.target.files) {
  //     if (event.target.files.length > 3 || this.urls.length > 3) {
  //       this.message = true;
  //       return;
  //     }
  //     this.message = false;
  //     for (var i = 0; i <= File.length; i++) {
  //       var reader = new FileReader();

  //       reader.readAsDataURL(event.target.files[i]);
  //       reader.onload = (event: any) => {
  //         this.urls.push(event.target.result);
  //       };
  //     }
  //   }
  // }

  // removeImage(event) {
  //   var tmp = [];
  //   this.urls.forEach((url) => {
  //     if (url != event.target.classList[2]) {
  //       tmp.push(url);
  //     }
  //   });
  //   this.urls = tmp;
  // }

  // upload() {
  //   if (localStorage.getItem('token') == null) {
  //     this.router.navigate(['/login']);
  //     return;
  //   }
  //   if (this.uploadForm.valid) {
  //     const data = {
  //       user: localStorage.getItem('token'),
  //       form: this.uploadForm.value,
  //       urls: this.urls,
  //     };

  //     this.uploadService.uploadPost(data).subscribe((res) => {
  //       if (res['code'] == 200) {
  //         this.router.navigate(['/post', res['id']]);
  //       }
  //     });
  //   } else {
  //     this.form_msg = true;
  //   }
  // }

  // openAll(event) {
  //   const animal = event.target.id;

  //   this.router.navigate(['/search', { animal: animal }]);
  // }
}
