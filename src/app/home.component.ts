import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kos-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(public translate: TranslateService) {}

  selectLanguage(language: string) {
    this.translate.use(language);
  }
}
