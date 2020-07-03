import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  userName = 'welcome';
  userSubscribe: Subscription;
  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }


  ngOnInit(): void {
   this.userSubscribe = this.store
     .select('user')
     .subscribe( ({user}) => {
       user != null ? this.userName = user.nombre : this.userName = 'welcome';
     });
  }

  ngOnDestroy(): void {
   this.userSubscribe.unsubscribe();
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
