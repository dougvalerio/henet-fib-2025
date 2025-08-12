import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective],
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

  cpfError: string | null = null;
  cpfTouched: boolean = false; // Controla se o campo CPF foi interagido

  constructor(private router: Router) {}

  // Função para validar se o campo tem apenas números e o tamanho correto
  private isValidNumberInput(value: string, length: number): boolean {
    const cleanValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    return cleanValue.length === length;
  }

  // Função para validar CPF
  private isValidCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cleanCPF.length !== 11) {
      return false;
    }

    // Verifica se todos os dígitos são iguais (ex.: 11111111111)
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      return false;
    }

    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;

    // Primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCPF[i - 1]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF[9])) {
      return false;
    }

    // Segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanCPF[i - 1]) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF[10])) {
      return false;
    }

    return true;
  }

  // Valida o CPF ao perder o foco
  validateCPF(): void {
    this.cpfTouched = true; // Marca que o campo foi interagido
    const cleanCPF = this.cadastro.cpf.replace(/\D/g, '');
    
    if (cleanCPF.length === 0) {
      this.cpfError = null; // Não exibe erro se o campo está vazio
    } else if (cleanCPF.length < 11) {
      this.cpfError = 'CPF deve ter 11 dígitos';
    } else if (!this.isValidCPF(this.cadastro.cpf)) {
      this.cpfError = 'CPF inválido';
    } else {
      this.cpfError = null;
    }
  }

  // Verifica se todos os campos estão preenchidos e válidos
  get isFormValid(): boolean {
    const cleanCPF = this.cadastro.cpf.replace(/\D/g, '');
    let isCPFValid = true;

    if (cleanCPF.length > 0) {
      isCPFValid = this.isValidCPF(this.cadastro.cpf);
      if (this.cpfTouched) {
        this.cpfError = isCPFValid ? null : cleanCPF.length < 11 ? 'CPF deve ter 11 dígitos' : 'CPF inválido';
      }
    }

    return (
      this.cadastro.nomeCompleto.trim() !== '' &&
      this.cadastro.email.trim() !== '' &&
      this.isValidNumberInput(this.cadastro.cpf, 11) && // CPF deve ter 11 dígitos
      isCPFValid &&
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