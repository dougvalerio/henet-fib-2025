import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { JogoCabecalho } from '../models/jogo-cabecalho';
import { TitulosSelecionados } from '../models/titulosSelecionados';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient) { }

  // Inicia um novo jogo enviando os títulos selecionados
  startGame(titulosSelecionados: TitulosSelecionados): Observable<JogoCabecalho> {
    return this.http.post<JogoCabecalho>(`${API_CONFIG.baseUrl}/api/game/start`, titulosSelecionados)
      .pipe(
        tap(response => {
          console.log('Resposta do serviço /api/game/start:', response);
        })
      );
  }
}