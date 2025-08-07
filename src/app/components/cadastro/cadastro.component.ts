import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  cadastro = {
    nomeCompleto: '',
    cpf: '',
    email: '',
    telefone: ''
  };

  constructor(private router: Router) {}

  cadastrar() {
    console.log('Dados do cadastro:', this.cadastro);
    this.router.navigate(['/selecao-titulos']);
  }
}