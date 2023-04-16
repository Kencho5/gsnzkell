import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCostComponent } from './service-cost.component';

describe('ServiceCostComponent', () => {
  let component: ServiceCostComponent;
  let fixture: ComponentFixture<ServiceCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
