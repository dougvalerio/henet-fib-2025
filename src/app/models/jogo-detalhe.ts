import { JogoCabecalho } from "./jogo-cabecalho";

export interface JogoDetalhe {
  id?: any; 
  jogoCabecalho: any;
  pergunta: number;
  resposta: number | null; // Alterado para permitir null
  dataResposta: any; 
}