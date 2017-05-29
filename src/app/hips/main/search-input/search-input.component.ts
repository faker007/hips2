import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

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

	search_queries = ['띄어쓰기', '기준으로', '태그화', '됩니다.'];

  eventListIndex:number = 0;; // eventListIndex 변수는 Array.prototype.filter에서 index를 가져올 수 없어서 이렇게 선언 해두었음. 나중에 리펙토링할 수 있으면, 하는 게 좋을듯.

  constructor() { 

  }

  ngOnInit() {

  }

  addSearchQueries(word) {
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
        if(query.value) {
          if(eventList.title.indexOf(query.value) !== -1) {
            priority++;
          }
          eventList.tags.forEach((tag, index) => {
            if(tag.indexOf(query.value) !== -1) {
              priority++;
            }
          });
        }
        if(priority >= 1) {
          let obj = {
            address: eventList.address,
            beign: eventList.begin,
            created: eventList.created,
            end: eventList.end,
            id: eventList.id,
            isDeprecated: eventList.isDeprecated,
            tags: eventList.tags,
            title: eventList.title,
            url: eventList.url,
            priority: priority  
          }
          this.atarashi_array.push(obj);
        }

        this.ref.eventLists = this.atarashi_array;
      });



      /*eventList.tags.forEach((tag, index) => {
        this.search_queries.forEach((query:any, index2) => {
          if(query.value) {
            if(tag.indexOf(query.value) !== -1) {
              console.log(query);
              console.log(tag);
              console.log(eventList.title);
              console.log(this.eventListIndex);          
            }
          }
        });
      });*/

      /* if(eventList.tags[0].indexOf("남") !== -1) {
        this.atarashi_array.push(eventList);

        this.ref.eventLists = this.atarashi_array;
      } */
    });
  }

  beOriginalArray() {
    this.ref.eventLists = [];
    this.atarashi_array = [];
    this.ref.eventLists = this.undo_array;
  }

  showArray() {
    console.log(this.ref.eventLists);
  }
}
