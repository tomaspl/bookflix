import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/models/Book';
import { BookService } from 'src/app/shared/services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {

  public activeSearchBook!: boolean;
  public subscActiveSearch!: Observable<String>;
  public bookList$!: Observable<Book[]>;

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.activeSearchBook = false;
    this.subscActiveSearch = this.bookService.getNewBookKeyWords();
    this.bookList$ = this.bookService.getBooksFromDB();
    this.bookService.getNewBookKeyWords().subscribe((response: string) => {
      this.bookList$ = this.bookService.getBooksFromDB(response);
    })
  }
}
