import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AngularFire } from 'angularfire2';

@Injectable()
export class TagListService {
  name: Subject<string>;
  status: Subject<boolean>;
  Subject: Subject<boolean>;
  events: any;
  trendtags: any;
  my_events: Subject<Array<any>>;

  constructor(public af: AngularFire) {
    this.events = this.af.database.list('/tag', {
      query: {
        orderByChild: 'count',
        // limitToLast: 15
      },
      preserveSnapshot: true
    });


    this.trendtags = this.af.database.list('/tag', {
      query: {
        orderByChild: 'count',
        // limitToLast: 15
      },
      preserveSnapshot: true
    });

    this.name = new Subject();
  	this.status = new Subject();
    this.my_events = new Subject();
  }

  getTrendTags(): any{
    return this.trendtags;
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
}

