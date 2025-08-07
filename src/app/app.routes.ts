import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redireciona o caminho vazio para /home
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '/home' } // Redireciona rotas inválidas para /home
];