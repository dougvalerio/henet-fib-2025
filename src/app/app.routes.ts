import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';

export const routes: Routes = [
  
  { path: 'home', component: HomeComponent },
  { path: 'cadastro', component: CadastroComponent },
  
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redireciona o caminho vazio para /home
  { path: '**', redirectTo: '/home' }, // Redireciona rotas inválidas para /home
];