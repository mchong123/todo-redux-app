import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.models';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.action';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscript: Subscription;
  // tslint:disable-next-line: variable-name
  private _userFirebase: Usuario;
   get user(){
    return this._userFirebase;
  }
  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe(userFirebase => {
      if (userFirebase != null) {
        this.userSubscript = this.firestore.doc<Usuario>(`${userFirebase.uid}/usuario`)
         .valueChanges()
         .subscribe(user => {

           this._userFirebase = {...user};
           this.store.dispatch(authActions.setUser({user: {...user}}));
         });
      } else {
        this._userFirebase = null;
        if (this.userSubscript != null){
            this.userSubscript.unsubscribe();
        }

        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(ingresoEgresoActions.unSetItems());
      }
    });
  }
  crearUsuario(nombre: string, email: string, password: string) {

    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(userFb => {
        const newUser = new Usuario(userFb.user.uid, nombre, email);
        return this.firestore.doc(`${userFb.user.uid}/usuario`)
          .set({ ...newUser });

      });
  }

  signInCredentials(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  // authState retorna un observable por eso puedo aplicarle el pipe
  isAuth() {
    return this.auth.authState.pipe(
      map(userFire => userFire != null)
    );
  }
}
