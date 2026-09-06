===============================================================================
  KURESEL DOGAL AFET IZLEME PANELI - PROJE PLANI
  React + Three.js tabanli 3D kure uzerinde canli dogal afet takibi
===============================================================================

Belge tarihi : 6 Eylul 2026
Sure         : 4 hafta
Baslangic    : React deneyimi sifir


-------------------------------------------------------------------------------
1. PROJENIN TEK CUMLELIK TANIMI
-------------------------------------------------------------------------------

Dunya uzerinde meydana gelen dogal afetleri (deprem, sel, heyelan, yangin,
volkan, firtina) 3 boyutlu bir kure uzerinde canli olarak gosteren, gecmis
sismiklik verisiyle fay hatlarini ortaya cikaran ve her olay icin ilgili
haber kaynaklarina baglanti veren web uygulamasi.


-------------------------------------------------------------------------------
2. ONCELIK SISTEMI
-------------------------------------------------------------------------------

P0  ZORUNLU     Bu olmadan proje teslim edilemez.
P1  NOT YUKSELTEN Hocanin bakacagi teknik kalite gostergeleri.
P2  GOSTERI      Projeyi digerlerinden ayiran ozellikler.
P3  ARTARSA      Zaman kalirsa. Yetismezse hicbir sey kaybedilmez.

KURAL: Bir ust oncelikteki her sey bitmeden bir alt onceliğe gecilmez.
       P2 ozellikleri cazip gelecek, direnecegiz.


-------------------------------------------------------------------------------
3. TEKNOLOJI YIGINI (KESINLESMIS)
-------------------------------------------------------------------------------

Yapi araci     : Vite
Kutuphane      : React (JavaScript, TypeScript YOK)
3D kure        : react-globe.gl  (icinde three.js var)
Grafikler      : Recharts
Tasarim        : Tailwind CSS
Sayfa gecisi   : React Router
Testler        : Vitest + React Testing Library
Yayin          : Vercel
Surum kontrol  : Git + GitHub

KESINLIKLE YAPMAYACAKLARIMIZ (kapsam korumasi):
  - Backend sunucu / veritabani
  - Kullanici girisi, kayit, sifre
  - TypeScript
  - Redux / Zustand (Context + useReducer yeterli)
  - Kendi haber kazima (scraping) sistemimiz


-------------------------------------------------------------------------------
4. VERI KAYNAKLARI
-------------------------------------------------------------------------------

[A] USGS - Deprem (anahtar gerekmiyor)
    Canli akis:
      https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson
      https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
      https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
    Katalog sorgusu (gecmis veri icin):
      https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson
      Parametreler: starttime, endtime, minmagnitude, limit (tek sorguda max 20.000)

[B] NASA EONET v3 - Tum dogal olaylar (anahtar gerekmiyor)
      https://eonet.gsfc.nasa.gov/api/v3/events
      https://eonet.gsfc.nasa.gov/api/v3/categories
    Kategoriler: landslides, floods, wildfires, severeStorms, volcanoes,
                 earthquakes, drought, dustHaze, seaLakeIce, snow,
                 tempExtremes, waterColor, manmade
    NOT: Her olay kaydinda "sources" dizisi var, icinde haber/kaynak linkleri.

[C] GDACS - Uyari seviyeli afet listesi (anahtar gerekmiyor)
      geteventlist/SEARCH ucnoktasi, GeoJSON formatinda
    Olay tipleri: EQ (deprem), TC (tropikal siklon), FL (sel),
                  VO (volkan), WF (yangin), DR (kuraklik)
    Uyari seviyesi: yesil / turuncu / kirmizi
    NOT: "Ufaklari eleme" isini bu alan yapacak.

[D] ReliefWeb (BM OCHA) - Haber ve rapor katmani
      https://api.reliefweb.int/v1/disasters?appname=UYGULAMA-ADI
      https://api.reliefweb.int/v2/reports?appname=UYGULAMA-ADI
    Kota: gunde 1000 istek. Bizim icin fazlasiyla yeterli.
    appname parametresi zorunlu, kayit gerekmiyor.

HABER ESLESTIRME MANTIGI (onemli):
  Haberden konum cikarmayacagiz. Ters yonde calisiyoruz:
  Konum katalogdan (EONET/GDACS/USGS) gelir.
  Haber, o olayin ULKE + TARIH + AFET TIPI bilgisiyle ReliefWeb'e
  sorulup bulunur. Haber konumu bulmaz, konum haberi bulur.

TELIF NOTU: Haberlerden sadece baslik, kaynak adi, tarih ve link gosterilecek.
            Makale metni kopyalanmayacak.


-------------------------------------------------------------------------------
5. ORTAK VERI MODELI
-------------------------------------------------------------------------------

Dort farkli kaynaktan gelen her sey, cekildigi anda su tek sekle cevrilecek.
Uygulamanin geri kalani SADECE bu nesneyi taniyacak.

  {
    id            : string     kaynak_onekli benzersiz kimlik
    source        : string     "usgs" | "eonet" | "gdacs"
    type          : string     "earthquake" | "flood" | "landslide" |
                               "wildfire" | "volcano" | "storm" | "tsunami"
    title         : string     gosterilecek baslik
    lat           : number
    lon           : number
    time          : number     unix milisaniye
    magnitude     : number     varsa (deprem)
    depth         : number     varsa (deprem, km)
    alertLevel    : string     varsa "green" | "orange" | "red"
    impactScore   : number     0-100 arasi ortak siddet skoru (bizim hesabimiz)
    url           : string     resmi kaynak sayfasi
    links         : array      [{ title, source, date, url }] haberler
    isLive        : boolean    son 7 gun icinde mi
  }

ORTAK SIDDET SKORU:
  Farkli olcekleri (deprem buyuklugu, uyari seviyesi, yanan alan) 0-100
  arasi tek bir sayiya ceviren fonksiyon. Renk, nokta boyutu ve filtreleme
  hep bunu kullanacak. lib/impact.js icinde saf fonksiyon olarak yazilacak
  ve testi yazilacak.

ENERJI HESABI (deprem icin):
  log10(E) = 1.5 * M + 4.8     ->  E joule cinsinden
  M6, M5'ten yaklasik 32 kat guclu. Bu hesap istatistik panelinde
  "bugun aciga cikan toplam enerji" olarak gosterilecek.


-------------------------------------------------------------------------------
6. KLASOR YAPISI
-------------------------------------------------------------------------------

  proje/
  |
  +-- scripts/
  |     bake-seismicity.js      Bir kerelik gecmis veri indirme betigi
  |
  +-- public/
  |     seismicity.json         On-hesaplanmis gecmis deprem noktalari
  |     plates.geojson          Tektonik levha sinirlari (P2)
  |
  +-- src/
  |   +-- api/
  |   |     usgs.js             Sadece veri cekme, isleme yok
  |   |     eonet.js
  |   |     gdacs.js
  |   |     reliefweb.js
  |   |
  |   +-- lib/                  React'ten bagimsiz SAF fonksiyonlar
  |   |     normalize.js        Her kaynagi ortak modele cevirir
  |   |     impact.js           Ortak siddet skoru
  |   |     energy.js           Enerji hesabi
  |   |     distance.js         Haversine mesafe
  |   |     cluster.js          Yukseklik -> H3 cozunurlugu
  |   |     correlate.js        Zincirleme olay tespiti (P2)
  |   |     format.js           Tarih/sayi bicimleme
  |   |
  |   +-- hooks/
  |   |     useEarthquakes.js
  |   |     useAutoRefresh.js
  |   |     useLocalStorage.js
  |   |
  |   +-- context/
  |   |     FilterContext.jsx   useReducer ile filtre durumu
  |   |
  |   +-- components/
  |   |     Globe/
  |   |     Charts/
  |   |     Filters/
  |   |     DetailPanel/
  |   |     ui/
  |   |
  |   +-- pages/
  |         Dashboard.jsx
  |         EventDetail.jsx
  |         About.jsx
  |
  +-- tests/

lib/ klasoru en onemli tasarim karari. Hesaplar komponentlerin icine
girmeyecek. Testler burada yazilacak.


===============================================================================
  ASAMALAR
===============================================================================


-------------------------------------------------------------------------------
FAZ 0 - KURULUM VE DOGRULAMA           [P0]   Sure: 2-3 gun
-------------------------------------------------------------------------------

Bu fazin amaci kod yazmak degil, PROJENIN MUMKUN OLDUGUNU KANITLAMAK.

  0.1  Node.js kurulumu
  0.2  Vite + React projesi olusturma, calistirma
  0.3  Git deposu acma, GitHub'a baglama, ilk commit
  0.4  Tailwind kurulumu
  0.5  *** CORS TESTI *** Dort API'nin de tarayicidan cagrilabildigini
       dogrula. Bos bir sayfada fetch at, konsolda sonucu gor.
       Engel cikarsa: Vercel serverless proxy yazilacak (10 satir).
       BU TEST ILK GUN YAPILACAK. Ucuncu haftada kesfedilirse felaket.
  0.6  Vercel'e bos projeyi deploy et. Yayin hatti calissin.

BITTI KRITERI:
  Bos bir React sayfasi Vercel'de yayinda ve dort API'den de
  tarayici konsolunda veri gelebildigi kanitlanmis.


-------------------------------------------------------------------------------
FAZ 1 - REACT TEMELLERI + STATIK ISKELET   [P0]   Sure: 4-5 gun
-------------------------------------------------------------------------------

Ogrenilecek konular sirasiyla:
  JSX -> komponent -> props -> useState -> liste render (map) ->
  event handler -> kosullu render -> useEffect

  1.1  Sahte (mock) veriyle 10 elemanli deprem dizisi olustur
  1.2  Deprem karti komponenti (EventCard)
  1.3  Liste komponenti (EventList)
  1.4  Filtre paneli - sadece arayuz, henuz calismiyor
  1.5  Istatistik kartlari - sabit sayilarla
  1.6  Sayfa duzeni (layout) ve Tailwind ile gorunum

BITTI KRITERI:
  Sahte veriyle calisan, duzgun gorunen statik bir arayuz.
  Henuz internete cikmiyor.


-------------------------------------------------------------------------------
FAZ 2 - CANLI VERI                      [P0]   Sure: 3-4 gun
-------------------------------------------------------------------------------

  2.1  api/usgs.js - veri cekme fonksiyonu
  2.2  lib/normalize.js - GeoJSON'u ortak modele cevir
       (USGS koordinatlari [boylam, enlem, derinlik] sirasinda geliyor,
        zaman milisaniye damgasi - dikkat)
  2.3  hooks/useEarthquakes.js - veri + yukleniyor + hata durumu
  2.4  Yukleniyor iskeleti (skeleton)
  2.5  Hata ekrani + "tekrar dene" butonu
  2.6  Bos sonuc ekrani
  2.7  hooks/useAutoRefresh.js - 60 saniyede bir yenileme
       DIKKAT: useEffect temizleme fonksiyonu yazilacak,
       yoksa komponent kapaninca istek atmaya devam eder.
  2.8  "Son guncelleme: HH:MM" gostergesi
  2.9  Filtrelerin gercekten calismasi (zaman araligi, min buyukluk)
  2.10 FilterContext + useReducer'a gecis
  2.11 Filtreleme icin useMemo

BITTI KRITERI:
  Gercek veri geliyor, filtreler calisiyor, uc durum (yukleniyor /
  hata / bos) ayri ayri ele alinmis, veri kendini yeniliyor.


-------------------------------------------------------------------------------
FAZ 3 - 3D KURE                         [P0]   Sure: 3-4 gun
-------------------------------------------------------------------------------

  3.1  react-globe.gl kurulumu, temel kure, dondurme/yakinlastirma
  3.2  Nokta katmani (pointsData) - canli depremler
  3.3  Buyuklukle orantili nokta boyutu ve rengi
  3.4  Halka katmani (ringsData) - siddete gore genisleyip solan daireler
  3.5  Noktaya tiklayinca detay paneli acilmasi
  3.6  Kure ile filtrelerin senkron calismasi
  3.7  Uydu dokusu, gece isiklari, atmosfer efekti

>>> KILOMETRE TASI 1 <<<   (2. haftanin sonu - PAZARLIK YOK)
    Bu noktada elde: gercek veriyle calisan, kure uzerinde depremleri
    gosteren, filtrelenebilen, Vercel'de yayinda olan bir uygulama.
    TESLIM EDILEBILIR DURUMDA.
    Buradan sonrasi ekleme. Yetismeyen olursa proje yine de tamamdir.


-------------------------------------------------------------------------------
FAZ 4 - GECMIS SISMIKLIK VE FAY HATLARI   [P1]   Sure: 3-4 gun
-------------------------------------------------------------------------------

  4.1  scripts/bake-seismicity.js yaz
       - USGS katalogundan yil yil veri cek (20.000 sinirini as)
       - Baslangic esigi: M4.5+, son 20 yil (~35.000 nokta)
       - Sadece [lat, lon, mag] tut, 2 ondaliga yuvarla
       - public/seismicity.json olarak kaydet
       NEDEN: Gecmis veri degismiyor. Her acilista cekmek anlamsiz.
              Bu karar sunumda anlatilacak.
  4.2  Statik dosyayi yukle, siyah/koyu gri kucuk noktalar olarak ciz
  4.3  H3 hexbin katmani (hexBinPointsData)
  4.4  lib/cluster.js - kamera yuksekligi -> H3 cozunurlugu
         alt > 2.0  -> res 1
         alt > 1.2  -> res 2
         alt > 0.6  -> res 3
         alt > 0.3  -> res 4
         digeri     -> res 5
  4.5  onZoom baglantisi + throttle
       DIKKAT: onZoom saniyede onlarca kez tetiklenir, throttle sart.
  4.6  Agirlik secimi: deprem sayisi mi, toplam enerji mi (gecis dugmesi)
  4.7  "En aktif 10 bolge" paneli - hexbin zaten sayiyi veriyor
  4.8  Tikla -> kure oraya ucsun
  4.9  Gecmis katmani ac/kapat dugmesi

BITTI KRITERI:
  Kure uzerinde fay hatlari sonuk noktalarla gorunuyor, uzerinde
  canli olaylar parliyor. Yakinlastirinca noktalar ayrisiyor.


-------------------------------------------------------------------------------
FAZ 5 - GRAFIKLER VE ISTATISTIKLER        [P1]   Sure: 2-3 gun
-------------------------------------------------------------------------------

  5.1  Zaman cizgisi grafigi (gune gore olay sayisi)
  5.2  Buyukluk dagilimi (bar)
  5.3  Derinlik - buyukluk iliskisi (scatter)
  5.4  lib/energy.js + toplam enerji istatistigi
  5.5  Ozet kartlar: toplam olay, en buyuk olay, ortalama derinlik
  5.6  Grafiklerin filtrelerle senkron calismasi


-------------------------------------------------------------------------------
FAZ 6 - COKLU AFET KAYNAKLARI             [P2]   Sure: 3-4 gun
-------------------------------------------------------------------------------

  6.1  api/eonet.js + normalize
  6.2  api/gdacs.js + normalize
  6.3  lib/impact.js - ortak siddet skoru + testi
  6.4  Afet tipine gore ikon ve renk sistemi
  6.5  Tip filtresi (deprem / sel / heyelan / yangin / volkan / firtina)
  6.6  Uyari seviyesi filtresi (turuncu ve ustu gibi)
  6.7  Gosterge (legend) paneli


-------------------------------------------------------------------------------
FAZ 7 - HABER KATMANI                     [P2]   Sure: 2-3 gun
-------------------------------------------------------------------------------

  7.1  api/reliefweb.js
  7.2  Olay -> haber eslestirme (ulke + tarih + tip)
  7.3  Detay panelinde haber listesi (baslik + kaynak + tarih + link)
  7.4  Haber bulunamadi durumu
  7.5  EONET "sources" alanindaki linklerin de gosterilmesi
  7.6  EventDetail sayfasi + React Router


-------------------------------------------------------------------------------
FAZ 8 - CILA VE TESLIM HAZIRLIGI          [P1]   Sure: 3-4 gun
-------------------------------------------------------------------------------

Bu faz P1'dir ve ATLANAMAZ. Notu yukselten kisim burasi.

  8.1  Vitest kurulumu
  8.2  lib/ altindaki saf fonksiyonlar icin testler
       (normalize, impact, energy, distance, cluster)
  8.3  Error Boundary
  8.4  Filtrelerin URL'e yansimasi (paylasilabilir link)
  8.5  Mobil uyum (responsive)
  8.6  Karanlik / aydinlik tema
  8.7  Klavye erisilebilirligi, aria etiketleri
  8.8  Son gecerli veri onbellegi (API cokunce bos ekran olmasin)
  8.9  README: ne yapiyor, nasil calisiyor, mimari, ekran goruntuleri,
       veri kaynaklari ve lisanslari, kurulum adimlari
  8.10 Son deploy
  8.11 Sunum hazirligi

>>> KILOMETRE TASI 2 <<<   (4. haftanin sonu - TESLIM)


-------------------------------------------------------------------------------
FAZ 9 - ARTARSA                           [P3]
-------------------------------------------------------------------------------

  9.1  Tektonik levha sinirlari katmani (plates.geojson) - olcum ile
       resmi sinirlarin ortusmesini gosterir. Cok etkileyici, kolay.
  9.2  Zincirleme olay tespiti (lib/correlate.js)
       Deprem sonrasi 6 saat / 500 km icinde tsunami veya heyelan
       varsa bagli olay isaretle, kurede aralarina yay ciz.
  9.3  Zaman tuneli - son 48 saati kurede oynatan kaydirici
  9.4  "Bana en yakin" - konum izni + Haversine mesafe
  9.5  Izleme listesi + tarayici bildirimi
  9.6  Turkce / Ingilizce dil secimi


===============================================================================
  HAFTALIK TAKVIM
===============================================================================

  HAFTA 1   Faz 0 + Faz 1        Kurulum, React temelleri, statik iskelet
  HAFTA 2   Faz 2 + Faz 3        Canli veri + kure   -> KILOMETRE TASI 1
  HAFTA 3   Faz 4 + Faz 5        Fay hatlari + grafikler
  HAFTA 4   Faz 6 + 7 + 8        Coklu kaynak, haber, cila -> TESLIM

  Faz 9 ancak Faz 8 bittiyse acilir.


===============================================================================
  RISKLER VE ONLEMLER
===============================================================================

RISK 1  CORS engeli
        ONLEM: Faz 0.5'te ilk gun test edilecek.
        COZUM: Vercel serverless proxy.

RISK 2  Kure performansi (cok fazla nokta)
        ONLEM: Gecmis veri on-hesaplanmis ve yuvarlanmis.
        COZUM: hexBinMerge kullan (etkilesimi kapatir, dikkat),
               veya esigi M4.5'e cek.

RISK 3  onZoom asiri tetiklenmesi -> takilma
        ONLEM: throttle sart.

RISK 4  useEffect temizligi unutulmasi -> bellek sizintisi
        ONLEM: her interval/listener icin return temizleyici.

RISK 5  Kapsam sismesi
        ONLEM: Kilometre Tasi 1 pazarliga kapali.
               P2 ozellikleri P1 bitmeden acilmayacak.

RISK 6  Zaman yetmemesi
        ONLEM: Faz 3 sonunda zaten teslim edilebilir bir urun var.


===============================================================================
  CALISMA DISIPLINI
===============================================================================

  - Her gun en az bir commit. Anlamli mesajlarla.
    ("gunluk calisma" degil, "kure nokta katmani eklendi")
  - Her faz sonunda deploy. Yayindaki surum hep calisir durumda kalsin.
  - Anlamadigin bir kod satirini projeye koyma. Sunumda sorulur.
  - Hesap komponent icine yazilmaz, lib/ altina yazilir.
  - Yeni ozellik eklemeden once bir onceki faz "bitti kriteri"ni
    gecmis olmali.


===============================================================================
  HOCAYA SORULACAKLAR
===============================================================================

  1. Konu serbest mi, listeden mi secilmeli?
  2. Ozgunluk beklentisi var mi? (Benzer projeler internette mevcut)
  3. Sunum / kod savunmasi olacak mi?
  4. Grup calismasi mi, bireysel mi?
  5. Teslim formati: GitHub linki mi, canli link mi, dosya mi?

  Bu sorular ILK HAFTA sorulacak. Dorduncu haftada surpriz olmasin.


===============================================================================
  SONRAKI ADIM
===============================================================================

  FAZ 0.1 - Node.js kurulumu.
  Isletim sistemi belirtildikten sonra adim adim ilerlenecek.

===============================================================================