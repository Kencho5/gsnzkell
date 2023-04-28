import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'app/login/login.service';
import { Subscription } from 'rxjs';
import { PaymentStatusService } from './payment-status.service';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: [
    './payment-status.component.scss',
    '../login/login.component.scss',
  ],
})
export class PaymentStatusComponent {
  constructor(
    private route: ActivatedRoute,
    private paymentStatusService: PaymentStatusService,
    private login: LoginService
  ) {}

  message: string;
  paymentId: string;
  private routeSub: Subscription;

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.paymentId = params['id'];
      this.paymentStatus();
    });
  }

  paymentStatus() {
    this.paymentStatusService
      .checkStatus({
        paymentId: this.paymentId,
        email: this.login.user.email
      })
      .subscribe((res) => {
        if (res['code'] === 200) {
          this.message = "Payment Successful!";
          localStorage.setItem('token', res['token']);
        } else {
          this.message = 'Payment Error.';
        }
      });
  }
}
