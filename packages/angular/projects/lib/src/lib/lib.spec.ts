import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lib } from './lib';

describe('Lib', () => {
  let component: Lib;
  let fixture: ComponentFixture<Lib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
