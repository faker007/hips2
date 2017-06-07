import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class EventListService {
  name: Subject<string>;
  status: Subject<boolean>;
  Subject: Subject<boolean>;
  events: any;
  my_events: Subject<Array<any>>;
  eventCount: number = 0;

  constructor(public db: AngularFireDatabase) {
    this.events = this.db.list('/event', { preserveSnapshot: true });
    this.name = new Subject();
  	this.status = new Subject();
    this.my_events = new Subject();
  }

  getEvents(): any {
    return this.events;
  }

  getMyEvents() {
    return this.my_events;
  }

  setMyEvents(events): any {
    this.my_events.next(events);
  }

  getEventsByDate(begin, end): any{
    return this.db.list('/event', { 
      query: {
        orderByChild: 'begin',
        startAt: begin,
        endAt: end 
      }, preserveSnapshot: true 
    });
  }

  getEventsNumber(count: number) {
    this.eventCount = this.eventCount + count;
    return this.db.list('/event', { 
      query: {
        orderByChild: 'begin',
        startAt: '2017-06-07',
        limitToFirst: this.eventCount
      }, preserveSnapshot: true 
    });
  }
}

