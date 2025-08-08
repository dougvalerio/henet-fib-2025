import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  imports: [CommonModule],
  templateUrl: './perguntas.component.html',
  styleUrl: './perguntas.component.css',
})
export class PerguntasComponent implements OnInit {
  currentQuestionIndex = 0;
  selectedOption: number | null = null;
  questions: Question[] = [];
  selectedTitles: Title[] = [];

  constructor(private router: Router) {
    // Recuperar os títulos selecionados do estado da navegação
    const navigation = this.router.getCurrentNavigation();
    this.selectedTitles = navigation?.extras.state?.['selectedTitles'] || [];
  }

  ngOnInit() {
    // Gerar perguntas com base nos títulos selecionados
    this.generateQuestions();
  }

  generateQuestions() {
    const questionsPerTitle = 3;
    const allQuestions: Question[] = [
      // Perguntas para "The Last of Us"
      {
        title: 'The Last of Us',
        imagePath: '../../../assets/TLOUS.jpg',
        text: 'Qual é o nome da protagonista feminina de The Last of Us?',
        options: ['Ellie', 'Tess', 'Marlene', 'Sarah', 'Abby'],
        correctAnswer: 0,
      },
      {
        title: 'The Last of Us',
        imagePath: '../../../assets/TLOUS.jpg',
        text: 'Em que ano se passa a maior parte da história de The Last of Us?',
        options: ['2013', '2020', '2033', '2040', '2050'],
        correctAnswer: 2,
      },
      {
        title: 'The Last of Us',
        imagePath: '../../../assets/TLOUS.jpg',
        text: 'Qual é o nome do parceiro de Ellie na maior parte da série?',
        options: ['Joel', 'Tommy', 'Bill', 'David', 'Riley'],
        correctAnswer: 0,
      },
      // Perguntas para "House of the Dragon"
      {
        title: 'House of the Dragon',
        imagePath: '../../../assets/HOD.jpg',
        text: 'Qual é o nome da casa principal retratada em House of the Dragon?',
        options: ['Stark', 'Lannister', 'Targaryen', 'Baratheon', 'Greyjoy'],
        correctAnswer: 2,
      },
      {
        title: 'House of the Dragon',
        imagePath: '../../../assets/HOD.jpg',
        text: 'Quem é a rainha que luta pelo Trono de Ferro na Dança dos Dragões?',
        options: ['Cersei', 'Daenerys', 'Rhaenyra', 'Sansa', 'Margaery'],
        correctAnswer: 2,
      },
      {
        title: 'House of the Dragon',
        imagePath: '../../../assets/HOD.jpg',
        text: 'Qual é o nome do dragão de Daemon Targaryen?',
        options: ['Drogon', 'Caraxes', 'Balerion', 'Vhagar', 'Syrax'],
        correctAnswer: 1,
      },
      // Perguntas para "F.r.i.e.n.d.s"
      {
        title: 'F.r.i.e.n.d.s',
        imagePath: '../../../assets/friends.jpg',
        text: 'Qual é o nome do café onde os amigos frequentemente se encontram?',
        options: ['Central Perk', 'Java Joe', 'Starbucks', 'Coffee House', 'Beanery'],
        correctAnswer: 0,
      },
      {
        title: 'F.r.i.e.n.d.s',
        imagePath: '../../../assets/friends.jpg',
        text: 'Qual personagem é conhecido por dizer "How you doin\'"?',
        options: ['Ross', 'Chandler', 'Joey', 'Monica', 'Rachel'],
        correctAnswer: 2,
      },
      {
        title: 'F.r.i.e.n.d.s',
        imagePath: '../../../assets/friends.jpg',
        text: 'Qual é a profissão de Ross Geller?',
        options: ['Chef', 'Ator', 'Paleontólogo', 'Publicitário', 'Médico'],
        correctAnswer: 2,
      },
      // Adicione mais perguntas para os outros títulos conforme necessário
    ];

    // Filtrar perguntas apenas para os títulos selecionados
    this.questions = allQuestions.filter((q) =>
      this.selectedTitles.some((t) => t.title === q.title)
    );

    // Garantir que haja exatamente 9 perguntas (3 por título)
    this.questions = this.questions
      .slice(0, questionsPerTitle * this.selectedTitles.length)
      .sort(() => Math.random() - 0.5); // Embaralhar perguntas
  }

  selectOption(index: number) {
    this.selectedOption = index;
  }

  nextQuestion() {
    if (this.selectedOption !== null) {
      this.currentQuestionIndex++;
      this.selectedOption = null;
      if (this.currentQuestionIndex >= this.questions.length) {
        // Redirecionar para uma tela de resultados ou reiniciar
        console.log('Quiz finalizado!');
        this.router.navigate(['/resultado']); // Ajuste conforme necessário
      }
    }
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }
}