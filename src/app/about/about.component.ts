import {Component, OnInit} from '@angular/core';
import {concat, interval, merge, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
        const source1$ = of(1, 2, 3);
        const source2$ = of(4, 5, 6);
        const source3$ = of(7, 8, 9);

        const result$ = concat(source1$, source2$, source3$);

        result$.subscribe(console.log);

        const interval1 = interval(1000);
        const interval2 = interval1.pipe(map(val => val * 10));
        const merge$ = merge(interval1, interval2);

        const sub = merge$.subscribe(console.log);

        setTimeout(() => sub.unsubscribe(), 3000);

        const http$ = createHttpObservable('/api/courses');
        const sub2 = http$.subscribe(console.log);

        setTimeout(() => sub2.unsubscribe());

    }

}






