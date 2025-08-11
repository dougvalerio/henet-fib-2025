import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulamentoComponent } from './regulamento.component';

describe('RegulamentoComponent', () => {
  let component: RegulamentoComponent;
  let fixture: ComponentFixture<RegulamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegulamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegulamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
