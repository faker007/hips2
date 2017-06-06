import { Component, OnInit } from '@angular/core';
import { EventListService } from '../../../services/event-list.service';

import * as _ from 'lodash';

import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'hips-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  animations: [
    trigger('myAwesomeAnimation', [
      state('small', style({
        transform: 'scale(1)',
      })),
      state('large', style({
        transform: 'scale(1.0)'
      })),
      transition('small <=> large', animate('300ms ease-in', keyframes([
        style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
        style({opacity: 0.5, transform: 'translateY(35px)', offset: 0.5}),
        style({opacity: 1, transform: 'translateY(0)', offset: 1.0})
      ]))),
    ])
  ]
})
export class EventListComponent implements OnInit {

	eventLists:Array<any> = [];

	dayName:string = ''; // 요일
	month:string = ''; // 월
	day:string = ''; // 일

  array:Array<any> = [];

  groupByEventList:Array<any> = []; // lodash의 groupBy를 하기 위한 변수.

  sortedGroupByEventList:Array<any> = [];

  tatanoArray:Array<any> = [];

  state:string = 'small'

  constructor(public elS: EventListService) {
  }

  ngOnInit() {
  	this.elS.getEvents().subscribe((snapshots) => {
      this.eventLists = [];
  		snapshots.forEach((snapshot) => {
  			this.eventLists.push(snapshot.val());
        console.log(snapshot.val());
  		});
  		this.sortArray();
  		this.removeArrayFromToday();
  		this.groupBy(this.eventLists);  		
  		console.log(this.eventLists);
  	});  	
  	this.getTodayDay();
  }

  getTodayDay() {
  	let date = new Date();
  	let dayNameArray = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']; // date.getDay() 메소드는 0부터 반환한다. 0은 일요일.
  	let dayName = dayNameArray[date.getDay()];
  	let month = date.getMonth () + 1;
  	let day = date.getDate();

  	this.dayName = dayName;
  	this.month = month.toString();
  	this.day = day.toString();
  }

  sortArray() {
  	if(this.eventLists !== []) {
  		this.eventLists.sort(function (a, b) {
  			if(a !== undefined && b !== undefined) {
  				var monthSort1 = a.begin.split(" ")[0].split("-")[1];
	  			var monthSort2 = b.begin.split(" ")[0].split("-")[1];

	  			var daySort1 = a.begin.split(" ")[0].split("-")[2];
	  			var daySort2 = b.begin.split(" ")[0].split("-")[2];

	  			var hourSort1 = a.begin.split(" ")[1].split(":")[0];
	  			var hourSort2 = b.begin.split(" ")[1].split(":")[0];

	  			var minuteSort1 = a.begin.split(" ")[1].split(":")[1];
	  			var minuteSort2 = b.begin.split(" ")[1].split(":")[1];

	  			if(monthSort1 < monthSort2 ) return -1;
	  			if(monthSort1 > monthSort2 ) return 1;
	  			if(daySort1 < daySort2 ) return -1;
	  			if(daySort1 > daySort2 ) return 1;
	  			if(hourSort1 < hourSort2 ) return -1;
	  			if(hourSort1 > hourSort2 ) return 1;
	  			if(minuteSort1 < minuteSort2 ) return -1;
	  			if(minuteSort1 > minuteSort2 ) return 1;

	  			return 0;
  			}
  		});
  	}
  }

  removeArrayFromToday() {
  	var index = 0;
  	for(let i = 0; i < this.eventLists.length; i++) {
  		var month1 = parseInt(this.eventLists[i].begin.split(" ")[0].split("-")[1]);
  		var month2 = parseInt(this.month);

  		var day1 = parseInt(this.eventLists[i].begin.split(" ")[0].split("-")[2]);
  		var day2 = parseInt(this.day);

  		if(month1 < month2) {
  			index++;
  		}

  		if(day1 < day2 && month1 <= month2) {
  			index++;
  		}
  	}

  	while(index) {
  		this.eventLists.shift();
  		index--;
  	}
  }

  addMyArray() {
    this.array.push('something');
    console.log(this.array);
  }

  groupBy(array) {
  	let tempArray = [];
  	this.groupByEventList = array;
  	this.groupByEventList.forEach((eventList, index) => {
  		let obj = {
  			address: eventList.address,
  			parsed_begin: eventList.begin.split(" ")[0], 
  			begin: eventList.begin,
  			created: eventList.created,
  			end: eventList.end,
  			id: eventList.id,
  			isDeprecated: eventList.isDeprecated,
  			tags: eventList.tags,
  			title: eventList.title,
  			url: eventList.url
  		};

  		tempArray.push(obj);
  	});

  	let tatanoArray:any = _.groupBy(tempArray, 'parsed_begin');

  	this.sortedGroupByEventList = [];

  	let objKeys = Object.keys(_.groupBy(tempArray, 'parsed_begin'));
  	objKeys.forEach((key, index) => {
  		this.sortedGroupByEventList.push(tatanoArray[key]);
  	});
  }

  getDday(month, day) {
    var now = new Date();
    var then= new Date(`2017-${month}-${day}`);
    var gap = now.getTime() - then.getTime();
    gap = Math.floor(gap / (1000 * 60 * 60 * 24)) * -1
    if(gap !== NaN) {
      return gap;
    } else {
      return "999";
    }
  }

  getYoil(month, day) {
    let date = new Date(`2017-${month}-${day}`);
    let dayNameArray = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']; // date.getDay() 메소드는 0부터 반환한다. 0은 일요일.
    let dayName = dayNameArray[date.getDay()];
    return dayName;
  }

  animateMe() {
    this.state = (this.state === 'small' ? 'large' : 'small');
  }
}
