import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  dataSource: MatTableDataSource<any> = new MatTableDataSource([{test: 'teeeest', value: 'test'}]);
  columns: Array<string> = ['test'];
  displayedColumns = ['test'];

  constructor(@Inject('data') private data: any) {
    console.log(data);
    this.dataSource = data;
  }

  getValueForColumn(column: any, element: any) {
    if(column.setValue)
      return column.setValue(element);
    else{
      //Default value
      return element['test'];
    }
    //Mozliwosc innych pol jak data i checbox
  }

  testfn() {
    return this.dataSource
  }

}
