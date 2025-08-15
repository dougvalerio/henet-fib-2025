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
  @Input() isOpen: boolean = false;
  @Input() perguntaId: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  titulos: Titulo[] = [];
  pergunta: Pergunta = {
    pergunta: '',
    respostaA: '',
    respostaB: '',
    respostaC: '',
    respostaD: '',
    respostaCorreta: null,
    titulo: null
  };
  respostas: string[] = ['', '', '', ''];
  selectedTitleId: any = '';
  answerLabels = ['A', 'B', 'C', 'D'];
  isEditMode: boolean = false;

  constructor(
    private perguntaService: PerguntaService,
    private tituloService: TituloService
  ) {}

  ngOnInit() {
    this.loadTitles();
    if (this.perguntaId) {
      this.loadPergunta(this.perguntaId);
      this.isEditMode = true;
    } else {
      this.resetForm();
    }
  }

  loadTitles() {
    this.tituloService.findAll().subscribe({
      next: (titulos) => {
        this.titulos = titulos;
      },
      error: (err) => {
        console.error('Erro ao carregar títulos:', err);
      }
    });
  }

  loadPergunta(id: any) {
    this.perguntaService.findById(id).subscribe({
      next: (pergunta) => {
        this.pergunta = pergunta;
        this.respostas = [
          pergunta.respostaA || '',
          pergunta.respostaB || '',
          pergunta.respostaC || '',
          pergunta.respostaD || ''
        ];
        this.selectedTitleId = pergunta.titulo?.id || '';
      },
      error: (err) => {
        console.error('Erro ao carregar pergunta:', err);
      }
    });
  }

  get isFormValid(): boolean {
    return !!(
      this.selectedTitleId &&
      this.pergunta.pergunta &&
      this.respostas.every(resposta => resposta.trim() !== '') &&
      this.pergunta.respostaCorreta !== null
    );
  }

  setCorrectAnswer(index: number) {
    this.pergunta.respostaCorreta = index;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  saveQuestion() {
    if (this.isFormValid) {
      const perguntaToSave: Pergunta = {
        ...this.pergunta,
        respostaA: this.respostas[0],
        respostaB: this.respostas[1],
        respostaC: this.respostas[2],
        respostaD: this.respostas[3],
        titulo: this.titulos.find(t => t.id === this.selectedTitleId) || null
      };

      if (this.isEditMode && this.pergunta.id) {
        this.perguntaService.update(this.pergunta.id, perguntaToSave).subscribe({
          next: () => {
            this.saved.emit();
            this.resetForm();
          },
          error: (err) => {
            console.error('Erro ao atualizar pergunta:', err);
          }
        });
      } else {
        this.perguntaService.create(perguntaToSave).subscribe({
          next: () => {
            this.saved.emit();
            this.resetForm();
          },
          error: (err) => {
            console.error('Erro ao criar pergunta:', err);
          }
        });
      }
    }
  }

  private resetForm() {
    this.pergunta = {
      pergunta: '',
      respostaA: '',
      respostaB: '',
      respostaC: '',
      respostaD: '',
      respostaCorreta: null,
      titulo: null
    };
    this.respostas = ['', '', '', ''];
    this.selectedTitleId = '';
    this.isEditMode = false;
  }
}