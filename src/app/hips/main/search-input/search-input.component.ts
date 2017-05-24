import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hips-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {
	search_queries = ['띄어쓰기', '기준으로', '태그화', '됩니다.'];
  constructor() { }

  ngOnInit() {

  }

  addSearchQueries(word) {
  	this.search_queries.push(word);
  }

}
