import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { SelecaoTitulosComponent } from './components/selecao-titulos/selecao-titulos.component';
import { PerguntasComponent } from './components/perguntas/perguntas.component';
import { TitulosListComponent } from './components/cadastro-titulos/titulos-list/titulos-list.component';
import { PopupResultadoRespostaComponent } from './components/popup-resultado-resposta/popup-resultado-resposta.component';
import { PerguntasListComponent } from './components/cadastro-perguntas/perguntas-list/perguntas-list.component';
import { RegulamentoComponent } from './components/regulamento/regulamento.component';

export const routes: Routes = [
  
  { path: 'home', component: HomeComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'selecao-titulos', component: SelecaoTitulosComponent },
  { path: 'titulos-list', component: TitulosListComponent },
  { path: 'perguntas', component: PerguntasComponent },
  { path: 'perguntas-list', component: PerguntasListComponent },
  { path: 'popup-resultado-resposta', component: PopupResultadoRespostaComponent },
  { path: 'regulamento', component: RegulamentoComponent },
  
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redireciona o caminho vazio para /home
  { path: '**', redirectTo: '/home' }, // Redireciona rotas inválidas para /home
];