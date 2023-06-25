import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableOptions } from '../model/tableOptions';
import { Column } from '../model/column';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columns: Column[];
  displayedColumns: string[];
  options: TableOptions<any>;

  constructor(
    @Inject('data') private data: TableOptions<any>,
    private router: Router) {
    this.options = data;
    this.columns = data.columns;
    this.displayedColumns = this.columns.map((e) => e.header);
    this.fetchData();
  }

  fetchData() {
    this.options.tableData.subscribe((e) => (this.dataSource.data = e));
  }

  getCellValue(column: Column, element: any) {
    try {
      return column.getValue(element);
    } catch (error) {
      return null;
    }
  }

  rowClick(row: any) {
    if(this.options.redirectTo)
      this.router.navigate([this.options.redirectTo(row)]);
  }
}
