import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perguntas-create-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perguntas-create-update.component.html',
  styleUrl: './perguntas-create-update.component.css'
})
export class PerguntasCreateUpdateComponent {
  @Input() isOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() titles: { name: string, cover: string }[] = [];
  @Input() selectedTitle: string | null = '';
  @Input() difficulty: number | null = null;
  @Input() question: string | null = '';
  @Input() answers: string[] = ['', '', '', ''];
  @Input() correctAnswer: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{
    title: string,
    difficulty: number,
    question: string,
    answers: string[],
    correctAnswer: number
  }>();

  answerLabels = ['A', 'B', 'C', 'D'];

  // Função trackBy para otimizar o *ngFor
  trackByIndex(index: number, item: any): number {
    return index;
  }

  ngOnChanges() {
    if (!this.isEditMode) {
      this.resetForm();
    } else {
      // Garante que o array answers tenha exatamente 4 elementos no modo de edição
      if (this.answers.length !== 4) {
        this.answers = ['', '', '', ''];
      }
    }
  }

  get isFormValid(): boolean {
    return !!(
      this.selectedTitle &&
      this.difficulty !== null &&
      this.question &&
      this.answers.every(answer => answer.trim() !== '') &&
      this.correctAnswer !== null
    );
  }

  setCorrectAnswer(index: number) {
    this.correctAnswer = index;
  }

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  saveQuestion() {
    if (this.isFormValid) {
      this.save.emit({
        title: this.selectedTitle!,
        difficulty: this.difficulty!,
        question: this.question!,
        answers: [...this.answers], // Cria uma cópia para evitar mutações inesperadas
        correctAnswer: this.correctAnswer!
      });
      this.resetForm();
    }
  }

  private resetForm() {
    this.selectedTitle = '';
    this.difficulty = null;
    this.question = '';
    this.answers = ['', '', '', '']; // Sempre reinicia com 4 elementos vazios
    this.correctAnswer = null;
  }
}