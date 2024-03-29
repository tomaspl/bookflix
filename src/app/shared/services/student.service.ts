import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Student } from '../models/Student';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  currentStudent!: Student;
  private currentStudentSub = new BehaviorSubject<Student>({} as Student);
  private currentStudentSub$: Observable<Student> = this.currentStudentSub.asObservable();

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) {
    const params = this.route.firstChild?.snapshot.params;
    if (params) {
      const studentId = params['id'];
      this.db.object("students/" + studentId).valueChanges().subscribe((response: any) => {

        const myStudent: Student = ({ key: studentId, ...response } as Student)
        console.log('myStudent', myStudent);

        this.setCurrentStudent(myStudent)
        this.currentStudentSub.next(myStudent)
      });
    }
  }

  getStudents(): Observable<Student[]> {
    return this.db.list('/students').snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.key, ...c.payload.val() as Object } as Student))));
  }

  setCurrentStudent(student: Student) {
    this.currentStudent = student;
    this.currentStudentSub.next(student)

  }

  getCurrentStudent(): Observable<Student> {
    return this.currentStudentSub$;
  }


  takeBook(bookId: string) {
    const tutRef = this.db.object("students/" + this.currentStudent.key);
    this.currentStudent.bookId = bookId;
    tutRef.update({ bookId: bookId })
  }

  bookReadByStudent(bookId: string): Promise<boolean> {
    const studentId = this.route.firstChild?.snapshot.params['id'];
    return new Promise((resolve, reject) => {
      this.db.list(studentId).snapshotChanges().subscribe(changes => {
        const presente = changes.some(change => change.key === bookId);
        resolve(presente);
      }, error => {
        reject(error);
      });
    });


  }

}