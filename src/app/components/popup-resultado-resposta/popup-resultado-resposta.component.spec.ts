import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupResultadoRespostaComponent } from './popup-resultado-resposta.component';

describe('PopupResultadoRespostaComponent', () => {
  let component: PopupResultadoRespostaComponent;
  let fixture: ComponentFixture<PopupResultadoRespostaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupResultadoRespostaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupResultadoRespostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
