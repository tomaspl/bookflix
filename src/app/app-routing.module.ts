import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { BookComponent } from './components/book/book.component';

export const routes: Routes = [
  {
    path: 'home',
    component: StudentListComponent,
    pathMatch: 'full'
  },
  {
    path: 'home/students/:id',
    component: MenuComponent,
    children: [

      {
        path: '',
        component: BookListComponent,
        outlet: 'lolo',
        /*resolve: {
          alumno: AlumnoResolver
        },*/
        pathMatch: 'full'

      }
    ],
    pathMatch: 'full'
  },
  {
    path: 'home/students/:id/:book',
    component: MenuComponent,
    children: [{
      path: '',
      component: BookComponent,
      outlet: 'lolo',
      pathMatch: 'full'
      /*resolve: {
        alumno: AlumnoResolver
      },*/

    },]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
