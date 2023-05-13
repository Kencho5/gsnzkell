import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { LoginService } from 'app/login/login.service';
import { BalanceService } from './balance.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss', '../login/login.component.scss'],
})
export class BalanceComponent {
  constructor(
    private formBuilder: FormBuilder,
    private balanceService: BalanceService,
    private login: LoginService
  ) {}

  amountForm = new FormGroup({
    amount: new FormControl('', Validators.required),
  });

  message: string;

  pay() {
    if(parseInt(this.amountForm.value.amount) < 1) {
      this.message = "Minimum 1 GEL.";
      return;
    }

    this.balanceService.pay({
      amount: this.amountForm.value.amount,
      user: this.login.user
    }).subscribe((res) => {
      if (res['code'] === 200) {
        window.open(res.url, "_self");
      } else {
        this.message = 'Payment Error.';
      }
    });
  }
}
