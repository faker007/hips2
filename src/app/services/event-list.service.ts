import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

import 'rxjs/add/operator/take';

import { EmitterService } from './my.service';

@Injectable()
export class EventListService {
  name: Subject<string>;
  status: Subject<boolean>;
  Subject: Subject<boolean>;
  events: any;
  events2: any;
  my_events: Subject<Array<any>>;
  eventCount: number = 0;

  date: any;
  todayYear: any;
  todayMonth: any;
  todayDay: any;

  constructor(public db: AngularFireDatabase) {
    this.events = this.db.list('/event', { preserveSnapshot: true });
    this.events2 = this.db.list('/event', { preserveSnapshot: true });
    this.name = new Subject();
  	this.status = new Subject();
    this.my_events = new Subject();

    this.date = new Date();
    this.todayYear = this.date.getFullYear();
    this.todayMonth = this.date.getMonth() + 1;
    this.todayDay = this.date.getDate();
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

  getEventByID(id): any{
    return this.db.list('/event', {
      query: {
        orderByChild: 'id',
        equalTo: id,
      }, preserveSnapshot: true
    });
  }

  getEventByCreated(created): any{
    return this.db.list('/event', {
      query: {
        orderByChild: 'created',
        equalTo: created,
      }, preserveSnapshot: true
    });
  }

  getEventByTitle(title): any{
    return this.db.list('/event', {
      query: {
        orderByChild: 'title',
        equalTo: title,
        limitToFirst: 1
      }, preserveSnapshot: true
    });
  }

  addZero(argu) {
    if(parseInt(argu) < 10) {
      return "0" + argu.toString().trim()
    } else {
      return argu;
    }
  }  

  getEventsNumber(count: number): any {
  	console.log(this.events);
    this.eventCount = count; // this.eventCount + count;
    this.events = this.db.list('/event', {
      query: {
        orderByChild: 'begin',
        startAt: `${this.todayYear}-${this.addZero(this.todayMonth)}-${this.addZero(this.todayDay)}`,
        limitToFirst: this.eventCount
      }, preserveSnapshot: true
    });

    return this.getEvents();
  }

  getTodayEvents(): any {
    this.events = this.db.list('/event', {
      query: {
        orderByChild: 'begin',
        startAt: `${this.todayYear}-${this.todayMonth}-${this.todayDay}`,
        limitToFirst: 1000
      }, preserveSnapshot: true
    });
    return this.getEvents();
  }
}

