import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { TagInputModule } from 'ng2-tag-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MgmtComponent } from './mgmt/mgmt.component';
import { EventManagerComponent } from './mgmt/event-manager/event-manager.component';
import { TagManagerComponent } from './mgmt/tag-manager/tag-manager.component';
import { HipsComponent } from './hips/hips.component';
import { MainComponent } from './hips/main/main.component';
import { SearchComponent } from './hips/search/search.component';
import { TrendTagComponent } from './hips/main/trend-tag/trend-tag.component';
import { EventListComponent } from './hips/main/event-list/event-list.component';
import { SearchInputComponent } from './hips/main/search-input/search-input.component';

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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TagInputModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
