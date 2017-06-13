import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { EmitterService } from '../../services/my.service';

@Component({
  selector: 'hips-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {


  search_queries: any;
  private sub: any;

  constructor(public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      EmitterService.get('queries').emit(params.array);
    });
  }
}
