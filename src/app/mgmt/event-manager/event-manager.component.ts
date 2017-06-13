import {Component, OnInit, Input, Output, EventEmitter, Inject, HostListener} from '@angular/core';
import {Ng2SmartTableModule, LocalDataSource, ViewCell} from 'ng2-smart-table';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2/database";
import {EventListService} from "../../services/event-list.service";
import {isNullOrUndefined} from "util";
import {isUndefined} from "util";
import {split} from "ts-node/dist";
import 'rxjs/add/operator/take';

import {FirebaseApp} from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  selector: 'button-view',
  template: `
    <button *ngIf="isUndefined" (click)="onClick($event, source)">{{ renderValue }}</button>
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

    if (this.isUndefined) {
      this.renderValue = "승인하기";
    } else {
      this.renderValue = this.value.toString();
    }
  }

  onClick(event, source) {
    var result = window.confirm('이 이벤트를 승인하시겠습니까?');

    if (result) {

      console.log("승인하기", this.rowData);

    } else {

    }

  }
}

@Component({
  selector: 'btn-delete',
  template: `
    <button (click)="onClick($event)">{{ renderValue }}</button>
  `,
})
export class BtnDeleteComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {

    if (this.value) {
      this.renderValue = "복구하기";
    } else {
      this.renderValue = "삭제하기";
    }
  }

  onClick(event) {
    console.log("복구/삭제하기 : ", event.value);

    this.save.emit(this.rowData);
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
    pager: {
      display: true,
      perPage: 25
    },
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
        width: "4%",
        editable: false
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
      tags: {
        title: '행사 태그',
        filter: false,
        width: "26%",
      },
      address: {
        title: '행사 위치',
        filter: false,
        width: "10%"
      },
      url: {
        title: 'url',
        filter: false,
        width: "10%",
        type: 'html',
        valuePrepareFunction: (value) => {
          return '<a href="' + value + '" >' + value + '</a>'
        }
      },
      created: {
        title: '생성 날짜',
        width: "10%",
        filter: false,
        editable: false,
      },
      updated: {
        title: '업데이트 날짜',
        width: "10%",
        filter: false,
        editable: false,
        type: 'custom',
        renderComponent: ButtonViewComponent,
        // onComponentInitFunction(instance) {
        //   instance.save.subscribe(row => {
        //     alert(`${row.name} saved!`)
        //   });
        // }
        // type: 'html',
        // valuePrepareFunction: (cell, row) => {
        // return '<a href="#" id="btn-confirm-255">'+row.id+'</a>';
        // return '<a (click)="alert()">{{value}}</a>';
        // }
      },
      isDeprecated: {
        title: '삭제/복구',
        width: "10%",
        filter: false,
        editable: false,
        type: 'custom',
        renderComponent: BtnDeleteComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`)
          });
        }
      },
    }
  };

  items: FirebaseListObservable<any[]>;
  eventObj: FirebaseListObservable<any[]>;

  constructor(public db: AngularFireDatabase, public elService: EventListService, @Inject(FirebaseApp) public firebaseApp: firebase.app.App) {
    this.source = new LocalDataSource();
    this.items = this.elService.getEvents();
    this.eventObj = this.db.list('/event');
    this.callEvents();
  }

  callEvents() {
    this.items.take(1).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.source.append(snapshot.val());
      });
    });
  }

  onSaveConfirm(event) {
    var result = window.confirm('Are you sure you want to save?');

    if (result) {
      // event.confirm.resolve(event.newData);

      console.log("new", event.newData);

      let initData = this.elService.getEventByTitle(event.newData.title);

      initData.take(1).subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          initData = snapshot.val();
          console.log("initData: ", initData);

          let isValidated: boolean = true;
          let isUpdated: boolean = false;

          if (!(initData.title === event.newData.title)) {
            if (event.newData.title.length > 0) {
              initData.title = event.newData.title;
              console.log("title changed: ", initData.title);
              isUpdated = true;
            } else {
              alert("행사 제목을 입력해주세요.");
              isValidated = false;
            }
          }

          if (!(initData.address === event.newData.address)) {
            if (event.newData.address.length > 0) {
              initData.address = event.newData.address;
              console.log("address changed: ", initData.address);
              isUpdated = true;
            } else {
              alert("행사 위치를 입력해주세요.");
              isValidated = false;
            }
          }

          if (!(initData.begin === event.newData.begin)) {
            if (event.newData.begin.length > 0) {
              initData.begin = event.newData.begin;
              console.log("begin changed: ", initData.begin);
              isUpdated = true;
            } else {
              alert("행사 시작 시간을 입력해주세요.");
              isValidated = false;
            }
          }

          if (!(initData.url === event.newData.url)) {
            if (event.newData.url.length > 0) {
              initData.url = event.newData.url;
              console.log("url changed: ", initData.url);
              isUpdated = true;
            } else {
              alert("행사 url을 입력해주세요.");
              isValidated = false;
            }
          }


        })
      });
      //
      //
      //
      //     if (typeof(event.newData.tags) == "string") {
      //       let tags = event.newData.tags.split(",");
      //
      //       console.log("data.tags : ", data.tags);
      //       console.log("tags : ", tags);
      //
      //       if (tags.length > 0) {
      //         console.log(tags.length);
      //       } else {
      //         alert("태그를 입력해주세요.");
      //       }
      //       console.log("data.tags : ", data.tags);
      //       console.log("tags : ", tags);
      //     }
      //
      //     if ((typeof data != 'undefined') && isUpdated) {
      //       //이전 데이터 => data.tags
      //
      //       //update할 데이터
      //       let tags = event.newData.tags.split(",");
      //
      //       let existingTags:any = ""; //update이전에도 존재했던 태그목록 index
      //       let deletedTags:any = ""; //update후 삭제된 태그목록 index
      //       let newTags:any = "";//update후 새롭게 추가된 태그목록 index
      //
      //       /** for (let i in tags) {
      //         // let indexOf: number = data.tags.indexOf(tags[i]);
      //         if( indexOf > -1 ){
      //           //원래 있던 태그
      //           existingTags.push(indexOf);
      //           console.log("원래 있던 태그 : ",tags[i]);
      //         }else{
      //           //추가된 태그
      //           newTags.push(parseInt(i));
      //         }
      //       } **/
      //
      //       //tag table update for deleted tags
      //       for(let i in data.tags){
      //         //update 이전에도 존재했던 태그이면 통과
      //         if( existingTags.indexOf(i) == -1 ){
      //           //Todo: DeleteTags, find tag equal to label and count--
      //           console.log("delete tag : ", i, data.tags[i]);
      //         }
      //       }
      //
      //       console.log(event.newData);
      //
      //       //tag table update for new tags
      //       //Todo: push on the tag table to this data : newTags
      //       //Todo: check if is tag already exist
      //       //case 1: exist : count ++;
      //       //case 2: not exist : create new record
      //
      //       /*this.db.object('event/' + event.newData.id).set(data)
      //       	.then(_ => console.log("Updated"))
      //       	.catch(err => console.log(err, "Failed"));
      //       	*/
      //       console.log(event.newData.url.split('event/')[1]);
      //
      //       let _id = event.newData.url.split('event/')[1];
      //
      //
      //       this.firebaseApp.database().ref().child('event/' + _id).once('value', (snapshot) => {
      //     		this.firebaseApp.database().ref().child('event/' + _id).update({
      //     			tags: tags
      //     	});
      //   });
      //     }
      //   });

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

  onConfirm(value) {
    alert("승인하기");
  }

  onEdit(event) {
    console.log("on Edit");
  }

  ngOnInit() {
  }

}
