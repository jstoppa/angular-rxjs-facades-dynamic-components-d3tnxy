import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Data, InfoComponent } from './models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'widget-two',
  template: `
    <ng-container>
      <p><strong> WIDGET (2) </strong></p>
      <span><strong>Id:</strong> {{ info?.id }}</span>
      <p><strong>Data:</strong> {{ info?.title }}</p>
    </ng-container>
  `,
  styleUrls: ['./widget-two.component.css'],
})
export class WidgetTwoComponent implements InfoComponent {
  static componentName = 'WidgetTwoComponent';
  @Input() info: Partial<Data>;  
}
