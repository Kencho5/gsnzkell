import { Component, Input } from '@angular/core';
import { LoginService } from 'app/login/login.service';

@Component({
  selector: 'app-service-cost',
  templateUrl: './service-cost.component.html',
  styleUrls: ['./service-cost.component.scss']
})
export class ServiceCostComponent {
  balance: number;
  freeUpload: boolean;
  @Input() serviceCost: number;

  constructor(
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.balance = this.loginService.user.balance;

    if(this.loginService.user['freeUpload']) {
      this.freeUpload = true;
    }
  }
}
