import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Usuario } from '../models/usuario.models';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.action';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy{

  userSubscription: Subscription;
  ingresoSubs: Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {

    this.userSubscription = this.store.select('user')
      .pipe(
          filter(({user}) => user != null)
      )
      .subscribe( ({user}) => {

       this.ingresoSubs = this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
          .subscribe(ingresoEgresosList => {
            this.store.dispatch( ingresoEgresoActions.setItems({items: ingresoEgresosList }));
          });

      });
  }
  ngOnDestroy(): void {
    this.ingresoSubs.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
