import { JogoCabecalho } from "./jogo-cabecalho";

export interface Cadastro {
  id?: any;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataRegistro: any;
  jogoList: JogoCabecalho[];
}