import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { BalanceService } from './balance.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss', '../login/login.component.scss'],
})
export class BalanceComponent {
  constructor(
    private formBuilder: FormBuilder,
    private balanceService: BalanceService
  ) {}

  amountForm = new FormGroup({
    amount: new FormControl('', Validators.required),
  });

  message: string;

  pay() {
    this.balanceService.pay(this.amountForm.value).subscribe((res) => {
      if (res['code'] === 200) {
        console.log(res)
      } else {
        this.message = 'Payment Error.';
      }
    });
  }
}
