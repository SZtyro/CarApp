import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSearchComponent } from './base-search.component';

describe('BaseSearchComponent', () => {
  let component: BaseSearchComponent;
  let fixture: ComponentFixture<BaseSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaseSearchComponent]
    });
    fixture = TestBed.createComponent(BaseSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
