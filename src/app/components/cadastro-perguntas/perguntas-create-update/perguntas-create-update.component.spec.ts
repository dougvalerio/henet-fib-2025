import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntasCreateUpdateComponent } from './perguntas-create-update.component';

describe('PerguntasCreateUpdateComponent', () => {
  let component: PerguntasCreateUpdateComponent;
  let fixture: ComponentFixture<PerguntasCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerguntasCreateUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerguntasCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
