import { Component, OnInit, Input } from '@angular/core';
import {TagListService} from "../../../services/tag-list.service";

@Component({
  selector: 'hips-trend-tag',
  templateUrl: './trend-tag.component.html',
  styleUrls: ['./trend-tag.component.css']
})
export class TrendTagComponent implements OnInit {
	@Input() ref;
  // trend_tags = ['TAG', 'EXAMPLE', 'HIPS', '개발자로성공하기', '건물주가꿈입니다'];
  trend_tags =[];

  test;
  constructor(public tgService: TagListService) {
    this.test = this.tgService.getTrendTags();
    console.log(this.test);
    this.callEvents()
  }
  ngOnInit() {
  }

  add(word) {
    console.log(word);
  	this.ref.addSearchQueries(word);
  }

  callEvents() {
    this.test.subscribe(snapshots => {
      this.TagsOrderByCount(snapshots);
    });
  }

  TagsOrderByCount(data){
    data.forEach(tag => this.trend_tags.unshift(tag.val()));
    console.log(this.trend_tags);
  }

}
