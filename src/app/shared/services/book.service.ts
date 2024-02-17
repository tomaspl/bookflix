import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Book } from '../models/Book';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Comment } from '../models/Comment';
import { StudentService } from './student.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  value!: number;
  total!: number;
  average!: number;

  private allBooksSubject = new BehaviorSubject<Book[]>([]);
  private allBooks$: Observable<Book[]> = this.allBooksSubject.asObservable();

  private bookKeyWords = new BehaviorSubject<string>('');
  private bookKeyWords$: Observable<string> = this.bookKeyWords.asObservable();

  constructor(private db: AngularFireDatabase, private studentService: StudentService) {
    this.db.list('/books').snapshotChanges().pipe(
      map(changes => changes.map(c => ({ ...c.payload.val() as Book })))
    ).subscribe(books => {
      this.allBooksSubject.next(books);
    });
  }
  getBooksFromDB(keyword?: string): Observable<Book[]> {
    return this.allBooks$.pipe(
      map(books => {
        if (keyword) {
          const lowerCaseKeyword = keyword.toLowerCase();
          return books.filter(book =>
            book.title?.toLowerCase().includes(lowerCaseKeyword) ||
            book.author?.toLowerCase().includes(lowerCaseKeyword)
          );
        }
        return books;
      })
    );
  }

  setNewBookKeyWords(value: string) {
    this.bookKeyWords.next(value)
  }

  getNewBookKeyWords(): Observable<string> {
    return this.bookKeyWords$
  }

  findBookByUrl(url: string): Observable<any> {
    return this.db.object('/books/' + url).valueChanges();
  }

  findBookByCalif(bookKey: string | undefined, studentKey: string): Observable<string> {
    return this.db.object(bookKey + "/" + studentKey).valueChanges() as Observable<string>;

  }

  saveBookAverage(
    alumnoId: string,
    calif: number,
    libroId: string
  ): Promise<any> {
    this.value = 0;
    this.total = 0;
    this.average = 0;
    const tutRef = this.db.object(`${libroId}/${alumnoId}`);
    return tutRef.set(calif);
  }

  updateAverages(libroId: any) {
    this.db.list(libroId).snapshotChanges().pipe(map(changes =>
      changes.map(c => {
        return c.payload.val()
      }
      )
    )).subscribe((response: any) => {
      this.average = 0;
      const sum = response.reduce((total: number, currentNumber: number) => total + currentNumber, 0);
      this.average = sum / response.length;
      const bookRef = this.db.object("books/" + libroId);
      bookRef.update({ average: this.average, averageX: this.average * 20 })
    })

  }

  takeBook(bookId: string | undefined) {
    const tutRef = this.db.object("books/" + bookId);
    tutRef.update({ hasit: this.studentService.currentStudent.key })
  }

  addToFiles(bookKey: string | undefined, idAlumno: string | null) {
    const date = new Date();
    const fichaToSave = { idAlumno, timestamp: date.getTime() };
    this.db.list('/files' + bookKey + '/list').push(fichaToSave);

  }

  getBookComments(bookId: string): Observable<Comment[]> {
    return this.db
      .list("commentsByBook/" + bookId + "/").snapshotChanges().pipe(
        map(changes => changes.map(c => ({ id: c.key, ...c.payload.val() as Object } as Comment))));
  }

  checkoutBook(bookKey: string | undefined, bookTitle: string | undefined, bookPicture: string | undefined) {
    if (bookKey) {
      const data = { [bookKey]: { returned: false, bookTitle, bookPicture } }
      const bookRef = this.db.object(`${this.studentService.currentStudent.key}`);
      bookRef.update(data)
    }
  }

  createNewComment(
    comment: any,
    bookKey: string | undefined,
    bookTitle: string | undefined
  ) {
    const commentToSave = {
      ...comment,
      bookTitle,
      bookKey,
      time: new Date().getTime(),
    };
    this.db.list('commentsByBook/' + bookKey).push(commentToSave);
  }

  private addDaysToTime(days: number, timestamp: number) {
    return 60000 * 60 * 24 * days + timestamp;
  }


  addToCurrentState(
    bookKey: string | undefined,
    bookTitle: string | undefined,
    bookPicture: string | undefined
  ) {
    const date = new Date();
    const student = this.studentService.currentStudent;
    const newEstado = {
      studentId: student.key,
      nya: student.firstName + " " + student.lastName,
      bookKey,
      bookTitle,
      bookPicture,
      dateOfRent: date.getTime(),
      dateOfReturn: this.addDaysToTime(7, date.getTime())
    };
    this.db.list('state').push(newEstado);
  }
}
