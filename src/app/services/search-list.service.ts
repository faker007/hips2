import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';

@Injectable()
export class SearchListService {
  name: Subject<string>;
  status: Subject<boolean>;
  Subject: Subject<boolean>;
  userSearchs: any;

  constructor(public db: AngularFireDatabase, @Inject(FirebaseApp) public firebaseApp: firebase.app.App) {
  }

  getUserSearchs(): any {
    return this.userSearchs;
  }

  addUserSearch(searchQuery): any { // searchQuery의 파라미터가 존재하지 않으면, 새롭게 생성하고, 아니면 count = count + 1 함.
    this.firebaseApp.database().ref().child('search/' + searchQuery).once('value', (snapshot) => {
      var exists = (snapshot.val() !== null);
      if(exists === false) {
        this.firebaseApp.database().ref().child('search/' + searchQuery).set({
          label: searchQuery,
          count: 1
        });
      } else {
        this.firebaseApp.database().ref().child('search/' + searchQuery).once('value', (snapshot) => {
          this.firebaseApp.database().ref().child('search/' + searchQuery).set({
            label: searchQuery,
            count: snapshot.val().count + 1
          });
        });
      }
    });
  }
}

