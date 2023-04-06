import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['../login/login.component.scss', './reset.component.scss']
})
export class ResetComponent implements OnInit {
  message: boolean;

  resetForm = this.formBuilder.group({
    email: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  resetPass() {
    this.message = false;
    if(this.resetForm.valid) {

    } else {
      this.message = true;
    }
  }

}
