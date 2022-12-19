import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchForm = this.formBuilder.group({
    text:  new FormControl(),
    type:  new FormControl()
  });

  constructor(
    private homeService: HomeService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      text: new FormControl('', [Validators.required]),
      type: new FormControl('', Validators.required)
   });
  }

  search() {
    if(this.searchForm.valid) {
      this.router.navigate(['/search', {type: this.searchForm.value.type, text: this.searchForm.value.text}]);
    }
  }

}
