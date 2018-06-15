export interface GenericResponse {
  ok: boolean;
  error?: string;
}

export interface PostResponse extends GenericResponse {
  id: string;
}
