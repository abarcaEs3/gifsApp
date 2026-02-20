import { Component, inject, OnInit, signal } from '@angular/core';
import { GifsListComponent } from '../../components/gifs-list/gifs-list.component';
import { GifsService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interfaces';

@Component({
  selector: 'app-search-page',
  imports: [GifsListComponent],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export default class SearchPageComponent {
  gifsService = inject(GifsService);

  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    this.gifsService.searchGifs(query).subscribe((resp) => {
      this.gifs.set(resp);  
    });
  }
}
