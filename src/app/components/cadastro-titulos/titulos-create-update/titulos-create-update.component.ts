import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-titulos-create-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './titulos-create-update.component.html',
  styleUrl: './titulos-create-update.component.css'
})
export class TitulosCreateUpdateComponent {
  @Input() isOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() titleName: string | null | undefined = ''; // Aceita null ou undefined
  @Input() coverImage: string | null | undefined = null; // Aceita null ou undefined
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ title: string, image: File | null }>();

  previewImage: string | null = null;
  selectedFile: File | null = null;

  ngOnChanges() {
    this.previewImage = this.coverImage || null; // Garante que previewImage seja null se coverImage for undefined
    if (!this.isEditMode) {
      this.titleName = ''; // Reseta o título no modo de criação
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

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  saveTitle() {
    if (this.titleName) { // Garante que titleName não seja null/undefined
      this.save.emit({ title: this.titleName, image: this.selectedFile });
      this.resetForm();
    }
  }

  private resetForm() {
    this.titleName = '';
    this.previewImage = null;
    this.selectedFile = null;
  }
}