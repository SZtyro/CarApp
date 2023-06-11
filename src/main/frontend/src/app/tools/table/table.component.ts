import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableOptions } from '../model/tableOptions';
import { Column } from '../model/column';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columns: Column[];
  displayedColumns: string[];
  options: TableOptions<any>;

  constructor(@Inject('data') private data: TableOptions<any>) {
    this.options = data;
    this.columns = data.columns;
    this.displayedColumns = this.columns.map(e => e.header);
    this.fetchData();
  }

  fetchData(){
    this.options.tableData.subscribe( e => this.dataSource.data = e);  
  }

}
