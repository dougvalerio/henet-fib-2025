import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerguntasCreateUpdateComponent } from '../perguntas-create-update/perguntas-create-update.component';
import { PerguntaService } from '../../../services/pergunta.service';
import { TituloService } from '../../../services/titulo.service';
import { Pergunta } from '../../../models/pergunta';
import { Titulo } from '../../../models/titulo';

@Component({
  selector: 'app-perguntas-list',
  standalone: true,
  imports: [CommonModule, PerguntasCreateUpdateComponent],
  templateUrl: './perguntas-list.component.html',
  styleUrls: ['./perguntas-list.component.css']
})
export class PerguntasListComponent implements OnInit {
  titles: Titulo[] = [];
  questions: Pergunta[] = [];
  answerLabels = ['A', 'B', 'C', 'D'];
  isModalOpen = false;
  selectedPerguntaId: any = null;

  constructor(
    private perguntaService: PerguntaService,
    private tituloService: TituloService
  ) {}

  ngOnInit() {
    this.loadTitles();
    this.loadQuestions();
  }

  loadTitles() {
    this.tituloService.findAll().subscribe({
      next: (titles) => {
        this.titles = titles;
      },
      error: (err) => {
        console.error('Erro ao carregar títulos:', err);
      }
    });
  }

  loadQuestions() {
    this.perguntaService.findAll().subscribe({
      next: (questions) => {
        this.questions = questions;
      },
      error: (err) => {
        console.error('Erro ao carregar perguntas:', err);
      }
    });
  }

  openCreateModal() {
    this.isModalOpen = true;
    this.selectedPerguntaId = null;
  }

  openEditModal(pergunta: Pergunta) {
    this.isModalOpen = true;
    this.selectedPerguntaId = pergunta.id;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedPerguntaId = null;
  }

  onQuestionSaved() {
    this.loadQuestions();
    this.closeModal();
  }

  deleteQuestion(id: any) {
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
      this.perguntaService.delete(id).subscribe({
        next: () => {
          this.loadQuestions();
        },
        error: (err) => {
          console.error('Erro ao excluir pergunta:', err);
        }
      });
    }
  }
}