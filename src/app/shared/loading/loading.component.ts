import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  isLoading = true;

  ngOnInit() {
    window.addEventListener('load', () => {
      this.isLoading = false;
    });
  }
}
