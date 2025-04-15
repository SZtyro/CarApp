import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ProfileService } from '@sztyro/core';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService implements Resolve<any>{

  constructor(
    private profile: ProfileService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.profile.getProfile().pipe(
      map((e) => {
        if(e != null) this.router.navigate(['dashboard'])
      }),
      catchError(e => {
        // if(e.status === 401) retur
        return of(e)
      })
    )
    
  }
}
