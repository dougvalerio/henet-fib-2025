import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TituloService } from '../../../services/titulo.service';
import { Titulo } from '../../../models/titulo';

@Component({
  selector: 'app-titulos-create-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './titulos-create-update.component.html',
  styleUrls: ['./titulos-create-update.component.css']
})
export class TitulosCreateUpdateComponent implements OnChanges {
  @Input() modalAberto: boolean = false;
  @Input() titulo: Titulo | null = null;
  @Input() modoEdicao: boolean = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<Titulo>();

  imagemPrevia: string | null = null;
  arquivoSelecionado: File | null = null;
  nomeTitulo: string = '';
  imagemExcluida: boolean = false;
  mensagemErro: string | null = null;

  constructor(private servicoTitulo: TituloService) {}

  ngOnChanges(changes: SimpleChanges) {
    // Reiniciar o formulário apenas se o modal for fechado ou estivermos no modo de criação
    if (changes['modalAberto'] && !this.modalAberto) {
      this.reiniciarFormulario();
      return;
    }

    // Carregar dados do título apenas se o modal está aberto e no modo de edição
    if (this.modalAberto && this.modoEdicao && this.titulo && (changes['titulo'] || changes['modoEdicao'] || changes['modalAberto'])) {
      this.nomeTitulo = this.titulo.nome || '';
      this.imagemExcluida = !this.titulo.imagemUrl;
      this.imagemPrevia = null; // Resetar imagemPrevia antes de carregar
      if (this.titulo.imagemUrl) {
        this.carregarImagemServidor();
      }
    } else if (this.modalAberto && !this.modoEdicao) {
      // Modo de criação: garantir que o formulário esteja limpo
      this.reiniciarFormulario();
    }
  }

  acionarInputArquivo() {
    const inputArquivo = document.getElementById('coverImage') as HTMLInputElement;
    inputArquivo.click();
  }

  aoMudarImagem(event: Event) {
    this.mensagemErro = null;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.arquivoSelecionado = input.files[0];
      if (this.arquivoSelecionado.type === 'image/jpeg' || this.arquivoSelecionado.type === 'image/png') {
        if (this.arquivoSelecionado.size > 3145728) { // 3 MB
          this.mensagemErro = 'A imagem é muito grande. Por favor, selecione uma imagem de até 3 MB.';
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(this.arquivoSelecionado);
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
            this.imagemPrevia = canvas.toDataURL(this.arquivoSelecionado!.type);
            this.imagemExcluida = false;
          };
        };
      } else {
        this.mensagemErro = 'Por favor, selecione uma imagem JPG ou PNG.';
      }
    }
  }

  excluirImagem() {
    this.mensagemErro = null;
    this.imagemExcluida = true;
    this.imagemPrevia = null;
    this.arquivoSelecionado = null;
    if (this.modoEdicao && this.titulo?.id) {
      this.servicoTitulo.deleteImage(this.titulo.id).subscribe({
        next: () => {
          this.titulo!.imagemUrl = undefined;
        },
        error: (error) => {
          this.mensagemErro = 'Erro ao excluir a imagem: ' + (error.message || 'Tente novamente.');
          console.error('Erro ao excluir imagem:', error);
        }
      });
    }
  }

  private carregarImagemServidor() {
    if (this.titulo?.id && this.titulo.imagemUrl && !this.imagemExcluida) {
      this.servicoTitulo.downloadImage(this.titulo.id).subscribe({
        next: (blob: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => {
            this.imagemPrevia = reader.result as string;
          };
        },
        error: (error) => {
          if (error.status !== 404) {
            this.mensagemErro = 'Erro ao carregar a imagem do título.';
            console.error('Erro ao carregar imagem:', error);
          }
          this.imagemPrevia = null;
        }
      });
    } else {
      this.imagemPrevia = null;
    }
  }

  salvarTitulo() {
    this.mensagemErro = null;

    if (!this.nomeTitulo.trim()) {
      this.mensagemErro = 'O nome do título é obrigatório.';
      return;
    }

    const titulo: Titulo = {
      nome: this.nomeTitulo,
      perguntaList: this.titulo?.perguntaList || [],
      id: this.modoEdicao ? this.titulo?.id : undefined,
      imagemUrl: this.titulo?.imagemUrl
    };

    const operacaoSalvar = this.modoEdicao && this.titulo?.id
      ? this.servicoTitulo.update(this.titulo.id, titulo)
      : this.servicoTitulo.create(titulo);

    operacaoSalvar.subscribe({
      next: (tituloSalvo) => {
        this.titulo = tituloSalvo;
        if (this.arquivoSelecionado && !this.imagemExcluida) {
          this.enviarImagemServidor();
        } else {
          this.salvar.emit(tituloSalvo);
          this.fecharModal();
        }
      },
      error: (err) => {
        const mensagemErro = err.error?.message || err.message || 'Erro interno no servidor. Tente novamente.';
        this.mensagemErro = `Erro ao salvar título: ${mensagemErro}`;
        console.error('Erro ao salvar título:', err);
      }
    });
  }

  private enviarImagemServidor() {
    if (this.arquivoSelecionado && this.titulo?.id) {
      this.servicoTitulo.uploadImage(this.titulo.id, this.arquivoSelecionado).subscribe({
        next: (imagemUrl) => {
          this.titulo!.imagemUrl = imagemUrl;
          this.salvar.emit(this.titulo!);
          this.fecharModal();
        },
        error: (error) => {
          this.mensagemErro = 'Erro ao carregar a imagem: ' + (error.message || 'Tente novamente.');
          console.error('Erro ao carregar imagem:', error);
        }
      });
    }
  }

  fecharModal() {
    this.fechar.emit();
    this.reiniciarFormulario();
  }

  private reiniciarFormulario() {
    this.nomeTitulo = '';
    this.imagemPrevia = null;
    this.arquivoSelecionado = null;
    this.imagemExcluida = false;
    this.mensagemErro = null;
  }
}