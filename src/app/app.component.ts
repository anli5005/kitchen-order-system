import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: '<div class="d-block container-fluid h-100 bg-dark p-0"><router-outlet></router-outlet></div>',
  styleUrls: ['./app.component.css', './bootstrap.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'app';
  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
