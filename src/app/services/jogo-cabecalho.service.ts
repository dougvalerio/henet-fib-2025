import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { JogoCabecalho } from '../models/jogo-cabecalho';

@Injectable({
  providedIn: 'root'
})
export class JogoCabecalhoService {
  constructor(private http: HttpClient) { }

  // Cria um novo jogo cabeçalho com os dados fornecidos
  create(jogoCabecalho: JogoCabecalho): Observable<JogoCabecalho> {
    return this.http.post<JogoCabecalho>(`${API_CONFIG.baseUrl}/api/jogosCabecalhos`, jogoCabecalho);
  }

  // Busca um jogo cabeçalho específico pelo seu ID
  findById(id: any): Observable<JogoCabecalho> {
    return this.http.get<JogoCabecalho>(`${API_CONFIG.baseUrl}/api/jogosCabecalhos/${id}`);
  }

  // Retorna todos os jogos cabeçalhos disponíveis
  findAll(): Observable<JogoCabecalho[]> {
    return this.http.get<JogoCabecalho[]>(`${API_CONFIG.baseUrl}/api/jogosCabecalhos`);
  }

  // Exclui um jogo cabeçalho com base no ID
  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/api/jogosCabecalhos/${id}`);
  }
}