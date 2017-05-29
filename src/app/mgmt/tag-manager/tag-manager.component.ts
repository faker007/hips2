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
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager : {
      display : true,
      perPage:25
    },
    delete : {
      confirmDelete: true,
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
        this.source.prepend(snapshot.val());
      });
    });
  }

  ondeleteConfirm(event) {
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


  ngOnInit() {
  }

}
