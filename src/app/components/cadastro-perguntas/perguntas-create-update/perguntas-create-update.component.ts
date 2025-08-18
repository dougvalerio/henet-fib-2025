import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pergunta } from '../../../models/pergunta';
import { Titulo } from '../../../models/titulo';
import { PerguntaService } from '../../../services/pergunta.service';
import { TituloService } from '../../../services/titulo.service';

@Component({
  selector: 'app-perguntas-create-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perguntas-create-update.component.html',
  styleUrls: ['./perguntas-create-update.component.css']
})
export class PerguntasCreateUpdateComponent implements OnInit {
  @Input() modalAberto: boolean = false;
  @Input() modoEdicao: boolean = false;
  @Input() pergunta: Pergunta | null = null;
  @Input() titulos: Titulo[] = [];
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();

  perguntaFormulario: Pergunta = {
    pergunta: '',
    respostaA: '',
    respostaB: '',
    respostaC: '',
    respostaD: '',
    respostaCorreta: null,
    titulo: null
  };
  respostas: string[] = ['', '', '', ''];
  idTituloSelecionado: string = '';
  rotulosRespostas = ['A', 'B', 'C', 'D'];
  mensagemErro: string | null = null;

  constructor(
    private servicoPergunta: PerguntaService,
    private servicoTitulo: TituloService
  ) {}

  ngOnInit() {
    // Não carregar títulos aqui, será feito em ngOnChanges
  }

  ngOnChanges() {
    if (this.modalAberto) {
      this.carregarTitulos().then(() => {
        if (this.modoEdicao && this.pergunta) {
          this.perguntaFormulario = { ...this.pergunta };
          this.respostas = [
            this.pergunta.respostaA || '',
            this.pergunta.respostaB || '',
            this.pergunta.respostaC || '',
            this.pergunta.respostaD || ''
          ];
          this.idTituloSelecionado = this.pergunta.titulo?.toString() || '';
        } else {
          this.reiniciarFormulario();
        }
      });
    }
  }

  carregarTitulos(): Promise<void> {
    return new Promise((resolve) => {
      this.mensagemErro = null; // Limpar mensagem de erro ao carregar títulos
      this.servicoTitulo.findAll().subscribe({
        next: (titulos) => {
          this.titulos = titulos.filter(titulo => !!titulo.id);
          console.log('Títulos carregados:', this.titulos); // Depuração
          if (!this.titulos.length) {
            this.mensagemErro = 'Nenhum título disponível para seleção.';
          }
          resolve();
        },
        error: (err) => {
          this.mensagemErro = 'Erro ao carregar títulos. Tente novamente.';
          console.error('Erro ao carregar títulos:', err);
          resolve(); // Resolver mesmo em caso de erro para evitar travamento
        }
      });
    });
  }

  get formularioValido(): boolean {
    const isValid = !!(
      this.idTituloSelecionado &&
      this.titulos.some(t => t.id?.toString() === this.idTituloSelecionado) &&
      this.perguntaFormulario.pergunta.trim() &&
      this.respostas.every(resposta => resposta.trim() !== '') &&
      this.perguntaFormulario.respostaCorreta !== null
    );
    return isValid;
  }

  definirRespostaCorreta(indice: number) {
    this.perguntaFormulario.respostaCorreta = indice;
  }

  trackByIndex(indice: number): number {
    return indice;
  }

  salvarPergunta() {
    // Limpar mensagem de erro anterior
    this.mensagemErro = null;

    // Validar cada campo e exibir mensagem específica no <p>
    if (!this.idTituloSelecionado) {
      this.mensagemErro = 'Selecione um título no campo de seleção.';
      return;
    }
    if (!this.titulos.some(t => t.id?.toString() === this.idTituloSelecionado)) {
      this.mensagemErro = 'O título selecionado é inválido.';
      return;
    }
    if (!this.perguntaFormulario.pergunta.trim()) {
      this.mensagemErro = 'Digite o texto da pergunta.';
      return;
    }
    if (!this.respostas[0].trim()) {
      this.mensagemErro = 'Digite a resposta A.';
      return;
    }
    if (!this.respostas[1].trim()) {
      this.mensagemErro = 'Digite a resposta B.';
      return;
    }
    if (!this.respostas[2].trim()) {
      this.mensagemErro = 'Digite a resposta C.';
      return;
    }
    if (!this.respostas[3].trim()) {
      this.mensagemErro = 'Digite a resposta D.';
      return;
    }
    if (this.perguntaFormulario.respostaCorreta === null) {
      this.mensagemErro = 'Selecione uma resposta correta marcando um checkbox.';
      return;
    }

    const perguntaParaSalvar: Pergunta = {
      pergunta: this.perguntaFormulario.pergunta,
      respostaA: this.respostas[0],
      respostaB: this.respostas[1],
      respostaC: this.respostas[2],
      respostaD: this.respostas[3],
      respostaCorreta: this.perguntaFormulario.respostaCorreta,
      titulo: this.idTituloSelecionado
    };

    // Exibir o objeto no console para depuração
    console.log('Objeto Pergunta enviado:', perguntaParaSalvar);

    const operacaoSalvar = this.modoEdicao && this.pergunta?.id
      ? this.servicoPergunta.update(this.pergunta.id, perguntaParaSalvar)
      : this.servicoPergunta.create(perguntaParaSalvar);

    operacaoSalvar.subscribe({
      next: () => {
        this.mensagemErro = null; // Limpar mensagem de erro em caso de sucesso
        this.salvar.emit();
        this.reiniciarFormulario();
      },
      error: (err) => {
        this.mensagemErro = `Erro ao salvar pergunta: ${err.message || 'Tente novamente.'}`;
        console.error('Erro ao salvar pergunta:', err);
      }
    });
  }

  fecharModal() {
    this.mensagemErro = null; // Limpar mensagem de erro ao fechar o modal
    this.fechar.emit();
    this.reiniciarFormulario();
  }

  private reiniciarFormulario() {
    this.perguntaFormulario = {
      pergunta: '',
      respostaA: '',
      respostaB: '',
      respostaC: '',
      respostaD: '',
      respostaCorreta: null,
      titulo: null
    };
    this.respostas = ['', '', '', ''];
    this.idTituloSelecionado = '';
    this.mensagemErro = null; // Limpar mensagem de erro ao reiniciar
  }
}