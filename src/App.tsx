import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Flame, Heart, Droplets, Clock, X, Phone, MapPin, Star, Sparkles, ChevronDown } from 'lucide-react';

// --- Types ---
interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration_min: number;
  image_url: string;
  tags: string[];
}

interface BookingModalProps {
  service: Service | null;
  onClose: () => void;
}

// --- Components ---

const Navbar = () => (
  <nav className="fixed w-full z-50 transition-all duration-500 bg-black/60 backdrop-blur-lg border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-24">
        <div className="flex items-center group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-2 bg-pink-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Flame className="h-8 w-8 text-pink-500 relative z-10 animate-pulse-slow" strokeWidth={1.5} />
          </div>
          <div className="ml-3 flex flex-col">
            <span className="text-2xl font-serif font-semibold text-white tracking-[0.2em]">VELVET</span>
            <span className="text-[0.65rem] uppercase tracking-[0.4em] text-pink-400 font-sans">Room & Spa</span>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="ml-10 flex items-center space-x-10">
            <a href="#rituals" className="text-pink-100/70 hover:text-pink-400 text-xs uppercase tracking-widest transition-colors">Rituales</a>
            <a href="#gallery" className="text-pink-100/70 hover:text-pink-400 text-xs uppercase tracking-widest transition-colors">Galería</a>
            <a href="#contact" className="bg-gradient-to-r from-pink-700 to-rose-600 hover:from-pink-600 hover:to-rose-500 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(219,39,119,0.4)] transition-all hover:scale-105">
              Reserva Discreta
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background Image with Deep Overlay */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1620662657343-98282b3d1796?q=80&w=2070&auto=format&fit=crop" 
        alt="Sensual atmosphere"
        className="w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-pink-950/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-zinc-950/80 to-zinc-950"></div>
    </div>
    
    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
      <div className="inline-flex items-center space-x-2 mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-pink-500"></span>
        <span className="text-pink-400 uppercase tracking-[0.3em] text-xs font-semibold">Exclusivo para Caballeros & Parejas</span>
        <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-pink-500"></span>
      </div>
      
      <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 leading-tight animate-fade-in opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
        El Arte del <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-400 to-pink-600 text-glow italic pr-4">
          Placer Prohibido
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-pink-100/70 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
        Descubre un santuario donde la sensualidad se encuentra con la relajación. 
        Masajes tántricos, cuerpo a cuerpo y rituales eróticos diseñados para liberar tus deseos más profundos.
      </p>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
        <a href="#rituals" className="w-full md:w-auto bg-pink-600 hover:bg-pink-500 text-white px-10 py-4 rounded-xl font-serif text-lg transition-all duration-300 shadow-[0_0_30px_rgba(219,39,119,0.3)] hover:shadow-[0_0_50px_rgba(219,39,119,0.5)]">
          Ver Carta de Servicios
        </a>
        <span className="text-pink-500/50 text-sm hidden md:block">✦</span>
        <a href="#contact" className="w-full md:w-auto text-pink-300 hover:text-white border border-pink-500/30 hover:border-pink-500/60 px-10 py-4 rounded-xl font-serif text-lg transition-all duration-300 bg-pink-950/20 backdrop-blur-sm">
          Contactar Ahora
        </a>
      </div>
    </div>

    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-pink-500/50">
      <ChevronDown size={30} strokeWidth={1} />
    </div>
  </div>
);

const BookingModal: React.FC<BookingModalProps> = ({ service, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });

  if (!service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const bookingTime = new Date(`${formData.date}T${formData.time}`).toISOString();

    const { error } = await supabase
      .from('erotic_bookings')
      .insert([{
        service_id: service.id,
        client_alias: formData.name,
        contact_info: formData.phone,
        booking_time: bookingTime,
        special_requests: formData.notes
      }]);

    setLoading(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } else {
      console.error(error);
      alert('Error en la reserva. Intenta nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-zinc-900 border border-pink-500/20 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_rgba(236,72,153,0.15)] overflow-hidden animate-fade-in flex flex-col md:flex-row">
        
        {/* Image Side */}
        <div className="hidden md:block w-1/3 relative">
           <img src={service.image_url} alt={service.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />
           <div className="absolute inset-0 bg-pink-900/40 mix-blend-overlay"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900"></div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-2/3 p-8 md:p-10 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-pink-500/50 hover:text-pink-400 transition-colors">
            <X size={24} />
          </button>

          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10">
              <Heart className="w-20 h-20 text-pink-500 animate-pulse" fill="currentColor" />
              <h3 className="text-3xl font-serif text-white">¡Deseo Recibido!</h3>
              <p className="text-pink-200/70">Una de nuestras masajistas confirmará tu cita en breve con total discreción.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="text-pink-500 text-xs font-bold uppercase tracking-widest">Solicitud de Cita</span>
                <h3 className="text-2xl font-serif text-white mt-2">{service.title}</h3>
                <p className="text-pink-200/50 text-sm mt-1">Total discreción garantizada.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-pink-400/70 mb-2">Alias / Nombre</label>
                    <input 
                      required 
                      type="text" 
                      className="input-erotic"
                      placeholder="Sr. Grey"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-pink-400/70 mb-2">WhatsApp / Telegram</label>
                    <input 
                      required 
                      type="text" 
                      className="input-erotic"
                      placeholder="+1 ..."
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-pink-400/70 mb-2">Fecha</label>
                    <input 
                      required 
                      type="date" 
                      className="input-erotic [color-scheme:dark]"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-pink-400/70 mb-2">Hora</label>
                    <input 
                      required 
                      type="time" 
                      className="input-erotic [color-scheme:dark]"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-pink-400/70 mb-2">Fantasías o Peticiones (Opcional)</label>
                  <textarea 
                    rows={2}
                    className="input-erotic resize-none"
                    placeholder="¿Alguna preferencia especial para tu masajista?"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
                
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-700 to-rose-600 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-4 rounded-xl mt-4 transition-all duration-300 shadow-lg shadow-pink-900/50 disabled:opacity-50"
                >
                  {loading ? 'Confirmando...' : 'Confirmar Encuentro'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('erotic_services')
        .select('*')
        .order('price');
      
      if (data && data.length > 0) {
        setServices(data);
      } 
    };
    fetchServices();
  }, []);

  return (
    <section id="rituals" className="py-32 relative bg-zinc-950">
      {/* Ambient Lights */}
      <div className="absolute top-1/4 left-0 w-full h-[500px] bg-pink-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-900/10 blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <Sparkles className="inline-block text-pink-500 mb-4 animate-pulse" size={24} />
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Nuestros Rituales Íntimos</h2>
          <p className="text-pink-200/60 max-w-2xl mx-auto font-light text-lg">
            Experiencias diseñadas para elevar la temperatura, conectar con tu cuerpo y disfrutar del placer sin culpas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div key={service.id} 
              className="group glass-panel rounded-3xl overflow-hidden glass-card-hover transform transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={service.image_url} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"></div>
                
                <div className="absolute top-4 right-4 flex gap-2">
                  {service.tags?.map(tag => (
                    <span key={tag} className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-pink-300 text-[10px] font-bold uppercase tracking-wider border border-pink-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-8 relative">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-serif text-white group-hover:text-pink-400 transition-colors">{service.title}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-light text-pink-300">${service.price}</span>
                    <span className="text-xs text-zinc-500">{service.duration_min} min</span>
                  </div>
                </div>
                
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-light border-l-2 border-pink-900/50 pl-4">
                  {service.description}
                </p>
                
                <button 
                  onClick={() => setSelectedService(service)}
                  className="w-full py-4 border border-pink-500/30 rounded-xl text-pink-300 font-serif hover:bg-pink-900/30 hover:text-white hover:border-pink-500/60 transition-all duration-300 uppercase tracking-widest text-sm"
                >
                  Solicitar Cita
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedService && (
        <BookingModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </section>
  );
};

const Atmosphere = () => (
  <section className="py-24 bg-zinc-950 relative border-y border-white/5 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-pink-600/20 rounded-full blur-2xl animate-pulse-slow"></div>
          <img 
            src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop" 
            alt="Woman relaxing" 
            className="relative rounded-3xl shadow-2xl shadow-pink-900/20 z-10 grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-zinc-900 border border-pink-500/30 rounded-full flex items-center justify-center z-20 shadow-xl">
             <div className="text-center">
                <span className="block text-3xl font-serif text-white">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-pink-400">Privacidad</span>
             </div>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif text-white">Un Espacio para la <span className="text-pink-500 italic">Liberación</span></h2>
          <p className="text-zinc-400 font-light leading-relaxed text-lg">
            En Velvet Room, entendemos que el bienestar sexual es parte fundamental de la salud. 
            Nuestras terapeutas son expertas en el arte del tacto consciente, creando un ambiente 
            seguro y sofisticado donde puedes ser tú mismo.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center text-pink-200/80">
              <Heart className="mr-4 text-pink-600" size={20} /> 
              Masajistas profesionales y discretas
            </li>
            <li className="flex items-center text-pink-200/80">
              <Droplets className="mr-4 text-pink-600" size={20} /> 
              Aceites calientes afrodisíacos
            </li>
            <li className="flex items-center text-pink-200/80">
              <Star className="mr-4 text-pink-600" size={20} /> 
              Finales felices garantizados en rituales premium
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer id="contact" className="bg-black pt-24 pb-12 border-t border-pink-900/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16">
         <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-serif text-white">VELVET <span className="text-pink-600">ROOM</span></h2>
            <p className="text-zinc-500 text-sm mt-2 tracking-widest uppercase">Exclusive Erotic Spa</p>
         </div>
         <div className="flex space-x-8">
            <a href="#" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-pink-500 hover:text-pink-500 transition-all">
               <Phone size={18} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-pink-500 hover:text-pink-500 transition-all">
               <MapPin size={18} />
            </a>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left border-t border-zinc-900 pt-12">
        <div>
          <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Ubicación</h4>
          <p className="text-zinc-500 text-sm">Calle Secreta 69, Zona Rosa<br/>Ciudad de México</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Horarios</h4>
          <p className="text-zinc-500 text-sm">Lunes a Sábado<br/>11:00 AM - 11:00 PM</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Contacto</h4>
          <p className="text-zinc-500 text-sm">citas@velvetroom.com<br/>+52 (55) 1234 5678</p>
        </div>
      </div>
      
      <div className="mt-20 text-center text-zinc-800 text-xs">
        <p>© 2024 Velvet Room. Solo para mayores de 18 años.</p>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-pink-50 font-sans selection:bg-pink-600 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Atmosphere />
        <Services />
      </main>
      <Footer />
    </div>
  );
}

export default App;