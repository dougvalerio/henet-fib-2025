import { TestBed } from '@angular/core/testing';

import { JogoCabecalhoService } from './jogo-cabecalho.service';

describe('JogoCabecalhoService', () => {
  let service: JogoCabecalhoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JogoCabecalhoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
