import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TituloService } from '../../../services/titulo.service';
import { Titulo } from '../../../models/titulo';

@Component({
  selector: 'app-titulos-create-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './titulos-create-update.component.html',
  styleUrl: './titulos-create-update.component.css'
})
export class TitulosCreateUpdateComponent {
  @Input() isOpen: boolean = false;
  @Input() titulo: Titulo | null = null;
  @Input() isEditMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Titulo>();

  previewImage: string | null = null;
  selectedFile: File | null = null;
  titleName: string = '';

  constructor(private tituloService: TituloService) {}

  ngOnChanges() {
    if (this.titulo) {
      this.titleName = this.titulo.nome;
      this.previewImage = this.titulo.imagemUrl || null;
      this.isEditMode = !!this.titulo.id;
    } else {
      this.resetForm();
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('coverImage') as HTMLInputElement;
    fileInput.click();
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveTitle() {
    if (!this.titleName) {
      alert('O nome do título é obrigatório.');
      return;
    }

    // Cria o objeto título sem incluir imagemUrl diretamente
    const titulo: Titulo = {
      id: this.isEditMode ? this.titulo?.id : undefined,
      nome: this.titleName,
      perguntaList: this.titulo?.perguntaList || []
    };

    if (this.selectedFile) {
      // Faz upload da imagem primeiro
      this.tituloService.uploadImage(this.selectedFile).subscribe({
        next: (createdTitulo) => {
          // Atualiza o título com a URL da imagem retornada pelo backend
          const updatedTitulo = { ...titulo, imagemUrl: createdTitulo.imagemUrl };
          this.saveOrUpdate(updatedTitulo);
        },
        error: (err) => {
          console.error('Erro ao fazer upload da imagem:', err);
          alert('Erro ao fazer upload da imagem. Tente novamente.');
        }
      });
    } else {
      // Mantém a imagemUrl existente no modo de edição, ou undefined no modo de criação
      if (this.isEditMode && this.titulo?.imagemUrl) {
        titulo.imagemUrl = this.titulo.imagemUrl;
      }
      this.saveOrUpdate(titulo);
    }
  }

  private saveOrUpdate(titulo: Titulo) {
    const saveObservable = this.isEditMode && titulo.id
      ? this.tituloService.update(titulo.id, titulo)
      : this.tituloService.create(titulo);

    saveObservable.subscribe({
      next: (savedTitulo) => {
        this.save.emit(savedTitulo);
        this.closeModal();
      },
      error: (err) => {
        console.error('Erro ao salvar título:', err);
        alert('Erro ao salvar título. Verifique os dados e tente novamente.');
      }
    });
  }

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  private resetForm() {
    this.titleName = '';
    this.previewImage = null;
    this.selectedFile = null;
    this.isEditMode = false;
  }
}