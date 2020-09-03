import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {Observable, throwError, timer} from 'rxjs';
import {catchError, delayWhen, finalize, map, retryWhen, shareReplay} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';
import {Store} from '../common/store.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;


    constructor(private store: Store) {

    }

    ngOnInit() {

        const http$ = createHttpObservable('/api/courses');

        const courses$ = http$.pipe(
            // catchError(err => {
            //     console.log('error happened', err);
            //     return throwError(err);
            // }),
            // finalize get executed when the observable completes or errors out
            // finalize(() => {
            //     console.log('finalized ...');
            // }),
            map(response => response['payload']),
            shareReplay(),
            retryWhen(errors => {
                return errors.pipe(
                    delayWhen(() => timer(2000))
                );
            })
            // 1.catch and replace: catchError(err => of([])) // catch error and return empty list of courses
            // 2. catch and rethrow and finalize



        );

        this.beginnerCourses$ = courses$.pipe(
            map((courses: Course[]) =>
                courses.filter(course => course.category === 'BEGINNER')
            ));

        this.advancedCourses$ = courses$.pipe(
            map((courses: Course[]) =>
                courses.filter(course => course.category === 'ADVANCED'))
        );

    }

}
