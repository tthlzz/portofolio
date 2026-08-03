# Portofolio

Situs portofolio pribadi saya, dibangun dengan HTML, CSS, dan JavaScript murni tanpa framework atau build step.

**Live:** [ahsanul22.netlify.app](https://ahsanul22.netlify.app)

## Fitur

- Kartu fan interaktif di hero yang mengembang saat di-hover/tap
- Daftar proyek dikelompokkan per kategori (Engineering, Research, Software)
- Carousel showcase gambar untuk pekerjaan yang masih berjalan
- Starfield animasi halus di hero, dengan animasi reveal saat scroll di seluruh halaman
- Responsif penuh sampai layar mobile kecil

## Stack

- HTML5 / CSS3 (custom properties, tanpa framework)
- JavaScript murni (tanpa dependency)

## Menjalankan secara lokal

Tidak perlu build step, tinggal buka `index.html` di browser, atau jalankan folder ini dengan static file server apa saja:

```bash
python3 -m http.server 8000
```

## Struktur

```
index.html      # markup
style.css       # semua styling
script.js       # interaksi (kartu fan, carousel, scroll reveal, starfield, dll)
about-photo.jpg # foto profil
```
