import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { Cadastro } from '../../models/cadastro';
import { CadastroFilter } from '../../models/cadastroFilter';

@Component({
  selector: 'app-cadastro-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-list.component.html',
  styleUrl: './cadastro-list.component.css'
})
export class CadastroListComponent implements OnInit {
  cadastros: Cadastro[] = [];
  searchTerm: string = '';

  constructor(private cadastroService: CadastroService) {}

  ngOnInit() {
    this.carregarCadastros();
  }

  carregarCadastros(filter?: CadastroFilter) {
    this.cadastroService.findAll(filter).subscribe({
      next: (cadastros) => {
        this.cadastros = cadastros.filter(cadastro => !!cadastro.id);
        console.log("Exibindo cadastros: ", this.cadastros)
      },
      error: (err) => {
        console.error('Erro ao carregar cadastros:', err);
      }
    });
  }

  searchCadastros() {
    const filter: CadastroFilter = {};
    if (this.searchTerm.trim()) {
      filter.pesquisa = this.searchTerm.trim();
    }
    this.carregarCadastros(filter);
  }

  onSearchTermChange() {
    if (!this.searchTerm.trim()) {
      this.carregarCadastros();
    }
  }
}