import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PopupResultadoRespostaComponent } from '../popup-resultado-resposta/popup-resultado-resposta.component';
import { PerguntaService } from '../../services/pergunta.service';
import { TituloService } from '../../services/titulo.service';
import { JogoDetalheService } from '../../services/jogo-detalhe.service';
import { Pergunta } from '../../models/pergunta';
import { JogoCabecalho } from '../../models/jogo-cabecalho';
import { JogoDetalhe } from '../../models/jogo-detalhe';
import { Titulo } from '../../models/titulo';

interface Title {
  title: string;
  imagePath: string;
  selected: boolean;
  id?: any;
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
  jogoCabecalho: JogoCabecalho | null = null;
  showPopup = false;
  isCorrectAnswer = false;
  isQuizFinished = false;
  isInitialMessage = true;
  currentJogoDetalhe: JogoDetalhe | null = null;

  constructor(
    private router: Router,
    private perguntaService: PerguntaService,
    private tituloService: TituloService,
    private jogoDetalheService: JogoDetalheService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.selectedTitles = navigation?.extras.state?.['selectedTitles'] || [];
    this.jogoCabecalho = navigation?.extras.state?.['jogoCabecalho'] || null;
  }

  ngOnInit() {
    if (!this.jogoCabecalho || !this.jogoCabecalho.jogoDetalheList?.length) {
      console.error('Erro: jogoCabecalho ou jogoDetalheList não encontrado no state.');
      this.router.navigate(['/inicio']);
      return;
    }
    this.showPopup = true;
    this.isInitialMessage = true;
    this.isCorrectAnswer = false;
    this.isQuizFinished = false;

    console.log('ngOnInit:', {
      showPopup: this.showPopup,
      isInitialMessage: this.isInitialMessage,
      isCorrectAnswer: this.isCorrectAnswer,
      isQuizFinished: this.isQuizFinished,
      jogoCabecalho: this.jogoCabecalho,
      selectedTitles: this.selectedTitles,
    });
  }

  loadQuestion(perguntaId: number) {
    if (
      this.jogoCabecalho &&
      Array.isArray(this.jogoCabecalho.jogoDetalheList) &&
      this.currentQuestionIndex < this.jogoCabecalho.jogoDetalheList.length
    ) {
      const currentDetalhe = this.jogoCabecalho.jogoDetalheList[this.currentQuestionIndex];
      this.currentJogoDetalhe = {
        id: currentDetalhe.id,
        jogoCabecalho: this.jogoCabecalho.id,
        pergunta: currentDetalhe.pergunta,
        resposta: null,
        dataResposta: null,
      };
      console.log('JogoDetalhe criado:', this.currentJogoDetalhe);
    } else {
      console.error('Erro: Item de jogoDetalheList não encontrado para o índice atual.');
      this.router.navigate(['/inicio']);
      return;
    }

    this.perguntaService.findById(perguntaId).subscribe({
      next: (pergunta: Pergunta) => {
        const options = [
          pergunta.respostaA,
          pergunta.respostaB,
          pergunta.respostaC,
          pergunta.respostaD,
        ].filter((opt): opt is string => opt != null);

        const question: Question = {
          title: pergunta.titulo?.toString() || 'Desconhecido',
          imagePath: 'assets/placeholder.jpg',
          text: pergunta.pergunta,
          options: options,
          correctAnswer: pergunta.respostaCorreta ?? 0,
        };

        this.questions[this.currentQuestionIndex] = question;
        console.log('Pergunta carregada:', question);
        this.loadTitleImage(pergunta, question);
      },
      error: (error) => {
        console.error('Erro ao carregar pergunta:', error);
        this.router.navigate(['/inicio']);
      },
    });
  }

  loadTitleImage(pergunta: Pergunta, question: Question) {
    const tituloId = pergunta.titulo;
    if (!tituloId) {
      console.warn('ID do título não fornecido para a pergunta.');
      question.imagePath = 'assets/placeholder.jpg';
      this.questions = [...this.questions];
      return;
    }

    const selectedTitle = this.selectedTitles.find((t) => t.id?.toString() === tituloId.toString());
    if (selectedTitle && selectedTitle.imagePath && selectedTitle.imagePath !== 'assets/placeholder.jpg') {
      question.imagePath = selectedTitle.imagePath;
      this.questions = [...this.questions];
      return;
    }

    this.tituloService.downloadImage(tituloId).subscribe({
      next: (blob: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          const imageDataUrl = reader.result as string;
          question.imagePath = imageDataUrl;
          if (selectedTitle) {
            selectedTitle.imagePath = imageDataUrl;
          }
          this.questions = [...this.questions];
        };
      },
      error: (error) => {
        console.error(`Erro ao carregar imagem do título ID ${tituloId}:`, error);
        question.imagePath = 'assets/placeholder.jpg';
        this.questions = [...this.questions];
      },
    });
  }

  selectOption(index: number) {
    this.selectedOption = index;
    if (this.currentJogoDetalhe) {
      this.currentJogoDetalhe.resposta = index;
      console.log('Resposta selecionada:', this.currentJogoDetalhe);
    }
  }

  nextQuestion() {
    if (this.selectedOption !== null && this.currentJogoDetalhe && this.jogoCabecalho) {
      const currentQuestion = this.currentQuestion;
      if (currentQuestion) {
        this.isCorrectAnswer = this.selectedOption === currentQuestion.correctAnswer;
        this.isInitialMessage = false;

        // Garantir que apenas o ID do jogoCabecalho seja enviado e dataResposta seja null
        this.currentJogoDetalhe.jogoCabecalho = this.jogoCabecalho.id;
        this.currentJogoDetalhe.dataResposta = null;

        this.jogoDetalheService.create(this.currentJogoDetalhe).subscribe({
          next: (response: JogoDetalhe) => {
            this.jogoCabecalho!.jogoDetalheList[this.currentQuestionIndex] = {
              ...this.jogoCabecalho!.jogoDetalheList[this.currentQuestionIndex],
              id: response.id,
              resposta: response.resposta,
              dataResposta: response.dataResposta,
            };

            console.log('JogoDetalhe salvo com sucesso:', response);
            console.log('jogoDetalheList atualizado:', this.jogoCabecalho!.jogoDetalheList);

            this.showPopup = true;

            if (this.isCorrectAnswer && this.currentQuestionIndex === this.jogoCabecalho!.jogoDetalheList.length - 1) {
              this.isQuizFinished = true;
            }
          },
          error: (error) => {
            console.error('Erro ao salvar JogoDetalhe:', error);
            this.showPopup = true;
          },
        });
      }
    }
  }

  closePopup() {
    this.showPopup = false;
    if (this.isInitialMessage) {
      if (
        this.jogoCabecalho &&
        Array.isArray(this.jogoCabecalho.jogoDetalheList) &&
        this.jogoCabecalho.jogoDetalheList.length > 0 &&
        this.jogoCabecalho.jogoDetalheList[0]?.pergunta != null
      ) {
        const firstPerguntaId = this.jogoCabecalho.jogoDetalheList[0].pergunta;
        this.loadQuestion(firstPerguntaId);
      } else {
        console.error('Erro: ID da primeira pergunta não encontrado ou jogoDetalheList inválido.');
        this.router.navigate(['/inicio']);
      }
    } else {
      if (this.isCorrectAnswer && !this.isQuizFinished) {
        this.currentQuestionIndex++;
        this.selectedOption = null;
        this.currentJogoDetalhe = null;
        if (
          this.jogoCabecalho &&
          Array.isArray(this.jogoCabecalho.jogoDetalheList) &&
          this.currentQuestionIndex < this.jogoCabecalho.jogoDetalheList.length &&
          this.jogoCabecalho.jogoDetalheList[this.currentQuestionIndex]?.pergunta != null
        ) {
          const nextPerguntaId = this.jogoCabecalho.jogoDetalheList[this.currentQuestionIndex].pergunta;
          this.loadQuestion(nextPerguntaId);
        } else {
          console.error('Erro: Próxima pergunta não encontrada ou jogoDetalheList inválido.');
          this.isQuizFinished = true;
          this.showPopup = true;
        }
      } else {
        this.router.navigate(['/inicio']);
      }
    }
    this.isInitialMessage = false;
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }
}