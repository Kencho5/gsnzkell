import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent {
  supportedLanguages = ['en', 'ge'];
  currentLanguage: string;
  showDropdown = false;

  constructor(private translate: TranslateService) {
    // this.currentLanguage = this.translate.currentLang;
  }

  ngOnInit() {
    this.translate.use(localStorage.getItem('lang'));
    this.currentLanguage = localStorage.getItem('lang');
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectLanguage(event) {
    const lang = event.target.id;

    if (lang == '') {
      return;
    }

    localStorage.setItem('lang', lang);

    this.translate.use(lang);
    this.currentLanguage = lang;
    this.showDropdown = false;
  }
}
