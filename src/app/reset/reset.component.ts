import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ResetService } from './reset.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['../login/login.component.scss', './reset.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ResetComponent implements OnInit {
  message: boolean;
  step = 1;
  codeMessage = false;

  resetForm: FormGroup;
  codeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private resetService: ResetService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.codeForm = this.formBuilder.group({
      code: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  sendCode() {
    this.message = false;

    if (this.resetForm.valid) {
      const email = this.resetForm.value.email;
      this.resetService.sendEmail({ email }).subscribe((res) => {
        if (res['code'] === 200) {
          this.step = 2;
        }
      });
    } else {
      this.message = true;
    }
  }

  resetPass() {
    this.message = false;

    if (this.codeForm.valid) {
      const code = this.codeForm.value.code;
      const password = this.codeForm.value.password;

      this.resetService.checkCode({ code, password }).subscribe((res) => {
        if (res['code'] === 200) {
          this.router.navigate(['/login']);
        } else {
          this.codeMessage = true;
        }
      });
    } else {
      this.message = true;
    }
  }

}
