import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment.development';
import { StudentListComponent } from './components/student-list/student-list.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { BookComponent } from './components/book/book.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsListComponent } from './components/comments-list/comments-list.component';
import { StarsRatingComponent } from './components/stars-rating/stars-rating.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

@NgModule({
  declarations: [
    AppComponent,
    StudentListComponent,
    BookListComponent,
    MenuComponent,
    BookComponent,
    CommentsListComponent,
    StarsRatingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    ReactiveFormsModule/*,
    provideFirebaseApp(() => initializeApp({ "projectId": "dev-bookflix", "appId": "1:355497591795:web:ab130f8089d821e5", "databaseURL": "https://dev-bookflix.firebaseio.com", "storageBucket": "dev-bookflix.appspot.com", "locationId": "southamerica-east1", "apiKey": "AIzaSyAGd4HjAORQ2cf-bYvdAVi-u83lP1Vv_dM", "authDomain": "dev-bookflix.firebaseapp.com", "messagingSenderId": "355497591795" })),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase())*/
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
