import { Pergunta } from "./pergunta";

export interface Titulo {
  id?: string; // Opcional, pois é gerado pelo backend
  nome: string;
  imagemUrl?: string; // Opcional, pois pode não haver imagem
  perguntaList?: any[]; // Ajuste conforme o tipo correto das perguntas
}