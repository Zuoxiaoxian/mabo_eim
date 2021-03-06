import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdLevelComponent } from './third-level.component';

describe('ThirdLevelComponent', () => {
  let component: ThirdLevelComponent;
  let fixture: ComponentFixture<ThirdLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
