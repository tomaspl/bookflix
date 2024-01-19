import { Component, OnInit, Input, ViewContainerRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
//import { Book } from "../shared/model/book";
//import { Calificacion } from "../shared/model/calificacion";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { Student } from "../shared/model/student";
//import { Overlay } from 'angular2-modal';
// import { Modal } from 'angular2-modal/plugins/bootstrap';
//import {Comentario} from '../shared/model/comentario';
import { Subscription, map } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Rate } from 'src/app/shared/models/Rate';
import { StudentService } from 'src/app/shared/services/student.service';
import { BookService } from 'src/app/shared/services/book.service';
import { Book } from 'src/app/shared/models/Book';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent {
  form: FormGroup;
  taken!: boolean;
  video!: boolean;
  @Input() initialValue: any;
  book!: Book;
  studentId!: string;
  student!: Student;
  rating!: Rate;
  showEditComments = false;
  isTeacher = false;
  linkYoutube: any;
  currentStars!: string;
  subscriptionBook!: Subscription
  commentSubscription!: Subscription
  constructor(/*overlay: Overlay,*/
    private route: ActivatedRoute,
    private bookService: BookService,
    private studentService: StudentService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    /*public modal: Modal*/) {
    this.student = this.currentStudent
    this.form = this.fb.group({
      comment: ['', [Validators.required]],
      student: [this.student?.firstName ?? ''],
      img: [this.student?.img ?? '']
    });
    //overlay.defaultViewContainer = vcRef;


  }


  ngOnInit() {
    window.scrollTo(0, 0);
    this.fetchBook();
    this.fetchRate();
    /*const params = await this.route.snapshot.params;
    this.id = params['id'];

    this.subscriptionBook = this.route.params.subscribe(params => {
      this.bookService.findBookByUrl(params['book']).snapshotChanges().pipe(map(changes =>
        changes.map((c: any) => {
          return { key: c.key, ...c.payload.val() }
        }
        )
      )).subscribe(book => {
        this.book = book;
      })
    })*/

    //this.showEditComments = this.route.snapshot.routeConfig.path.indexOf('comentarios') > -1;
    /* TODO: 
      - con el id de currentStudent:
        - buscar la calificacion previa que le habia dado al libro
        - ver si el alumno actualmente tiene este libro en su poder para que pueda calificar
        - ver si es perfil teacher

    this.subscriptionBook = this.route.params.switchMap(params => {

      const tituloUrl = params['book'];

      return this.bookService.findBookByUrl(tituloUrl);
    })
      .subscribe((book:Book) => {
        this.book = book;
        //this.stringBook = this.libro.$key;
        if (this.book.linkYoutube) {
          const auxUrl = this.book.linkYoutube.split('?v=')[1]
          const parseLinkYoutube = "https://www.youtube-nocookie.com/embed/" + auxUrl.split('&')[0] + '?autoplay=1&controls=0&rel=0&enablejsapi=1'
          this.linkYoutube = this.sanitizer.bypassSecurityTrustResourceUrl(parseLinkYoutube);
        }
        this.route.params.switchMap(params => {

          this.alumnoId = params['id'];

          this.esMaestra = this.alumnoId === 'maestra'
          this.retirado = this.book.loTiene === this.alumnoId
          this.alumnoService.findAlumnoById(this.alumnoId).subscribe(response => {
            this.alumno = response;
          })
          return this.bookService.findBookByCalif(this.stringBook, this.alumnoId);
        })
          .subscribe(result => this.currentStars = result.$value);
      });
      */
  }

  get currentStudent() {
    return this.studentService.getCurrentStudent();
  }

  async fetchBook() {
    const params = await this.route.snapshot.params;
    const bookUrl = params['book'];

    this.bookService.findBookByUrl(bookUrl).subscribe(data => {
      this.book = data as Book;
      if (this.book.youtubeLink) {
        const auxUrl = data.youtubeLink.split('?v=')[1]
        const parseLinkYoutube = "https://www.youtube-nocookie.com/embed/" + auxUrl.split('&')[0] + '?autoplay=1&controls=0&rel=0&enablejsapi=1'
        this.linkYoutube = this.sanitizer.bypassSecurityTrustResourceUrl(parseLinkYoutube);
      }
    })
  }

  async fetchRate() {
    const params = await this.route.snapshot.params;
    const studentId = params['id'];
    const bookId = params['book'];
    this.bookService.findBookByCalif(bookId, studentId).subscribe((data: any) => {
      this.currentStars = data;
    })
  }
  saveRating(calif: number, book: string | undefined) {
    if (book) {
      const alumnoId = this.route.snapshot.params['id'];
      this.bookService.saveBookAverage(alumnoId, calif, book);
      this.bookService.updateAverages(book);
    }
  }

  reset() {
    this.form = this.fb.group({
      comment: ['', [Validators.required]],
      student: [this.student?.firstName ?? ''],
      img: [this.student?.img ?? '']
    });
  }

  retirar(bookKey: string | undefined, studentId: string | null, firstName: string | undefined, lastName: string | undefined, bookTitle: string | undefined, bookFoto: string | undefined) {
    this.bookService.addToCurrentState(bookKey, studentId, firstName, lastName, bookTitle, bookFoto);
    this.bookService.checkoutBook(bookKey, studentId, bookTitle, bookFoto);
    this.bookService.addToFiles(bookKey, studentId)
    this.bookService.retirar(bookKey, studentId)
    this.studentService.retirar(bookKey, studentId)
  }
  hideVideo() {
    this.video = false;
  }

  showVideo() {
    this.video = true;
  }

  saveComment() {

    this.bookService.createNewComment(this.form.value, this.book.url, this.book.title);
    this.reset();
  }

  ngOnDestroy() {
    if (this.subscriptionBook) this.subscriptionBook.unsubscribe();
    if (this.commentSubscription) this.commentSubscription.unsubscribe()
  }
}
