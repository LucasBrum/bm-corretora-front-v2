import { Component, EventEmitter, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.scss']
})
export class ToolbarNavigationComponent {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

  constructor(private cookieService: CookieService, private router: Router) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  handleLogout(): void {
    console.log("callllllllll");
    this.cookieService.delete('USER_INFO');
    void this.router.navigate(['/home']);
  }
}
