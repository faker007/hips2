import {Component, OnInit, HostListener, Inject} from '@angular/core';
import {EventListService} from '../../../services/event-list.service';
import {DOCUMENT} from "@angular/platform-browser";
import {$} from "protractor";

@Component({
  selector: 'hips-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  eventLists: Array<any> = [];
  eventGroupIndex: number = 0;
  isLoaderVisible: boolean = true;

  dayName: string = ''; // 요일
  month: string = ''; // 월
  day: string = ''; // 일

  array: Array<any> = [];

  begin:string='2017-05-30';
  end:string='2017-05-31';

  constructor(public elS: EventListService, @Inject(DOCUMENT)private document: Document, ) {

    // this.elS.getEvents().subscribe((snapshots) => {
    // 	snapshots.forEach((snapshot) => {
    // 		this.eventLists.push(snapshot.val());
    // 	});
    // 	this.sortArray();
    // 	this.removeArrayFromToday();
    // 	console.log(this.eventLists);
    // });
    // var displayDate = new Date(new Date().toString());
    // let dayName = displayDate.getDate();
    // let month = displayDate.getMonth()+1;
    // let day = displayDate.getDay();
    //
    // console.log(displayDate);
    // console.log(dayName);
    // console.log(month);
    // console.log(day);

    var d = new Date();
    console.log(d);
// Wed Feb 29 2012 11:00:00 GMT+1100 (EST)

    d.setDate(d.getDate() + 1);
    console.log(d);
// Thu Mar 01 2012 11:00:00 GMT+1100 (EST)

    console.log(d.getDate());

    this.getEventsByDate(this.begin,this.end);

  }

  ngOnInit() {
    this.getTodayDay();
  }

  // ex ) begin : 2017-05-31 , end: 2017-06-01
  getEventsByDate(begin,end){
    this.elS.getEventsByDate(begin,end).subscribe((snapshots) => {
      snapshots.forEach((snapshot) => {
        this.eventLists.push(snapshot.val());
      });
      // this.sortArray();
      // this.removeArrayFromToday();
      console.log(this.eventLists);
    });
  }

  getTodayDay() {
    let date = new Date();
    let dayNameArray = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']; // date.getDay() 메소드는 0부터 반환한다. 0은 일요일.
    let dayName = dayNameArray[date.getDay()];
    let month = date.getMonth() + 1;
    let day = date.getDate();

    this.dayName = dayName;
    this.month = month.toString();
    this.day = day.toString();
  }



  sortArray() {
    if (this.eventLists !== []) {
      this.eventLists.sort(function (a, b) {
        if (a !== undefined && b !== undefined) {
          var monthSort1 = a.begin.split(" ")[0].split("-")[1];
          var monthSort2 = b.begin.split(" ")[0].split("-")[1];

          var daySort1 = a.begin.split(" ")[0].split("-")[2];
          var daySort2 = b.begin.split(" ")[0].split("-")[2];

          var hourSort1 = a.begin.split(" ")[1].split(":")[0];
          var hourSort2 = b.begin.split(" ")[1].split(":")[0];

          var minuteSort1 = a.begin.split(" ")[1].split(":")[1];
          var minuteSort2 = b.begin.split(" ")[1].split(":")[1];

          if (monthSort1 < monthSort2) return -1;
          if (monthSort1 > monthSort2) return 1;
          if (daySort1 < daySort2) return -1;
          if (daySort1 > daySort2) return 1;
          if (hourSort1 < hourSort2) return -1;
          if (hourSort1 > hourSort2) return 1;
          if (minuteSort1 < minuteSort2) return -1;
          if (minuteSort1 > minuteSort2) return 1;

          return 0;
        }
      });
    }
  }

  removeArrayFromToday() {
    var index = 0;
    for (let i = 0; i < this.eventLists.length; i++) {
      var month1 = parseInt(this.eventLists[i].begin.split(" ")[0].split("-")[1]);
      var month2 = parseInt(this.month);

      var day1 = parseInt(this.eventLists[i].begin.split(" ")[0].split("-")[2]);
      var day2 = parseInt(this.day);

      if (month1 < month2) {
        index++;
      }

      if (day1 < day2 && month1 <= month2) {
        index++;
      }
    }

    while (index) {
      this.eventLists.shift();
      index--;
    }
  }

  addMyArray() {
    this.array.push('something');
    console.log(this.array);
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    let documentHeight = this.document.body.offsetHeight;
    let scrollHeight = this.document.body.scrollHeight;
    let number = this.document.body.scrollTop;
    // let number = this.document.body.scrollTop;
    console.log(documentHeight, this.document.body.getElementsByClassName('content-wrapper')[0].scrollHeight+",,,,"+ this.document.body.scrollTop);

    if(documentHeight - number < 750 ){
      this.getEventsByDate('2017-05-31','2017-06-01');
      this.isLoaderVisible = true;
    }else{
      this.isLoaderVisible = false;
    }
    // if($('window').scrollTop() == $('document').height() - $('window').height()) {
    //   ajax call get data from server and append to the div
    // }
    // if (number > 100) {
    //   this.navIsFixed = true;
    // } else if (this.navIsFixed && number < 10) {
    //   this.navIsFixed = false;
    // }
  }
}
