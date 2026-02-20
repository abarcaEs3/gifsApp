import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { map } from "rxjs";
import type { KlipyResponse } from "../interfaces/klipy.interfaces";
import { environment } from "@environments/environment.development";
import { Gif } from "../interfaces/gif.interfaces";
import { GifMapper } from "../mapper/gif.mapper";

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private baseUrl = 'https://api.klipy.com/api/v1';

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);

  trendingGifsLoading = signal(true);

  constructor() {
    this.loadTrendingGifs();
  }

  searchGifs(query: string) {
    return this.http
      .get<KlipyResponse>(`${this.baseUrl}/${environment.klipyAPIkey}/gifs/search?q=${query}&per_page=20`)
      .pipe(
        map(({data}) => GifMapper.mapKlipyItemstoGifArray(data.data))

        //TODO Historial
      );
      /*.subscribe((resp) => {
        const gifs = GifMapper.mapKlipyItemstoGifArray(resp.data.data);
        console.log( { Search: gifs });
      })*/
  }

  loadTrendingGifs() {
    this.http
      .get<KlipyResponse>(`${this.baseUrl}/${environment.klipyAPIkey}/gifs/trending?per_page=20`)
      .subscribe((resp) => {
        const gifs = GifMapper.mapKlipyItemstoGifArray(resp.data.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log({ gifs });
      })
  }
}
