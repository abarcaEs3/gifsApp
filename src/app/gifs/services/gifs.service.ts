import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { finalize, map, Observable, tap } from 'rxjs';
import type { KlipyResponse } from '../interfaces/klipy.interfaces';
import { environment } from '@environments/environment.development';
import { Gif } from '../interfaces/gif.interfaces';
import { GifMapper } from '../mapper/gif.mapper';
import TrendingPage from '../pages/trending-page/trending-page.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const GIF_KEY = 'Gifs';

const loadGifsFromLocalStorage = () => {
  const gifs = localStorage.getItem(GIF_KEY);
  return gifs ? JSON.parse(gifs) : {};
};

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private baseUrl = 'https://api.klipy.com/api/v1';

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);

  isLoading = signal(false);

  private TrendingPage = signal(1);

  //[[gif1, gif2, gif3, gif4, gif5], [gif5, gif6, gif7, gif8, gif9]]
  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];

    for (let i = 0; i < this.trendingGifs().length; i += 5) {
      groups.push(this.trendingGifs().slice(i, i + 5));
    }

    return groups;
  })

  searchHistory = signal<Record<string, Gif[]>>(loadGifsFromLocalStorage());

  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  saveGifsToLocalStorage = effect(() => {
    localStorage.setItem(GIF_KEY, JSON.stringify(this.searchHistory()));
  });

  constructor() {
    this.loadTrendingGifs();
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http
      .get<KlipyResponse>(
        `${this.baseUrl}/${environment.klipyAPIkey}/gifs/search?q=${query}&per_page=40`,
      )
      .pipe(
        map(({ data }) => GifMapper.mapKlipyItemstoGifArray(data.data)),

        //Historial
        tap((items) => {
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLowerCase()]: items,
          }));
        }),
      );
  }

  loadTrendingGifs() {

    if (this.isLoading()) return;

    this.isLoading.set(true);

    this.http
      .get<KlipyResponse>(`${this.baseUrl}/${environment.klipyAPIkey}/gifs/trending?page=${this.TrendingPage()}&per_page=40`)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((resp) => {
        const gifs = GifMapper.mapKlipyItemstoGifArray(resp.data.data);
        this.trendingGifs.update(currentGifs => [
          ...currentGifs,
          ...gifs
        ]);

        this.TrendingPage.update(page => page + 1);
        this.isLoading.set(false);
      });
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
