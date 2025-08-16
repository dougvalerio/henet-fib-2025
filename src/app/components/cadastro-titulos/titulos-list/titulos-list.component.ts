import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitulosCreateUpdateComponent } from '../titulos-create-update/titulos-create-update.component';
import { TituloService } from '../../../services/titulo.service';
import { Titulo } from '../../../models/titulo';

@Component({
  selector: 'app-titulos-list',
  standalone: true,
  imports: [CommonModule, TitulosCreateUpdateComponent],
  templateUrl: './titulos-list.component.html',
  styleUrl: './titulos-list.component.css'
})
export class TitulosListComponent implements OnInit {
  titulos: Titulo[] = [];
  modalAberto = false;
  modoEdicao = false;
  tituloSelecionado: Titulo | null = null;
  urlsImagens: { [key: string]: string } = {};

  constructor(private servicoTitulo: TituloService) {}

  ngOnInit() {
    this.carregarTitulos();
  }

  carregarTitulos() {
    this.servicoTitulo.findAll().subscribe({
      next: (titulos) => {
        this.titulos = titulos;
        this.titulos.forEach((titulo) => {
          if (titulo.id && titulo.imagemUrl) {
            this.carregarImagem(titulo.id);
          }
        });
      },
      error: (err) => console.error('Erro ao carregar títulos:', err)
    });
  }

  carregarImagem(id: any) {
    this.servicoTitulo.downloadImage(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.urlsImagens[id] = url;
      },
      error: (err) => {
        console.error('Erro ao carregar imagem:', err);
        this.urlsImagens[id] = 'assets/placeholder.jpg';
      }
    });
  }

  abrirModalCriar() {
    this.modalAberto = true;
    this.modoEdicao = false;
    this.tituloSelecionado = { nome: '', perguntaList: [], imagemUrl: undefined };
  }

  abrirModalEditar(titulo: Titulo) {
    this.modalAberto = true;
    this.modoEdicao = true;
    this.tituloSelecionado = { ...titulo };
  }

  fecharModal() {
    this.modalAberto = false;
    this.tituloSelecionado = null;
  }

  salvarTitulo(titulo: Titulo) {
    this.carregarTitulos();
    this.fecharModal();
  }

  excluirTitulo(id: any) {
    if (confirm('Tem certeza que deseja excluir este título?')) {
      this.servicoTitulo.delete(id).subscribe({
        next: () => {
          this.carregarTitulos();
          if (this.urlsImagens[id]) {
            URL.revokeObjectURL(this.urlsImagens[id]);
            delete this.urlsImagens[id];
          }
        },
        error: (err) => console.error('Erro ao excluir título:', err)
      });
    }
  }
}