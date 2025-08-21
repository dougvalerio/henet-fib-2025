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
    vencedor: false,
    jogoList: []
  };

  cpfError: string | null = null;
  cpfTouched: boolean = false;

  constructor(
    private router: Router,
    private cadastroService: CadastroService
  ) {}

  restrictToNumbers(event: KeyboardEvent): void {
    const charCode = event.charCode || event.keyCode;
    // Permite apenas dígitos (0-9) e teclas de controle (backspace, tab, etc.)
    if (charCode < 48 || charCode > 57) {
      if (![8, 9, 13, 37, 39, 46].includes(charCode)) { // Backspace, Tab, Enter, Setas, Delete
        event.preventDefault();
      }
    }
  }

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

  // cadastrar() {
  //   if (this.isFormValid) {
  //     this.cadastroService.create(this.cadastro).subscribe({
  //       next: (response) => {
  //         console.log('Cadastro realizado com sucesso:', JSON.stringify(response, null, 2));
  //         this.router.navigate(['/selecao-titulos'], {
  //           state: { cadastroId: response.id }
  //         });
  //       },
  //       error: (error) => {
  //         console.error('Erro ao realizar cadastro:', JSON.stringify(error, null, 2));
  //         this.cpfError = 'Erro ao realizar cadastro. Tente novamente.';
  //       }
  //     });
  //   }
  // }

  loading = false;

  cadastrar() {
    // Verifica se o formulário é válido e se não está carregando
    if (this.isFormValid && !this.loading) {
      this.loading = true; // Ativa o estado de carregamento
  
      this.cadastroService.create(this.cadastro).subscribe({
        next: (response: Cadastro) => {
          // Cadastro realizado com sucesso
          console.log('Cadastro realizado com sucesso:', JSON.stringify(response, null, 2));
  
          // Navega para a próxima página com o ID do cadastro
          this.router.navigate(['/selecao-titulos'], {
            state: { cadastroId: response.id }
          });
        },
        error: (error: any) => {
          // Desativa o loading em caso de erro
          this.loading = false;
  
          // Log detalhado do erro (útil para depuração)
          console.error('Erro ao realizar cadastro:', JSON.stringify(error, null, 2));
  
          // Limpa mensagens antigas
          this.cpfError = '';
  
          // === Tratamento específico para cadastro já existente nos últimos 9h ===
          if (error.status === 409 && error.error && error.error.cadastroExistente) {
            const cadastroExistente = error.error.cadastroExistente;
            const dataRegistro = new Date(cadastroExistente.dataRegistro);
  
            // Verifica se a data é válida
            if (isNaN(dataRegistro.getTime())) {
              this.cpfError = 'Erro: data do cadastro inválida.';
              return;
            }
  
            // Formata apenas a hora: HH:mm
            const hora = dataRegistro.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            });
  
            // Mensagem clara para o usuário
            this.cpfError = `Você já realizou um cadastro hoje às ${hora}. 
                             Só é permitido um cadastro a cada 9 horas.`;
  
          } else if (error.status === 400) {
            // Erro de validação (ex: CPF inválido, e-mail mal formatado)
            this.cpfError = 'Verifique os dados informados e tente novamente.';
          } else {
            // Outros erros: rede, servidor (500), timeout, etc.
            this.cpfError = 'Erro ao realizar cadastro. Tente novamente mais tarde.';
          }
        },
        complete: () => {
          // Garante que o loading será desativado ao final (opcional, mas seguro)
          this.loading = false;
        }
      });
    }
  }
}