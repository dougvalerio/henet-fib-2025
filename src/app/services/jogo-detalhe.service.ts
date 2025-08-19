import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { JogoDetalhe } from '../models/jogo-detalhe';

@Injectable({
  providedIn: 'root'
})
export class JogoDetalheService {
  constructor(private http: HttpClient) { }

  // Cria um novo jogo detalhe com os dados fornecidos
  create(jogoDetalhe: JogoDetalhe): Observable<JogoDetalhe> {
    return this.http.post<JogoDetalhe>(`${API_CONFIG.baseUrl}/api/jogosDetalhes`, jogoDetalhe);
  }

  // Busca um jogo detalhe específico pelo seu ID
  findById(id: any): Observable<JogoDetalhe> {
    return this.http.get<JogoDetalhe>(`${API_CONFIG.baseUrl}/api/jogosDetalhes/${id}`);
  }

  // Retorna todos os jogos detalhes disponíveis
  findAll(): Observable<JogoDetalhe[]> {
    return this.http.get<JogoDetalhe[]>(`${API_CONFIG.baseUrl}/api/jogosDetalhes`);
  }

  // Exclui um jogo detalhe com base no ID
  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/api/jogosDetalhes/${id}`);
  }
}