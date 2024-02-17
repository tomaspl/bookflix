import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
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
export class BookComponent implements OnInit, OnDestroy {
  @Input() initialValue: any;

  public book!: Book;
  public commentSubscription!: Subscription;
  public currentStars$!: Observable<string>;
  public form: FormGroup;
  public linkYoutube: any;
  public rating!: Rate;
  public showEditComments = false;
  public student$!: Observable<Student>;
  public taken!: boolean;
  public video!: boolean;

  private subscriptionStudent!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private studentService: StudentService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      comment: ['', [Validators.required]],
      img: [''],
      student: ['']
    });

    this.subscriptionStudent = this.studentService.getCurrentStudent().subscribe(student => {
      this.form.patchValue({
        img: student ? student.img : '',
        student: student ? `${student.firstName} ${student.lastName}` : ''
      });
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.fetchBook();
    this.fetchRate();
  }

  ngOnDestroy() {
    if (this.subscriptionStudent) this.subscriptionStudent.unsubscribe();
  }

  async fetchBook() {
    const params = await this.route.snapshot.params;
    const bookUrl = params['book'];
    this.bookService.findBookByUrl(bookUrl).subscribe(data => {
      this.book = data as Book;
      if (this.book.youtubeLink) {
        const auxUrl = data.youtubeLink.split('?v=')[1];
        const parseLinkYoutube = "https://www.youtube-nocookie.com/embed/" + auxUrl.split('&')[0] + '?autoplay=1&controls=0&rel=0&enablejsapi=1';
        this.linkYoutube = this.sanitizer.bypassSecurityTrustResourceUrl(parseLinkYoutube);
      }
    });
  }

  async fetchRate() {
    const params = await this.route.snapshot.params;
    const studentId = params['id'];
    const bookId = params['book'];
    this.currentStars$ = this.bookService.findBookByCalif(bookId, studentId);
  }

  saveRating(calif: number, book: string | undefined) {
    if (book) {
      const alumnoId = this.route.snapshot.params['id'];
      this.bookService.saveBookAverage(alumnoId, calif, book);
      this.bookService.updateAverages(book);
    }
  }

  reset() {
    this.form.patchValue({
      comment: ''
    });
  }

  takeBook(bookKey: string, bookTitle: string | undefined, bookFoto: string | undefined) {
    this.bookService.addToCurrentState(bookKey, bookTitle, bookFoto);
    this.bookService.checkoutBook(bookKey, bookTitle, bookFoto);
    this.bookService.takeBook(bookKey);
    this.studentService.takeBook(bookKey);
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
}