import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe'
})
export class DatePipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
  	if(value !== undefined) {
	    let spliter = value.split(' ');
	    let dates = spliter[0].split('-');
	    let times = spliter[1].split(':');

	    let year = dates[0] + "년";
	    let month = dates[1] + "월";
	    let day = dates[2] + "일";

	    let hour = times[0];
	    let minutes = times[1];

	    let timeSpliter = ''; // 오전 또는 오후

	    if(hour / 12 <= 1) {
	    	timeSpliter = "오전"
	    } else {
	    	timeSpliter = "오후"
	    	hour = hour - 12;
	    }

	    let returned = `${timeSpliter}${hour}:${minutes}`;
	    return returned;  		
  	}
  }
}
