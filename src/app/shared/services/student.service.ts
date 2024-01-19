import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';
import { Student } from '../models/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  currentStudent!: Student;
  constructor(private db: AngularFireDatabase) { }

  getStudents(): Observable<Student[]> {
    return this.db.list('/students').snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.key, ...(c.payload.val() as Object) }))));
  }

  setCurrentStudent(student: Student) {
    this.currentStudent = student;
  }

  getCurrentStudent(): Student {
    return this.currentStudent;
  }

  retirar(bookId: string | undefined, idAlumno: string | null) {
    const tutRef = this.db.object("students/" + idAlumno);
    this.currentStudent.bookId = bookId;
    tutRef.update({ bookId: bookId })
  }
}