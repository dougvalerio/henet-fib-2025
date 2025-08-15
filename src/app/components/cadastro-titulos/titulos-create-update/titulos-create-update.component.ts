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
  imagemExcluida: boolean = false;

  constructor(private tituloService: TituloService) {}

  ngOnChanges() {
    if (this.isOpen) {
      if (this.titulo && this.isEditMode) {
        // Modo de edição: carrega os dados do título
        this.titleName = this.titulo.nome;
        this.buscarImagemServidor();
      } else {
        // Modo de criação: reinicia o formulário
        this.resetForm();
      }
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
      if (this.selectedFile.type === 'image/jpeg' || this.selectedFile.type === 'image/png') {
        if (this.selectedFile.size > 3145728) { // 3 MB
          alert('A imagem é muito grande. Por favor, selecione uma imagem de até 3 MB');
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxSize = 500;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            this.previewImage = canvas.toDataURL(this.selectedFile!.type);
            this.imagemExcluida = false;
          };
        };
      } else {
        alert('Por favor, selecione uma imagem JPG ou PNG.');
      }
    }
  }

  excluirImagem() {
    this.imagemExcluida = true;
    this.previewImage = null;
    this.selectedFile = null;
    if (this.isEditMode && this.titulo?.id) {
      this.tituloService.deleteImage(this.titulo.id).subscribe({
        next: () => {
          alert('Imagem excluída com sucesso.');
          this.titulo!.imagemUrl = undefined;
        },
        error: (error) => {
          alert('Erro ao excluir a imagem.');
          console.error('Erro ao excluir imagem:', error);
        }
      });
    }
  }

  private buscarImagemServidor() {
    if (this.titulo?.id) {
      this.tituloService.downloadImage(this.titulo.id).subscribe({
        next: (blob: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => {
            this.previewImage = reader.result as string;
          };
        },
        error: (error) => {
          if (error.status !== 404) {
            alert('Erro ao carregar a imagem do título.');
            console.error('Erro ao carregar imagem:', error);
          }
        }
      });
    }
  }

  saveTitle() {
    if (!this.titleName) {
      alert('O nome do título é obrigatório.');
      return;
    }

    const titulo: Titulo = {
      id: this.isEditMode ? this.titulo?.id : undefined,
      nome: this.titleName,
      perguntaList: this.titulo?.perguntaList || [],
      imagemUrl: this.isEditMode ? this.titulo?.imagemUrl : undefined
    };

    const saveObservable = this.isEditMode && titulo.id
      ? this.tituloService.update(titulo.id, titulo)
      : this.tituloService.create(titulo);

    saveObservable.subscribe({
      next: (savedTitulo) => {
        this.titulo = savedTitulo;
        if (this.selectedFile && !this.imagemExcluida) {
          this.enviarImagemServidor();
        } else {
          this.save.emit(savedTitulo);
          this.closeModal();
        }
      },
      error: (err) => {
        console.error('Erro ao salvar título:', err);
        alert('Erro ao salvar título. Verifique os dados e tente novamente.');
      }
    });
  }

  private enviarImagemServidor() {
    if (this.selectedFile && this.titulo?.id) {
      this.tituloService.uploadImage(this.titulo.id, this.selectedFile).subscribe({
        next: (imagemUrl) => {
          this.titulo!.imagemUrl = imagemUrl;
          this.save.emit(this.titulo!);
          alert('Imagem carregada com sucesso.');
          this.closeModal();
        },
        error: (error) => {
          alert('Erro ao carregar a imagem: ' + (error.message || 'Tente novamente.'));
          console.error('Erro ao carregar imagem:', error);
        }
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
    this.imagemExcluida = false;
    this.isEditMode = false;
    this.titulo = null; // Garante que o título interno seja nulo
  }
}