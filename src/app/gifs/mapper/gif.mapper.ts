import { Gif } from "../interfaces/gif.interfaces";
import { Datum } from '../interfaces/klipy.interfaces';

export class GifMapper {
  static mapDatumItemToGif(item: Datum): Gif {
    return {
      id: item.id,
      title: item.title,
      url: item.file.sm["gif"].url
    };
  }

  static mapKlipyItemstoGifArray(items: Datum[]): Gif[] {
    return items.map(this.mapDatumItemToGif);
  }
}
