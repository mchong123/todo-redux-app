import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {

  totalIngresos = 0;
  totalEgresos = 0;
  ingresos = 0;
  egresos = 0;

  public doughnutChartLabels: Label[] = ['Egresos', 'Ingresos'];
  public doughnutChartData: MultiDataSet = [[]];

  constructor(private store: Store<AppStateWithIngreso>) { }

  ngOnInit(): void {

    this.store.select('ingresosEgresos')
      .subscribe(({ items }) => this.generarEstadistica(items));
  }
  generarEstadistica(items: IngresoEgreso[]) {

    this.totalIngresos = 0;
    this.totalEgresos = 0;
    this.ingresos = 0;
    this.egresos = 0;

    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }
    this.doughnutChartData = [[this.totalEgresos, this.totalIngresos]];
  }
}
