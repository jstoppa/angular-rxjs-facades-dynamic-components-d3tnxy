import { ApiService } from './api.service';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WidgetConfig } from './models';
import { Observable } from 'rxjs';


const WIDGETS = [
  { apiId: '1', widgetName: 'WidgetOneComponent' },
  { apiId: '2', widgetName: 'WidgetTwoComponent' },
  { apiId: '3', widgetName: 'WidgetOneComponent' },
  { apiId: '4', widgetName: 'WidgetTwoComponent' },
  { apiId: '5', widgetName: 'WidgetOneComponent' }
] as WidgetConfig[];

@Component({
  selector: 'my-app',
  template: `
    <button (click)="facade.reloadAll(true)">Refresh ALL</button>
    <div *ngFor="let it of widgets">
      <container [id]="it.apiId" [widgetName]="it.widgetName"></container>
    </div>
  `,
  styleUrls: ['./root.component.css'],
})
export class RootComponent {
  widgets: WidgetConfig[] = WIDGETS;
  constructor(public facade: ApiService){}
}

