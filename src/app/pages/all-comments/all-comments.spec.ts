import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllComments } from './all-comments';

describe('AllComments', () => {
  let component: AllComments;
  let fixture: ComponentFixture<AllComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllComments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllComments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
