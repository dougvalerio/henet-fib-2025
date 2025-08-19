import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CadastroService } from '../../services/cadastro.service';
import { Cadastro } from '../../models/cadastro';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  cadastro: Cadastro = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataRegistro: new Date(),
    jogoList: []
  };

  cpfError: string | null = null;
  cpfTouched: boolean = false;

  constructor(
    private router: Router,
    private cadastroService: CadastroService
  ) {}

  private isValidNumberInput(value: string, length: number): boolean {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.length === length;
  }

  private isValidCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCPF[i - 1]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF[9])) {
      return false;
    }

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

  validateCPF(): void {
    this.cpfTouched = true;
    const cleanCPF = this.cadastro.cpf.replace(/\D/g, '');
    
    if (cleanCPF.length === 0) {
      this.cpfError = null;
    } else if (cleanCPF.length < 11) {
      this.cpfError = 'CPF deve ter 11 dígitos';
    } else if (!this.isValidCPF(this.cadastro.cpf)) {
      this.cpfError = 'CPF inválido';
    } else {
      this.cpfError = null;
    }
  }

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
      this.cadastro.nome.trim() !== '' &&
      this.cadastro.email.trim() !== '' &&
      this.isValidNumberInput(this.cadastro.cpf, 11) &&
      isCPFValid &&
      this.isValidNumberInput(this.cadastro.telefone, 11)
    );
  }

  cadastrar() {
    if (this.isFormValid) {
      this.cadastroService.create(this.cadastro).subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso. Cadastro ID:', response.id, response.nome); // Log do cadastroId
          this.router.navigate(['/selecao-titulos'], {
            state: { cadastroId: response.id } // Passa o cadastroId no state
          });
        },
        error: (error) => {
          console.error('Erro ao realizar cadastro:', error);
          this.cpfError = 'Erro ao realizar cadastro. Tente novamente.';
        }
      });
    }
  }
}