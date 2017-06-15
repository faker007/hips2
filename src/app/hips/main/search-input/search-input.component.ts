import {Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { forEach } from "@angular/router/src/utils/collection";

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';

import { SearchListService } from '../../../services/search-list.service';

import { IMyDrpOptions, IMyDateRangeModel, IMyDateRange, IMyInputFieldChanged, IMyCalendarViewChanged, IMyDateSelected } from 'mydaterangepicker';

import { EmitterService } from '../../../services/my.service';

@Component({
  selector: 'hips-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchInputComponent implements OnInit {
  @Input() ref;
  atarashi_array: Array<any> = []; // 태그 검색이 반환될 배열
  undo_array: Array<any> = []; // 태그 검색을 하면 원본 배열이 사라지는데, 사라지는 원본 배열에 대한 백업용

	search_queries = [];

  eventListIndex:number = 0;; // eventListIndex 변수는 Array.prototype.filter에서 index를 가져올 수 없어서 이렇게 선언 해두었음. 나중에 리펙토링할 수 있으면, 하는 게 좋을듯.

  private myDateRangePickerModule: IMyDrpOptions = {
    dateFormat: 'yyyy.mm.dd',

  };

  private model: any = {
    beginDate: {
      year: 2017,
      month: 6,
      day: 17
    },
    endDate: {
      year: 2017,
      month: 6,
      day: 18
    }
  }

  constructor(public slS: SearchListService, public router: Router, public route: ActivatedRoute) {
  }

  ngOnInit() {

  }

  addSearchQueries(word) {

    //트랜딩 태그에서 태그 추가할 때, 중복체크.
    for(let query of this.search_queries){
      if(query === word)
        return;
    }
  	this.search_queries.push(word);
  }

  returnSearchedArray() {
    this.eventListIndex = 0;
    if(this.undo_array[0] === undefined) {
      this.undo_array = this.ref.eventLists;
    }

    this.atarashi_array = [];

    this.ref.eventLists.filter((eventList) => {
      var priority = 0;
      this.eventListIndex = this.eventListIndex + 1;
      this.search_queries.forEach((query:any, index) => {
        console.log(query);
        if(query) {
          if(eventList.title.indexOf(query) !== -1) {
            priority++;
          }
          eventList.tags.forEach((tag, index) => {
            if(tag.indexOf(query) !== -1) {
              priority++;
            }
          });
        }
      });

      if(priority >= 1) {
        let obj = {
          address: eventList.address,
          begin: eventList.begin,
          created: eventList.created,
          end: eventList.end,
          id: eventList.id,
          isDeprecated: eventList.isDeprecated,
          tags: eventList.tags,
          title: eventList.title,
          url: eventList.url,
          priority: priority
        };
        this.atarashi_array.push(obj);
      }

      this.atarashi_array.sort((a, b) => {
        return b.priority - a.priority;
      });
    });

    this.ref.groupBy(this.atarashi_array);

    this.search_queries.forEach((query, index) => {
      this.slS.addUserSearch(query);
    });
  }

  searchByDate() {
    if(this.undo_array[0] === undefined) {
      this.undo_array = this.ref.eventLists;
    }

    this.atarashi_array = [];

    this.ref.eventLists.forEach((eventList, index) => {
      var eventListTimeSpliter = eventList.begin.split(" ")[0].split("-");
      var eventListYear = eventListTimeSpliter[0];
      var eventListMonth = eventListTimeSpliter[1];
      var eventListDay = eventListTimeSpliter[2];
      var eventListDate = new Date(eventListYear, eventListMonth, eventListDay);

      var myDate = new Date(this.model.beginDate.year, this.model.beginDate.month, this.model.beginDate.day);
      var myDate2 = new Date(this.model.endDate.year, this.model.endDate.month, this.model.endDate.day);

      if(eventListDate >= myDate && eventListDate <= myDate2) {
        this.atarashi_array.push(eventList);
        console.log(index);
      }

      this.ref.groupBy(this.atarashi_array);
    });
  }

  beOriginalArray() {
    this.atarashi_array = [];
    this.ref.groupBy(this.undo_array);
  }

  showArray() {
    console.log(this.ref.eventLists);
  }

  onAddTag() {
  }

  navigateToSearch() {
    this.router.navigate(['/search'], { queryParams: { array: this.search_queries } });
  }

  onRemoveTag() {
    if(this.search_queries[0] !== undefined) {
      this.returnSearchedArray();
    } else {
      this.beOriginalArray();
    }
  }
}

@Component({
  selector: 'hips-search-input-2',
  templateUrl: './search-input-2.component.html',
  styleUrls: ['./search-input-2.component.css'],
  providers: [SearchInputComponent],
  encapsulation: ViewEncapsulation.None
})
export class SearchInput2Component implements OnInit {
  @Input() ref;
  @Input() ref2;

  public isDatepickerVisible: boolean = false;

  atarashi_array: Array<any> = []; // 태그 검색이 반환될 배열
  undo_array: Array<any> = []; // 태그 검색을 하면 원본 배열이 사라지는데, 사라지는 원본 배열에 대한 백업용

  search_queries: Array<any> = [];

  searchInput: any;

  eventListIndex:number = 0;; // eventListIndex 변수는 Array.prototype.filter에서 index를 가져올 수 없어서 이렇게 선언 해두었음. 나중에 리펙토링할 수 있으면, 하는 게 좋을듯.

  today: Date = new Date();
  todayYear: any = this.today.getFullYear();
  todayMonth: any = this.today.getMonth() + 1;
  todayDay: any = this.today.getDate();

  private myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'yyyy.mm.dd',
    inline: true,
    showSelectDateText: true,
    markCurrentDay: true,
    disableUntil: {
      year: this.todayYear, 
      month: this.todayMonth, 
      day: this.todayDay - 1
    }
  };

  constructor(public slS: SearchListService) {
    if(EmitterService.get('queries') !== undefined) {
      EmitterService.get('queries').take(1).subscribe(datas => {
      	if(datas !== undefined && datas[0] !== undefined) {
	        datas.forEach((data, index) => {
	          this.search_queries.push(data);
	        });
      	}

        if(this.search_queries.length !== 0) {
          setTimeout(() => { // To do : 이건 꼼수로 해결한 부분. 반드시 리팩토링 되어야 할 것임.
            this.returnSearchedArray();
            console.log('Okay!');
          }, 1500);
        }
      });
    }

    if(this.ref2 !== undefined) {
      this.search_queries = this.ref2.array;
    } else {
      this.search_queries = [];
    }

    console.log(this.search_queries);
  }

  ngOnInit() {

  }

  addSearchQueries(word) {
    //트렌딩 태그에서 태그 추가할 때, 중복체크.
    for(let query of this.search_queries){
      if(query === word)
        return;
    }
    this.search_queries.push(word);
  }

  returnSearchedArray() {
    this.eventListIndex = 0;
    if(this.undo_array[0] === undefined) {
      this.undo_array = this.ref.eventLists;
    }

    this.atarashi_array = [];

    this.ref.eventLists.filter((eventList) => {
      var priority = 0;
      this.eventListIndex = this.eventListIndex + 1;
      this.search_queries.forEach((query:any, index) => {
        console.log(query);
        if(query) {
          if(eventList.title.indexOf(query) !== -1) {
            priority++;
          }
          eventList.tags.forEach((tag, index) => {
            if(tag.indexOf(query) !== -1) {
              priority++;
            }
          });
        }
      });

      if(priority >= 1) {
        let obj = {
          address: eventList.address,
          begin: eventList.begin,
          created: eventList.created,
          end: eventList.end,
          id: eventList.id,
          isDeprecated: eventList.isDeprecated,
          tags: eventList.tags,
          title: eventList.title,
          url: eventList.url,
          priority: priority
        };
        this.atarashi_array.push(obj);
      }

      console.log(this.atarashi_array[0]);

      if(this.atarashi_array[0] === undefined) {
      	this.ref.sortedGroupByEventList = [];
      }

      this.atarashi_array.sort((a, b) => {
        return b.priority - a.priority;
      });
    });

    this.ref.groupBy(this.atarashi_array);

    this.search_queries.forEach((query, index) => {
      this.slS.addUserSearch(query);
    });
  }

  searchByDate(beginDate, endDate) {
    console.log('Called by searchByDate() beginDate: ' + beginDate);
    console.log('Called by searchByDate() endDate: ' + endDate);

    if(this.undo_array[0] === undefined) {
      this.undo_array = this.ref.eventLists;
    }

    this.atarashi_array = [];

    this.ref.eventLists.forEach((eventList, index) => {
      var eventListTimeSpliter = eventList.begin.split(" ")[0].split("-");
      var eventListYear = eventListTimeSpliter[0];
      var eventListMonth = eventListTimeSpliter[1];
      var eventListDay = eventListTimeSpliter[2];
      var eventListDate = new Date(eventListYear, eventListMonth, eventListDay);

      var myDate = new Date(beginDate.year, beginDate.month, beginDate.day);
      var myDate2 = new Date(endDate.year, endDate.month, endDate.day);

      if(eventListDate >= myDate && eventListDate <= myDate2) {
        this.atarashi_array.push(eventList);
        console.log(index);
      }

      this.ref.groupBy(this.atarashi_array);

      if(this.atarashi_array.length === 0) {
        this.ref.sortedGroupByEventList = [];
      }
    });
  }

  beOriginalArray() {
    this.atarashi_array = [];
    this.ref.groupBy(this.undo_array);
  }

  showArray() {
    console.log(this.ref.eventLists);
  }

  onAddTag() {
    this.returnSearchedArray();
  }

  onRemoveTag() {
    if(this.search_queries[0] !== undefined) {
      this.returnSearchedArray();
    } else {
      this.beOriginalArray();
    }
  }

  onDateRangeChanged(event: any) {
    this.searchByDate(event.beginDate, event.endDate);
    this.isDatepickerVisible = false;
  }

  addZero(argu) {
    if(parseInt(argu) < 10) {
      return "0" + argu.toString().trim()
    } else {
      return argu;
    }
  }

  searchForThisWeek() {
    let today = `${this.todayYear}/${this.todayMonth}/${this.todayDay}`
    let today2 = `${this.todayYear}-${this.addZero(this.todayMonth)}-${this.addZero(this.todayDay)}`

    let firstDay = new Date(today);
    let thisWeek = new Date(firstDay.getTime() + (7 - firstDay.getDay()) * 24 * 60 * 60 * 1000);

    let formatedThisWeekYear = thisWeek.getFullYear();
    let formatedThisWeekMonth = thisWeek.getMonth() + 1;
    let formatedThisWeekDay = thisWeek.getDate();

    this.undo_array = this.ref.eventLists;

    let todayObj = {
    	year: `${this.todayYear}`,
    	month: `${this.todayMonth}`,
    	day: `${this.todayDay}`
    }

    let formatedObj =  {
    	year: `${formatedThisWeekYear}`,
    	month: `${formatedThisWeekMonth}`,
    	day: `${formatedThisWeekDay}`
    }

    console.log(today2);
    this.searchByDate(todayObj, formatedObj);
  }

  searchForNextWeek() {
    let today = `${this.todayYear}/${this.todayMonth}/${this.todayDay}`
    let today2 = `${this.todayYear}-${this.addZero(this.todayMonth)}-${this.addZero(this.todayDay)}`

    let firstDay = new Date(today);
    let nextWeek = new Date(firstDay.getTime() + (7 - firstDay.getDay() + 1) * 24 * 60 * 60 * 1000);
    let nextWeek2 = new Date(firstDay.getTime() + (7 + 7 - firstDay.getDay()) * 24 * 60 * 60 * 1000);

    let formatedNextWeekYear = nextWeek2.getFullYear();
    let formatedNextWeekMonth = nextWeek2.getMonth() + 1;
    let formatedNextWeekDay = nextWeek2.getDate();

    this.undo_array = this.ref.eventLists;

    let todayObj = {
      year: `${nextWeek.getFullYear()}`,
      month: `${nextWeek.getMonth() + 1}`,
      day: `${nextWeek.getDate()}`
    }

    let formatedObj =  {
      year: `${formatedNextWeekYear}`,
      month: `${formatedNextWeekMonth}`,
      day: `${formatedNextWeekDay}`
    }

    this.searchByDate(todayObj, formatedObj);
  }

  beDefaultWeek() {
    this.beOriginalArray();
  }

}

