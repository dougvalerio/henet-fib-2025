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
  indicePerguntaAtual = 0;
  opcaoSelecionada: number | null = null;
  perguntas: Question[] = [];
  titulosSelecionados: Title[] = [];
  jogoCabecalho: JogoCabecalho | null = null;
  exibirPopup = false;
  respostaCorreta = false;
  quizFinalizado = false;
  mensagemInicial = true;
  jogoDetalheAtual: JogoDetalhe | null = null;
  tentativasErradas = 0;

  constructor(
    private router: Router,
    private perguntaService: PerguntaService,
    private tituloService: TituloService,
    private jogoDetalheService: JogoDetalheService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.titulosSelecionados = navigation?.extras.state?.['selectedTitles'] || [];
    this.jogoCabecalho = navigation?.extras.state?.['jogoCabecalho'] || null;
    console.log(this.jogoCabecalho)
  }

  ngOnInit() {
    if (!this.jogoCabecalho || !this.jogoCabecalho.jogoDetalheList?.length) {
      console.error('Erro: jogoCabecalho ou jogoDetalheList não encontrado no state.');
      this.router.navigate(['/inicio']);
      return;
    }
    this.exibirPopup = true;
    this.mensagemInicial = true;
    this.respostaCorreta = false;
    this.quizFinalizado = false;

    console.log('ngOnInit:', {
      exibirPopup: this.exibirPopup,
      mensagemInicial: this.mensagemInicial,
      respostaCorreta: this.respostaCorreta,
      quizFinalizado: this.quizFinalizado,
      jogoCabecalho: this.jogoCabecalho,
      titulosSelecionados: this.titulosSelecionados,
    });
  }

  carregarPergunta(perguntaId: number) {
    if (
      this.jogoCabecalho &&
      Array.isArray(this.jogoCabecalho.jogoDetalheList) &&
      this.indicePerguntaAtual < this.jogoCabecalho.jogoDetalheList.length
    ) {
      const detalheAtual = this.jogoCabecalho.jogoDetalheList[this.indicePerguntaAtual];
      this.jogoDetalheAtual = {
        id: detalheAtual.id,
        jogoCabecalho: this.jogoCabecalho.id,
        pergunta: detalheAtual.pergunta,
        resposta: null,
        dataResposta: null,
      };
      console.log('JogoDetalhe criado:', this.jogoDetalheAtual);
    } else {
      console.error('Erro: Item de jogoDetalheList não encontrado para o índice atual.');
      this.router.navigate(['/inicio']);
      return;
    }

    this.perguntaService.findById(perguntaId).subscribe({
      next: (pergunta: Pergunta) => {
        const opcoes = [
          pergunta.respostaA,
          pergunta.respostaB,
          pergunta.respostaC,
          pergunta.respostaD,
        ].filter((opt): opt is string => opt != null);

        const perguntaObj: Question = {
          title: pergunta.titulo?.toString() || 'Desconhecido',
          imagePath: 'assets/placeholder.jpg',
          text: pergunta.pergunta,
          options: opcoes,
          correctAnswer: pergunta.respostaCorreta ?? 0,
        };

        this.perguntas[this.indicePerguntaAtual] = perguntaObj;
        console.log('Pergunta carregada:', perguntaObj);
        this.carregarImagemTitulo(pergunta, perguntaObj);
      },
      error: (error) => {
        console.error('Erro ao carregar pergunta:', error);
        this.router.navigate(['/inicio']);
      },
    });
  }

  carregarImagemTitulo(pergunta: Pergunta, perguntaObj: Question) {
    const tituloId = pergunta.titulo;
    if (!tituloId) {
      console.warn('ID do título não fornecido para a pergunta.');
      perguntaObj.imagePath = 'assets/placeholder.jpg';
      this.perguntas = [...this.perguntas];
      return;
    }

    const tituloSelecionado = this.titulosSelecionados.find((t) => t.id?.toString() === tituloId.toString());
    if (tituloSelecionado && tituloSelecionado.imagePath && tituloSelecionado.imagePath !== 'assets/placeholder.jpg') {
      perguntaObj.imagePath = tituloSelecionado.imagePath;
      this.perguntas = [...this.perguntas];
      return;
    }

    this.tituloService.downloadImage(tituloId).subscribe({
      next: (blob: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          const imageDataUrl = reader.result as string;
          perguntaObj.imagePath = imageDataUrl;
          if (tituloSelecionado) {
            tituloSelecionado.imagePath = imageDataUrl;
          }
          this.perguntas = [...this.perguntas];
        };
      },
      error: (error) => {
        console.error(`Erro ao carregar imagem do título ID ${tituloId}:`, error);
        perguntaObj.imagePath = 'assets/placeholder.jpg';
        this.perguntas = [...this.perguntas];
      },
    });
  }

  selecionarOpcao(indice: number) {
    this.opcaoSelecionada = indice;
    if (this.jogoDetalheAtual) {
      this.jogoDetalheAtual.resposta = indice;
      console.log('Resposta selecionada:', this.jogoDetalheAtual);
    }
  }

  proximaPergunta() {
    if (this.opcaoSelecionada !== null && this.jogoDetalheAtual && this.jogoCabecalho) {
      const perguntaAtual = this.perguntaAtual;
      if (perguntaAtual) {
        this.respostaCorreta = this.opcaoSelecionada === perguntaAtual.correctAnswer;
        this.mensagemInicial = false;

        if (!this.respostaCorreta) {
          this.tentativasErradas++;
        }

        this.jogoDetalheAtual.jogoCabecalho = this.jogoCabecalho.id;
        this.jogoDetalheAtual.dataResposta = null;

        this.jogoDetalheService.create(this.jogoDetalheAtual).subscribe({
          next: (response: JogoDetalhe) => {
            this.jogoCabecalho!.jogoDetalheList[this.indicePerguntaAtual] = {
              ...this.jogoCabecalho!.jogoDetalheList[this.indicePerguntaAtual],
              id: response.id,
              resposta: response.resposta,
              dataResposta: response.dataResposta,
            };

            console.log('JogoDetalhe salvo com sucesso:', response);
            console.log('jogoDetalheList atualizado:', this.jogoCabecalho!.jogoDetalheList);

            this.exibirPopup = true;

            if (this.respostaCorreta && this.indicePerguntaAtual === this.jogoCabecalho!.jogoDetalheList.length - 1) {
              this.quizFinalizado = true;
            }
          },
          error: (error) => {
            console.error('Erro ao salvar JogoDetalhe:', error);
            this.exibirPopup = true;
          },
        });
      }
    }
  }

  fecharPopup() {
    this.exibirPopup = false;
    if (this.mensagemInicial) {
      if (
        this.jogoCabecalho &&
        Array.isArray(this.jogoCabecalho.jogoDetalheList) &&
        this.jogoCabecalho.jogoDetalheList.length > 0 &&
        this.jogoCabecalho.jogoDetalheList[0]?.pergunta != null
      ) {
        const primeiraPerguntaId = this.jogoCabecalho.jogoDetalheList[0].pergunta;
        this.carregarPergunta(primeiraPerguntaId);
      } else {
        console.error('Erro: ID da primeira pergunta não encontrado ou jogoDetalheList inválido.');
        this.router.navigate(['/inicio']);
      }
    } else {
      if (this.respostaCorreta || this.tentativasErradas < 3) {
        if (!this.quizFinalizado) {
          this.indicePerguntaAtual++;
          this.opcaoSelecionada = null;
          this.jogoDetalheAtual = null;
          if (
            this.jogoCabecalho &&
            Array.isArray(this.jogoCabecalho.jogoDetalheList) &&
            this.indicePerguntaAtual < this.jogoCabecalho.jogoDetalheList.length &&
            this.jogoCabecalho.jogoDetalheList[this.indicePerguntaAtual]?.pergunta != null
          ) {
            const proximaPerguntaId = this.jogoCabecalho.jogoDetalheList[this.indicePerguntaAtual].pergunta;
            this.carregarPergunta(proximaPerguntaId);
          } else {
            this.quizFinalizado = true;
            this.exibirPopup = true;
          }
        } else {
          this.router.navigate(['/inicio']);
        }
      } else {
        this.router.navigate(['/inicio']);
      }
    }
    this.mensagemInicial = false;
  }

  get perguntaAtual(): Question | null {
    return this.perguntas[this.indicePerguntaAtual] || null;
  }

  // Propriedade para fornecer o título da pergunta de forma segura
  get perguntaTitulo(): string {
    return this.perguntaAtual?.title || '';
  }
}