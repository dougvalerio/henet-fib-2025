import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerguntasCreateUpdateComponent } from '../perguntas-create-update/perguntas-create-update.component';

@Component({
  selector: 'app-perguntas-list',
  standalone: true,
  imports: [CommonModule, PerguntasCreateUpdateComponent],
  templateUrl: './perguntas-list.component.html',
  styleUrl: './perguntas-list.component.css'
})
export class PerguntasListComponent {
  titles = [
    { name: 'The Last of Us', cover: '../../../../assets/TLOUS.jpg' },
    { name: 'House of The Dragon', cover: '../../../../assets/HOD.jpg' }
  ];

  questions = [
    {
      title: 'The Last of Us',
      question: 'Quem é o protagonista principal?',
      answers: ['Joel', 'Ellie', 'Tess', 'Bill', 'Tommy'],
      correctAnswer: 0
    },
    {
      title: 'House of The Dragon',
      question: 'Qual é a casa principal da série?',
      answers: ['Targaryen', 'Stark', 'Lannister', 'Baratheon', 'Greyjoy'],
      correctAnswer: 0
    },
    {
      title: 'The Last of Us',
      question: 'Qual é o nome da filha de Joel?',
      answers: ['Ellie', 'Sarah', 'Tess', 'Marlene', 'Anna'],
      correctAnswer: 1
    }
  ];

  answerLabels = ['A', 'B', 'C', 'D', 'E'];
  isModalOpen = false;
  isEditMode = false;
  selectedQuestion: {
    title: string,
    question: string,
    answers: string[],
    correctAnswer: number | null
  } | null = null;
  selectedIndex: number | null = null;

  openCreateModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.selectedQuestion = {
      title: '',
      question: '',
      answers: ['', '', '', '', ''],
      correctAnswer: null
    };
  }

  openEditModal(question: {
    title: string,
    question: string,
    answers: string[],
    correctAnswer: number
  }, index: number) {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.selectedQuestion = { ...question, correctAnswer: question.correctAnswer };
    this.selectedIndex = index;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedQuestion = null;
    this.selectedIndex = null;
  }

  saveQuestion(data: {
    title: string,
    question: string,
    answers: string[],
    correctAnswer: number
  }) {
    if (this.isEditMode && this.selectedIndex !== null) {
      this.questions[this.selectedIndex] = { ...data };
    } else {
      this.questions.push({ ...data });
    }
    this.closeModal();
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }
}