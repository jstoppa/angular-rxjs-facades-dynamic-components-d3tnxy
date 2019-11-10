
export declare type DataCache = Record<string, Data>;


export interface Data {
  id: string;
  title: string;
}

export interface InfoComponent {
  info: Partial<Data>;
}


export interface WidgetConfig {
  apiId: string,
  widgetName: string
}
