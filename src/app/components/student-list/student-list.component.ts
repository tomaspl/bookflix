import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Student } from 'src/app/shared/models/Student';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent {

  students$!: Observable<Student[]>;
  studentClicked: any;
  showErrorPassword = false;

  constructor(private studentService: StudentService, private router: Router) {
    this.getStudents();
  }

  getStudents(): void {
    this.students$ = this.studentService.getStudents();
  }

  selectStudent(student: Student): void {
    this.studentService.setCurrentStudent(student)
    this.router.navigate(['/home', 'students', student.key])
  }

  updateData(student: Student) {
    this.studentClicked = student;
  }
  hideError() {
    this.showErrorPassword = false;
  }
}
