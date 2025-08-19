import { JogoCabecalho } from "./jogo-cabecalho";

export interface JogoDetalhe {
  id?: any; 
  jogoCabecalho: JogoCabecalho;
  pergunta: number;
  resposta: number;
  dataResposta: any; 
}