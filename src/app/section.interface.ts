import { GenericResponse } from './response.interface';

export interface Section {
  _id?: string;
  enabled: boolean;
  name?: string;
}

export interface SectionResponse extends GenericResponse {
  section?: Section;
}

export interface SectionsResponse extends GenericResponse {
  sections?: Section[];
}
