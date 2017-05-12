import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Ng2SmartTableModule, LocalDataSource, ViewCell} from 'ng2-smart-table';
import {AngularFire, FirebaseListObservable, AngularFireDatabase} from "angularfire2";
import {EventListService} from "../../services/event-list.service";
import {isNullOrUndefined} from "util";
import {isUndefined} from "util";

@Component({
  selector: 'button-view',
  template: `
    <button *ngIf="isUndefined" (click)="onClick()">{{ renderValue }}</button>
    <p *ngIf="!isUndefined">{{renderValue}}</p>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;
  isUndefined: boolean;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.isUndefined = this.value.toString().length > 0 ? false : true;

    if(this.isUndefined){
      this.renderValue = "승인하기";
    }else{
      this.renderValue = this.value.toString();
    }
  }

  onClick() {
    console.log("승인하기 : ",this.rowData);
    // this.save.emit(this.rowData);
  }
}

@Component({
  selector: 'btn-delete',
  template: `
    <button (click)="onClick()">{{ renderValue }}</button>
  `,
})
export class BtnDeleteComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {

    if(this.value){
      this.renderValue = "복구하기";
    }else{
      this.renderValue = "삭제하기";
    }
  }

  onClick() {
    console.log("복구/삭제하기 : ",this.rowData);
  }
}

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
        width: "4%"
      },
      begin: {
        title: '행사일',
        filter: false,
        width: "8%"
      },
      title: {
        title: '행사 제목',
        filter: false,
        width: "12%"
      },
      address: {
        title: '행사 위치',
        filter: false,
        width: "10%"
      },
      tags: {
        title: '행사 태그',
        filter: false,
        width: "26%",
      },
      url:{
        title: 'url',
        filter: false,
        width: "10%",
        type: 'html',
        valuePrepareFunction: (value) => { return '<a href="{{value}}" >{{value}} '}
      },
      created: {
        title: '생성 날짜',
        width: "10%",
        filter: false
      },
      updated: {
        title: '업데이트 날짜',
        width: "10%",
        filter: false,
        type: 'custom',
        renderComponent: ButtonViewComponent,
      },
      isDeprecated: {
        title: '삭제/복구',
        width: "10%",
        filter: false,
        type: 'custom',
        renderComponent: BtnDeleteComponent,
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

  onEdit(event){
    console.log("Edit : ", event);
  }

  ngOnInit() {
  }

}
