import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { GifsService } from '../../services/gifs.service';

interface MenuOption {
  icon: string,
  label: string,
  route: string,
  subLabel: string;
}

@Component({
  selector: 'app-gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './gifs-side-menu-options.component.html',
})
export class GifsSideMenuOptionsComponent {

  gifsService = inject(GifsService);

  menuOptions : MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Tendencia',
      subLabel: 'Gifs Populares',
      route: '/dashboard/trending'
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Buscar',
      subLabel: 'Explorar gifs',
      route: '/dashboard/search'
    }
  ]
 }
