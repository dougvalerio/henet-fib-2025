import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PopupResultadoRespostaComponent } from '../popup-resultado-resposta/popup-resultado-resposta.component';

interface Title {
  title: string;
  imagePath: string;
  selected: boolean;
}

interface Question {
  title: string;
  imagePath: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

@Component({
  selector: 'app-perguntas',
  standalone: true,
  imports: [CommonModule, PopupResultadoRespostaComponent],
  templateUrl: './perguntas.component.html',
  styleUrl: './perguntas.component.css',
})
export class PerguntasComponent implements OnInit {
  currentQuestionIndex = 0;
  selectedOption: number | null = null;
  questions: Question[] = [];
  selectedTitles: Title[] = [];
  showPopup = false;
  isCorrectAnswer = false;
  isQuizFinished = false;
  isInitialMessage = true;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.selectedTitles = navigation?.extras.state?.['selectedTitles'] || [];
  }

  ngOnInit() {
    this.generateQuestions();
    this.showPopup = true; // Exibir o popup inicial
    this.isInitialMessage = true; // Garantir que a mensagem inicial seja exibida
    this.isCorrectAnswer = false; // Garantir que não haja estado de erro no início
    this.isQuizFinished = false; // Garantir que o quiz não esteja finalizado no início

    console.log('ngOnInit:', {
      showPopup: this.showPopup,
      isInitialMessage: this.isInitialMessage,
      isCorrectAnswer: this.isCorrectAnswer,
      isQuizFinished: this.isQuizFinished,
    });
  }

  generateQuestions() {
    const questionsPerTitle = 3;
    const allQuestions: Question[] = [
      {
        title: 'The Last of Us',
        imagePath: '../../../assets/TLOUS.jpg',
        text: 'Qual é o nome da protagonista feminina de The Last of Us?',
        options: ['Ellie', 'Tess', 'Marlene', 'Sarah'],
        correctAnswer: 0,
      },
      {
        title: 'The Last of Us',
        imagePath: '../../../assets/TLOUS.jpg',
        text: 'Em que ano se passa a maior parte da história de The Last of Us?',
        options: ['2013', '2020', '2033', '2040'],
        correctAnswer: 2,
      },
      {
        title: 'The Last of Us',
        imagePath: '../../../assets/TLOUS.jpg',
        text: 'Qual é o nome do parceiro de Ellie na maior parte da série?',
        options: ['Joel', 'Tommy', 'Bill', 'David'],
        correctAnswer: 0,
      },
      {
        title: 'House of the Dragon',
        imagePath: '../../../assets/HOD.jpg',
        text: 'Qual é o nome da casa principal retratada em House of the Dragon?',
        options: ['Stark', 'Lannister', 'Targaryen', 'Baratheon'],
        correctAnswer: 2,
      },
      {
        title: 'House of the Dragon',
        imagePath: '../../../assets/HOD.jpg',
        text: 'Quem é a rainha que luta pelo Trono de Ferro na Dança dos Dragões?',
        options: ['Cersei', 'Daenerys', 'Rhaenyra', 'Sansa'],
        correctAnswer: 2,
      },
      {
        title: 'House of the Dragon',
        imagePath: '../../../assets/HOD.jpg',
        text: 'Qual é o nome do dragão de Daemon Targaryen?',
        options: ['Drogon', 'Caraxes', 'Balerion', 'Vhagar'],
        correctAnswer: 1,
      },
      {
        title: 'F.r.i.e.n.d.s',
        imagePath: '../../../assets/friends.jpg',
        text: 'Qual é o nome do café onde os amigos frequentemente se encontram?',
        options: ['Central Perk', 'Java Joe', 'Starbucks', 'Coffee House'],
        correctAnswer: 0,
      },
      {
        title: 'F.r.i.e.n.d.s',
        imagePath: '../../../assets/friends.jpg',
        text: 'Qual personagem é conhecido por dizer "How you doin\'"?',
        options: ['Ross', 'Chandler', 'Joey', 'Monica'],
        correctAnswer: 2,
      },
      {
        title: 'F.r.i.e.n.d.s',
        imagePath: '../../../assets/friends.jpg',
        text: 'Qual é a profissão de Ross Geller?',
        options: ['Chef', 'Ator', 'Paleontólogo', 'Publicitário'],
        correctAnswer: 2,
      },
    ];

    this.questions = allQuestions
      .filter((q) => this.selectedTitles.some((t) => t.title === q.title))
      .slice(0, questionsPerTitle * this.selectedTitles.length)
      .sort(() => Math.random() - 0.5);
  }

  selectOption(index: number) {
    this.selectedOption = index;
  }

  nextQuestion() {
    if (this.selectedOption !== null) {
      const currentQuestion = this.currentQuestion;
      if (currentQuestion) {
        this.isCorrectAnswer = this.selectedOption === currentQuestion.correctAnswer;
        this.isInitialMessage = false; // Desativar mensagem inicial após a primeira resposta
        this.showPopup = true; // Exibir popup para resultado da resposta

        if (this.isCorrectAnswer && this.currentQuestionIndex === this.questions.length - 1) {
          this.isQuizFinished = true;
        }
      }
    }
  }

  closePopup() {
    this.showPopup = false;
    if (!this.isInitialMessage) {
      if (this.isCorrectAnswer && !this.isQuizFinished) {
        this.currentQuestionIndex++;
        this.selectedOption = null;
      }
      if (!this.isCorrectAnswer || this.isQuizFinished) {
        this.router.navigate(['/inicio']);
      }
    }
    this.isInitialMessage = false; // Desativar mensagem inicial após fechar o popup
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }
}