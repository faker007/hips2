import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class SearchListService {
  name: Subject<string>;
  status: Subject<boolean>;
  Subject: Subject<boolean>;
  userSearchs: any;

  constructor(public db: AngularFireDatabase) {
    this.userSearchs = this.db.list('/search', {
      query: {
        orderByChild: 'count',
        // limitToLast: 15
      },
      preserveSnapshot: true
    });
  }

  getUserSearchs(): any {
    return this.userSearchs;
  }

  addUserSearch(searchQuery): any { // searchQuery의 파라미터가 존재하지 않으면, 새롭게 생성하고, 아니면 count = count + 1 함.
    this.userSearchs.child(searchQuery).once('value', function (snapshot) {
      var exists = (snapshot.val() !== null);
      console.log(exists);
    });  
  }
}

