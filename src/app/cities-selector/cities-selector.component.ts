import { Component } from '@angular/core';
import citiesJson from '../../assets/i18n/cities.json';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cities-selector',
  templateUrl: './cities-selector.component.html',
  styleUrls: ['./cities-selector.component.scss']
})
export class CitiesSelectorComponent {
  cities = citiesJson.cities[this.translate.currentLang];

  constructor(
    public translate: TranslateService
  ) {}

}
