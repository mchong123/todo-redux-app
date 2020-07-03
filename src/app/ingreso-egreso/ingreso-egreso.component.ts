import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  cualquiera: any;
  uiSuscription: Subscription;
  cargando = false;
  ingresoForm: FormGroup;
  tipo = 'ingreso';
  constructor(private fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });
    // tslint:disable-next-line: no-shadowed-variable
    this.uiSuscription = this.store.select('ui').subscribe(({ isLoading }) => this.cargando = isLoading);
  }
  ngOnDestroy(){
    this.uiSuscription.unsubscribe();
  }
  guardar(){

    if (this.ingresoForm.invalid){ return; }

    this.store.dispatch( ui.isLoading());

    const {descripcion, monto} = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.cualquiera = ingresoEgreso;

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.store.dispatch( ui.stopLoading());
        this.ingresoForm.reset();
        Swal.fire('Success', descripcion, 'success');
      })
      .catch( ex => {
        Swal.fire('Error', ex.message, 'error');
        this.store.dispatch( ui.stopLoading());
      });
  }
}
