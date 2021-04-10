import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeReporterComponent } from './code-reporter.component';

describe('CodeReporterComponent', () => {
  let component: CodeReporterComponent;
  let fixture: ComponentFixture<CodeReporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeReporterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeReporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
