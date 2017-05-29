import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ViewCell, LocalDataSource} from "ng2-smart-table";
import {FirebaseListObservable, AngularFire, AngularFireDatabase} from "angularfire2";
import {TagListService} from "../../services/tag-list.service";

@Component({
  selector: 'btn-delete',
  template: `
    <button (click)="onClick($event)">{{ renderValue }}</button>
  `,
})
export class BtnDeleteComponent2 implements ViewCell, OnInit {
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
    this.save.emit(this.rowData);
    // console.log("복구/삭제하기 : ", event.value);
  }
}

@Component({
  selector: 'mgmt-tag-manager',
  templateUrl: './tag-manager.component.html',
  styleUrls: ['./tag-manager.component.css']
})
export class TagManagerComponent implements OnInit {

  source: LocalDataSource;
  settings = {
    pager : {
      display : true,
      perPage:25
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
        width: "5%",
        editable: false
      },
      label: {
        title: '태그명',
        filter: false,
        width: "20%",
        editable: false
      },
      count: {
        title: '태그 횟수',
        filter: false,
        width: "15%",
        editable: false
      },
      created: {
        title: '생성 날짜',
        width: "20%",
        filter: false,
        editable: false,
      },
      updated: {
        title: '업데이트 날짜',
        width: "20%",
        filter: false,
        editable: false,
      },
      isDeprecated: {
        title: '삭제/복구',
        width: "20%",
        filter: false,
        editable: false,
        type: 'custom',
        renderComponent: BtnDeleteComponent2,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`)
          });
        }
      },
    }
  };

  items: FirebaseListObservable<any[]>;
  tagObj: FirebaseListObservable<any[]>;

  constructor(public af: AngularFire, public tgService: TagListService, db: AngularFireDatabase) {
    this.source = new LocalDataSource();
    this.items = this.tgService.getEvents();
    this.tagObj = this.af.database.list('/tag');
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
      // event.newData['name'] += ' + added in code';
      //get data from db
      this.af.database.object('/event/' + event.newData.id)
        .subscribe(data => {
          console.log(data);
          console.log(event.newData);

          //update check
          //title
          if (data.title != event.newData.title) {
            if (event.newData.title.length > 0) {
              data.title = event.newData.title;
            } else {
              alert("행사 제목을 입력해주세요.");
            }
          }

          //address
          if (data.address != event.newData.address) {
            if (event.newData.address.length > 0) {
              data.begin = event.newData.address;

            } else {
              alert("행사 위치를 입력해주세요.");
            }
          }

          //begin
          if (data.begin != event.newData.begin) {
            if (event.newData.begin.length > 0) {
              data.begin = event.newData.begin;
            } else {
              alert("행사 시작 시간을 입력해주세요.");
            }
          }

          //url
          if (data.url != event.newData.url) {
            if (event.newData.url.length > 0) {
              data.begin = event.newData.url;
            } else {
              alert("행사 시작 시간을 입력해주세요.");
            }
          }

          //tags
          if (typeof(event.newData.tags) == "string") {
            let tags = event.newData.tags.split(",");

            console.log("data.tags : ", data.tags);
            console.log("tags : ", tags);

            if (tags.length > 0) {
              //태그 길이 검증
              data.tags = tags;
            }else{
              alert("태그를 입력해주세요.");
            }
            console.log("data.tags : ", data.tags);
            console.log("tags : ", tags);
          }

          this.af.database.object('event/'+event.newData.id).set(data)
            .then(_ => console.log("Updated"))
            .catch(err => console.log(err, "Failed"));

        });
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

  onConfirm(value) {
    alert("승인하기");
  }

  onEdit(event) {
    console.log("Edit : ", event);
  }

  ngOnInit() {
  }

}
