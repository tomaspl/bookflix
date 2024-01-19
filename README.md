![Bookflix](/src/assets/logo.png)

This Angular project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.5. The Angular version is 15.2.10

## Summary of the project
Bookflix is a web app that was developed for a school in Argentina. The web application served as a platform to manage classroom book rentals, with the goal of making reading activities more engaging for children at school. Inspired by the design of Netflix, students could rent books from the classroom library and provide ratings and comments.

<img src="./src/assets/screenshot-0.png" alt="Logo de Mi Proyecto" width="500"/>

It was created in 2017 using Angular 2, and data persistence was handled directly by the real-time database of Firebase. Managing the backend with it was a relatively easy and straightforward process for me at those times, considering my limited experience in backend development on tbhose years.

<div style="display: flex; justify-align:center; ">
<img src="./src/assets/screenshot-1.png" alt="Logo de Mi Proyecto" width="40%" style="margin-right:20px"/>
<img src="./src/assets/screenshot-2.png" alt="Logo de Mi Proyecto" width="40%"/>
</div>


Currently, the project is undergoing migration to a more modern Angular version, with enhancements being made to both the UI design and the overall code structure.

## Migration state:

- <input type="checkbox" checked/> **Connection with Firebase Realtime Database**
- <input type="checkbox" checked/> **Initial page with a list of students**
- <input type="checkbox" checked/> **Home page with list of books**
- <input type="checkbox" checked/> **Book detail page**
- <input type="checkbox" checked/> **Rating functionality and calculation of the average of votes**
- <input type="checkbox" checked/> **Renting functionality and validation to avoid multiple rentals until the previous one is returned**
- <input type="checkbox" checked/> **Comments module on the book page**
- <input type="checkbox" /> **Search book functionality**
- <input type="checkbox" /> **Style adjustments on the students list page**
- <input type="checkbox" /> **Style adjustments on the books list and book detail pages**
- <input type="checkbox" /> **Admin page to mark the books returned by students**
- <input type="checkbox" /> **Refactoring**
- <input type="checkbox" /> **Typings reviews**




## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
