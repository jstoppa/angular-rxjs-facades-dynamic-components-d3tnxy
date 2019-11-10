import { Component, AfterViewInit, OnDestroy, ComponentFactoryResolver, ViewContainerRef, Input, ViewChild, Type, ChangeDetectionStrategy } from '@angular/core';
import {untilViewDestroyed} from '@mindspace-io/rxjs-utils';

import { InfoComponent } from './models';
import { ApiService, AsyncItem, AsyncState, filterAsyncItem } from './api.service';

export const STATUS_COLORS = {
  [AsyncState.IDLE]: 'white',
  [AsyncState.READY]: 'aquamarine',
  [AsyncState.LOADING]: 'yellow',
  [AsyncState.ERROR]: 'pink'
};

@Component({
  selector: 'container',
  template: `
    <div class="widget" [style.backgroundColor]="bkgrndColor" >
          <ng-container #vc></ng-container>
      <button (click)="facade.loadItem(id, true)">Reload</button>
    </div>
  `,
  styleUrls: ['./container.component.css'],
})
export class ContainerComponent implements AfterViewInit, OnDestroy {
  bkgrndColor = STATUS_COLORS[AsyncState.LOADING];
  
  constructor(
    public facade: ApiService, 
    private resolver: ComponentFactoryResolver) {   }
    
    @Input() id: string;
    @Input() widgetName : string;
    @ViewChild('vc',{read: ViewContainerRef, static: false}) target!: ViewContainerRef;
  

  ngAfterViewInit(): void {
    this.facade.loadItem(this.id);
    this.makeWidgetInstance(this.widgetName);    
    
    this.watchDatasource();
  }

  ngOnDestroy() {}  // placeholder...

  watchDatasource() {
    // Facade emits changes for all widgets...
    // Only want the streamed value associated with 'id'
    const data$ = this.facade.widgets$.pipe(
      filterAsyncItem(this.id),
      untilViewDestroyed(this)
    );

    data$.subscribe((item: AsyncItem) => {      
      this.vcInstance.info =  {...item.data};      
      this.bkgrndColor = STATUS_COLORS[item.status];
    });
  }

  makeWidgetInstance(componentName: string) {
    const factories = Array.from(this.resolver['_factories'].keys());
    const type = factories.find((x: any) => x.componentName === componentName) as Type<Component>;
    const factory = this.resolver.resolveComponentFactory(type);
    const compRef = this.target.createComponent(factory);

    this.vcInstance = compRef.instance as InfoComponent;    
  }

  private vcInstance: InfoComponent;
}


