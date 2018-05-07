import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { IntroComponent } from './intro.component';
import { HomeComponent } from './home.component';
import { SeatComponent } from './seat.component';
import { ServerLoginComponent } from './server.login.component';
import { ServerMenuComponent } from './server.menu.component';
import { ServerWireframeComponent } from './server.wireframe.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const appRoutes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "seat",
    component: SeatComponent
  },
  {
    path: "server",
    component: ServerLoginComponent
  },
  {
    path: "server/menu",
    component: ServerMenuComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    IntroComponent,
    SeatComponent,
    ServerLoginComponent,
    ServerMenuComponent,
    ServerWireframeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
