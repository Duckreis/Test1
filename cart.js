// Sepete ürün ekleme fonksiyonu
function sepeteEkle(urunId, baslik, fiyat, kapakFoto) {
    let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
    const mevcutUrunIndex = sepet.findIndex(item => item.id === urunId);

    if (mevcutUrunIndex > -1) {
        sepet[mevcutUrunIndex].adet++;
    } else {
        sepet.push({ id: urunId, baslik: baslik, fiyat: parseFloat(fiyat), kapakFoto: kapakFoto, adet: 1 });
    }
    localStorage.setItem('sepet', JSON.stringify(sepet));
    guncelSepetSayisiniGoster();
    alert(`${baslik} sepete eklendi!`);
}

// Sepetten ürün silme fonksiyonu
function sepettenSil(urunId) {
    let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
    sepet = sepet.filter(item => item.id !== urunId);
    localStorage.setItem('sepet', JSON.stringify(sepet));
    guncelSepetSayisiniGoster();
    if (window.location.pathname.includes('sepet.html')) {
        sepetiGoster();
    }
}

// Sepetteki ürün adetini artırma fonksiyonu
function adetArtir(id) {
    let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
    const urun = sepet.find(item => item.id === id);
    if (urun) {
        urun.adet++;
    }
    localStorage.setItem('sepet', JSON.stringify(sepet));
    guncelSepetSayisiniGoster();
    if (window.location.pathname.includes('sepet.html')) {
        sepetiGoster();
    }
}

// Sepetteki ürün adetini azaltma fonksiyonu
function adetAzalt(id) {
    let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
    const urun = sepet.find(item => item.id === id);
    if (urun && urun.adet > 1) {
        urun.adet--;
    }
    localStorage.setItem('sepet', JSON.stringify(sepet));
    guncelSepetSayisiniGoster();
    if (window.location.pathname.includes('sepet.html')) {
        sepetiGoster();
    }
}

// Sepet sayfasını güncelleyen fonksiyon
function sepetiGoster() {
    const sepetListesi = document.getElementById('sepet-urunleri');
    const araToplamFiyatSpan = document.getElementById('ara-toplam-fiyat');
    const sepetToplamFiyatSpan = document.getElementById('sepet-toplam-fiyat');

    if (!sepetListesi || !araToplamFiyatSpan || !sepetToplamFiyatSpan) return;

    sepetListesi.innerHTML = '';
    let sepet = JSON.parse(localStorage.getItem('sepet')) || [];

    if (sepet.length === 0) {
        sepetListesi.innerHTML = `<li class="sepet-urunu">Sepetinizde ürün bulunmamaktadır.</li>`;
        araToplamFiyatSpan.textContent = '0.00₺';
        sepetToplamFiyatSpan.textContent = '0.00₺';
        return;
    }

    let toplamFiyat = 0;
    sepet.forEach(item => {
        toplamFiyat += item.fiyat * item.adet;

        const li = document.createElement('li');
        li.className = 'sepet-urunu';
        li.innerHTML = `
            <img src="${item.kapakFoto}" alt="${item.baslik}" class="sepet-urunu-img">
            <div class="sepet-urunu-bilgi">
                <span class="sepet-urunu-baslik">${item.baslik}</span>
                <span class="sepet-urunu-fiyat">${(item.fiyat * item.adet).toFixed(2)}₺</span>
            </div>
            <div class="sepet-adet-islemleri">
                <button onclick="adetAzalt(${item.id})">-</button>
                <input type="number" value="${item.adet}" class="sepet-adet-input" onchange="adetDegistir(${item.id}, this.value)">
                <button onclick="adetArtir(${item.id})">+</button>
            </div>
            <span class="sepet-urunu-sil" onclick="sepettenSil(${item.id})">❌</span>
        `;
        sepetListesi.appendChild(li);
    });

    araToplamFiyatSpan.textContent = toplamFiyat.toFixed(2) + '₺';
    sepetToplamFiyatSpan.textContent = toplamFiyat.toFixed(2) + '₺';
}

// Sepetteki ürün sayısını gösteren fonksiyon
function guncelSepetSayisiniGoster() {
    const sepet = JSON.parse(localStorage.getItem('sepet')) || [];
    const sepetSayaci = document.getElementById('sepet-sayaci');
    if (sepetSayaci) {
        const toplamAdet = sepet.reduce((sum, item) => sum + item.adet, 0);
        sepetSayaci.textContent = `(${toplamAdet})`;
    }
}

// Sayfa yüklendiğinde sepet sayacını ve sepet içeriğini güncelle
document.addEventListener('DOMContentLoaded', () => {
    guncelSepetSayisiniGoster();
    if (window.location.pathname.includes('sepet.html')) {
        sepetiGoster();
    }
});

// WhatsApp siparişi oluşturma fonksiyonu
const whatsappSiparisVer = () => {
    const sepet = JSON.parse(localStorage.getItem('sepet')) || [];
    if (sepet.length === 0) {
        alert("Sepetiniz boş. Lütfen önce ürün ekleyin.");
        return;
    }

    let mesaj = "Merhaba, sepetimdeki ürünleri sipariş vermek istiyorum:\n\n";
    let toplamFiyat = 0;

    sepet.forEach(item => {
        mesaj += `- ${item.baslik} (Adet: ${item.adet}, Fiyat: ${(item.fiyat * item.adet).toFixed(2)}₺)\n`;
        toplamFiyat += item.fiyat * item.adet;
    });

    mesaj += `\nToplam Fiyat: ${toplamFiyat.toFixed(2)}₺\n\n`;
    mesaj += "Lütfen siparişimin teslimatı için aşağıdaki bilgileri doldurunuz:\n";
    mesaj += "Adınız Soyadınız: \n";
    mesaj += "Telefon Numaranız: \n";
    mesaj += "Adresiniz: \n";
    mesaj += "Şehir/İlçe: \n";
    mesaj += "Ek Notlar (varsa): \n";

    mesaj += `\nToplam Fiyat: ${toplamFiyat.toFixed(2)}₺`;

    const telefonNumarasi = "905541278746";
    const whatsappURL = `https://wa.me/${telefonNumarasi}?text=${encodeURIComponent(mesaj)}`;

    window.open(whatsappURL, '_blank');
};