import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { Observable } from 'rxjs';
import { Pergunta } from '../models/pergunta';
import { PerguntaFilter } from '../models/perguntaFilter';

@Injectable({
  providedIn: 'root'
})
export class PerguntaService {
  constructor(private http: HttpClient) { }

  // Cria uma nova pergunta com os dados fornecidos
  create(pergunta: Pergunta): Observable<Pergunta> {
    return this.http.post<Pergunta>(`${API_CONFIG.baseUrl}/api/perguntas`, pergunta);
  }

  // Atualiza uma pergunta existente com base no ID e nos dados fornecidos
  update(id: any, pergunta: Pergunta): Observable<Pergunta> {
    return this.http.put<Pergunta>(`${API_CONFIG.baseUrl}/api/perguntas/${id}`, pergunta);
  }

  // Exclui uma pergunta com base no ID
  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/api/perguntas/${id}`);
  }

  // Busca uma pergunta específica pelo seu ID
  findById(id: any): Observable<Pergunta> {
    return this.http.get<Pergunta>(`${API_CONFIG.baseUrl}/api/perguntas/${id}`);
  }

  // Retorna todas as perguntas disponíveis
  //findAll(): Observable<Pergunta[]> {
  //  return this.http.get<Pergunta[]>(`${API_CONFIG.baseUrl}/api/perguntas`);
  //}

  findAll(filter?: PerguntaFilter): Observable<Pergunta[]> {
    let params = new HttpParams();

    if (filter?.tituloId !== undefined && filter.tituloId !== null) {
      params = params.set('tituloId', filter.tituloId.toString());
    }

    return this.http.get<Pergunta[]>(`${API_CONFIG.baseUrl}/api/perguntas`, { params });
  }
}