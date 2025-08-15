import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { Observable } from 'rxjs';
import { Titulo } from '../models/titulo';

@Injectable({
  providedIn: 'root'
})
export class TituloService {
  constructor(private http: HttpClient) { }

  create(titulo: Titulo): Observable<Titulo> {
    return this.http.post<Titulo>(`${API_CONFIG.baseUrl}/api/titulos`, titulo);
  }

  update(id: any, titulo: Titulo): Observable<Titulo> {
    return this.http.put<Titulo>(`${API_CONFIG.baseUrl}/api/titulos/${id}`, titulo);
  }

  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/api/titulos/${id}`);
  }

  findById(id: any): Observable<Titulo> {
    return this.http.get<Titulo>(`${API_CONFIG.baseUrl}/api/titulos/${id}`);
  }

  findAll(): Observable<Titulo[]> {
    return this.http.get<Titulo[]>(`${API_CONFIG.baseUrl}/api/titulos`);
  }

  uploadImage(id: any, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${API_CONFIG.baseUrl}/api/titulos/uploadImagem/${id}`, formData, { responseType: 'text' });
  }

  downloadImage(id: any): Observable<Blob> {
    return this.http.get(`${API_CONFIG.baseUrl}/api/titulos/downloadImagem/${id}`, { responseType: 'blob' });
  }

  deleteImage(id: any): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/api/titulos/deleteImagem/${id}`);
  }
}