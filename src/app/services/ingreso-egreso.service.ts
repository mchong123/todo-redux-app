import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { Usuario } from '../models/usuario.models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
              private authService: AuthService) {

  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    delete ingresoEgreso.uid;
    return this.firestore.doc(`${this.authService.user.uid}/ingresos-egresos`)
      .collection('items')
      .add({...ingresoEgreso});
  }

  initIngresosEgresosListener(uid: string){

    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges().
      pipe(
        map( snapshop => {
          // console.log(snapshop);
          // arreglo/payload/doc/id
          return snapshop.map( snapshopObj =>
            {
              const doc = snapshopObj.payload.doc;
              const {descripcion, monto, tipo}: any = doc.data();

              return {
                uid: doc.id,
                descripcion,
                monto,
                tipo
              };
            }
          );
        }));
  }

  borrarIngresoEgreso(uidItem: string){
    const uid = this.authService.user.uid;
    return this.firestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete();
  }
}
