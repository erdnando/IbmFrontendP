import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { ObtenerlistaService } from 'src/app/Service/listados/obtenerlista.service';
import { LoadService } from 'src/app/Service/load/load.service';
import { StorageService } from 'src/app/Service/storage-service/storage.service';

@Component({
  selector: 'app-pop-up-load-detail',
  templateUrl: './pop-up-load-detail.component.html',
  styleUrls: ['./pop-up-load-detail.component.css']
})
export class PopUpLoadDetailComponent {
  @ViewChild('arpSort') arpSort!: MatSort;
  @ViewChild('tseSort') tseSort!: MatSort;
  @ViewChild('steSort') steSort!: MatSort;
  @ViewChild('arpParametersPaginator') arpParametersPaginator!: MatPaginator;
  @ViewChild('tseParametersPaginator') tseParametersPaginator!: MatPaginator;
  @ViewChild('steParametersPaginator') steParametersPaginator!: MatPaginator;

  id: number | string = '';
  page: number = 0;
  pageSize: number = 5;
  loading: boolean = false;
  columnasAMostrar: string[] = ['fechA_REP', 'horaInicio', 'horaFin', 'employeeCode', 'estatusProceso'];
  loadArpDetailsDataSource = new MatTableDataSource<any>();
  loadTseDetailsDataSource = new MatTableDataSource<any>();
  loadSteDetailsDataSource = new MatTableDataSource<any>();
  
  constructor(
    public dialogRef: MatDialogRef<PopUpLoadDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private storageService: StorageService,
    private loadService: LoadService,
  ) {}

  ngOnInit() {
    this.id = this.dialogData.id;
    this.getParameters();

  }

  ngAfterViewInit() {
    this.loadArpDetailsDataSource.paginator = this.arpParametersPaginator;
    this.loadArpDetailsDataSource.sort = this.arpSort;
    this.loadTseDetailsDataSource.paginator = this.tseParametersPaginator;
    this.loadTseDetailsDataSource.sort = this.tseSort;
    this.loadSteDetailsDataSource.paginator = this.steParametersPaginator;
    this.loadSteDetailsDataSource.sort = this.steSort;
  }

  getParameters () {
    this.loading = true;
    forkJoin({
      arp: this.getArpParameters(),
      tse: this.getTseParameters(),
      ste: this.getSteParameters(),
    }).subscribe({
      next: data => {
        this.loading = false;
      }
    });
  }

  getArpParameters() {
    let params = {
      page: this.page + 1
    };
    let observable = this.loadService.GetArpParameters(this.id, params);
    observable.subscribe((resp: any) => {
      this.loadArpDetailsDataSource.data = resp.data;
      this.page += 1;
    });
    return observable;
  }

  getTseParameters() {
    let params = {
      page: this.page + 1
    };
    let observable = this.loadService.GetTseParameters(this.id, params);
    observable.subscribe((resp: any) => {
      this.loadTseDetailsDataSource.data = resp.data;
      this.page += 1;
    });
    return observable;
  }

  getSteParameters() {
    let params = {
      page: this.page + 1
    };
    let observable = this.loadService.GetSteParameters(this.id, params);
    observable.subscribe((resp: any) => {
      this.loadSteDetailsDataSource.data = resp.data;
      this.page += 1;
    });
    return observable;
  }

  onPaginatorPage(event: any) {
    this.pageSize = event.pageSize;
    if (this.arpParametersPaginator.pageSize != this.pageSize) {
      this.arpParametersPaginator._changePageSize(this.pageSize);
    }
    if (this.tseParametersPaginator.pageSize != this.pageSize) {
      this.tseParametersPaginator._changePageSize(this.pageSize);
    }
    if (this.steParametersPaginator.pageSize != this.pageSize) {
      this.steParametersPaginator._changePageSize(this.pageSize);
    }
  }

  sortArpData(sort: Sort) {
    this.loadArpDetailsDataSource.data = this.sortData(sort, this.loadArpDetailsDataSource.data);
  }

  sortTseData(sort: Sort) {
    this.loadTseDetailsDataSource.data = this.sortData(sort, this.loadTseDetailsDataSource.data);
  }

  sortSteData(sort: Sort) {
    this.loadSteDetailsDataSource.data = this.sortData(sort, this.loadSteDetailsDataSource.data);
  }

  sortData(sort: Sort, data: any[]): any[] {
    if (!sort.active || sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fechA_REP':
          return compare(a[sort.active].substring(0,10).split("/").reverse().join("-"), b[sort.active].substring(0,10).split("/").reverse().join("-"), isAsc);
        default:
          return compare(a[sort.active], b[sort.active], isAsc);
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
