import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Coffee, Star, MapPin, Phone, Instagram, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- TYPES ---
interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  desc: string;
  img: string;
}

interface CartItem extends MenuItem {
  qty: number;
}

// --- MOCK DATA ---
const MENU_DATA: MenuItem[] = [
  { id: 1, name: 'Kopi Susu Nikikula', category: 'Coffee', price: 18000, desc: 'Espresso + Gula Aren + Susu Creamy. Signature kita!', img: 'https://images.unsplash.com/photo-1593443320739-77f74939d0da?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Americano X-tra', category: 'Coffee', price: 15000, desc: 'Double shot espresso. Cocok buat nugas lembur.', img: 'https://images.unsplash.com/photo-1514432324607-a2ce7beea8ea?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Matcha Latte', category: 'Non Coffee', price: 20000, desc: 'Premium matcha dengan susu segar. Gak bikin eneg.', img: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Red Velvet', category: 'Non Coffee', price: 20000, desc: 'Manisnya pas, creamy, dan visualnya cakep parah.', img: 'https://images.unsplash.com/photo-1620358482436-1e646271c6d3?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'Roti Bakar Choco Cheese', category: 'Snack', price: 15000, desc: 'Roti tebal, topping melimpah ruah. Perfect combo.', img: 'https://images.unsplash.com/photo-1605333346571-0814a60da1ec?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'Platter Mabar', category: 'Snack', price: 25000, desc: 'Sosis, nugget, kentang. Pas buat nongkrong ramean.', img: 'https://images.unsplash.com/photo-1626200419189-39c8eb00be98?auto=format&fit=crop&w=400&q=80' },
];

const PROMO_DATA = {
  title: "Ngopi Hemat Weekday!",
  desc: "Beli 2 Kopi Susu Nikikula Gratis 1 Roti Bakar Choco Cheese. Khusus jam 14.00 - 18.00.",
  validUntil: "Berlaku Senin - Jumat"
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // --- TRACKING SYSTEM ---
  const trackEvent = (eventName: string, details: any = {}) => {
    console.log(`[TRACKING] Event: ${eventName}`, details);
  };

  // --- CART LOGIC ---
  const addToCart = (item: MenuItem) => {
    trackEvent("Click_Add_To_Cart", { itemName: item.name });
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // --- WHATSAPP ORDER GENERATOR ---
  const handleCheckoutWA = () => {
    trackEvent("Click_Checkout_WhatsApp", { totalItems, totalPrice });
    
    let text = "Halo *Warkop Nikikula*, saya ingin pesan:\n\n";
    cart.forEach(item => {
      text += `▪️ ${item.qty}x ${item.name} - Rp ${(item.price * item.qty).toLocaleString('id-ID')}\n`;
    });
    
    text += `\n*Total Tagihan: Rp ${totalPrice.toLocaleString('id-ID')}*\n\n`;
    text += `Apakah bisa disiapkan untuk diambil / diminum di tempat? Terima kasih!`;

    const waNumber = "6281327376818"; 
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const filteredMenu = activeCategory === 'All' 
    ? MENU_DATA 
    : MENU_DATA.filter(item => item.category === activeCategory);

  // Logo URL source
  const LOGO_SRC = "WhatsApp Image 2026-04-07 at 09.25.50.jpeg";

  return (
    <div className="min-h-screen bg-bg-light text-text-dark scroll-smooth font-sans">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full h-[72px] bg-white/95 backdrop-blur-md border-b border-border-light shadow-sm z-40 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-10 flex justify-between items-center">
          <a href="#hero" className="flex items-center gap-3 font-extrabold text-xl text-primary tracking-tighter">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <Coffee size={24} />
            </div>
            NIKIKULA
          </a>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8 font-semibold text-sm text-muted">
              <a href="#hero" className="text-primary hover:opacity-80 transition">Home</a>
              <a href="#about" className="hover:text-primary transition">About</a>
              <a href="#menu" className="hover:text-primary transition">Menu</a>
            </div>
            
            <button 
              onClick={() => {
                setIsCartOpen(true);
                trackEvent("Click_Open_Cart");
              }}
              className="flex items-center gap-2 bg-white border border-border-light px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition shadow-sm"
            >
              <ShoppingBag size={18} />
              Keranjang
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT GRID */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 px-4 md:px-10 pt-28 pb-12">
        
        {/* LEFT COLUMN: HERO & PROMO */}
        <div className="flex flex-col gap-8">
          <section id="hero" className="hero-panel">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <h2 className="text-[48px] font-extrabold leading-[1.1] tracking-tight">
                Kopi Enak, <br/>
                <span className="text-primary">Vibes Santai.</span>
              </h2>
              <p className="text-muted text-base leading-relaxed">
                Mulai harimu dengan racikan kopi terbaik dari Warkop Nikikula. Nongkrong asik, tugas kelar, dompet aman.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a 
                  href="#menu"
                  onClick={() => trackEvent("Click_CTA_Pesan_Sekarang")}
                  className="px-7 py-3.5 rounded-xl bg-primary text-white font-bold shadow-[0_4px_12px_rgba(182,4,4,0.2)] hover:opacity-90 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Pesan Sekarang
                </a>
                <a 
                  href="#about"
                  className="px-7 py-3.5 rounded-xl bg-white border border-border-light text-text-dark font-bold hover:bg-gray-50 transition flex items-center justify-center"
                >
                  Cerita Kami
                </a>
              </div>
            </motion.div>
          </section>

          {/* PROMO CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-[#E63946] rounded-[24px] p-6 text-white relative overflow-hidden shadow-lg"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mt-16 -mr-16 blur-2xl"></div>
            <div className="relative z-10">
              <div className="inline-block bg-secondary px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
                Weekday Promo
              </div>
              <h3 className="text-xl font-bold mb-2">{PROMO_DATA.title}</h3>
              <p className="text-white/90 text-sm leading-relaxed">{PROMO_DATA.desc}</p>
              <Star size={80} className="absolute -right-5 -bottom-5 opacity-10 rotate-12" />
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: MENU PANEL */}
        <section id="menu" className="bg-white rounded-[32px] border border-border-light p-7 flex flex-col shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-xl font-bold">Menu Andalan</h2>
            <div className="flex gap-2 bg-bg-light p-1 rounded-full border border-border-light">
              {['All', 'Coffee', 'Non Coffee', 'Snack'].map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    trackEvent("Filter_Menu", { category });
                  }}
                  className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all ${
                    activeCategory === category 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-muted hover:text-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredMenu.map(item => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id} 
                  className="border border-border-light rounded-[20px] overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="relative h-[140px] overflow-hidden bg-gray-50">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold text-primary border border-border-light">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[15px] mb-1 leading-tight">{item.name}</h3>
                    <p className="text-[12px] text-muted mb-4 line-clamp-2 h-8">{item.desc}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-secondary">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 rounded-full border-2 border-primary text-primary flex items-center justify-center font-bold hover:bg-primary hover:text-white transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </main>

      {/* ABOUT SECTION (Preserved) */}
      <section id="about" className="py-16 bg-white border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row-reverse items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-5 text-center md:text-left"
          >
            <h3 className="text-secondary font-bold tracking-wider uppercase text-sm">Tentang Kami</h3>
            <h2 className="text-3xl font-bold">Bukan Sekadar Ngopi, Tapi Cari Inspirasi.</h2>
            <p className="text-muted leading-relaxed">
              Warkop Nikikula lahir dari kecintaan kami pada kopi Nusantara dan budaya nongkrong anak muda. Kami percaya bahwa ide-ide besar seringkali muncul dari secangkir kopi dan obrolan hangat di meja warkop.
            </p>
            <ul className="space-y-3 text-left max-w-sm mx-auto md:mx-0">
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-secondary"/> Biji kopi pilihan lokalan</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-secondary"/> Free WiFi kenceng buat nugas</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-secondary"/> Harga ramah kantong mahasiswa</li>
            </ul>
          </motion.div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=300&q=80" className="rounded-2xl shadow-sm w-full h-48 object-cover mt-8" alt="Coffee" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=300&q=80" className="rounded-2xl shadow-sm w-full h-48 object-cover" alt="Cafe Vibes" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      {/* FOOTER (Preserved) */}
      <footer className="bg-text-dark text-white py-12 border-t-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-6 inline-block bg-white p-2 rounded-xl">
              <img 
                src={LOGO_SRC} 
                alt="Warkop Nikikula Logo" 
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => { 
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = 'https://via.placeholder.com/150x50/B60404/FFFFFF?text=Warkop+Nikikula'; 
                }}
              />
            </div>
            <p className="text-gray-400 text-sm mb-6">Membawa kehangatan dan inspirasi di setiap cangkir. Tempat terbaik untuk nongkrong dan bercerita.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition"><Instagram size={18} /></a>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-lg border-b border-gray-700 pb-2 inline-block">Kontak & Lokasi</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3"><MapPin size={18} className="text-secondary shrink-0" /> Jl. Kopi Santai No. 99, Yogyakarta</li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-secondary shrink-0" /> +62 812 3456 7890</li>
              <li className="flex items-center gap-3"><Clock size={18} className="text-secondary shrink-0" /> Buka Setiap Hari: 09.00 - 23.00</li>
            </ul>
          </div>
          <div>
             <h3 className="font-bold mb-4 text-lg border-b border-gray-700 pb-2 inline-block">Menu Cepat</h3>
             <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#hero" className="hover:text-white transition">Beranda</a></li>
              <li><a href="#about" className="hover:text-white transition">Tentang Kami</a></li>
              <li><a href="#menu" className="hover:text-white transition">Order Menu</a></li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-10 text-center mt-12 pt-6 border-t border-gray-800 text-sm text-gray-500">
          © {new Date().getFullYear()} Warkop Nikikula. All rights reserved.
        </div>
      </footer>

      {/* FLOATING CART BUTTON (Professional Polish Style) */}
      <AnimatePresence>
        {totalItems > 0 && !isCartOpen && (
          <motion.button 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-10 right-4 md:right-10 bg-text-dark text-white px-6 py-4 rounded-[20px] flex items-center gap-4 shadow-2xl z-40 hover:scale-105 transition-transform"
          >
            <div className="flex flex-col items-start">
              <span className="text-[11px] opacity-70 uppercase font-bold tracking-wider">{totalItems} Item Pesanan</span>
              <strong className="text-lg">Rp {totalPrice.toLocaleString('id-ID')}</strong>
            </div>
            <div className="bg-green-500 text-white px-4 py-2 rounded-xl text-[12px] font-extrabold">
              CHECKOUT
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* CART SIDEBAR (Preserved functionality) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" 
              onClick={() => setIsCartOpen(false)}
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="px-6 py-5 border-b flex justify-between items-center bg-bg-light">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-primary" />
                  <h2 className="font-bold text-lg">Keranjang Pesanan</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted space-y-4">
                    <Coffee size={48} className="opacity-50" />
                    <p>Keranjangmu masih kosong nih.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2 border border-primary text-primary rounded-full text-sm font-bold hover:bg-primary hover:text-white transition"
                    >
                      Mulai Pesan
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="flex gap-4 items-center"
                    >
                      <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-text-dark leading-tight">{item.name}</h4>
                        <p className="text-secondary font-bold text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-bg-light rounded-full px-2 py-1 border border-border-light">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded-full transition">
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded-full transition">
                          <Plus size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-muted font-medium">Total Harga</span>
                    <span className="text-2xl font-bold text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <button 
                    onClick={handleCheckoutWA}
                    className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30 transition transform hover:-translate-y-1 flex justify-center items-center gap-2"
                  >
                    Pesan via WhatsApp <ArrowRight size={20} />
                  </button>
                  <p className="text-center text-xs text-muted mt-3">Kamu akan dialihkan ke WhatsApp untuk konfirmasi.</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
