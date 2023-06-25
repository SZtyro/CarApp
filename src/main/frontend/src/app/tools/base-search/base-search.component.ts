import { Component, Injector, OnInit } from '@angular/core';
import { BaseService } from '../model/baseService';
import { Table } from '../model/table';
import { TableOptions } from '../model/tableOptions';

@Component({
  selector: 'app-base-search',
  templateUrl: './base-search.component.html',
  styleUrls: ['./base-search.component.scss'],
})
export class BaseSearchComponent<T> implements OnInit {
  tableField;
  service: BaseService<T>;
  tableOptions: TableOptions<T> = null;

  constructor(protected injector: Injector) {}

  ngOnInit(): void {
    if (this.tableOptions != null) {
      this.tableField = new Table<any>({
        ...{tableData: this.service.getAll()},
        ...this.tableOptions
      });
    }
  }
}
