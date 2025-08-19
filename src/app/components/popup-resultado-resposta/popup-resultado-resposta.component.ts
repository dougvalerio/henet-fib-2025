import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-resultado-resposta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-resultado-resposta.component.html',
  styleUrl: './popup-resultado-resposta.component.css',
})
export class PopupResultadoRespostaComponent implements OnChanges {
  @Input() showPopup: boolean = false;
  @Input() isCorrectAnswer: boolean = false;
  @Input() isQuizFinished: boolean = false;
  @Input() isInitialMessage: boolean = false;
  @Input() tentativasErradas: number = 0;
  @Input() perguntaTitulo: string = '';
  @Output() close = new EventEmitter<void>();

  initialMessages: string[] = [
    '🎬 É diversão que você quer? Então bora testar se você lembra mesmo dessas séries e filmes ou se só deu play pra dormir no sofá. 😴',
    '🍿 Vamos ver se você é fã raiz... ou só clicou em "assistir trailer" e saiu contando que viu a série toda. 😜',
    '🎥 Se você sabe o nome do figurante que aparece no episódio 3 da segunda temporada... esse quiz é pra você. 😎',
    '📺 Você vive entre spoilers, memes e trends? Então bora provar que é fluente em cultura pop! 🔥',
  ];

  errorMessages: string[] = [
    '😕 Que pena, você errou! Mas não desista, assista novamente ao filme ou série e tente outra vez! 🍿',
    '😓 Ops, não foi dessa vez! Que tal dar uma revisada na série antes de tentar novamente? 📺',
    '🙈 Errou, hein? Mas relaxa, é só dar play de novo e voltar com tudo! 🎬',
    '😢 Não acertou dessa vez, mas o próximo vai ser moleza! Bora tentar de novo? 🚀',
  ];

  correctMessages: string[] = [
    '🎉 Mandou bem, cinéfilo do sofá!',
    '😎 Essa tava fácil, vai...',
    '🧠 Tá com memória boa ou andou revendo esse aí ontem?',
    '🎥 Até parece que você não decorou esse filme todo!',
    '😲 Olha... uma resposta correta. Milagre?',
    '😂 Essa aí até o meu tio saberia. Que fase!',
    '🔍 Parabéns, Sherlock. Acertou uma óbvia.',
    '😜 Tá querendo enganar quem com esse chute? Acertou? Sério isso?',
    '🎬 Você claramente pausou e analisou frame por frame desse filme.',
    '👍 Acertou. E nem precisou pesquisar no fórum.',
    '🌟 Esse detalhe só quem é fã hardcore saberia!',
    '🤓 Respondeu certo e ainda lembrou da teoria que nunca foi confirmada. Respeito!',
    '📱 Acertou! Essa vive nos Reels.',
    '🔥 Trend total, né? Nem tinha como errar.',
    '🎥 Você deve ter visto essa cena em pelo menos 4 dublagens diferentes no TikTok.',
    '🎉 Mandou bem! Já pode abrir um canal de reacts.',
  ];

  finishedMessages: string[] = [
    '🎉 Você realmente se diverte assistindo tudo, hein? Na He-Net, você vê tudo isso num só combo — e com mega velocidade! 🚀 Quem tá com tudo, tá com a He-Net. Agora vá lá testar sua sorte no brinde! 🎁',
    '🏆 Ok, temos aqui um verdadeiro "especialista de streaming" (ou um grande sortudo). Mas se quiser assistir tudo de verdade, é com a He-Net: Max, Telecine, Premiere e Paramount+ no combo. 🌟 Quem tá com tudo, tá com a He-Net. Agora vai buscar seu brinde... se merecer! 😎',
    '🎬 Você zerou o quiz e, se deixasse, ainda faria um podcast sobre ele. Na He-Net, você assiste tudo isso com qualidade digna de maratona! 📺 Quem tá com tudo, tá com a He-Net. Vai lá garantir seu brinde nerd! 🎮',
    '🔥 Tá com tudo nos hits do streaming, hein? Com a He-Net, você maratona tudo isso, e sem travar! 🚀 Agora corre pro brinde, que trend bom também é ganhar presente. 🎁',
  ];

  // Arrays de GIFs para mensagens iniciais e finais
  initialGifs: string[] = [
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjEzM3F1Z3BsdXM2Y25qenZtcGtsNHNxOTMxanFpeDc1eWh6cHd0MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IoMkSXKHQIDVm/giphy.gif'
  ];

  finishedGifs: string[] = [
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHM2Yjlma213eWJ0YzdjODU4MDczZmI3bWhjbXIyMjNscmRiY2t0OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/11sBLVxNs7v6WA/giphy.gif'
  ];

  // Mapeamento de GIFs por título (ignorando maiúsculas/minúsculas)
  private gifMap: { [key: string]: { feliz: string; triste: string } } = {
    'house of the dragon': { feliz: '../../../assets/gifs/hotd-feliz.gif', triste: '../../../assets/gifs/hotd-triste.gif' },
    'the last of us': { feliz: '../../../assets/gifs/tlou-feliz.gif', triste: '../../../assets/gifs/tlou-triste.gif' },
    'friends': { feliz: '../../../assets/gifs/friends-feliz.gif', triste: '../../../assets/gifs/friends-triste.gif' },
    'harry potter': { feliz: '../../../assets/gifs/hp-feliz.gif', triste: '../../../assets/gifs/hp-triste.gif' },
    'dexter': { feliz: '../../../assets/gifs/dexter-feliz.gif', triste: '../../../assets/gifs/dexter-triste.gif' },
    'bob espoja': { feliz: '../../../assets/gifs/bob-feliz.gif', triste: '../../../assets/gifs/bob-triste.gif' },
    'todo mundo odeia o chris': { feliz: '../../../assets/gifs/tmoc-feliz.gif', triste: '../../../assets/gifs/tmoc-triste.gif' },
    'meu malvado favorito': { feliz: '../../../assets/gifs/mmf-feliz.gif', triste: '../../../assets/gifs/mmf-triste.gif' },
  };

  private _initialMessage: string | null = null;
  private _errorMessage: string | null = null;
  private _correctMessage: string | null = null;
  private _finishedMessage: string | null = null;
  private _currentInitialGif: string | null = null;
  private _currentFinishedGif: string | null = null;

  get initialMessage(): string {
    if (!this._initialMessage || !this.isInitialMessage) {
      this._initialMessage = this.initialMessages[Math.floor(Math.random() * this.initialMessages.length)];
      this._currentInitialGif = this.initialGifs[Math.floor(Math.random() * this.initialGifs.length)];
    }
    return this._initialMessage;
  }

  get errorMessage(): string {
    if (!this._errorMessage || this.isInitialMessage) {
      this._errorMessage = this.errorMessages[Math.floor(Math.random() * this.errorMessages.length)];
    }
    return this._errorMessage;
  }

  get correctMessage(): string {
    if (!this._correctMessage || this.isInitialMessage) {
      this._correctMessage = this.correctMessages[Math.floor(Math.random() * this.correctMessages.length)];
    }
    return this._correctMessage;
  }

  get finishedMessage(): string {
    if (!this._finishedMessage || this.isInitialMessage) {
      this._finishedMessage = this.finishedMessages[Math.floor(Math.random() * this.finishedMessages.length)];
      this._currentFinishedGif = this.finishedGifs[Math.floor(Math.random() * this.finishedGifs.length)];
    }
    return this._finishedMessage;
  }

  getGifUrl(): string {
    if (this.isInitialMessage && this._currentInitialGif) {
      return this._currentInitialGif;
    }
    if (this.isQuizFinished && this._currentFinishedGif) {
      return this._currentFinishedGif;
    }

    const tituloNormalizado = this.perguntaTitulo.toLowerCase().trim();
    const gifs = this.gifMap[tituloNormalizado] || { feliz: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHltM2l1YzVmeXA3NHlsNzQ1d2YxZGQ3enh2bzd0czI3anp0Y2p4ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BPJmthQ3YRwD6QqcVD/giphy.gif', triste: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2tiOXhxZmpwdmc4M3EzeTA3eGt0d20wbDhyM2ZnZmxodm1zdXB4NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tXL4FHPSnVJ0A/giphy.gif' };
    return this.isCorrectAnswer ? gifs.feliz : gifs.triste;
  }

  resetMessages() {
    this._initialMessage = null;
    this._errorMessage = null;
    this._correctMessage = null;
    this._finishedMessage = null;
    this._currentInitialGif = null;
    this._currentFinishedGif = null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isInitialMessage'] && changes['isInitialMessage'].currentValue) {
      this.resetMessages();
    }
    if (!this.isInitialMessage && !this.isCorrectAnswer && !this.isQuizFinished) {
      this._errorMessage = null;
    }
    if (!this.isInitialMessage && this.isCorrectAnswer && !this.isQuizFinished) {
      this._correctMessage = null;
    }
    if (!this.isInitialMessage && this.isQuizFinished) {
      this._finishedMessage = null;
      this._currentFinishedGif = null;
    }
  }

  closePopup() {
    this.close.emit();
  }
}