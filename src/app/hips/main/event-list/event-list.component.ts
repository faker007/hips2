import { Component, OnInit } from '@angular/core';
import { EventListService } from '../../../services/event-list.service';

@Component({
  selector: 'hips-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
	eventList: Array<any>;
  constructor(public elS: EventListService) { 
  }

  ngOnInit() {
  	this.elS.getEvents().subscribe((snapshots) => {
  		snapshots.forEach(function (snapshot) {
  			this.eventList.push(snapshot.val());
  		});
  	});
  }

}
