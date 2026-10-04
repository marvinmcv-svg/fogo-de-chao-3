export type L = { es: string; en: string };

export const cuts: L[] = [
  { es: "Picanha", en: "Picanha" },
  { es: "Fraldinha", en: "Fraldinha" },
  { es: "Filet mignon", en: "Filet mignon" },
  { es: "Cupim", en: "Cupim" },
  { es: "Costela", en: "Beef ribs" },
  { es: "Cordeiro", en: "Lamb" },
  { es: "Linguiça", en: "Sausage" },
  { es: "Frango", en: "Chicken" },
];

export type MenuItem = { name: L; desc: L; tags?: ("veg" | "gf" | "signature")[] };
export type MenuCategory = { id: string; title: L; blurb: L; items: MenuItem[] };

// Dishes follow the Fogo de Chão format. The restaurant must confirm availability and add prices.
export const menu: MenuCategory[] = [
  {
    id: "churrasco",
    title: { es: "Experiencia Churrasco", en: "Churrasco Experience" },
    blurb: {
      es: "Cortes asados sobre fuego de leña y servidos en la mesa por nuestros gaúchos hasta que digas basta.",
      en: "Cuts fire-roasted over wood and carved tableside by our gaúchos until you say stop.",
    },
    items: [
      { name: { es: "Picanha", en: "Picanha" }, desc: { es: "La tapa de cuadril, con su capa de grasa, sal de mar y brasas.", en: "Top sirloin cap with its fat crown, sea salt and embers." }, tags: ["signature", "gf"] },
      { name: { es: "Filet mignon", en: "Filet mignon" }, desc: { es: "Lomo tierno, a punto y sin apuro.", en: "Tender tenderloin, cooked to your point." }, tags: ["gf"] },
      { name: { es: "Fraldinha", en: "Fraldinha" }, desc: { es: "Falda de res jugosa, de sabor profundo.", en: "Juicy bottom sirloin with deep flavor." }, tags: ["gf"] },
      { name: { es: "Cordeiro", en: "Lamb" }, desc: { es: "Cordero asado con hierbas.", en: "Herb-roasted lamb." }, tags: ["gf"] },
      { name: { es: "Costela", en: "Beef ribs" }, desc: { es: "Costilla asada lentamente hasta soltar el hueso.", en: "Slow-roasted rib, falling from the bone." }, tags: ["gf"] },
      { name: { es: "Linguiça", en: "Linguiça" }, desc: { es: "Chorizo brasileño especiado.", en: "Spiced Brazilian sausage." } },
    ],
  },
  {
    id: "market",
    title: { es: "Market Table", en: "Market Table" },
    blurb: {
      es: "Ensaladas de temporada, verduras frescas, quesos, fiambres y panes en una mesa inspirada en el sur de Brasil.",
      en: "Seasonal salads, fresh vegetables, cheeses, charcuterie and breads on a table inspired by southern Brazil.",
    },
    items: [
      { name: { es: "Ensaladas de temporada", en: "Seasonal salads" }, desc: { es: "Hojas, vegetales asados y aderezos de la casa.", en: "Greens, roasted vegetables and house dressings." }, tags: ["veg", "gf"] },
      { name: { es: "Quesos y fiambres", en: "Cheeses & charcuterie" }, desc: { es: "Selección curada para compartir.", en: "A curated selection to share." }, tags: ["gf"] },
      { name: { es: "Feijoada", en: "Feijoada" }, desc: { es: "Frijoles negros estofados, el clásico brasileño.", en: "Stewed black beans, the Brazilian classic." } },
      { name: { es: "Pão de queijo", en: "Pão de queijo" }, desc: { es: "Panecillos de queso calientes, recién horneados.", en: "Warm cheese rolls, fresh from the oven." }, tags: ["veg", "signature"] },
    ],
  },
  {
    id: "carta",
    title: { es: "Platos a la carta", en: "À la carte" },
    blurb: { es: "Para quienes prefieren elegir su plato.", en: "For those who prefer to choose a single plate." },
    items: [
      { name: { es: "Cortes premium", en: "Premium cuts" }, desc: { es: "Preparados al fuego, con guarniciones.", en: "Fire-prepared, with sides." }, tags: ["gf"] },
      { name: { es: "Acompañamientos", en: "Sides" }, desc: { es: "Plátano caramelizado, polenta frita, puré de papa.", en: "Caramelized banana, crispy polenta, mashed potatoes." }, tags: ["veg"] },
    ],
  },
  {
    id: "cocteles",
    title: { es: "Cócteles tropicales", en: "Tropical cocktails" },
    blurb: { es: "Coctelería artesanal con alma brasileña.", en: "Craft cocktails with a Brazilian soul." },
    items: [
      { name: { es: "Caipirinha", en: "Caipirinha" }, desc: { es: "Cachaça, limón y azúcar. El clásico.", en: "Cachaça, lime and sugar. The classic." }, tags: ["veg", "gf", "signature"] },
      { name: { es: "Cócteles de la casa", en: "House cocktails" }, desc: { es: "Fruta fresca y licores de autor.", en: "Fresh fruit and signature spirits." }, tags: ["veg", "gf"] },
    ],
  },
  {
    id: "postres",
    title: { es: "Postres", en: "Desserts" },
    blurb: { es: "El final dulce de la noche.", en: "The sweet end to the night." },
    items: [
      { name: { es: "Papaya cream", en: "Papaya cream" }, desc: { es: "Crema de papaya con licor de cassis.", en: "Papaya cream with cassis liqueur." }, tags: ["veg", "gf", "signature"] },
      { name: { es: "Postres de la casa", en: "House desserts" }, desc: { es: "Consulta la selección del día.", en: "Ask about today's selection." }, tags: ["veg"] },
    ],
  },
  {
    id: "vinos",
    title: { es: "Vinos y Bar Fogo", en: "Wines & Bar Fogo" },
    blurb: { es: "Una carta de vinos pensada para el fuego, y platos pequeños en el bar.", en: "A wine list built for the fire, and small plates at the bar." },
    items: [
      { name: { es: "Malbec y tintos", en: "Malbec & reds" }, desc: { es: "De Argentina, Chile y Bolivia.", en: "From Argentina, Chile and Bolivia." }, tags: ["veg", "gf"] },
      { name: { es: "Tinto de altura", en: "High-altitude reds" }, desc: { es: "Singani y vinos de Tarija.", en: "Singani and wines from Tarija." }, tags: ["veg", "gf"] },
      { name: { es: "Aperitivos del bar", en: "Bar small plates" }, desc: { es: "Platos pequeños inspirados en Brasil.", en: "Small plates inspired by Brazil." } },
    ],
  },
];

export const timeline: { year: string; title: L; body: L; img: string }[] = [
  {
    year: "Sierra Gaúcha",
    title: { es: "Una granja en el sur de Brasil", en: "A farm in southern Brazil" },
    body: { es: "Los fundadores crecieron en la Sierra Gaúcha, donde aprendieron a cocinar en la tradición del churrasco.", en: "The founders grew up in the Serra Gaúcha, where they learned to cook in the churrasco tradition." },
    img: "/img/hero-1.webp",
  },
  {
    year: "Río · São Paulo",
    title: { es: "El oficio del churrasquero", en: "The craft of the churrasqueiro" },
    body: { es: "Los hermanos dejaron las montañas de Rio Grande do Sul para formarse como churrasqueros en Río y São Paulo.", en: "The brothers left the Rio Grande do Sul hills to train as churrasqueiros in Rio and São Paulo." },
    img: "/img/hero-2.webp",
  },
  {
    year: "Porto Alegre",
    title: { es: "El primer restaurante", en: "The first restaurant" },
    body: { es: "Una estructura de madera en el campo, nacida de la obsesión por la calidad y el respeto por el patrimonio familiar.", en: "A wooden structure in the countryside, born of an obsession with quality and respect for family heritage." },
    img: "/img/hero-3.webp",
  },
  {
    year: "Dallas",
    title: { es: "El salto a Estados Unidos", en: "The leap to the United States" },
    body: { es: "A pedido de sus huéspedes estadounidenses, el concepto debutó en Dallas, Texas. Entre 1997 y 2013 abrieron 29 restaurantes más.", en: "At the request of American guests, the concept debuted in Dallas, Texas. Between 1997 and 2013, 29 more restaurants opened." },
    img: "/img/story-2.webp",
  },
  {
    year: "Santa Cruz",
    title: { es: "El fuego llega a Bolivia", en: "The fire arrives in Bolivia" },
    body: { es: "Hoy el churrasco vive en Ventura Mall, con la misma paciencia, el mismo fuego y la misma mesa abierta.", en: "Today the churrasco lives at Ventura Mall, with the same patience, the same fire and the same open table." },
    img: "/img/story-6.webp",
  },
];

export const gallery: { src: string; alt: L; span: string }[] = [
  { src: "/img/hero-1.webp", alt: { es: "Brasas de leña", en: "Wood embers" }, span: "md:col-span-2 md:row-span-2" },
  { src: "/img/story-1.webp", alt: { es: "Vino en la mesa", en: "Wine at the table" }, span: "" },
  { src: "/img/hero-5.webp", alt: { es: "El gaúcho", en: "The gaúcho" }, span: "" },
  { src: "/img/story-6.webp", alt: { es: "Picanha servida", en: "Served picanha" }, span: "md:col-span-2" },
  { src: "/img/hero-2.webp", alt: { es: "Corte en la mesa", en: "Tableside carving" }, span: "" },
];

export const events: { title: L; body: L }[] = [
  { title: { es: "Cumpleaños y celebraciones", en: "Birthdays & celebrations" }, body: { es: "Una mesa larga, fuego y brindis.", en: "A long table, fire and toasts." } },
  { title: { es: "Almuerzos corporativos", en: "Corporate lunches" }, body: { es: "Servicio ágil para equipos y clientes.", en: "Smooth service for teams and clients." } },
  { title: { es: "Eventos privados", en: "Private events" }, body: { es: "Menús a medida para grupos grandes.", en: "Tailored menus for larger groups." } },
];

export const faq: { q: L; a: L }[] = [
  { q: { es: "¿Cómo funciona el rodízio?", en: "How does the rodízio work?" }, a: { es: "Recibes una ficha: lado verde significa que sigas trayendo cortes, lado rojo que hagas una pausa. Nuestros gaúchos pasan por la mesa con espadas de carne recién asada.", en: "You get a card: green side means keep the cuts coming, red side means pause. Our gaúchos roam the room with skewers of freshly roasted meat." } },
  { q: { es: "¿Necesito reservar?", en: "Do I need a reservation?" }, a: { es: "Recomendamos reservar, sobre todo viernes, sábados y domingos. Puedes hacerlo aquí, por WhatsApp o con nuestro asistente.", en: "We recommend booking, especially Friday to Sunday. You can do it here, on WhatsApp or with our assistant." } },
  { q: { es: "¿Tienen opciones vegetarianas?", en: "Do you have vegetarian options?" }, a: { es: "Sí, la Market Table ofrece ensaladas, verduras, quesos y más. Avísanos de cualquier alergia o dieta.", en: "Yes, the Market Table offers salads, vegetables, cheeses and more. Tell us about any allergy or diet." } },
  { q: { es: "¿Dónde estacionar?", en: "Where can I park?" }, a: { es: "Ventura Mall cuenta con estacionamiento. Confirma tarifas con el centro comercial.", en: "Ventura Mall has parking. Confirm rates with the mall." } },
  { q: { es: "¿Aceptan grupos grandes?", en: "Do you take large groups?" }, a: { es: "Sí. Para más de 10 personas escríbenos por WhatsApp y armamos la mesa.", en: "Yes. For more than 10 guests message us on WhatsApp and we will set the table." } },
  { q: { es: "¿Hay código de vestimenta?", en: "Is there a dress code?" }, a: { es: "Casual elegante. Ven cómodo.", en: "Smart casual. Come comfortable." } },
];

// Placeholder quotes: replace with real, attributed guest reviews before launch.
export const testimonials: { quote: L; who: string }[] = [
  { quote: { es: "La picanha llegó a la mesa todavía crepitando.", en: "The picanha reached the table still crackling." }, who: "Reseña de ejemplo" },
  { quote: { es: "Un servicio que te hace sentir en casa.", en: "Service that makes you feel at home." }, who: "Reseña de ejemplo" },
  { quote: { es: "La mejor mesa de ensaladas de la ciudad.", en: "The best salad table in town." }, who: "Reseña de ejemplo" },
];
