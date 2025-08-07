import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecaoTitulosComponent } from './selecao-titulos.component';

describe('SelecaoTitulosComponent', () => {
  let component: SelecaoTitulosComponent;
  let fixture: ComponentFixture<SelecaoTitulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecaoTitulosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecaoTitulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
