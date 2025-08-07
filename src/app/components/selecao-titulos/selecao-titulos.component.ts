import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selecao-titulos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selecao-titulos.component.html',
  styleUrl: './selecao-titulos.component.css'
})
export class SelecaoTitulosComponent {
  titulos = [
    { title: 'The Last of US', imagePath: '../../../assets/TLOUS.jpg', selected: false },
    { title: 'House of the Dragon', imagePath: '../../../assets/HOD.jpg', selected: false },
    { title: 'F.r.i.e.n.d.s', imagePath: '../../../assets/friends.jpg', selected: false },
    { title: 'Harry Potter', imagePath: '../../../assets/hp.jpg', selected: false },
    { title: 'Bob Esponja', imagePath: '../../../assets/be.jpg', selected: false },
    { title: 'Dexter', imagePath: '../../../assets/dexter.jpg', selected: false },
    { title: 'Todo Mundo Odeia o Chris', imagePath: '../../../assets/tmoc.jpg', selected: false },
    { title: 'Meu Malvado Favorito', imagePath: '../../../assets/mmf.jpg', selected: false },
  ];

  selectedCount = 0;

  toggleSelection(index: number) {
    if (this.titulos[index].selected) {
      this.titulos[index].selected = false;
      this.selectedCount--;
    } else if (this.selectedCount < 3) {
      this.titulos[index].selected = true;
      this.selectedCount++;
    }
  }

  startQuiz() {
    if (this.selectedCount === 3) {
      console.log('Iniciando quiz com:', this.titulos.filter(t => t.selected));
      // Adicione aqui a lógica para iniciar o quiz
    }
  }
}