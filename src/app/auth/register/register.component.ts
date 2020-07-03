import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  cargando = false;
  registroForm: FormGroup;
  uiSuscription: Subscription;
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }


  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],

    });
    this.uiSuscription = this.store.select('ui').subscribe( uis => this.cargando = uis.isLoading);
  }
  ngOnDestroy(): void {
      this.uiSuscription.unsubscribe();
  }
  crearUsuario() {

    if (this.registroForm.invalid) { return; }

    // Swal
    this.store.dispatch( ui.isLoading());

    const { nombre, correo, password } = this.registroForm.value;

    this.authService.crearUsuario(nombre, correo, password)
      .then(credenciales => {
        // console.log(credenciales);
        this.router.navigate(['/']);
      })
      .catch(error => {
        this.store.dispatch( ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        });
      }
      );
  }
}
