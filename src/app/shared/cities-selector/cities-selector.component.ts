import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CitiesService } from './cities.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cities-selector',
  templateUrl: './cities-selector.component.html',
  styleUrls: ['./cities-selector.component.scss'],
})
export class CitiesSelectorComponent {
  constructor(
    private citiesService: CitiesService,
    public translate: TranslateService
  ) {}

  @Input() controlName: string;
  @Input() form: FormGroup;
  @Input() currentCity: string;

  cities$: Observable<any>;

  ngOnInit() {
    this.cities$ = this.getCities();
  }

  getCities(): Observable<string[]> {
    return this.citiesService.getCities().pipe(
      map((res) => {
        return res.cities[this.translate.currentLang];
      })
    );
  }
}
