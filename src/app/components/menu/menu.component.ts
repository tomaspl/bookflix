import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Student } from 'src/app/shared/models/Student';
import { BookService } from 'src/app/shared/services/book.service';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  student$!: Observable<Student>
  book!: Boolean;
  alreadyRead!: Boolean;
  esMaestra!: Boolean;
  showSearch!: Boolean
  relPathFichero = '';
  relPathPrestamos = '';
  adminurl = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private bookService: BookService) {

  }
  ngOnInit() {
    const splittedURL = this.router.routerState.snapshot.url.split('/');
    this.showSearch = !this.route.firstChild?.snapshot.params['book'];
    this.student$ = this.studentService.getCurrentStudent();
  }

  keyUp(event: any) {
    this.bookService.setNewBookKeyWords(event.target.value);
  }
}



