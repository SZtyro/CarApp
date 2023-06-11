export class Column {
  header: string;
  path: string;

  getValue(element: any) {
    return element[this.path];
  }

  constructor(private options?: Partial<Column>){
    Object.assign(this, options);
  }

  static fromPath(path: string): Column {
    let instance: Column = new Column();
    instance.header = path[0].toUpperCase() + path.slice(1);
    instance.path = path;

    return instance;
  }
}
