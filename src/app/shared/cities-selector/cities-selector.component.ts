import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CitiesSelectorService } from './cities-selector.service';

@Component({
  selector: 'app-cities-selector',
  templateUrl: './cities-selector.component.html',
  styleUrls: ['../upload-form/upload-form.component.scss'],
})
export class CitiesSelectorComponent {
  // cities = citiesJson.cities[this.translate.currentLang];
  cities;

  constructor(
    public translate: TranslateService,
    private citiesSelectorService: CitiesSelectorService
  ) {}

  ngOnInit() {
    this.getCities();
  }

  getCities() {
    this.citiesSelectorService.getCities().subscribe((res) => {
      this.cities = res.cities[this.translate.currentLang];
    });
  }
}
