import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerguntasCreateUpdateComponent } from '../perguntas-create-update/perguntas-create-update.component';
import { PerguntaService } from '../../../services/pergunta.service';
import { TituloService } from '../../../services/titulo.service';
import { Pergunta } from '../../../models/pergunta';
import { Titulo } from '../../../models/titulo';
import { PerguntaFilter } from '../../../models/perguntaFilter';

@Component({
  selector: 'app-perguntas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PerguntasCreateUpdateComponent],
  templateUrl: './perguntas-list.component.html',
  styleUrls: ['./perguntas-list.component.css']
})
export class PerguntasListComponent implements OnInit {
  titulos: Titulo[] = [];
  perguntas: Pergunta[] = [];
  rotulosRespostas = ['A', 'B', 'C', 'D'];
  modalAberto = false;
  modoEdicao = false;
  perguntaSelecionada: Pergunta | null = null;
  filter: PerguntaFilter = {};
  selectedTituloId: string | null = null;

  constructor(
    private servicoPergunta: PerguntaService,
    private servicoTitulo: TituloService
  ) {}

  ngOnInit() {
    this.carregarTitulos();
    this.carregarPerguntas();
  }

  carregarTitulos() {
    this.servicoTitulo.findAll().subscribe({
      next: (titulos) => {
        this.titulos = titulos.filter(titulo => !!titulo.id);
      },
      error: (err) => {
        console.error('Erro ao carregar títulos:', err);
      }
    });
  }

  carregarPerguntas() {
    this.servicoPergunta.findAll(this.filter).subscribe({
      next: (perguntas) => {
        this.perguntas = perguntas.filter(pergunta => !!pergunta.id);
      },
      error: (err) => {
        console.error('Erro ao carregar perguntas:', err);
      }
    });
  }

  filtrarPorTitulo(event: Event) {
    const target = event.target as HTMLSelectElement;
    const tituloId = target.value;
    const id = tituloId === '' || tituloId === null ? null : +tituloId;
    this.filter.tituloId = id;
    this.selectedTituloId = tituloId;
    this.carregarPerguntas();
  }

  getTituloNome(tituloId: string | null): string {
    if (!tituloId) {
      return 'Sem título';
    }
    const titulo = this.titulos.find(t => t.id?.toString() === tituloId.toString());
    return titulo ? titulo.nome : 'Sem título';
  }

  abrirModalCriar() {
    this.modalAberto = true;
    this.modoEdicao = false;
    this.perguntaSelecionada = {
      pergunta: '',
      respostaA: '',
      respostaB: '',
      respostaC: '',
      respostaD: '',
      respostaCorreta: null,
      titulo: null
    };
  }

  abrirModalEditar(pergunta: Pergunta) {
    this.modalAberto = true;
    this.modoEdicao = true;
    this.perguntaSelecionada = { ...pergunta };
  }

  fecharModal() {
    this.modalAberto = false;
    this.perguntaSelecionada = null;
  }

  salvarPergunta() {
    this.carregarPerguntas();
    this.fecharModal();
  }

  excluirPergunta(id: string | undefined) {
    if (!id) {
      alert('ID da pergunta inválido.');
      return;
    }
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
      this.servicoPergunta.delete(id).subscribe({
        next: () => {
          this.carregarPerguntas();
        },
        error: (err) => {
          console.error('Erro ao excluir pergunta:', err);
          alert('Erro ao excluir pergunta. Tente novamente.');
        }
      });
    }
  }
}