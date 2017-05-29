import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

import {TagInputModule} from 'ng2-tag-input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {MgmtComponent} from './mgmt/mgmt.component';
import {
  EventManagerComponent, 
  ButtonViewComponent,
  BtnDeleteComponent
} from './mgmt/event-manager/event-manager.component';
import {TagManagerComponent, BtnDeleteComponent2} from './mgmt/tag-manager/tag-manager.component';
import {HipsComponent} from './hips/hips.component';
import {MainComponent} from './hips/main/main.component';
import {SearchComponent} from './hips/search/search.component';
import {TrendTagComponent} from './hips/main/trend-tag/trend-tag.component';
import {EventListComponent} from './hips/main/event-list/event-list.component';
import {SearchInputComponent} from './hips/main/search-input/search-input.component';
import {Ng2SmartTableModule} from "ng2-smart-table";
import {EventListService} from "./services/event-list.service";
import {TagListService} from "./services/tag-list.service";
import {AngularFireModule} from "angularfire2";

export const firebaseConfig = {
  apiKey: "AIzaSyDsEP8hG1QUXn_zvZ87il2grtUsQQgoi5E",
  authDomain: "hips-f9841.firebaseapp.com",
  databaseURL: "https://hips-f9841.firebaseio.com",
  storageBucket: "hips-f9841.appspot.com",
  messagingSenderId: "159416853085"
};

@NgModule({
  declarations: [
    AppComponent,
    MgmtComponent,
    EventManagerComponent,
    TagManagerComponent,
    HipsComponent,
    MainComponent,
    SearchComponent,
    TrendTagComponent,
    EventListComponent,
    SearchInputComponent,
    ButtonViewComponent,
    BtnDeleteComponent,
    BtnDeleteComponent2
  ],
  entryComponents: [ButtonViewComponent, BtnDeleteComponent, BtnDeleteComponent2],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TagInputModule,
    BrowserAnimationsModule,
    Ng2SmartTableModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [EventListService,TagListService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
