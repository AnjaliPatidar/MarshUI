import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        ReactiveFormsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form if valid', () => {
    component.myForm.setValue({
      file: 'file path',
      group: 'Group A'
    });
    spyOn(console, 'log');
    component.onSubmit();
    // expect(console.log).toHaveBeenCalledWith(component.myForm.value, "this.myForm.value************");
  });

  // it('should alert if form is invalid', () => {
  //   spyOn(window, 'alert');
  //   component.onSubmit();
  //   expect(window.alert).toHaveBeenCalledWith('Please fill out all required fields.');
  // });

  it('should handle file change correctly', () => {
    const file = new File([''], 'test.csv', { type: 'text/csv' });
    const event = { target: { files: [file] } };
    spyOn(URL, 'createObjectURL').and.returnValue('blob:http://localhost/test');
    component.handleChange(event);
    expect(component.fileUrl).toBe('blob:http://localhost/test');
    expect(component.uploadFile).toBe(file);
    expect(component.myForm.value.file).toBe('blob:http://localhost/test');
  });

  it('should handle file change incorrectly', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
    spyOn(URL, 'createObjectURL').and.returnValue('blob:http://localhost/test');
    component.handleChange(event);
    // expect(component.fileUrl).toBe('blob:http://localhost/test');
    // expect(component.uploadFile).toBe(file);
    expect(component.myForm.value.file).toBe(null);
  });

  it('should alert if file type is not allowed', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } };
    spyOn(window, 'alert');
    component.handleChange(event);
    expect(window.alert).toHaveBeenCalledWith('File type is not allowed.');
    expect(component.fileUrl).toBeNull();
    expect(component.uploadFile).toBeNull();
  });

  it('should reset file input', () => {
  component.handleRemovesFile();
  });
});

