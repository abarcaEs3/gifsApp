import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import type { KlipyResponse } from "../interfaces/klipy.interfaces";
import { environment } from "@environments/environment.development";
import { Gif } from '../interfaces/gif.interfaces';
import { GifMapper } from "../mapper/gif.mapper";

const GIF_KEY = 'Gifs';

const loadGifsFromLocalStorage = () => {
  const gifs = localStorage.getItem(GIF_KEY);
  return gifs ? JSON.parse(gifs) : {};
}

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private baseUrl = 'https://api.klipy.com/api/v1';

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);

  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>(loadGifsFromLocalStorage());

  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  saveGifsToLocalStorage = effect(() => {
    localStorage.setItem(GIF_KEY, JSON.stringify(this.searchHistory()))
  })

  constructor() {
    this.loadTrendingGifs();
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http
      .get<KlipyResponse>(`${this.baseUrl}/${environment.klipyAPIkey}/gifs/search?q=${query}&per_page=20`)
      .pipe(
        map(({data}) => GifMapper.mapKlipyItemstoGifArray(data.data)),

        //Historial
        tap((items) => {
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLowerCase()]: items,
          }));
        })
      );
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

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }

}
