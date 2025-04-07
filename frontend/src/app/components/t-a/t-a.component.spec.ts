import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAComponent } from './t-a.component';

describe('TAComponent', () => {
  let component: TAComponent;
  let fixture: ComponentFixture<TAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
