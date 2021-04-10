import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeRedeemerComponent } from './code-redeemer.component';

describe('CodeRedeemerComponent', () => {
  let component: CodeRedeemerComponent;
  let fixture: ComponentFixture<CodeRedeemerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeRedeemerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeRedeemerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
