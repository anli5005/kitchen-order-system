import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { GenericResponse, PostResponse } from './response.interface';
import { Section, SectionResponse, SectionsResponse } from './section.interface';
import { Observable, forkJoin } from 'Rxjs';

interface Names {
  [index: string]: string;
}

@Component({
  selector: 'koss-menu',
  templateUrl: './server.menu.component.html',
})
export class ServerMenuComponent {
  sections: Section[] = [];
  selectedSection: Section = null;
  selectedLanguage: string = "en";
  names: Names = {};
  private password: string = sessionStorage.getItem("kos_password");

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {
    this.refresh();
    this.selectLanguage(this.translate.currentLang);
  }

  refresh() {
    const password = sessionStorage.getItem("kos_password");
    this.http.get<SectionsResponse>("/api/v1/menu/sections?language=" + this.translate.currentLang).subscribe((response) => {
      if (response.ok) {
        this.sections = response.sections;
      }
    });
  }

  newSection() {
    this.names = {};
    this.selectedSection = {enabled: true};
  }

  editSection(section: Section) {
    this.names = {};
    this.selectedSection = section;
    this.selectLanguage(this.selectedLanguage);
  }

  cancelSection() {
    this.selectedSection = null;
  }

  saveNames(id: string): Observable<GenericResponse[]> {
    return forkJoin(Object.keys(this.names).map((lang) => {
      return this.http.put<GenericResponse>(`/api/v1/menu/sections/${id}/${lang}`, {name: this.names[lang]}, {headers: new HttpHeaders({"Authorization": this.password})});
    }));
  }

  saveSection() {
    if (this.selectedSection._id) {
      this.http.put<GenericResponse>(`/api/v1/menu/sections/${this.selectedSection._id}/enabled`, {enabled: this.selectedSection.enabled}, {headers: new HttpHeaders({"Authorization": this.password})}).subscribe((response) => {
        if (response.ok) {
          this.saveNames(this.selectedSection._id).subscribe((res) => {
            this.refresh();
            this.cancelSection();
          });
        }
      });
    } else {
      this.http.post<PostResponse>("/api/v1/menu/sections", {enabled: this.selectedSection.enabled}, {headers: new HttpHeaders({"Authorization": this.password})}).subscribe((response) => {
        if (response.ok) {
          this.saveNames(response.id).subscribe((res) => {
            this.refresh();
            this.cancelSection();
          });
        }
      });
    }
  }

  deleteSection() {
    this.http.delete<GenericResponse>(`/api/v1/menu/sections/${this.selectedSection._id}`, {headers: new HttpHeaders({"Authorization": this.password})}).subscribe((response) => {
      if (response.ok) {
        this.refresh();
        this.cancelSection();
      }
    });
  }

  selectLanguage(language) {
    this.selectedLanguage = language;
    if (this.selectedSection && this.selectedSection._id) {
      this.http.get<SectionResponse>(`/api/v1/menu/sections/${this.selectedSection._id}?language=${language}`, {headers: new HttpHeaders({"Authorization": this.password})}).subscribe((response) => {
        if (response.ok) {
          this.names[language] = response.section.name;
        }
      });
    }
  }
}
