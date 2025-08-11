import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  systemLogo: string | null = null;
  quizLogo: string | null = null;
  backgroundImage: string | null = null;
  primaryColor: string = '#1E3A8A';
  secondaryColor: string = '#10B981';
  textColor: string = '#111827';

  onSystemLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.systemLogo = URL.createObjectURL(input.files[0]);
    }
  }

  onQuizLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.quizLogo = URL.createObjectURL(input.files[0]);
    }
  }

  onBackgroundChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.backgroundImage = URL.createObjectURL(input.files[0]);
    }
  }

  onPrimaryColorChange(): void {
    document.documentElement.style.setProperty('--primary-color', this.primaryColor);
  }

  onSecondaryColorChange(): void {
    document.documentElement.style.setProperty('--secondary-color', this.secondaryColor);
  }

  onTextColorChange(): void {
    document.documentElement.style.setProperty('--text-color', this.textColor);
  }

  saveConfig(): void {
    // Lógica para salvar as configurações (ex.: enviar para uma API)
    console.log('Configurações salvas:', {
      systemLogo: this.systemLogo,
      quizLogo: this.quizLogo,
      backgroundImage: this.backgroundImage,
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor,
      textColor: this.textColor
    });
  }
}