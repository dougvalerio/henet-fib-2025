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

  // Cria um novo título com os dados fornecidos
  create(titulo: Titulo): Observable<Titulo> {
    return this.http.post<Titulo>(`${API_CONFIG.baseUrl}/titulos`, titulo);
  }

  // Atualiza um título existente com base no ID e nos dados fornecidos
  update(id: any, titulo: Titulo): Observable<Titulo> {
    return this.http.put<Titulo>(`${API_CONFIG.baseUrl}/titulos/${id}`, titulo);
  }

  // Exclui um título com base no ID
  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/titulos/${id}`);
  }

  // Busca um título específico pelo seu ID
  findById(id: any): Observable<Titulo> {
    return this.http.get<Titulo>(`${API_CONFIG.baseUrl}/titulos/${id}`);
  }

  // Retorna todos os títulos disponíveis
  findAll(): Observable<Titulo[]> {
    return this.http.get<Titulo[]>(`${API_CONFIG.baseUrl}/titulos`);
  }

  // Faz o upload de uma imagem para criar um novo título
  uploadImage(file: File): Observable<Titulo> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Titulo>(`${API_CONFIG.baseUrl}/titulos`, formData);
  }

  // Faz o download da imagem associada a um título pelo seu ID
  downloadImage(id: any): Observable<Blob> {
    return this.http.get(`${API_CONFIG.baseUrl}/titulos/${id}/imagem`, { responseType: 'blob' });
  }
}