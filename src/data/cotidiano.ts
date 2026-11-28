export interface ItemCotidiano {
  espanol: string;
  japones: string;
  lectura: string;
  romaji: string;
  irregular?: boolean;
}

export const numerosData: ItemCotidiano[] = [
  { espanol: '0', japones: '零 / ゼロ', lectura: 'れい / ゼロ', romaji: 'rei / zero' },
  { espanol: '1', japones: '一', lectura: 'いち', romaji: 'ichi' },
  { espanol: '2', japones: '二', lectura: 'に', romaji: 'ni' },
  { espanol: '3', japones: '三', lectura: 'さん', romaji: 'san' },
  { espanol: '4', japones: '四', lectura: 'よん / し', romaji: 'yon / shi', irregular: true },
  { espanol: '5', japones: '五', lectura: 'ご', romaji: 'go' },
  { espanol: '6', japones: '六', lectura: 'ろく', romaji: 'roku' },
  { espanol: '7', japones: '七', lectura: 'なな / しち', romaji: 'nana / shichi', irregular: true },
  { espanol: '8', japones: '八', lectura: 'はち', romaji: 'hachi' },
  { espanol: '9', japones: '九', lectura: 'きゅう / く', romaji: 'kyū / ku', irregular: true },
  { espanol: '10', japones: '十', lectura: 'じゅう', romaji: 'jū' },
  { espanol: '100', japones: '百', lectura: 'ひゃく', romaji: 'hyaku' },
  { espanol: '1.000', japones: '千', lectura: 'せん', romaji: 'sen' },
  { espanol: '10.000', japones: '一万', lectura: 'いちまん', romaji: 'ichiman' }
];

export const horasData: ItemCotidiano[] = [
  { espanol: '1:00', japones: '一時', lectura: 'いちじ', romaji: 'ichi-ji' },
  { espanol: '2:00', japones: '二時', lectura: 'にじ', romaji: 'ni-ji' },
  { espanol: '3:00', japones: '三時', lectura: 'さんじ', romaji: 'san-ji' },
  { espanol: '4:00', japones: '四時', lectura: 'よじ', romaji: 'yo-ji', irregular: true },
  { espanol: '5:00', japones: '五時', lectura: 'ごじ', romaji: 'go-ji' },
  { espanol: '6:00', japones: '六時', lectura: 'ろくじ', romaji: 'roku-ji' },
  { espanol: '7:00', japones: '七時', lectura: 'しちじ', romaji: 'shichi-ji', irregular: true },
  { espanol: '8:00', japones: '八時', lectura: 'はちじ', romaji: 'hachi-ji' },
  { espanol: '9:00', japones: '九時', lectura: 'くじ', romaji: 'ku-ji', irregular: true },
  { espanol: '10:00', japones: '十時', lectura: 'じゅうじ', romaji: 'jū-ji' },
  { espanol: '11:00', japones: '十一時', lectura: 'じゅういちじ', romaji: 'jūichi-ji' },
  { espanol: '12:00', japones: '十二時', lectura: 'じゅうにじ', romaji: 'jūni-ji' },
  { espanol: 'Y media (:30)', japones: '〜半', lectura: '〜はん', romaji: '~han' },
  { espanol: '5 minutos', japones: '五分', lectura: 'ごふん', romaji: 'go-fun' },
  { espanol: '10 minutos', japones: '十分', lectura: 'じゅっぷん', romaji: 'juppun', irregular: true }
];

export const diasSemanaData: ItemCotidiano[] = [
  { espanol: 'Lunes', japones: '月曜日', lectura: 'げつようび', romaji: 'getsuyōbi' },
  { espanol: 'Martes', japones: '火曜日', lectura: 'かようび', romaji: 'kayōbi' },
  { espanol: 'Miércoles', japones: '水曜日', lectura: 'すいようび', romaji: 'suiyōbi' },
  { espanol: 'Jueves', japones: '木曜日', lectura: 'もくようび', romaji: 'mokuyōbi' },
  { espanol: 'Viernes', japones: '金曜日', lectura: 'きんようび', romaji: 'kin’yōbi' },
  { espanol: 'Sábado', japones: '土曜日', lectura: 'どようび', romaji: 'doyōbi' },
  { espanol: 'Domingo', japones: '日曜日', lectura: 'にちようび', romaji: 'nichiyōbi' }
];

export const mesesData: ItemCotidiano[] = [
  { espanol: 'Enero', japones: '一月', lectura: 'いちがつ', romaji: 'ichigatsu' },
  { espanol: 'Febrero', japones: '二月', lectura: 'にがつ', romaji: 'nigatsu' },
  { espanol: 'Marzo', japones: '三月', lectura: 'さんがつ', romaji: 'sangatsu' },
  { espanol: 'Abril', japones: '四月', lectura: 'しがつ', romaji: 'shigatsu', irregular: true },
  { espanol: 'Mayo', japones: '五月', lectura: 'ごがつ', romaji: 'gogatsu' },
  { espanol: 'Junio', japones: '六月', lectura: 'ろくがつ', romaji: 'rokugatsu' },
  { espanol: 'Julio', japones: '七月', lectura: 'しちがつ', romaji: 'shichigatsu', irregular: true },
  { espanol: 'Agosto', japones: '八月', lectura: 'はちがつ', romaji: 'hachigatsu' },
  { espanol: 'Septiembre', japones: '九月', lectura: 'くがつ', romaji: 'kugatsu', irregular: true },
  { espanol: 'Octubre', japones: '十月', lectura: 'じゅうがつ', romaji: 'jūgatsu' },
  { espanol: 'Noviembre', japones: '十一月', lectura: 'じゅういちがつ', romaji: 'jūichigatsu' },
  { espanol: 'Diciembre', japones: '十二月', lectura: 'じゅうにがつ', romaji: 'jūnigatsu' }
];

export const diasMesIrregularesData: ItemCotidiano[] = [
  { espanol: 'Día 1', japones: '一日', lectura: 'ついたち', romaji: 'tsuitachi', irregular: true },
  { espanol: 'Día 2', japones: '二日', lectura: 'ふつか', romaji: 'futsuka', irregular: true },
  { espanol: 'Día 3', japones: '三日', lectura: 'みっか', romaji: 'mikka', irregular: true },
  { espanol: 'Día 4', japones: '四日', lectura: 'よっか', romaji: 'yokka', irregular: true },
  { espanol: 'Día 5', japones: '五日', lectura: 'いつか', romaji: 'itsuka', irregular: true },
  { espanol: 'Día 6', japones: '六日', lectura: 'むいか', romaji: 'muika', irregular: true },
  { espanol: 'Día 7', japones: '七日', lectura: 'なのか', romaji: 'nanoka', irregular: true },
  { espanol: 'Día 8', japones: '八日', lectura: 'ようか', romaji: 'yōka', irregular: true },
  { espanol: 'Día 9', japones: '九日', lectura: 'ここのか', romaji: 'kokonoka', irregular: true },
  { espanol: 'Día 10', japones: '十日', lectura: 'とおか', romaji: 'tōka', irregular: true },
  { espanol: 'Día 14', japones: '十四日', lectura: 'じゅうよっか', romaji: 'jūyokka', irregular: true },
  { espanol: 'Día 20', japones: '二十日', lectura: 'はつか', romaji: 'hatsuka', irregular: true },
  { espanol: 'Día 24', japones: '二十四日', lectura: 'にじゅうよっか', romaji: 'nijūyokka', irregular: true }
];
