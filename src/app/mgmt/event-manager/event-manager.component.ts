import {Component, OnInit} from '@angular/core';
import {Ng2SmartTableModule, LocalDataSource} from 'ng2-smart-table';
import {AngularFire, FirebaseListObservable, AngularFireDatabase} from "angularfire2";
import {EventListService} from "../../services/event-list.service";
import {EventObject} from "../../models/event.model";

@Component({
  selector: 'mgmt-event-manager',
  templateUrl: './event-manager.component.html',
  styleUrls: ['./event-manager.component.css']
})
export class EventManagerComponent implements OnInit {

  source: LocalDataSource;

  settings = {
    edit: {
      confirmSave: true,
    },
    add: {
      confirmCreate: true,
    },
    columns: {
      id: {
        title: 'ID',
        filter: false,
        width: "5%"
      },
      begin: {
        title: '행사일',
        filter: false,
        width: "10%"
      },
      title: {
        title: '행사 제목',
        filter: false,
        width: "15%"
      },
      address: {
        title: '행사 위치',
        filter: false,
        width: "8%"
      },
      tags: {
        title: '행사 태그',
        filter: false,
        width: "25%",
      },
      created: {
        title: '생성 날짜',
        width: "10%",
        filter: false
      },
      updated: {
        title: '업데이트 날짜',
        width: "10%",
        filter: false
      },
      isDeprecated: {
        title: '승인/삭제/복구',
        width: "10%",
        filter: false
      },
    }
  };

  items: FirebaseListObservable<any[]>;

  constructor(public af: AngularFire, public elService: EventListService, db: AngularFireDatabase) {
    this.source = new LocalDataSource();

    this.items = this.elService.getEvents();
    this.callEvents();
  }

  callEvents() {
    this.items.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.source.append(snapshot.val());
      });
    });
  }

  onSaveConfirm(event) {
    if (window.confirm('Are you sure you want to save?')) {
      event.newData['name'] += ' + added in code';
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event) {
    if (window.confirm('Are you sure you want to create?')) {
      event.newData['name'] += ' + added in code';
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  ngOnInit() {
  }

}
