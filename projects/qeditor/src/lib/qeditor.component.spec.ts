import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QEditorComponent } from './qeditor.component';

describe('QEditorComponent', () => {
  let component: QEditorComponent;
  let fixture: ComponentFixture<QEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
