import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ContainerComponent } from './container.component';
import { RootComponent } from './root.component';
import { WidgetOneComponent } from './widget-one.component';
import { WidgetTwoComponent } from './widget-two.component';


@NgModule({
  imports:          [ BrowserModule, FormsModule, HttpClientModule],
  declarations:     [ ContainerComponent, RootComponent,
                      WidgetOneComponent, WidgetTwoComponent ],
  entryComponents:  [ WidgetOneComponent, WidgetTwoComponent],
  bootstrap:    [ RootComponent ]
})
export class AppModule { }
