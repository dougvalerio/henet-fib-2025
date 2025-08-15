import { Pergunta } from "./pergunta";

export interface Titulo {
  id?: any;
  nome: string;
  imagemUrl: any;
  perguntaList: Pergunta[];
}

