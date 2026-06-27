const mockProducts = [
  {
    _id: "60c72b2f9b1d8e1f8c8b4501",
    name: "GoPro HERO6 4K Action Camera - Black",
    price: 99.50,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80",
    description: "Experience the ultimate action capture with the GoPro HERO6. Features stunning 4K video recording, advanced video stabilization, and a rugged waterproof design, making it the perfect companion for your outdoor adventures.",
    category: "Electronics",
    stock: 25,
    brand: "GoPro",
    rating: 7.5,
    reviews: 32,
    sold: 154,
    features: ["Metallic", "Super power", "Large Memory"],
    details: {
      "Model": "HERO-8786",
      "Style": "Action Cam",
      "Certificate": "ISO-8989",
      "Size": "66mm x 48mm x 24mm",
      "Memory": "MicroSD up to 256GB"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4502",
    name: "Smartwatches Premium Sports Edition v4",
    price: 99.50,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    description: "Track your fitness, receive notifications, and make payments on the go. Designed with a premium metallic finish and a vivid AMOLED screen, this smartwatch blends style and health tracking flawlessly.",
    category: "Electronics",
    stock: 50,
    brand: "Samsung",
    rating: 9.3,
    reviews: 48,
    sold: 210,
    features: ["Metallic", "8GB Ram", "Super power"],
    details: {
      "Model": "SW-400X",
      "Style": "Sports smartwatch",
      "Certificate": "CE-EMC",
      "Size": "42mm x 42mm x 11.5mm",
      "Memory": "8GB ROM / 1GB RAM"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4503",
    name: "Ultra Thin Core i7 Professional Laptop",
    price: 940.00,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
    description: "Boost your productivity with this ultra-thin laptop. Packed with a high-performance Core i7 processor, fast 8GB RAM, and a spacious SSD, it handles heavy programming, design work, and multitasking with ease.",
    category: "Electronics",
    stock: 12,
    brand: "Lenovo",
    rating: 8.7,
    reviews: 120,
    sold: 80,
    features: ["8GB Ram", "Large Memory", "Super power"],
    details: {
      "Model": "LNV-THIN9",
      "Style": "Business Notebook",
      "Certificate": "ENERGY STAR",
      "Size": "315mm x 220mm x 14.9mm",
      "Memory": "512GB NVMe SSD"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4504",
    name: "Pro Sound Active Noise Cancelling Headphones",
    price: 99.50,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    description: "Escape the noise with industry-leading Active Noise Cancelling technology. These headphones offer rich, high-fidelity audio, comfortable memory foam ear cushions, and up to 30 hours of continuous wireless playback.",
    category: "Electronics",
    stock: 40,
    brand: "Apple",
    rating: 7.5,
    reviews: 64,
    sold: 140,
    features: ["Plastic cover", "Super power"],
    details: {
      "Model": "ANC-PRO2",
      "Style": "Over-Ear Wireless",
      "Certificate": "FCC-ID",
      "Size": "180mm x 160mm x 80mm",
      "Memory": "N/A"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4505",
    name: "Canon Professional DSLR Camera Body Only",
    price: 689.00,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80",
    description: "Capture breathtaking, gallery-quality photographs with this high-resolution DSLR camera body. Perfectly suited for both portrait photography and cinematic video creation.",
    category: "Electronics",
    stock: 8,
    brand: "Huawei",
    rating: 7.5,
    reviews: 90,
    sold: 55,
    features: ["Metallic", "Large Memory"],
    details: {
      "Model": "EOS-200D",
      "Style": "DSLR Camera",
      "Certificate": "ISO-9001",
      "Size": "122mm x 93mm x 70mm",
      "Memory": "SD/SDHC/SDXC Dual Slot"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4506",
    name: "Nordic Style Velvet Soft Single Armchair",
    price: 19.00,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&auto=format&fit=crop&q=80",
    description: "Bring a touch of modern elegance to your living room or study. This armchair features soft velvet upholstery, dense foam cushioning, and sturdy solid wood legs for maximum comfort and style.",
    category: "Home interiors",
    stock: 15,
    brand: "Pocco",
    rating: 9.0,
    reviews: 18,
    sold: 300,
    features: ["Plastic cover"],
    details: {
      "Model": "NC-CHAIR1",
      "Style": "Single Armchair",
      "Certificate": "FSC-Certified",
      "Size": "75cm x 80cm x 85cm",
      "Memory": "N/A"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4507",
    name: "Modern Fabric Sofa with Accent Lamp",
    price: 19.00,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80",
    description: "A comfortable, compact fabric sofa designed for apartments and modern houses. Sturdy construction combined with a minimalistic form factor.",
    category: "Home interiors",
    stock: 5,
    brand: "Lenovo",
    rating: 8.5,
    reviews: 42,
    sold: 95,
    features: ["Metallic"],
    details: {
      "Model": "SF-FABRIC5",
      "Style": "Sofa",
      "Certificate": "ISO-14001",
      "Size": "180cm x 90cm x 85cm",
      "Memory": "N/A"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4508",
    name: "Premium Ceramic Dining Plate & Dish Set",
    price: 19.00,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=80",
    description: "Elevate your dining experience with this complete 12-piece ceramic dining dish set. Microwave and dishwasher safe, featuring a scratch-resistant glaze.",
    category: "Home interiors",
    stock: 60,
    brand: "Samsung",
    rating: 9.5,
    reviews: 50,
    sold: 450,
    features: ["Plastic cover"],
    details: {
      "Model": "PLATE-CER1",
      "Style": "Dining Tableware",
      "Certificate": "FDA-Approved",
      "Size": "Multiple sizes included",
      "Memory": "N/A"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4509",
    name: "Mens Long Sleeve T-shirt Cotton Base Layer",
    price: 10.30,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=80",
    description: "Crafted from 100% organic cotton, this classic long sleeve tee provides superior comfort and breathability. Its slim-fit design makes it perfect as a standalone shirt or a cozy base layer for cooler seasons.",
    category: "Clothing",
    stock: 100,
    brand: "Apple",
    rating: 9.3,
    reviews: 32,
    sold: 154,
    features: ["Plastic cover"],
    details: {
      "Model": "TS-COTTON-L",
      "Style": "Classic style",
      "Certificate": "ISO-898921212",
      "Size": "34mm x 450mm x 19mm",
      "Memory": "36GB RAM"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4510",
    name: "Classic Denim Jeans Shorts for Men",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=80",
    description: "Durable and fashionable denim shorts. Offers a relaxed fit with multiple pockets, perfect for casual summer outings and daily leisure wear.",
    category: "Clothing",
    stock: 80,
    brand: "Pocco",
    rating: 7.5,
    reviews: 14,
    sold: 80,
    features: ["Metallic"],
    details: {
      "Model": "DM-SHORTS2",
      "Style": "Denim Shorts",
      "Certificate": "OEKO-TEX",
      "Size": "Waist 30-38 available",
      "Memory": "N/A"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4511",
    name: "Brown Winter Coat with Faux Fur Hood",
    price: 12.50,
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=500&auto=format&fit=crop&q=80",
    description: "Stay warm in style. This heavy-duty winter coat is insulated with high-grade down filling and features a windproof exterior with an elegant faux-fur trimmed hood.",
    category: "Clothing",
    stock: 15,
    brand: "Huawei",
    rating: 8.9,
    reviews: 55,
    sold: 120,
    features: ["Metallic", "Super power"],
    details: {
      "Model": "WC-FUR88",
      "Style": "Heavy Outerwear",
      "Certificate": "ISO-Coat",
      "Size": "M, L, XL, XXL",
      "Memory": "N/A"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4512",
    name: "Jeans Bag for Travel & Everyday Wear",
    price: 34.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    description: "A trendy, durable denim travel backpack. Offers a main drawstring compartment with multiple side pockets for ultimate convenience.",
    category: "Accessories",
    stock: 35,
    brand: "Samsung",
    rating: 9.0,
    reviews: 30,
    sold: 190,
    features: ["Plastic cover"],
    details: {
      "Model": "JB-TRAVEL4",
      "Style": "Backpack",
      "Certificate": "ISO-Bag",
      "Size": "40cm x 30cm x 15cm",
      "Memory": "N/A"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4513",
    name: "Premium Handcrafted Leather Wallet",
    price: 99.00,
    image: "https://images.unsplash.com/photo-1507207611509-ec012433ff52?w=500&auto=format&fit=crop&q=80",
    description: "Made from full-grain vegetable-tanned leather, this slim bi-fold wallet contains card slots, a cash slot, and RFID-blocking technology.",
    category: "Accessories",
    stock: 45,
    brand: "Apple",
    rating: 9.7,
    reviews: 44,
    sold: 310,
    features: ["Metallic", "Large Memory"],
    details: {
      "Model": "LW-HAND9",
      "Style": "Bifold Wallet",
      "Certificate": "Leather-G",
      "Size": "110mm x 85mm x 15mm",
      "Memory": "N/A"
    }
  },
  {
    _id: "60c72b2f9b1d8e1f8c8b4514",
    name: "Minimalist Blue Leather Pocket Wallet",
    price: 10.30,
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=500&auto=format&fit=crop&q=80",
    description: "A sleek, minimal card holder wallet crafted in high-quality navy blue leather, perfect for carrying essential cards and folded cash.",
    category: "Accessories",
    stock: 90,
    brand: "Pocco",
    rating: 7.1,
    reviews: 12,
    sold: 99,
    features: ["Plastic cover"],
    details: {
      "Model": "LW-MINI3",
      "Style": "Card Wallet",
      "Certificate": "CE",
      "Size": "100mm x 70mm x 8mm",
      "Memory": "N/A"
    }
  }
];

module.exports = mockProducts;
