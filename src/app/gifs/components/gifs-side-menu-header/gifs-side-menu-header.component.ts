import { Component } from '@angular/core';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-gifs-side-menu-header',
  imports: [],
  templateUrl: './gifs-side-menu-header.component.html',
})
export class GifsSideMenuHeaderComponent {

  env = environment;

}
