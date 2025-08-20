import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Cadastro } from '../models/cadastro';
import { CadastroFilter } from '../models/cadastroFilter';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  constructor(private http: HttpClient) { }

  // Cria um novo cadastro com os dados fornecidos
  create(cadastro: Cadastro): Observable<Cadastro> {
    return this.http.post<Cadastro>(`${API_CONFIG.baseUrl}/api/cadastros`, cadastro);
  }

  // Atualiza um cadastro existente com base no ID
  update(id: any, cadastro: Cadastro): Observable<Cadastro> {
    return this.http.put<Cadastro>(`${API_CONFIG.baseUrl}/api/cadastros/${id}`, cadastro);
  }

  // Busca um cadastro específico pelo seu ID
  findById(id: any): Observable<Cadastro> {
    return this.http.get<Cadastro>(`${API_CONFIG.baseUrl}/api/cadastros/${id}`);
  }

  // Retorna todos os cadastros disponíveis com filtro opcional
  findAll(filter?: CadastroFilter): Observable<Cadastro[]> {
    let params = new HttpParams();

    if (filter?.pesquisa !== undefined && filter.pesquisa !== null) {
      params = params.set('pesquisa', filter.pesquisa);
    }

    return this.http.get<Cadastro[]>(`${API_CONFIG.baseUrl}/api/cadastros`, { params });
  }

  // Exclui um cadastro com base no ID
  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/api/cadastros/${id}`);
  }
}