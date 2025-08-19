import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TituloService } from '../../services/titulo.service';
import { GameService } from '../../services/game.service';
import { Titulo } from '../../models/titulo';
import { TitulosSelecionados } from '../../models/titulosSelecionados';
import { JogoCabecalho } from '../../models/jogo-cabecalho';

@Component({
  selector: 'app-selecao-titulos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selecao-titulos.component.html',
  styleUrl: './selecao-titulos.component.css',
})
export class SelecaoTitulosComponent implements OnInit {
  titulos: (Titulo & { selected: boolean; imagemPrevia?: string })[] = [];
  selectedCount = 0;
  titulosSelecionados: TitulosSelecionados = {
    cadastroId: null,
    titulosIds: []
  };

  constructor(
    private router: Router,
    private tituloService: TituloService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    if (state && state.cadastroId) {
      this.titulosSelecionados.cadastroId = Number(state.cadastroId); // Converte para número
      console.log('Cadastro ID recebido:', this.titulosSelecionados.cadastroId);
    } else {
      console.error('Erro: cadastroId não encontrado no state.');
      // Opcional: redirecionar ou exibir mensagem de erro para o usuário
      // this.router.navigate(['/alguma-rota-de-erro']);
    }
    this.carregarTitulos();
  }

  carregarTitulos(): void {
    this.tituloService.findAll().subscribe({
      next: (titulos: Titulo[]) => {
        this.titulos = titulos.map(titulo => ({ ...titulo, selected: false, imagemPrevia: '' }));
        this.carregarImagens();
      },
      error: (error) => {
        console.error('Erro ao carregar títulos:', error);
      }
    });
  }

  carregarImagens(): void {
    this.titulos.forEach(titulo => {
      if (titulo.id && titulo.imagemUrl) {
        this.tituloService.downloadImage(titulo.id).subscribe({
          next: (blob: Blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => {
              titulo.imagemPrevia = reader.result as string;
            };
          },
          error: (error) => {
            console.error(`Erro ao carregar imagem do título ${titulo.nome}:`, error);
            titulo.imagemPrevia = '';
          }
        });
      } else {
        titulo.imagemPrevia = '';
      }
    });
  }

  toggleSelection(index: number) {
    if (this.titulos[index].selected) {
      this.titulos[index].selected = false;
      this.selectedCount--;
    } else if (this.selectedCount < 3) {
      this.titulos[index].selected = true;
      this.selectedCount++;
    }
  }

  startQuiz() {
    if (this.selectedCount === 3) {
      // Armazena os IDs dos títulos selecionados
      this.titulosSelecionados.titulosIds = this.titulos
        .filter(t => t.selected)
        .map(t => Number(t.id)); // Garante que os IDs são números

      // Log detalhado do objeto enviado
      console.log('Enviando para /api/game/start:', this.titulosSelecionados);

      // Validação antes de enviar
      if (!this.titulosSelecionados.cadastroId || !this.titulosSelecionados.titulosIds.length) {
        console.error('Erro: Dados inválidos. CadastroId ou titulosIds estão ausentes.');
        return;
      }

      // Chama o método startGame do GameService
      this.gameService.startGame(this.titulosSelecionados).subscribe({
        next: (jogoCabecalho: JogoCabecalho) => {
          console.log('Resposta do startGame:', jogoCabecalho);

          // Navega para a tela de perguntas
          this.router.navigate(['/perguntas'], {
            state: {
              titulosSelecionados: this.titulosSelecionados,
              selectedTitles: this.titulos.filter(t => t.selected),
              jogoCabecalho: jogoCabecalho
            }
          });
        },
        error: (error: any) => {
          console.error('Erro ao iniciar o jogo:', error);
          if (error.error) {
            console.error('Detalhes do erro retornado pelo servidor:', error.error);
          }
        }
      });
    }
  }
}