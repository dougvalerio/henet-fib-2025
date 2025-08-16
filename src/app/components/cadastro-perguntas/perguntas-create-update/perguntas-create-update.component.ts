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

  constructor(
    private servicoPergunta: PerguntaService,
    private servicoTitulo: TituloService
  ) {}

  ngOnInit() {
    this.carregarTitulos();
  }

  ngOnChanges() {
    if (this.modalAberto) {
      if (this.modoEdicao && this.pergunta) {
        this.perguntaFormulario = { ...this.pergunta };
        this.respostas = [
          this.pergunta.respostaA || '',
          this.pergunta.respostaB || '',
          this.pergunta.respostaC || '',
          this.pergunta.respostaD || ''
        ];
        this.idTituloSelecionado = this.pergunta.titulo?.id || '';
      } else {
        this.reiniciarFormulario();
      }
    }
  }

  carregarTitulos() {
    if (!this.titulos.length) {
      this.servicoTitulo.findAll().subscribe({
        next: (titulos) => {
          this.titulos = titulos.filter(titulo => !!titulo.id);
        },
        error: (err) => {
          console.error('Erro ao carregar títulos:', err);
          alert('Erro ao carregar títulos. Tente novamente.');
        }
      });
    }
  }

  get formularioValido(): boolean {
    return !!(
      this.idTituloSelecionado &&
      this.perguntaFormulario.pergunta.trim() &&
      this.respostas.every(resposta => resposta.trim() !== '') &&
      this.perguntaFormulario.respostaCorreta !== null
    );
  }

  definirRespostaCorreta(indice: number) {
    this.perguntaFormulario.respostaCorreta = indice;
  }

  trackByIndex(indice: number): number {
    return indice;
  }

  salvarPergunta() {
    if (!this.formularioValido) {
      alert('Preencha todos os campos obrigatórios e selecione uma resposta correta.');
      return;
    }

    const perguntaParaSalvar: Pergunta = {
      pergunta: this.perguntaFormulario.pergunta,
      respostaA: this.respostas[0],
      respostaB: this.respostas[1],
      respostaC: this.respostas[2],
      respostaD: this.respostas[3],
      respostaCorreta: this.perguntaFormulario.respostaCorreta,
      titulo: this.titulos.find(t => t.id === this.idTituloSelecionado) || null
    };

    const operacaoSalvar = this.modoEdicao && this.pergunta?.id
      ? this.servicoPergunta.update(this.pergunta.id, perguntaParaSalvar)
      : this.servicoPergunta.create(perguntaParaSalvar);

    operacaoSalvar.subscribe({
      next: () => {
        this.salvar.emit();
        this.reiniciarFormulario();
      },
      error: (err) => {
        console.error('Erro ao salvar pergunta:', err);
        alert(`Erro ao salvar pergunta: ${err.message || 'Tente novamente.'}`);
      }
    });
  }

  fecharModal() {
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
  }
}