import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

interface Star {
  id: number;
  size: number;
  top: string;
  left: string;
  opacity: number;
  duration: number;
  delay: number;
}


@Component({
  selector: 'app-search-page',
  imports: [],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export default class  SearchPageComponent implements OnInit{
  stars: Star[] = [];

  ngOnInit(): void {
    this.generateStarts(150);
  }

  generateStarts(count: number) {
    for (let i = 0; i < count; i++) {
      this.stars.push({
        id: i,
        size: Math.random() * 3 + 1, // entre 1px y 4px
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 1 + 0.2, // entre 0.2 y 1
        duration: Math.random() * 3 + 5, // entre 5s y 15s
        delay: Math.random() * 5 // retraso aleatorio
      });
    }
  }
 }
