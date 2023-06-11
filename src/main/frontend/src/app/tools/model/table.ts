import { ComponentType } from "@angular/cdk/portal";
import { Component } from "@angular/core";
import { TableComponent } from "../table/table.component";
import { TableOptions } from "./tableOptions";

export class Table<T>{
    componentType: ComponentType<TableComponent> = TableComponent;
    options:TableOptions<any>;

    constructor(options: TableOptions<T>){
        this.options = options;
    }
}