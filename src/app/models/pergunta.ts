import { Titulo } from "./titulo";

export interface Pergunta {
  id?: any; // Opcional, gerado pelo backend
  pergunta: string;
  respostaA: string;
  respostaB: string;
  respostaC: string;
  respostaD: string;
  respostaCorreta: number | null; // 0, 1, 2 ou 3 para respostas A, B, C, D
  titulo: Titulo; // Deve ser um objeto Titulo ou null
}