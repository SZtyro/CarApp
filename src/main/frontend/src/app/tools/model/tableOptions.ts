import { Observable } from "rxjs";
import { Column } from "./column";

export class TableOptions<T>{
    columns: Column[];
    tableData?: Observable<T[]>;
    redirectTo?(row: any): string;
}