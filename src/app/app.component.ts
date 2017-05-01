import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	items = ['Pizza', 'Pasta', 'Parmesan'];
  title = 'app works!';

  show() {
  	console.log(this.items);
  }
}
