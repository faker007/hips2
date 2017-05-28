import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'hips-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchInputComponent implements OnInit {
	search_queries = ['띄어쓰기', '기준으로', '태그화', '됩니다.'];
  constructor() { }

  ngOnInit() {

  }

}
