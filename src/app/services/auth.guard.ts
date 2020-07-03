import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService,
              private router: Router){}
  

  canActivate(): Observable<boolean>{
    return this.authService.isAuth().pipe(
      tap( estado => {
        if (!estado) { this.router.navigate(['/login']); }
      })
    );
  }
  // yo tengo que limpiar la subscripcion
  // take(1) --> cancelo la subscripcion inmediatamente, cuando se resuelve por 1ra vez
  canLoad(): Observable<boolean>{
    return this.authService.isAuth().pipe(
      tap( estado => {
        if (!estado) { this.router.navigate(['/login']); }
      }), take(1)
    );
  }
}
