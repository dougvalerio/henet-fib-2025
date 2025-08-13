import { Resposta } from "./resposta";

export interface Cadastro {
  id?: any;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataRegistro: any;
  
  respostaList: Resposta[];
}


