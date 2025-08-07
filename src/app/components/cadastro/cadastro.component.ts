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

  // Função para validar se o campo tem apenas números e o tamanho correto
  private isValidNumberInput(value: string, length: number): boolean {
    const cleanValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    return cleanValue.length === length;
  }

  // Verifica se todos os campos estão preenchidos e válidos
  get isFormValid(): boolean {
    return (
      this.cadastro.nomeCompleto.trim() !== '' &&
      this.cadastro.email.trim() !== '' &&
      this.isValidNumberInput(this.cadastro.cpf, 11) && // CPF deve ter 11 dígitos
      this.isValidNumberInput(this.cadastro.telefone, 11) // Telefone deve ter 11 dígitos
    );
  }

  cadastrar() {
    if (this.isFormValid) {
      console.log('Dados do cadastro:', this.cadastro);
      this.router.navigate(['/selecao-titulos']);
    }
  }
}