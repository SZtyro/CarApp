import { Component, Injector, OnInit } from '@angular/core';
import { BaseService } from '../model/baseService';
import { Column } from '../model/column';
import { Table } from '../model/table';

@Component({
  selector: 'app-base-search',
  templateUrl: './base-search.component.html',
  styleUrls: ['./base-search.component.scss'],
})
export class BaseSearchComponent<T> implements OnInit {
  tableField;
  service: BaseService<T>;
  columns: Column[] = null;

  constructor(protected injector: Injector) {}

  ngOnInit(): void {
    if (this.columns != null) {
      this.tableField = new Table<any>({
        columns: this.columns,
        tableData: this.service.getAll(),
      });
    }
  }
}
