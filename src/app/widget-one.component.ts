import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Data, InfoComponent } from './models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'widget-one',
  template: `
    <ng-container>
      <p><strong> WIDGET (1) </strong></p>
      <span><strong>Id:</strong> {{ info?.id }}</span>
      <p><strong>Data:</strong> {{ info?.title }}</p>
    </ng-container>
  `,
  styleUrls: ['./widget-one.component.css'],
})
export class WidgetOneComponent implements InfoComponent {
  static componentName = 'WidgetOneComponent';
  @Input() info: Partial<Data>;  
}
 