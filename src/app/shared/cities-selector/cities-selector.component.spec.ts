import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitiesSelectorComponent } from './cities-selector.component';

describe('CitiesSelectorComponent', () => {
  let component: CitiesSelectorComponent;
  let fixture: ComponentFixture<CitiesSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitiesSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitiesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
