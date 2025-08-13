import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class PerguntaService {
  private apiUrl = `${API_CONFIG.baseUrl}/api/perguntas`;

  constructor(private http: HttpClient) { }

  // Headers para requisições
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Método para buscar todas as perguntas
  getAllPerguntas(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Método para buscar pergunta por ID
  getPerguntaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Método para buscar o timestamp da última pergunta
  getLastUpdatedTimestamp(): Observable<any> {
    return this.http.get(`${this.apiUrl}/last-updated`);
  }

  // Método para criar uma nova pergunta
  createPergunta(pergunta: any): Observable<any> {
    return this.http.post(this.apiUrl, pergunta, this.httpOptions);
  }

  // Método para deletar uma pergunta
  deletePergunta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}