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
  constructor(private login: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.login.isLoggedIn$.subscribe((res) => {
      if (res == false) {
        this.router.navigate(['/login']);
      }
    });
  }
}
