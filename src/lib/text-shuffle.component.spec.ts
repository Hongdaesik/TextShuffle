import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextShuffleComponent } from './text-shuffle.component';

describe('TextShuffleComponent', () => {
  let component: TextShuffleComponent;
  let fixture: ComponentFixture<TextShuffleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextShuffleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextShuffleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
