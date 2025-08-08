import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntasListComponent } from './perguntas-list.component';

describe('PerguntasListComponent', () => {
  let component: PerguntasListComponent;
  let fixture: ComponentFixture<PerguntasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerguntasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerguntasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
