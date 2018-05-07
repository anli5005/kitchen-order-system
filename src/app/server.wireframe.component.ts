import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'koss-wireframe',
  templateUrl: 'server.wireframe.component.html',
})
export class ServerWireframeComponent {
  pageName: string = "";
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.url.subscribe((url) => {
      this.pageName = url[1].path;
    });
  }

  logOut() {
    sessionStorage.removeItem("kos_password");
    this.router.navigate(["/server"]);
  }
}
