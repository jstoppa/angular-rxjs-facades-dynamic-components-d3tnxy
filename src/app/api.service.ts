
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { produce } from 'immer';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { delay, map, filter } from 'rxjs/operators';

import { Data } from './models';

export enum AsyncState { IDLE, LOADING, ERROR, READY };
export interface AsyncItem { status: AsyncState; data : Partial<Data> };
export type DataCache = Record<string, AsyncItem>;


/**
 * Custom RxJS operator to extract AsyncItem by ID
 * 
 */
export const filterAsyncItem = (id: string) => {
  const selectItemById = (id:string) => (cache: DataCache): AsyncItem => cache[id];

  return (source: Observable<DataCache>) => {
    return source.pipe(
      map(selectItemById(id)),
      filter(it => !!it),
    )
  }
};


@Injectable({
  providedIn: 'root'
})
@Injectable()
export class ApiService {
  private cache: DataCache = {};
  private emitter = new BehaviorSubject<DataCache>(this.cache);
  
  // stream for ALL widget data
  public widgets$: Observable<DataCache> = this.emitter.asObservable();

  constructor(private http: HttpClient){}

  // ***************************************************************
  // public methods
  // ***************************************************************


  reloadAll(forceRefresh = false) {
    const keys = Object.keys(this.cache);       
    keys.map(id => this.loadItem(id, forceRefresh));
  }

  // method to featch data either from cache or via web service call
  // and push it into its respective Behaviour Subject
  loadItem(id: string, forceRefresh: boolean = false) {
    if ( forceRefresh || !this.isReady(id) ) {
      this.initializeEntry(id);
    }
    this.loadWidgetData(id);
  }

  // ***************************************************************
  // Private methods
  // ***************************************************************

  /**
   * Load widget data from server and update cached item...
   * (add a random delay to simulate latency)
   */
  private loadWidgetData(id: string) {
    const showLoading = () => this.updateItem(id, AsyncState.LOADING);
    const wait = Math.floor(Math.random() * 2000) + 1;
    const url = `https://jsonplaceholder.typicode.com/todos/${id}`;
    const request$ = this.http.get<Data>(url).pipe(delay(wait));

    showLoading();
    request$.subscribe((data: Data) => {
      this.updateItem(id, AsyncState.READY, data);
    });

  }

  /**
   * Update Cached Item
   */
  private updateItem(id:string, status = AsyncState.LOADING, data?: Partial<Data>) {    
    const store = produce(this.cache, (store) => {
      const entry = store[id] || makeAsyncItem(id)
            entry.status = status;
            entry.data = data || entry.data;
      store[id] = entry;
    });

    this.emitter.next(this.cache = store);
  }

  /**
   * Always make sure the registry has a cached instance of widget's asyncItme
   * (even when not yet loaded)
   */
  private initializeEntry(id:string) {
    const store = produce(this.cache, (store) => {
      store[id] = makeAsyncItem(id);
    });
    this.emitter.next(this.cache = store);
  }

  private isReady(id:string): boolean {
    const item = this.cache[id];
    return !!item && (item.status === AsyncState.READY);
  }

}

function makeAsyncItem(id:string): AsyncItem {
  return { status: AsyncState.IDLE, data: { id }};
}
