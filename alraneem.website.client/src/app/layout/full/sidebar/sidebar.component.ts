import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Menu, MenuItems } from '../../../shared/menu-items/menu-items';
import { DemoMaterialModule } from '../../../demo-material-module';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { UserService } from 'src/app/Services/UserService';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    DemoMaterialModule,
    NgFor,
    NgIf,
    RouterModule,
    CommonModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: [],
})
export class AppSidebarComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  menuList: Menu[] = [];
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private userService: UserService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.userService.getUserRole().then((role) => {
      if (role != null) {
        this.menuList = this.menuItems.getMenuitemSync(role);
      }
    });
    this.userService.userRole$.subscribe((role) => {
      if (role != null) {
        this.menuList = this.menuItems.getMenuitemSync(role);
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
