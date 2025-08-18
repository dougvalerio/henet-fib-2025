import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroService } from '../../services/cadastro.service';
import { Cadastro } from '../../models/cadastro';

@Component({
  selector: 'app-cadastro-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cadastro-list.component.html',
  styleUrl: './cadastro-list.component.css'
})
export class CadastroListComponent implements OnInit {
  cadastros: Cadastro[] = [];

  constructor(private cadastroService: CadastroService) {}

  ngOnInit() {
    this.carregarCadastros();
  }

  carregarCadastros() {
    this.cadastroService.findAll().subscribe({
      next: (cadastros) => {
        this.cadastros = cadastros.filter(cadastro => !!cadastro.id);
      },
      error: (err) => {
        console.error('Erro ao carregar cadastros:', err);
      }
    });
  }
}