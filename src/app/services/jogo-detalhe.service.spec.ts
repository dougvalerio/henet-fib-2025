import { TestBed } from '@angular/core/testing';

import { JogoDetalheService } from './jogo-detalhe.service';

describe('JogoDetalheService', () => {
  let service: JogoDetalheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JogoDetalheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
