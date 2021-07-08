import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector : 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService){}
  userAuth =false;
  private authListenerSub: Subscription;
  ngOnInit(){
    this.userAuth = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated =>{
      this.userAuth = isAuthenticated;
    });
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    this.authListenerSub.unsubscribe();
  }

}
