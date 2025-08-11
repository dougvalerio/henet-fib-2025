import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitulosCreateUpdateComponent } from '../titulos-create-update/titulos-create-update.component';

@Component({
  selector: 'app-titulos-list',
  standalone: true,
  imports: [CommonModule, TitulosCreateUpdateComponent],
  templateUrl: './titulos-list.component.html',
  styleUrl: './titulos-list.component.css'
})
export class TitulosListComponent {
  titles = [
    { name: 'The Last of Us', cover: '../../../../assets/TLOUS.jpg' },
    { name: 'House of The Dragon', cover: '../../../../assets/HOD.jpg' }
  ];
  isModalOpen = false;
  isEditMode = false;
  selectedTitle: { name: string, cover: string } | null = null;
  selectedIndex: number | null = null;

  openCreateModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.selectedTitle = { name: '', cover: '' }; // Inicializa com valores padrão
  }

  openEditModal(title: { name: string, cover: string }, index: number) {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.selectedTitle = { ...title };
    this.selectedIndex = index;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTitle = null;
    this.selectedIndex = null;
  }

  saveTitle(data: { title: string, image: File | null }) {
    const coverUrl = data.image ? URL.createObjectURL(data.image) : (this.selectedTitle?.cover || '');
    if (this.isEditMode && this.selectedIndex !== null) {
      this.titles[this.selectedIndex] = { name: data.title, cover: coverUrl };
    } else {
      this.titles.push({ name: data.title, cover: coverUrl });
    }
    this.closeModal();
  }

  deleteTitle(index: number) {
    this.titles.splice(index, 1);
  }
}