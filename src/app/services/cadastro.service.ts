import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Cadastro } from '../models/cadastro';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  constructor(private http: HttpClient) { }

  // Cria um novo cadastro com os dados fornecidos
  create(cadastro: Cadastro): Observable<Cadastro> {
    return this.http.post<Cadastro>(`${API_CONFIG.baseUrl}/api/cadastros`, cadastro);
  }

  // Busca um cadastro específico pelo seu ID
  findById(id: any): Observable<Cadastro> {
    return this.http.get<Cadastro>(`${API_CONFIG.baseUrl}/api/cadastros/${id}`);
  }

  // Retorna todos os cadastros disponíveis
  findAll(): Observable<Cadastro[]> {
    return this.http.get<Cadastro[]>(`${API_CONFIG.baseUrl}/api/cadastros/all`);
  }

  // Exclui um cadastro com base no ID
  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/api/cadastros/${id}`);
  }
}