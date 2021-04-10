import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraCreditMachineComponent } from './extra-credit-machine.component';

describe('ExtraCreditMachineComponent', () => {
  let component: ExtraCreditMachineComponent;
  let fixture: ComponentFixture<ExtraCreditMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraCreditMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraCreditMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
