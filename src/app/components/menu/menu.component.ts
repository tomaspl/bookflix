import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/shared/models/Student';
import { BookService } from 'src/app/shared/services/book.service';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  student!: Student | null;
  book!: Boolean;
  alreadyRead!: Boolean;
  esMaestra!: Boolean;
  relPathFichero = '';
  relPathPrestamos = '';
  adminurl = '';
  constructor(private route: ActivatedRoute, private router: Router,
    private studentService: StudentService, private bookService: BookService) {
    console.log('constructor!!')
    if (this.studentService.getCurrentStudent()) {
      this.student = this.studentService.getCurrentStudent();
      console.log('this.student', this.student)
    } else {
      // TODO: extact id from url, fetch data and fill student object. else go to home
    }
    /*route.data
      .subscribe(
        data => {
          if (!data['student']?.firstName && data['student']?.key !== 'maestra') {
            this.router.navigate(['/home'])
          } else {
            if (data['student'].$key === 'maestra') {
              //this.student = {nombre: 'Maestra', apellido: 'Maestra', img:'01', libro:null, $key:'maestra', id:'1'}
              this.esMaestra = true;
            } else {
              this.esMaestra = false
              this.student = data['student'];
            }
          }
          this.book = data['book'] ? true : false;
          this.alreadyRead = data['read'] ? true : false;
        })
        */
  }
  ngOnInit() {
    const splittedURL = this.router.routerState.snapshot.url.split('/');
    this.adminurl = splittedURL[splittedURL.length - 1];



  }


  getStudentById(): void {
    /*this.student$ = this.studentService.getStudentById().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          return { key: c.key, ...c.payload.val() }
        }
        )
      )
    )*/
  }

  keyUp(event: any) {
    this.bookService.searchBook2(event.target.value)
  }
}



