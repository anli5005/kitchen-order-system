import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericResponse } from './response.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'koss-login',
  templateUrl: './server.login.component.html',
})
export class ServerLoginComponent {
  checking: boolean = false;
  password: string = null;

  constructor(private http: HttpClient, private router: Router) {
    this.password = sessionStorage.getItem("kos_password");
    if (this.password) {
      this.logIn();
    }
  }

  logIn() {
    this.checking = true;
    this.http.get<GenericResponse>("/api/v1/server", {headers: new HttpHeaders({"Authorization": this.password})}).subscribe((response: GenericResponse) => {
      if (response.ok) {
        sessionStorage.setItem("kos_password", this.password);
        this.router.navigate(["/server/menu"]);
      } else {
        this.checking = false;
      }
    }, (e) => {
      this.checking = false;
    });
  }
}
