import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private apiUrl = `${API_CONFIG.baseUrl}/api/cadastros`;

  constructor(private http: HttpClient) { }

  // Headers para requisições
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Método para buscar todos os cadastros
  getAllCadastros(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Método para buscar cadastro por ID
  getCadastroById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Método para buscar o timestamp do último cadastro
  getLastUpdatedTimestamp(): Observable<any> {
    return this.http.get(`${this.apiUrl}/last-updated`);
  }

  // Método para criar um novo cadastro
  createCadastro(cadastro: any): Observable<any> {
    return this.http.post(this.apiUrl, cadastro, this.httpOptions);
  }

  // Método para deletar um cadastro
  deleteCadastro(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}