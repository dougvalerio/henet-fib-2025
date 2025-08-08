import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitulosCreateUpdateComponent } from './titulos-create-update.component';

describe('TitulosCreateUpdateComponent', () => {
  let component: TitulosCreateUpdateComponent;
  let fixture: ComponentFixture<TitulosCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitulosCreateUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitulosCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
