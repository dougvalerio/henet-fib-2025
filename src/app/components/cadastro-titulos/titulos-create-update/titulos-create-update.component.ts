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
      // Carrega a imagem do título no modo de edição
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

    const titulo: Titulo = {
      id: this.titulo?.id,
      nome: this.titleName,
      imagemUrl: this.previewImage,
      perguntaList: this.titulo?.perguntaList || []
    };

    if (this.selectedFile) {
      // Caso uma nova imagem tenha sido selecionada, faz upload
      this.tituloService.uploadImage(this.selectedFile).subscribe({
        next: (createdTitulo) => {
          // Atualiza o título com a nova imagem
          const updatedTitulo = { ...titulo, imagemUrl: createdTitulo.imagemUrl };
          if (this.isEditMode) {
            this.tituloService.update(titulo.id, updatedTitulo).subscribe({
              next: (savedTitulo) => {
                this.save.emit(savedTitulo);
                this.closeModal();
              },
              error: (err) => console.error('Erro ao atualizar título:', err)
            });
          } else {
            this.save.emit(createdTitulo);
            this.closeModal();
          }
        },
        error: (err) => console.error('Erro ao fazer upload da imagem:', err)
      });
    } else {
      // Caso não haja nova imagem, apenas cria ou atualiza o título
      const saveObservable = this.isEditMode
        ? this.tituloService.update(this.titulo!.id, titulo)
        : this.tituloService.create(titulo);

      saveObservable.subscribe({
        next: (savedTitulo) => {
          this.save.emit(savedTitulo);
          this.closeModal();
        },
        error: (err) => console.error('Erro ao salvar título:', err)
      });
    }
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