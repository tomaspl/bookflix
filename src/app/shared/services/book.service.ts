import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Book } from '../models/Book';
import { Observable, Subject, map, of, switchMap } from 'rxjs';
import { Comment } from '../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  value!: number;
  total!: number;
  average!: number;
  private searchBook = new Subject<string>();
  public searchBook$ = this.searchBook.asObservable();

  constructor(private db: AngularFireDatabase) { }
  findAllBooks(): AngularFireList<Book> {
    return this.db.list('/books');
  }


  findActiveSearchBook() {
    return this.searchBook$;
  }
  /**
   * 
          query: {
            orderByChild: "url",
            equalTo: url
          }
        }
   */
  findBookByUrl(url: string): Observable<any> {
    console.log('url', url)
    return this.db.object('/books/' + url).valueChanges();

    //return this.db.list("/books", ref => ref.orderByChild('url').equalTo(url))
  }

  findBookByCalif(bookKey: string | undefined, studentKey: string) {
    return this.db.object(bookKey + "/" + studentKey).valueChanges();

  }

  searchBook2(value: string) { }

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

    // return this.db.list(libroId + "/" + alumnoId).push(dataToSave)
    // return this.firebaseUpdate(dataToSave);
  }

  updateAverages(libroId: any) {
    var valor = 0;

    this.db.list(libroId).snapshotChanges().pipe(map(changes =>
      changes.map(c => {
        return c.payload.val()
      }
      )
    )).subscribe((response: any) => {
      this.average = 0;
      const sum = response.reduce((total: number, currentNumber: number) => total + currentNumber, 0);
      this.average = sum / response.length;
      const tutRef = this.db.object("books/" + libroId);
      tutRef.update({ average: this.average })
      const tutRef2 = this.db.object("books/" + libroId);
      tutRef2.update({ averageX: this.average * 20 })
      /*for (let i = 0; i < response.length; i++) {
        setTimeout(() => {
          var total = response.length;
          valor += response[i].$value;
          console.log('response[i]', response[i].val())
          this.average = valor / total;
          var tempo = this.average;
          console.log('tempo', tempo)
          if (i + 1 == response.length) {
            let dataToSave: any = {};
            dataToSave["books/" + libroId + "/average"] = tempo;
            dataToSave["books/" + libroId + "/averageX"] = tempo * 20;
            const tutRef = this.db.object("books/" + libroId);
            tutRef.update({ average: tempo })
            const tutRef2 = this.db.object("books/" + libroId);
            tutRef2.update({ averageX: tempo * 20 })
          }
        }, 700);
      }*/
    })

  }

  retirar(bookId: string | undefined, studentId: string | null) {
    const tutRef = this.db.object("books/" + bookId);
    tutRef.update({ hasit: studentId })
  }

  addToFiles(bookKey: string | undefined, idAlumno: string | null) {
    const date = new Date();
    const fichaToSave = { idAlumno, timestamp: date.getTime() };
    /*const newFichaKey = this.db.database.child("files/" + bookKey + "/").push()
      .key;

    let envioFicha = {};

    envioFicha["fi/" + bookKey + "/list/" + newFichaKey] = fichaToSave;

    this.firebaseUpdate(envioFicha);*/
    this.db.list('/files' + bookKey + '/list').push(fichaToSave);

  }

  getBookComments(bookId: string): Observable<Comment[]> {
    console.log('bookId', bookId)
    return this.db
      .list("commentsByBook/" + bookId + "/").snapshotChanges().pipe(
        map(changes => changes.map(c => ({ id: c.key, ...c.payload.val() as Object } as Comment))));
  }

  checkoutBook(bookKey: string | undefined, studentId: string | null, bookTitle: string | undefined, bookPicture: string | undefined) {
    if (bookKey) {
      const data = { [bookKey]: { returned: false, bookTitle, bookPicture } }
      const tutRef2 = this.db.object(`${studentId}`);
      tutRef2.update(data)
    }
  }

  createNewComment(
    comment: any,
    bookKey: string | undefined,
    bookTitle: string | undefined
  ) {
    console.log('comment', comment)
    const commentToSave = {
      ...comment,
      bookTitle,
      bookKey,
      time: new Date().getTime(),
    };
    //console.log('commentsByBook', commentToSave)
    this.db.list('commentsByBook/' + bookKey).push(commentToSave);
  }

  private addDaysToTime(days: number, timestamp: number) {
    return 60000 * 60 * 24 * days + timestamp;
  }


  addToCurrentState(
    bookKey: string | undefined,
    studentId: string | null,
    firstName: string | undefined,
    lastName: string | undefined,
    bookTitle: string | undefined,
    bookPicture: string | undefined
  ) {
    const date = new Date();
    const newEstado = {
      studentId,
      nya: firstName + " " + lastName,
      bookKey,
      bookTitle,
      bookPicture,
      dateOfRent: date.getTime(),
      dateOfReturn: this.addDaysToTime(7, date.getTime())
    };



    this.db.list('state').push(newEstado);

  }

}
