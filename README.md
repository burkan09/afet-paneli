# Küresel Doğal Afet İzleme Paneli

Dünya genelindeki doğal afetleri üç ayrı bilimsel kaynaktan gerçek zamanlı
olarak toplayıp 3 boyutlu bir küre üzerinde gösteren web uygulaması.
Yirmi yıllık deprem kataloğunu işleyerek levha sınırlarını görünür kılar ve
farklı afet türlerini ortak bir etki ölçeğinde karşılaştırılabilir hale getirir.

<!-- Ekran görüntüsü: docs/ekran-goruntusu.png -->

---

## Ne yapar

**Canlı afet takibi.** USGS, NASA EONET ve GDACS kaynaklarından deprem,
orman yangını, şiddetli fırtına, volkanik aktivite, sel ve heyelan verilerini
çeker. Veri altmış saniyede bir kendini yeniler.

**Fay hatlarını veriden çıkarır.** Son yirmi yılda kaydedilmiş 153.000 deprem
noktası kürenin üzerine işlenir. Hiçbir fay haritası yüklenmeden Ateş Çemberi,
Orta Atlantik Sırtı ve Alp-Himalaya kuşağı kendiliğinden ortaya çıkar.
Kamera yaklaştıkça noktalar ayrışır, uzaklaştıkça birleşir.

**Farklı afetleri karşılaştırır.** M6.2 bir deprem mi daha ciddi, kırmızı
uyarılı bir sel mi? Uygulama bu soruya cevap verebilmek için tüm olayları
0–100 arası ortak bir etki skoruna çevirir. Küredeki renk, nokta boyutu ve
halka yarıçapı bu skoru temel alır.

**Enerjiyi anlaşılır kılar.** Deprem büyüklüğü logaritmik bir ölçektir; M6,
M5'ten iki değil yaklaşık otuz iki kat güçlüdür. Uygulama açığa çıkan enerjiyi
hesaplayıp TNT eşdeğerine çevirir, böylece aradaki fark sezilebilir hale gelir.

**Bağlam sunar.** Her olay için kaynak kaydına ve ilgili yayınlara bağlantı
verir. Sürüklenebilir cam paneller sayesinde arayüz kullanıcının istediği
düzene göre yerleştirilebilir.

---

## Veri kaynakları

| Kaynak | Kurum | Kapsam |
|---|---|---|
| [USGS Earthquake Catalog](https://earthquake.usgs.gov/fdsnws/event/1/) | ABD Jeoloji Araştırmaları Kurumu | Küresel deprem verisi, canlı ve arşiv |
| [NASA EONET v3](https://eonet.gsfc.nasa.gov/) | NASA Earth Observatory | Yangın, fırtına, volkan, sel, heyelan |
| [GDACS](https://www.gdacs.org/) | Avrupa Komisyonu / BM OCHA | Uyarı seviyeli afet bildirimleri |

Tüm kaynaklar kamuya açıktır ve API anahtarı gerektirmez. Dış kaynaklı
içerikler yalnızca başlık ve bağlantı olarak gösterilir; metin çoğaltılmaz.

---

## Teknolojiler

React · Vite · Tailwind CSS · react-globe.gl (three.js) · Recharts · h3-js

---

## Mimari kararlar

**Geçmiş veri çalışma anında çekilmez.** 2005 yılındaki depremler bugün
değişmeyeceği için bu veri bir kerelik bir betikle indirilir, gereksiz alanları
atılır, koordinatları yuvarlanır ve statik dosya olarak saklanır. Sonuç:
153.000 nokta yalnızca 2.8 MB yer kaplar ve uygulama açıldıktan sonra bu katman
için hiç ağ trafiği oluşmaz.

**Hesaplar bileşenlerin dışındadır.** Etki skoru, enerji dönüşümü, coğrafi
kümeleme ve filtreleme mantığı `src/lib/` altında React'ten bağımsız saf
fonksiyonlar olarak yazılmıştır. Bu ayrım hem test edilebilirlik sağlar hem de
arayüz değiştiğinde iş mantığının bozulmasını önler.

**Tek veri modeli.** Üç kaynağın üçü de farklı formatta veri döndürür. Her
kayıt çekildiği anda tek bir ortak şekle çevrilir; uygulamanın geri kalanı
kaynakların farklılıklarını hiç görmez.

**Kısmi başarısızlığa dayanıklılık.** Kaynaklar `Promise.allSettled` ile
paralel sorgulanır. Biri yanıt vermezse diğerleri çalışmaya devam eder ve
kullanıcıya hangi kaynağın ulaşılamadığı bildirilir.

**Performans için ödünler.** Küre üzerindeki altıgen katman tek bir birleşik
geometri olarak çizilir, geçmiş noktalar örneklenir ve kamera hareketi
kısıtlanmış sıklıkta işlenir. Bunlar olmadan yakınlaştırma sırasında kare hızı
kullanılamaz seviyeye düşmektedir.

---

## Proje yapısı

```
scripts/     Geçmiş veri indirme betiği (bir kerelik çalışır)
public/      Ön hesaplanmış sismiklik verisi
src/
  api/       Veri çekme — sadece ağ, işleme yok
  lib/       Saf fonksiyonlar: skor, enerji, kümeleme, filtreleme
  hooks/     Veri, otomatik yenileme, sürükleme
  context/   Filtre durumu (useReducer)
  components/
```

---

## Kurulum

```bash
git clone https://github.com/burkan09/afet-paneli.git
cd afet-paneli
npm install
npm run dev
```

Geçmiş sismiklik verisini yeniden üretmek için:

```bash
node scripts/bake-seismicity.js
```

---

## Sınırlılıklar

Heyelan kapsamı dardır; uluslararası kataloglara yalnızca uydudan tespit
edilebilen büyük olaylar girer, yerel ölçekli heyelanlar yer almaz.

Geçmiş sismiklik katmanı M4.5 ve üzeri depremleri içerir. Eşik kasıtlıdır:
sensör yoğunluğu ülkeden ülkeye çok değiştiği için daha düşük eşiklerde harita
gerçek sismik aktiviteyi değil sensör dağılımını yansıtmaktadır.

**Bu uygulama deprem tahmini yapmaz.** Depremlerin önceden tahmin edilmesi
bilimsel olarak mümkün değildir; USGS bunu açıkça belirtir. Uygulama yalnızca
gerçekleşmiş olayları gösterir ve geçmiş veride görülen örüntüleri sunar.

---

## Lisans ve atıf

Kaynak kod eğitim amaçlıdır. Veriler ilgili kurumların kendi kullanım
koşullarına tabidir: USGS verisi kamu malıdır, NASA EONET açık erişimlidir,
GDACS ve ReliefWeb içerikleri Creative Commons Atıf lisansı altındadır.