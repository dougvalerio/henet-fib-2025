import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitulosCreateUpdateComponent } from '../titulos-create-update/titulos-create-update.component';
import { TituloService } from '../../../services/titulo.service';
import { Titulo } from '../../../models/titulo';

@Component({
  selector: 'app-titulos-list',
  standalone: true,
  imports: [CommonModule, TitulosCreateUpdateComponent], // Remova HttpClientModule
  templateUrl: './titulos-list.component.html',
  styleUrl: './titulos-list.component.css'
})
export class TitulosListComponent implements OnInit {
  titles: Titulo[] = [];
  isModalOpen = false;
  isEditMode = false;
  selectedTitle: Titulo | null = null;
  imageUrls: { [key: string]: string } = {};

  constructor(private tituloService: TituloService) {}

  ngOnInit() {
    this.loadTitles();
  }

  loadTitles() {
    this.tituloService.findAll().subscribe({
      next: (titles) => {
        this.titles = titles;
        this.titles.forEach((title) => {
          if (title.id && title.imagemUrl) {
            this.loadImage(title.id);
          }
        });
      },
      error: (err) => console.error('Erro ao carregar títulos:', err)
    });
  }

  loadImage(id: any) {
    this.tituloService.downloadImage(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.imageUrls[id] = url;
      },
      error: (err) => {
        console.error('Erro ao carregar imagem:', err);
        this.imageUrls[id] = 'assets/placeholder.jpg';
      }
    });
  }

  openCreateModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.selectedTitle = null;
  }

  openEditModal(title: Titulo) {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.tituloService.findById(title.id).subscribe({
      next: (titulo) => {
        this.selectedTitle = titulo;
      },
      error: (err) => console.error('Erro ao carregar título:', err)
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTitle = null;
  }

  saveTitle(titulo: Titulo) {
    this.loadTitles();
    this.closeModal();
  }

  deleteTitle(id: any) {
    if (confirm('Tem certeza que deseja excluir este título?')) {
      this.tituloService.delete(id).subscribe({
        next: () => {
          this.loadTitles();
        },
        error: (err) => console.error('Erro ao excluir título:', err)
      });
    }
  }
}