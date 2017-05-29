import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hips-trend-tag',
  templateUrl: './trend-tag.component.html',
  styleUrls: ['./trend-tag.component.css']
})
export class TrendTagComponent implements OnInit {
	@Input() ref;
  trend_tags = ['TAG', 'EXAMPLE', 'HIPS', '개발자로성공하기', '건물주가꿈입니다'];
  
  constructor() { }

  ngOnInit() {
  }

  add(word) {
  	this.ref.addSearchQueries(word);
  }

}
