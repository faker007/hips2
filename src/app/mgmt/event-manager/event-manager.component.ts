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
    <button *ngIf = "isUndefined" (click) = "onClick()">{{ renderValue }}</button>
    <p *ngIf = "!isUndefined">{{ renderValue }}</p>
  `
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

  constructor(public db: AngularFireDatabase, public elService: EventListService, @Inject(FirebaseApp) public firebaseApp: firebase.app.App) {
  }

  onClick() {
    var result = window.confirm('이 이벤트를 승인하시겠습니까?');

    if (result) {
      console.log('승인하기', this.rowData);
      /* this.firebaseApp.database().ref().child('event/' + this.rowData.url.split('/event/')[1]).update({
       isDeprecated: true
       }); */
    } else {
      console.log('승인하기가 거절되었습니다.', this.rowData);
    }
  }
}

@Component({
  selector: 'btn-delete',
  template: `
    <button (click)="onClick($event, source)">{{ renderValue }}</button>
  `
})
export class BtnDeleteComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    if (this.value) {
      this.renderValue = "복구하기1234";
    } else {
      this.renderValue = "삭제하기1234";
    }
  }

  constructor(public db: AngularFireDatabase, public elService: EventListService, @Inject(FirebaseApp) public firebaseApp: firebase.app.App) {
  }

  onClick(event, source) {
    let result = window.confirm("이벤트를 삭제하시겠습니까?");
    if (result) {
      console.log('삭제하기: ', this.rowData);
      this.firebaseApp.database().ref().child('event/' + this.rowData.url.split('/event/')[1]).remove();
    } else {
      console.log('삭제하기를 거절하였습니다: ', this.rowData);
    }
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
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            console.log(row);
          });
        }
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
      event.confirm.resolve(event.newData);
      console.log(event.newData);

      this.db.object('/event/' + event.newData.id)
        .take(1)
        .subscribe(data => {
          console.log(data);
          let isUpdated: boolean = false;

          if (data.title != event.newData.title) {
            if (event.newData.title.length > 0) {
              data.title = event.newData.title;
              isUpdated = true;
            } else {
              alert("행사 제목을 입력해주세요.");
            }
          }

          if (data.address != event.newData.address) {
            if (event.newData.address.length > 0) {
              data.begin = event.newData.address;
              isUpdated = true;
            } else {
              alert("행사 위치를 입력해주세요.");
            }
          }

          if (data.begin != event.newData.begin) {
            if (event.newData.begin.length > 0) {
              data.begin = event.newData.begin;
              isUpdated = true;
            } else {
              alert("행사 시작 시간을 입력해주세요.");
            }
          }

          if (data.url != event.newData.url) {
            if (event.newData.url.length > 0) {
              data.begin = event.newData.url;
              isUpdated = true;
            } else {
              alert("행사 시작 시간을 입력해주세요.");
            }
          }

          if (typeof(event.newData.tags) == "string") {
            let tags = event.newData.tags.split(",");

            console.log("data.tags : ", data.tags);
            console.log("tags : ", tags);

            if (tags.length > 0) {
              console.log(tags.length);
            } else {
              alert("태그를 입력해주세요.");
            }
            console.log("data.tags : ", data.tags);
            console.log("tags : ", tags);
          }

          if ((typeof data != 'undefined') && isUpdated) {
            //이전 데이터 => data.tags

            //update할 데이터
            let tags = event.newData.tags.split(",");

            let existingTags: any = ""; //update이전에도 존재했던 태그목록 index
            let deletedTags: any = ""; //update후 삭제된 태그목록 index
            let newTags: any = "";//update후 새롭게 추가된 태그목록 index

            /** for (let i in tags) {
              // let indexOf: number = data.tags.indexOf(tags[i]);
              if( indexOf > -1 ){
                //원래 있던 태그
                existingTags.push(indexOf);
                console.log("원래 있던 태그 : ",tags[i]);
              }else{
                //추가된 태그
                newTags.push(parseInt(i));
              }
            } **/

            //tag table update for deleted tags
            for (let i in data.tags) {
              //update 이전에도 존재했던 태그이면 통과
              if (existingTags.indexOf(i) == -1) {
                //Todo: DeleteTags, find tag equal to label and count--
                console.log("delete tag : ", i, data.tags[i]);
              }
            }

            console.log(event.newData);

            //tag table update for new tags
            //Todo: push on the tag table to this data : newTags
            //Todo: check if is tag already exist
            //case 1: exist : count ++;
            //case 2: not exist : create new record

            /*this.db.object('event/' + event.newData.id).set(data)
             .then(_ => console.log("Updated"))
             .catch(err => console.log(err, "Failed"));
             */
            console.log(event.newData.url.split('event/')[1]);

            let _id = event.newData.url.split('event/')[1];


            this.firebaseApp.database().ref().child('event/' + _id).once('value', (snapshot) => {
              this.firebaseApp.database().ref().child('event/' + _id).update({
                tags: tags
              });
            });
          }
        });

    } else {
      event.confirm.reject();
    }
  }

  convertDate(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
  }

  onCreateConfirm(event) {
    if (window.confirm('Are you sure you want to create?')) {
      event.newData['name'] += ' + added in code';
      console.log(event.newData);

      let current_date = new Date();
      let timestamp = current_date.getTime();

      if (event.newData.title.length > 0) {
        if (event.newData.begin.length > 0) {
          if (event.newData.address.length > 0) {
            if (event.newData.url.length > 0) {
              if (event.newData.tags.length > 0) {

                let tags = event.newData.tags.split(",");

                for (let i in tags) {
                  this.firebaseApp.database().ref('tag').orderByChild('label').equalTo(tags[i]).limitToFirst(1).once('value').then((snapshot) => {

                    //table에 tag 존재 X
                    if (snapshot.val() === null) {

                      this.firebaseApp.database().ref('tag/' + timestamp).set({
                        label: tags[i],
                        id: timestamp,
                        count: 1,
                        isDeprecated: false,
                        created: this.convertDate(current_date)
                      });

                    } else {

                      snapshot.forEach((childSnapshot) => {
                        var value = childSnapshot.val();
                        console.log("Title is : " + value.label);

                        this.firebaseApp.database().ref().child('tag/' + value.id).update({
                          count: parseInt(value.count) + 1
                        });
                      });
                    }
                  });
                }

                //todo: add new record to event table
                this.firebaseApp.database().ref('event/' + timestamp).set({
                  title: event.newData.title,
                  address: event.newData.address,
                  begin: event.newData.begin,
                  url: event.newData.url,
                  created: this.convertDate(current_date),
                  isDeprecated: false,
                  id: timestamp,
                  tags: tags,
                  updated: true,
                });

                event.confirm.resolve();


              } else {
                event.confirm.reject();
                alert("이벤트 태그를 입력해주세요");
              }
            } else {
              event.confirm.reject();
              alert("이벤트 url을 입력해주세요");
            }
          } else {
            event.confirm.reject();
            alert("이벤트 위치를 입력해주세요");
          }
        } else {
          event.confirm.reject();
          alert("이벤트 시작 시간을 입력해주세요");
        }
      } else {
        event.confirm.reject();
        alert("이벤트 제목을 입력해주세요");
      }

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
