import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe o CommonModule

@Component({
  selector: 'app-popup-resultado-resposta',
  standalone: true,
  imports: [CommonModule], // Adicione CommonModule aqui
  templateUrl: './popup-resultado-resposta.component.html',
  styleUrl: './popup-resultado-resposta.component.css',
})
export class PopupResultadoRespostaComponent {
  @Input() showPopup: boolean = false;
  @Input() isCorrectAnswer: boolean = false;
  @Input() isQuizFinished: boolean = false;
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
}