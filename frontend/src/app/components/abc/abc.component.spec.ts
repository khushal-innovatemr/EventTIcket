import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbcComponent } from './abc.component';

describe('AbcComponent', () => {
  let component: AbcComponent;
  let fixture: ComponentFixture<AbcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbcComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
