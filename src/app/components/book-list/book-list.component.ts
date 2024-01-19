import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { Book } from 'src/app/shared/models/Book';
import { BookService } from 'src/app/shared/services/book.service';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {
  public portada1 = 'https://firebasestorage.googleapis.com/v0/b/bookflix-4230d.appspot.com/o/portada.png?alt=media&token=e752e171-a069-4816-a557-2c043b5acfdb'
  // public portada1 = 'https://firebasestorage.googleapis.com/v0/b/bookflix-4230d.appspot.com/o/portada1.png?alt=media&token=bc2bd801-7d01-4ae8-8e18-5d2702f0a5e0'
  public portada2 = 'https://firebasestorage.googleapis.com/v0/b/bookflix-4230d.appspot.com/o/portada2.png?alt=media&token=3c762682-07ba-4dc5-9b4c-f964966801a2'
  public portada3 = 'https://firebasestorage.googleapis.com/v0/b/bookflix-4230d.appspot.com/o/portada3.png?alt=media&token=de4e7851-89cc-4931-bf07-37ce99ece20c'
  public p1!: boolean;
  public p2!: boolean;
  public p3!: boolean;
  public keyword!: string;
  public activeSearchBook!: boolean;
  private subscFind!: Subscription;
  private subscActiveSearch!: Subscription;
  book$!: Observable<Book[]>;
  bookList!: Book[];
  constructor(private bookService: BookService, private router: Router, private route: ActivatedRoute, private studentService: StudentService) {
  }




  ngOnInit() {
    const num = 1;
    this.activeSearchBook = false;
    this.p1 = num === 1;
    // this.p2 = num===2;
    // this.p3 = num===3;

    this.subscFind = this.bookService.findAllBooks().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          return { ...c.payload.val() }
        }
        )
      )).subscribe(data => {
        this.bookList = data;
      })

    this.subscActiveSearch = this.bookService.findActiveSearchBook().subscribe(response => {
      this.activeSearchBook = response !== ''
      this.keyword = response
      this.p1 = num === 1 && !this.activeSearchBook
      // this.p2 = num===2 && !this.activeSearchLibro
      // this.p3 = num===3 && !this.activeSearchLibro
    });

  }
  ngOnDestroy() {
    this.subscActiveSearch.unsubscribe();
    this.subscFind.unsubscribe();
  }
}
