import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  message: string;

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
    const email = this.resetForm.value['email'];
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http.post('https://formspree.io/f/xpznvdyn',
        { name: 'Pender', replyto: email, message: "DASDASDSADSA" },
        { 'headers': headers }).subscribe(
          response => {
            console.log(response);
          }
        );
  }

}
