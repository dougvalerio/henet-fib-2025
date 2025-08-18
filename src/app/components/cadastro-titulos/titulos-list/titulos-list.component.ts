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
  styleUrls: ['./titulos-list.component.css']
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
        this.titulos = titulos.filter(titulo => !!titulo.id);
        this.titulos.forEach((titulo) => {
          if (titulo.imagemUrl) {
            this.carregarImagem(titulo.id!);
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
      error: () => {
        // Não exibir erro no console, apenas não definir a URL
        // O HTML cuidará de exibir o ícone padrão
      }
    });
  }

  abrirModalCriar() {
    this.tituloSelecionado = null;
    this.modalAberto = true;
    this.modoEdicao = false;
  }

  abrirModalEditar(titulo: Titulo) {
    this.tituloSelecionado = { ...titulo };
    console.log('Objeto completo a ser editado:', JSON.stringify(this.tituloSelecionado, null, 2));
    this.modoEdicao = true;
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.tituloSelecionado = null;
    this.modoEdicao = false;
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