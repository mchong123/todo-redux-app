import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresoSubs: Subscription;
  ingresoEgreso: IngresoEgreso[] = [];
  constructor(private store: Store<AppStateWithIngreso>,
              private ingresoEgresoService: IngresoEgresoService) { }


  ngOnInit(): void {
    this.ingresoSubs = this.store.select('ingresosEgresos').subscribe(({ items }) => this.ingresoEgreso = items);
  }
  ngOnDestroy(): void {
    this.ingresoSubs.unsubscribe();
  }
  borrar(uid: any) {
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
      .then( () => Swal.fire('Borrado', 'Item eliminado', 'success'))
      .catch(ex => Swal.fire('Error', ex.message, 'error'));

  }
}
