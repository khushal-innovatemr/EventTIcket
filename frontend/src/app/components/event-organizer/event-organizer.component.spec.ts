import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrganizerComponent } from './event-organizer.component';

describe('EventOrganizerComponent', () => {
  let component: EventOrganizerComponent;
  let fixture: ComponentFixture<EventOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventOrganizerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
