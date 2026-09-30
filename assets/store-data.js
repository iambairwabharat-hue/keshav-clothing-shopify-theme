/**
 * ASYNC & SYNC STORE DATA MANAGER
 * Syncs seamlessly with disk via /api/products and /api/collections
 * with instant localStorage fallback and cache.
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_PRODUCTS = 'nevermind_store_products';
  const STORAGE_KEY_COLLECTIONS = 'nevermind_store_collections';

  const DEFAULT_PRODUCTS = [
    {
      "id": 1,
      "title": "Essential Heavyweight Hoodie",
      "handle": "essential-heavyweight-hoodie",
      "category": "Hoodies",
      "product_type": "Hoodies & Sweatshirts",
      "vendor": "KCCLOTHING",
      "status": "Active",
      "price": 59.99,
      "compare_at_price": 89.99,
      "cost_per_item": 24.00,
      "inventory": 48,
      "sku": "NVM-HD-001",
      "barcode": "890123456789",
      "collections": ["all", "hoodies"],
      "tags": ["Heavyweight", "450GSM", "Oversized", "Bestseller"],
      "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=80",
      "media": [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1578768079470-fa9cf84ca1e3?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=80"
      ],
      "description": "<h3>Description</h3>\n<p>Premium heavyweight cotton hoodie with an oversized fit for ultimate comfort and modern style.</p>\n\n<h3>Materials & Fit</h3>\n<p>Crafted from 100% heavyweight 450GSM organic loopback fleece. Oversized fit with dropped shoulders and structured drape.</p>\n\n<h3>Shipping & Returns</h3>\n<p>Free worldwide shipping on orders over $99. 30-day effortless returns and exchanges.</p>",
      "colors": ["Charcoal Gray", "Light Gray", "Sand", "Black"],
      "sizes": ["S", "M", "L", "XL", "XXL"]
    },
    {
      "id": 2,
      "title": "Persistence of Time T-shirt",
      "handle": "persistence-of-time-tshirt",
      "category": "Tees",
      "product_type": "Graphic T-Shirts",
      "vendor": "KCCLOTHING",
      "status": "Active",
      "price": 34.99,
      "compare_at_price": 49.99,
      "cost_per_item": 12.00,
      "inventory": 32,
      "sku": "NVM-TEE-002",
      "barcode": "890123456790",
      "collections": ["all", "tees"],
      "tags": ["Block Print", "380GSM", "Vintage Wash"],
      "image": "https://images.unsplash.com/photo-1578768079470-fa9cf84ca1e3?w=800&h=1000&fit=crop&q=80",
      "media": [
        "https://images.unsplash.com/photo-1578768079470-fa9cf84ca1e3?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop&q=80"
      ],
      "description": "<h3>Description</h3>\n<p>Artisanal block-printed graphic tee engineered on 380GSM single jersey cotton.</p>\n\n<h3>Care Guide</h3>\n<p>Cold wash inside out. Flat dry in shade to preserve handcrafted pigment.</p>",
      "colors": ["Vintage White", "Faded Black", "Olive"],
      "sizes": ["S", "M", "L", "XL"]
    },
    {
      "id": 3,
      "title": "Laal Zameen Hand-Embroidered Jacket",
      "handle": "laal-zameen-jacket",
      "category": "Jackets",
      "product_type": "Outerwear & Coats",
      "vendor": "KCCLOTHING",
      "status": "Active",
      "price": 360.00,
      "compare_at_price": 420.00,
      "cost_per_item": 160.00,
      "inventory": 8,
      "sku": "NVM-JKT-003",
      "barcode": "890123456791",
      "collections": ["all", "jackets"],
      "tags": ["Zardozi", "Rare 1 of 50", "Embroidery"],
      "image": "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=1000&fit=crop&q=80",
      "media": [
        "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop&q=80"
      ],
      "description": "<h3>Masterpiece Craft</h3>\n<p>80+ artisan hours of Zardozi hand-embroidery on heavyweight Japanese raw twill.</p>\n\n<h3>Heritage & Provenance</h3>\n<p>Hand-tailored by generational master craftsmen in Varanasi and Gujarat.</p>",
      "colors": ["Crimson Red", "Obsidian Black"],
      "sizes": ["M", "L", "XL"]
    },
    {
      "id": 4,
      "title": "Kaarigar Heavyweight Overshirt",
      "handle": "kaarigar-heavyweight-overshirt",
      "category": "Shirts",
      "product_type": "Overshirts",
      "vendor": "KCCLOTHING",
      "status": "Active",
      "price": 64.99,
      "compare_at_price": 84.99,
      "cost_per_item": 28.00,
      "inventory": 24,
      "sku": "NVM-SHT-004",
      "barcode": "890123456792",
      "collections": ["all", "shirts"],
      "tags": ["Corduroy", "Handloom", "Utility"],
      "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop&q=80",
      "media": [
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1578768079470-fa9cf84ca1e3?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop&q=80"
      ],
      "description": "<h3>Description</h3>\n<p>Handloom ribbed corduroy overshirt with horn buttons and double chest utility pockets.</p>",
      "colors": ["Espresso Brown", "Earthy Sand", "Forest Green"],
      "sizes": ["S", "M", "L", "XL", "XXL"]
    },
    {
      "id": 5,
      "title": "Argentino Block-Printed Jersey",
      "handle": "argentino-block-printed-jersey",
      "category": "Tees",
      "product_type": "Jerseys",
      "vendor": "KCCLOTHING",
      "status": "Active",
      "price": 48.00,
      "compare_at_price": 65.00,
      "cost_per_item": 19.00,
      "inventory": 15,
      "sku": "NVM-JSY-005",
      "barcode": "890123456793",
      "collections": ["all", "tees"],
      "tags": ["Jersey", "Spray Block", "Limited Drop"],
      "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop&q=80",
      "media": [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1578768079470-fa9cf84ca1e3?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=80"
      ],
      "description": "<h3>Description</h3>\n<p>Heritage football silhouette re-engineered with artisanal spray-block print motifs.</p>",
      "colors": ["Sky Blue & White", "Noir Gold"],
      "sizes": ["S", "M", "L", "XL"]
    },
    {
      "id": 6,
      "title": "Mukammal Wide-Leg Cord Trousers",
      "handle": "mukammal-wide-leg-trousers",
      "category": "Bottoms",
      "product_type": "Pants & Trousers",
      "vendor": "KCCLOTHING",
      "status": "Active",
      "price": 55.00,
      "compare_at_price": 75.00,
      "cost_per_item": 22.00,
      "inventory": 19,
      "sku": "NVM-BTM-006",
      "barcode": "890123456794",
      "collections": ["all", "bottoms"],
      "tags": ["Corduroy", "Wide Leg", "Pleated"],
      "image": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=80",
      "media": [
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=1000&fit=crop&q=80"
      ],
      "description": "<h3>Description</h3>\n<p>Architectural wide drape milled from heavy wale ribbed cord with elasticated drawstring waist.</p>",
      "colors": ["Charcoal Black", "Vintage Olive", "Sand Tan"],
      "sizes": ["S", "M", "L", "XL"]
    }
  ];

  const DEFAULT_COLLECTIONS = [
    {
      "id": 1,
      "title": "All Products",
      "handle": "all",
      "description": "The complete archive of luxury streetwear staples and handcrafted drops.",
      "image": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=600&fit=crop&q=80",
      "product_ids": [1, 2, 3, 4, 5, 6]
    },
    {
      "id": 2,
      "title": "Jackets & Outerwear",
      "handle": "jackets",
      "description": "Architectural bomber jackets, raw twill coats, and heavy workwear silhouettes.",
      "image": "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&h=600&fit=crop&q=80",
      "product_ids": [3]
    },
    {
      "id": 3,
      "title": "Hoodies & Sweats",
      "handle": "hoodies",
      "description": "450GSM organic loopback fleece with dropped shoulders and custom garment dyeing.",
      "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=600&fit=crop&q=80",
      "product_ids": [1]
    },
    {
      "id": 4,
      "title": "T-Shirts & Tops",
      "handle": "tees",
      "description": "Heavyweight 380GSM boxy tees, handcrafted block prints, and vintage washes.",
      "image": "https://images.unsplash.com/photo-1578768079470-fa9cf84ca1e3?w=1200&h=600&fit=crop&q=80",
      "product_ids": [2, 5]
    },
    {
      "id": 5,
      "title": "Handblock Shirts",
      "handle": "shirts",
      "description": "Artisanal corduroy and raw linen overshirts crafted by generational weavers.",
      "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200&h=600&fit=crop&q=80",
      "product_ids": [4]
    },
    {
      "id": 6,
      "title": "Bottoms & Trousers",
      "handle": "bottoms",
      "description": "Wide-leg pleated cords, tailored cargo trousers, and relaxed fleece pants.",
      "image": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&h=600&fit=crop&q=80",
      "product_ids": [6]
    }
  ];

  // Try to sync with server API on script load
  const syncWithServer = async () => {
    try {
      const resP = await fetch('/api/products');
      if (resP.ok) {
        const prods = await resP.json();
        if (prods && prods.length > 0) {
          localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(prods));
        }
      }
    } catch (e) {}

    try {
      const resC = await fetch('/api/collections');
      if (resC.ok) {
        const cols = await resC.json();
        if (cols && cols.length > 0) {
          localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(cols));
        }
      }
    } catch (e) {}
  };

  syncWithServer();

  const StoreData = {
    getProducts: function() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return DEFAULT_PRODUCTS;
    },

    getProductById: function(id) {
      const products = this.getProducts();
      if (!id) return products[0];
      return products.find(p => String(p.id) === String(id) || p.handle === String(id)) || products[0];
    },

    saveProduct: async function(product) {
      const products = this.getProducts();
      const existingIdx = products.findIndex(p => String(p.id) === String(product.id));

      if (existingIdx >= 0) {
        products[existingIdx] = { ...products[existingIdx], ...product };
      } else {
        product.id = Date.now();
        if (!product.handle) {
          product.handle = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        products.unshift(product);
      }

      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));

      // Save to server disk
      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(products)
        });
      } catch (e) {
        console.warn('Server API save failed, saved to localStorage only:', e);
      }

      return product;
    },

    deleteProduct: async function(id) {
      const products = this.getProducts().filter(p => String(p.id) !== String(id));
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));

      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(products)
        });
      } catch (e) {}
    },

    getCollections: function() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_COLLECTIONS);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return DEFAULT_COLLECTIONS;
    },

    getCollectionById: function(id) {
      const collections = this.getCollections();
      return collections.find(c => String(c.id) === String(id) || c.handle === String(id)) || collections[0];
    },

    saveCollection: async function(col) {
      const collections = this.getCollections();
      const existingIdx = collections.findIndex(c => String(c.id) === String(col.id));

      if (existingIdx >= 0) {
        collections[existingIdx] = { ...collections[existingIdx], ...col };
      } else {
        col.id = Date.now();
        if (!col.handle) {
          col.handle = col.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        collections.push(col);
      }

      localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(collections));

      try {
        await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(collections)
        });
      } catch (e) {}

      return col;
    },

    deleteCollection: async function(id) {
      const collections = this.getCollections().filter(c => String(c.id) !== String(id));
      localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(collections));

      try {
        await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(collections)
        });
      } catch (e) {}
    },

    resetToDefault: async function() {
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
      localStorage.removeItem(STORAGE_KEY_COLLECTIONS);

      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_PRODUCTS)
        });
        await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_COLLECTIONS)
        });
      } catch (e) {}
    },

    /* =============================================
       QUERY HELPERS (Filter, Sort, Search, Related)
       ============================================= */

    searchProducts: function(query) {
      if (!query || !query.trim()) return this.getProducts();
      const q = query.toLowerCase().trim();
      return this.getProducts().filter(p => {
        return (p.title && p.title.toLowerCase().includes(q)) ||
               (p.category && p.category.toLowerCase().includes(q)) ||
               (p.product_type && p.product_type.toLowerCase().includes(q)) ||
               (p.vendor && p.vendor.toLowerCase().includes(q)) ||
               (p.description && p.description.toLowerCase().includes(q)) ||
               (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
               (p.colors && p.colors.some(c => c.toLowerCase().includes(q)));
      });
    },

    filterProducts: function(products, criteria) {
      let filtered = products || this.getProducts();

      // Filter by category/collection handle
      if (criteria.category && criteria.category !== 'all') {
        const col = this.getCollectionById(criteria.category);
        if (col && col.product_ids) {
          filtered = filtered.filter(p => col.product_ids.includes(p.id));
        } else {
          filtered = filtered.filter(p =>
            (p.category && p.category.toLowerCase() === criteria.category.toLowerCase()) ||
            (p.collections && p.collections.includes(criteria.category.toLowerCase()))
          );
        }
      }

      // Filter by categories array (checkboxes)
      if (criteria.categories && criteria.categories.length > 0) {
        filtered = filtered.filter(p =>
          criteria.categories.some(cat =>
            (p.category && p.category.toLowerCase() === cat.toLowerCase()) ||
            (p.product_type && p.product_type.toLowerCase().includes(cat.toLowerCase()))
          )
        );
      }

      // Filter by colors
      if (criteria.colors && criteria.colors.length > 0) {
        filtered = filtered.filter(p =>
          p.colors && criteria.colors.some(c =>
            p.colors.some(pc => pc.toLowerCase().includes(c.toLowerCase()))
          )
        );
      }

      // Filter by sizes
      if (criteria.sizes && criteria.sizes.length > 0) {
        filtered = filtered.filter(p =>
          p.sizes && criteria.sizes.some(s => p.sizes.includes(s))
        );
      }

      // Filter by price range
      if (criteria.priceMin !== undefined && criteria.priceMin !== null) {
        filtered = filtered.filter(p => Number(p.price) >= Number(criteria.priceMin));
      }
      if (criteria.priceMax !== undefined && criteria.priceMax !== null && Number(criteria.priceMax) > 0) {
        filtered = filtered.filter(p => Number(p.price) <= Number(criteria.priceMax));
      }

      // Filter by availability
      if (criteria.inStock) {
        filtered = filtered.filter(p => p.inventory > 0);
      }

      return filtered;
    },

    sortProducts: function(products, sortBy) {
      const sorted = [...products];
      switch (sortBy) {
        case 'price-asc':
          sorted.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case 'price-desc':
          sorted.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case 'alpha-asc':
          sorted.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'alpha-desc':
          sorted.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'newest':
          sorted.sort((a, b) => Number(b.id) - Number(a.id));
          break;
        case 'featured':
        default:
          break;
      }
      return sorted;
    },

    getRelatedProducts: function(prodId, limit) {
      limit = limit || 4;
      const product = this.getProductById(prodId);
      if (!product) return this.getProducts().slice(0, limit);

      const all = this.getProducts().filter(p => String(p.id) !== String(prodId));
      // Prioritize same category, then same tags
      const scored = all.map(p => {
        let score = 0;
        if (p.category === product.category) score += 10;
        if (p.tags && product.tags) {
          p.tags.forEach(t => { if (product.tags.includes(t)) score += 3; });
        }
        if (p.vendor === product.vendor) score += 2;
        return { ...p, _score: score };
      });
      scored.sort((a, b) => b._score - a._score);
      return scored.slice(0, limit).map(p => { delete p._score; return p; });
    }
  };

  window.StoreData = StoreData;
})(window);
