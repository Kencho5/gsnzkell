import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss', '../../responsive.css'],
})
export class FooterComponent {
  ngAfterViewInit() {
    const script = document.createElement('script');
    script.src = '//counter.top.ge/counter.js';
    script.defer = true;
    document.body.appendChild(script);
  }
}
