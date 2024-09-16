import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

const ALLOWED_FILE_TYPES = [
  'text/csv',
  'application/vnd.ms-excel', // XLS
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // XLSX
];

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})

export class FormComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  myForm: FormGroup;
  file: File | null = null;
  groups: string[] = ['Group 1', 'Group 2', 'Group 3'];

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      file: [null, Validators.required],
      group: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      console.log(this.myForm.value, "this.myForm.value************");
    } else {
      alert('Please fill out all required fields.');
    }
  }

  allowedFileTypes = ALLOWED_FILE_TYPES;
  fileUrl!: string | null;
  uploadFile!: File | null;

  handleChange(event: any) {
    const file = event.target.files[0] as File;
    if (!ALLOWED_FILE_TYPES.includes(file?.type)) {
      alert('File type is not allowed.');
      this.handleRemovesFile();
      return;
    }

    this.fileUrl = URL.createObjectURL(file);
    this.uploadFile = file;
    this.myForm.patchValue({ file: this.fileUrl });
  }

  handleRemovesFile() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }
    this.uploadFile = null;
    this.fileUrl = null;
    this.myForm.reset()
  }

}
