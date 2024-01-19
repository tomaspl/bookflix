import { Component, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from 'src/app/shared/models/Comment';
import { BookService } from 'src/app/shared/services/book.service';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class CommentsListComponent {
  comments$!: Observable<Comment[]>;
  @Input() bookKey: any;

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.comments$ = this.bookService.getBookComments(this.bookKey);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bookKey']) {
      this.comments$ = this.bookService.getBookComments(changes['bookKey'].currentValue);
    }
  }
}
