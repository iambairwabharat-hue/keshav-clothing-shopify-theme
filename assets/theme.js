/**
 * KCCLOTHING THEME — COMPLETE INTERACTIVE SYSTEM
 * Variant Switching, Product Tabs, Collection Filters/Sort/Pagination,
 * Gallery Zoom/Lightbox, Size Guide Modal, Quantity Selector, Sticky ATC,
 * Reviews, Share, Live Search, Wishlist, and Luxury Ajax Side Cart Drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================
     1. ANNOUNCEMENT BAR CLOSE
     ========================================================== */
  const announcementBar = document.getElementById('announcement-bar');
  const announcementClose = document.getElementById('announcement-close');
  if (announcementBar && announcementClose) {
    announcementClose.addEventListener('click', () => {
      announcementBar.style.display = 'none';
    });
  }

  /* ==========================================================
     2. HEADER SCROLL & ANNOUNCEMENT BAR OFFSET CONTROLLER
     ========================================================== */
  const headerEl = document.getElementById('header') || document.querySelector('.header');
  const sectionHeaderEl = document.getElementById('shopify-section-header') || document.querySelector('.shopify-section-header') || document.querySelector('.shopify-section-group-header-group');
  const annBarEl = document.getElementById('shopify-section-announcement-bar') || document.querySelector('.shopify-section-announcement-bar') || document.querySelector('.announcement-bar');

  if (headerEl || sectionHeaderEl) {
    let isStickyActive = false;
    const handleHeaderScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        if (!isStickyActive) {
          isStickyActive = true;
          if (headerEl) headerEl.classList.add('header--is-sticky');
          if (sectionHeaderEl) sectionHeaderEl.classList.add('header--is-sticky');
        }
      } else {
        if (isStickyActive) {
          isStickyActive = false;
          if (headerEl) headerEl.classList.remove('header--is-sticky');
          if (sectionHeaderEl) sectionHeaderEl.classList.remove('header--is-sticky');
        }
      }

      // Calculate dynamic top offset so announcement bar is NOT covered at top of page
      const isStickyEnabled = headerEl ? headerEl.classList.contains('header--sticky') : true;
      if (isStickyEnabled) {
        let annHeight = 0;
        if (annBarEl && annBarEl.offsetHeight > 0 && window.getComputedStyle(annBarEl).display !== 'none') {
          annHeight = annBarEl.offsetHeight;
        }

        const topOffset = (annHeight > 0 && scrollY < annHeight) ? (annHeight - scrollY) : 0;
        const targetEl = sectionHeaderEl || headerEl;
        if (targetEl) {
          targetEl.style.top = `${topOffset}px`;
        }
      }
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    window.addEventListener('resize', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  /* ==========================================================
     3. MOBILE NAVIGATION DRAWER
     ========================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileClose = document.getElementById('mobile-close');

  const openMobileNav = () => {
    if (mobileNav) mobileNav.classList.add('mobile-nav--open');
    if (mobileBackdrop) mobileBackdrop.classList.add('mobile-backdrop--visible');
    document.body.classList.add('mobile-nav-active');
    document.body.style.overflow = 'hidden';
    if (mobileToggle) mobileToggle.style.opacity = '0';
  };
  const closeMobileNav = () => {
    if (mobileNav) mobileNav.classList.remove('mobile-nav--open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('mobile-backdrop--visible');
    document.body.classList.remove('mobile-nav-active');
    document.body.style.overflow = '';
    if (mobileToggle) mobileToggle.style.opacity = '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileNav);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileNav(); });

  /* ==========================================================
     4. SCROLL REVEAL ANIMATIONS
     ========================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal--visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('scroll-reveal--visible'));
  }

  /* ==========================================================
     5. PRODUCT DETAILS TABS (Dynamic Headings H2/H3/H4 Parser)
     ========================================================== */
  const initProductDetailsTabs = () => {
    const rawDesc = document.getElementById('product-raw-desc');
    const tabsNav = document.getElementById('product-details-tabs-nav');
    const panesContainer = document.getElementById('product-details-panes');
    if (!rawDesc || !tabsNav || !panesContainer) return;

    const rawHtml = rawDesc.innerHTML.trim();
    if (!rawHtml) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;

    // Helper to test if a node is a heading or section title
    const isHeadingNode = (node) => {
      if (node.nodeType !== 1) return false;
      const tag = node.tagName.toLowerCase();
      if (['h2', 'h3', 'h4', 'h5'].includes(tag)) return true;
      if (tag === 'p' && node.children.length === 1 && ['strong', 'b'].includes(node.children[0].tagName.toLowerCase())) {
        const text = node.textContent.trim();
        if (text.length > 0 && text.length < 50 && !text.endsWith('.')) return true;
      }
      return false;
    };

    const allChildren = Array.from(tempDiv.childNodes);
    const hasHeadings = allChildren.some(isHeadingNode);

    if (hasHeadings) {
      const tabs = [];
      let currentTab = null;

      allChildren.forEach((node) => {
        if (isHeadingNode(node)) {
          const title = node.textContent.trim();
          if (title.length > 0) {
            if (currentTab) tabs.push(currentTab);
            currentTab = {
              title: title,
              slug: 'tab-' + tabs.length,
              contentNodes: []
            };
          }
        } else if (currentTab) {
          currentTab.contentNodes.push(node.cloneNode(true));
        } else {
          // Content before first heading
          const text = node.textContent.trim();
          if (text.length > 0 || (node.nodeType === 1 && node.querySelector('img, video, iframe, table, ul, ol'))) {
            if (!currentTab) {
              currentTab = {
                title: 'Description',
                slug: 'tab-0',
                contentNodes: []
              };
            }
            currentTab.contentNodes.push(node.cloneNode(true));
          }
        }
      });

      if (currentTab) tabs.push(currentTab);

      if (tabs.length > 0) {
        let navHtml = '';
        let panesHtml = '';

        tabs.forEach((tab, index) => {
          const isActive = index === 0;
          navHtml += `<button type="button" class="tab-btn${isActive ? ' tab-btn--active' : ''}" data-tab="${tab.slug}">${tab.title}</button>`;

          const paneWrapper = document.createElement('div');
          tab.contentNodes.forEach((n) => paneWrapper.appendChild(n));
          panesHtml += `<div class="tab-pane${isActive ? ' tab-pane--active' : ''}" data-tab="${tab.slug}">
            <div class="product-description-content rte" style="font-size:15px;line-height:1.8;color:#374151;">
              ${paneWrapper.innerHTML}
            </div>
          </div>`;
        });

        tabsNav.innerHTML = navHtml;
        panesContainer.innerHTML = panesHtml;
      }
    } else {
      // If no headings found, only show 1 single clean tab
      tabsNav.innerHTML = `<button type="button" class="tab-btn tab-btn--active" data-tab="tab-0">Description</button>`;
      panesContainer.innerHTML = `<div class="tab-pane tab-pane--active" data-tab="tab-0">
        <div class="product-description-content rte" style="font-size:15px;line-height:1.8;color:#374151;">
          ${rawHtml}
        </div>
      </div>`;
    }
  };

  // Delegated click listener for product details tabs
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.product-details-section .tab-btn');
    if (!btn) return;
    e.preventDefault();
    const tabId = btn.getAttribute('data-tab');
    const section = btn.closest('.product-details-section');
    if (!section) return;

    section.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('tab-btn--active'));
    section.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('tab-pane--active'));

    btn.classList.add('tab-btn--active');
    const targetPane = section.querySelector(`.tab-pane[data-tab="${tabId}"]`);
    if (targetPane) targetPane.classList.add('tab-pane--active');
  });

  window.initProductDetailsTabs = initProductDetailsTabs;
  initProductDetailsTabs();

  /* ==========================================================
     6. PRODUCT VARIANT PICKER & LIVE PRICE/IMAGE SWITCHER
     ========================================================== */
  const handleVariantClick = (btn) => {
    const parentGroup = btn.closest('.variant-group');
    if (!parentGroup) return;

    const section = btn.closest('.product-main') || document.querySelector('.product-main');
    if (!section) return;

    // Toggle active state in this group
    parentGroup.querySelectorAll('.variant-option-btn, .color-swatch, .size-btn').forEach((b) => {
      b.classList.remove('is-active', 'color-swatch--active', 'size-btn--active');
    });
    btn.classList.add('is-active');
    if (btn.classList.contains('color-swatch')) btn.classList.add('color-swatch--active');
    if (btn.classList.contains('size-btn')) btn.classList.add('size-btn--active');

    // Update Label Value Text
    const optionIndex = btn.getAttribute('data-option-index') || (parentGroup.getAttribute('data-option-name') === 'Size' ? '1' : '0');
    const val = btn.getAttribute('data-value') || btn.getAttribute('data-color') || btn.getAttribute('data-size') || btn.textContent.trim();
    const labelVal = section.querySelector(`#option-${optionIndex}-label`) || parentGroup.querySelector('.variant-label__value');
    if (labelVal) labelVal.textContent = val;

    // Check if there's ProductJson script
    const variantScript = section.querySelector('script[id^="ProductJson-"]');
    let productData = null;
    if (variantScript) {
      try { productData = JSON.parse(variantScript.textContent); } catch (e) {}
    }

    const selectedVariantInput = section.querySelector('#selected-variant-id') || section.querySelector('input[name="id"]');
    const priceCurrent = section.querySelector('#product-price-current');
    const priceCompare = section.querySelector('#product-price-compare');
    const priceDiscount = section.querySelector('#product-price-discount');
    const addToCartBtn = section.querySelector('#add-to-cart');
    const addToCartText = section.querySelector('#add-to-cart-text') || (addToCartBtn ? addToCartBtn.querySelector('span') : null);
    const mainImg = section.querySelector('#gallery-main-img');

    const formatMoney = (cents) => {
      if (window.Shopify && Shopify.formatMoney) return Shopify.formatMoney(cents, window.theme?.moneyFormat || '${{amount}}');
      return 'Rs. ' + (cents / 100).toFixed(0);
    };

    if (productData && productData.variants && productData.variants.length > 0) {
      const selectedOptions = [];
      section.querySelectorAll('.variant-group').forEach((g) => {
        const activeBtn = g.querySelector('.is-active, .color-swatch--active, .size-btn--active');
        if (activeBtn) {
          selectedOptions.push(activeBtn.getAttribute('data-value') || activeBtn.getAttribute('data-color') || activeBtn.getAttribute('data-size') || activeBtn.textContent.trim());
        }
      });

      const matchedVariant = productData.variants.find((v) => {
        if (!v.options) return false;
        return selectedOptions.every((optVal, idx) => v.options[idx] === optVal || !v.options[idx]);
      }) || productData.variants[0];

      if (matchedVariant) {
        if (selectedVariantInput) selectedVariantInput.value = matchedVariant.id;
        if (priceCurrent && matchedVariant.price) priceCurrent.textContent = formatMoney(matchedVariant.price).replace('$', 'Rs. ');
        if (priceCompare && matchedVariant.compare_at_price) {
          if (matchedVariant.compare_at_price > matchedVariant.price) {
            priceCompare.textContent = formatMoney(matchedVariant.compare_at_price).replace('$', 'Rs. ');
            priceCompare.classList.remove('is-hidden');
            priceCompare.style.display = 'inline';
            if (priceDiscount) {
              const disc = Math.round(((matchedVariant.compare_at_price - matchedVariant.price) / matchedVariant.compare_at_price) * 100);
              priceDiscount.textContent = `${disc}% OFF`;
              priceDiscount.classList.remove('is-hidden');
              priceDiscount.style.display = 'inline-block';
            }
          } else {
            priceCompare.classList.add('is-hidden');
            priceCompare.style.display = 'none';
            if (priceDiscount) {
              priceDiscount.classList.add('is-hidden');
              priceDiscount.style.display = 'none';
            }
          }
        }
        if (addToCartBtn) {
          addToCartBtn.disabled = matchedVariant.available === false;
          if (addToCartText) addToCartText.textContent = matchedVariant.available !== false ? 'Add to Cart' : 'Sold Out';
        }
        if (matchedVariant.featured_image && matchedVariant.featured_image.src && mainImg) {
          mainImg.src = matchedVariant.featured_image.src;
          const thumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
          const matchIdx = thumbs.findIndex((t) => {
            const src = t.getAttribute('data-src') || '';
            return src.includes(matchedVariant.featured_image.src.split('?')[0]);
          });
          if (matchIdx >= 0 && typeof window.galleryGoToSlide === 'function') {
            window.galleryGoToSlide(matchIdx);
          }
        }
      }
    }
  };

  // Delegated click listener on document for all variant buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.variant-option-btn, .color-swatch, .size-btn');
    if (btn) {
      e.preventDefault();
      handleVariantClick(btn);
    }
  });

  window.handleVariantClick = handleVariantClick;

  /* ==========================================================
     7. PRODUCT GALLERY CAROUSEL (SWIPE, ARROWS, THUMBNAILS & PRELOAD)
     ========================================================== */
  const initProductGallery = () => {
    const thumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
    const mainImg = document.getElementById('gallery-main-img');
    const galleryMain = document.getElementById('gallery-main');
    const prevBtn = document.getElementById('gallery-prev-btn');
    const nextBtn = document.getElementById('gallery-next-btn');
    const counterCurrent = document.getElementById('gallery-counter-current');
    const counterTotal = document.getElementById('gallery-counter-total');

    if (!mainImg) return;

    let currentIndex = 0;

    // Find initial active index
    if (thumbs.length > 0) {
      const activeIdx = thumbs.findIndex((t) => t.classList.contains('gallery-thumb--active'));
      if (activeIdx >= 0) currentIndex = activeIdx;
      if (counterTotal) counterTotal.textContent = thumbs.length;
    }

    // Preload full size images in browser memory immediately
    thumbs.forEach((thumb) => {
      const src = thumb.getAttribute('data-src');
      if (src) {
        const preloadImg = new Image();
        preloadImg.src = src;
      }
    });

    const goToSlide = (index, smooth = true) => {
      if (thumbs.length === 0) return;
      if (index < 0) index = thumbs.length - 1;
      if (index >= thumbs.length) index = 0;

      currentIndex = index;
      const targetThumb = thumbs[currentIndex];
      if (!targetThumb) return;

      thumbs.forEach((t, i) => {
        t.classList.toggle('gallery-thumb--active', i === currentIndex);
      });

      const newSrc = targetThumb.getAttribute('data-src') || (targetThumb.querySelector('img') ? targetThumb.querySelector('img').src : null);
      if (newSrc && mainImg.src !== newSrc) {
        mainImg.style.opacity = '0.7';
        mainImg.src = newSrc;
        setTimeout(() => {
          mainImg.style.opacity = '1';
        }, 120);
      }

      if (counterCurrent) {
        counterCurrent.textContent = (currentIndex + 1);
      }

      // Smooth scroll the thumbnail row to center the active thumbnail
      const galleryThumbs = document.getElementById('gallery-thumbs');
      if (galleryThumbs && targetThumb) {
        const thumbLeft = targetThumb.offsetLeft;
        const thumbWidth = targetThumb.offsetWidth;
        const containerWidth = galleryThumbs.clientWidth;
        const scrollTarget = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
        galleryThumbs.scrollTo({
          left: Math.max(0, scrollTarget),
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    };

    // Attach click listener to thumbs
    thumbs.forEach((thumb, idx) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
      });
    });

    // Arrow navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    // Touch swipe gestures on main image container
    if (galleryMain && thumbs.length > 1) {
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;
      let isSwiping = false;

      galleryMain.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchEndX = touchStartX;
        touchEndY = touchStartY;
        isSwiping = true;
      }, { passive: true });

      galleryMain.addEventListener('touchmove', (e) => {
        if (!isSwiping || !e.touches || e.touches.length !== 1) return;
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
      }, { passive: true });

      galleryMain.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // If horizontal swipe is dominant and exceeds threshold (35px)
        if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
          if (diffX < 0) {
            // Swiped left -> next
            goToSlide(currentIndex + 1);
          } else {
            // Swiped right -> prev
            goToSlide(currentIndex - 1);
          }
        }
      }, { passive: true });
    }

    // Expose for external calls (e.g. variant change)
    window.galleryGoToSlide = goToSlide;
  };
  initProductGallery();

  /* ==========================================================
     8. GALLERY ZOOM / LIGHTBOX MODAL
     ========================================================== */
  const initGalleryZoom = () => {
    const zoomBtn = document.querySelector('.gallery-zoom');
    const galleryMain = document.getElementById('gallery-main-img');
    if (!galleryMain) return;

    const openLightbox = () => {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox-overlay';
      lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <img src="${galleryMain.src}" alt="Product zoom" class="lightbox-img">
      `;
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => lightbox.classList.add('lightbox-overlay--active'));

      const close = () => {
        lightbox.classList.remove('lightbox-overlay--active');
        setTimeout(() => { lightbox.remove(); document.body.style.overflow = ''; }, 300);
      };
      lightbox.querySelector('.lightbox-close').addEventListener('click', close);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
      document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
    };

    if (zoomBtn) zoomBtn.addEventListener('click', openLightbox);
    const mainWrap = document.getElementById('gallery-main');
    if (mainWrap) {
      mainWrap.addEventListener('click', (e) => {
        if (e.target.closest('.gallery-nav-btn, .gallery-zoom, #gallery-prev-btn, #gallery-next-btn')) return;
        if (window.innerWidth > 768) {
          openLightbox();
        }
      });
      if (window.innerWidth > 768) {
        galleryMain.style.cursor = 'zoom-in';
      }
    }
  };
  initGalleryZoom();

  /* ==========================================================
  /* ==========================================================
     9. SIZE GUIDE MODAL
     Handled directly by #size-chart-modal in main-product.liquid
     (Signature Fit & Oversized Fit)
     ========================================================== */
  const initSizeGuide = () => {
    // Left empty: #size-chart-modal in main-product.liquid handles all [data-size-guide] and .size-guide-trigger clicks
  };
  initSizeGuide();


  /* ==========================================================
     10. QUANTITY SELECTOR
     ========================================================== */
  const initQuantitySelector = () => {
    const qtyContainer = document.getElementById('qty-selector');
    if (!qtyContainer) return;

    const minusBtn = qtyContainer.querySelector('[data-qty-minus]');
    const plusBtn = qtyContainer.querySelector('[data-qty-plus]');
    const qtyInput = qtyContainer.querySelector('[data-qty-value]');
    if (!minusBtn || !plusBtn || !qtyInput) return;

    minusBtn.addEventListener('click', () => {
      let val = parseInt(qtyInput.value || qtyInput.textContent) || 1;
      if (val > 1) { val--; }
      if (qtyInput.tagName === 'INPUT') qtyInput.value = val; else qtyInput.textContent = val;
    });
    plusBtn.addEventListener('click', () => {
      let val = parseInt(qtyInput.value || qtyInput.textContent) || 1;
      val++;
      if (qtyInput.tagName === 'INPUT') qtyInput.value = val; else qtyInput.textContent = val;
    });
  };
  initQuantitySelector();

  /* ==========================================================
     11. STICKY ADD-TO-CART BAR
     ========================================================== */
  const initStickyATC = () => {
    const mainATC = document.getElementById('add-to-cart');
    const stickyBar = document.getElementById('sticky-atc-bar');
    if (!mainATC || !stickyBar) return;

    const obs = new IntersectionObserver(([entry]) => {
      stickyBar.classList.toggle('sticky-atc--visible', !entry.isIntersecting);
    }, { threshold: 0 });
    obs.observe(mainATC);

    const stickyBtn = stickyBar.querySelector('.sticky-atc-btn');
    if (stickyBtn) {
      stickyBtn.addEventListener('click', () => mainATC.click());
    }
  };
  initStickyATC();

  /* ==========================================================
     12. SOCIAL SHARE BUTTONS
     ========================================================== */
  const initShareButtons = () => {
    document.querySelectorAll('[data-share]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = btn.getAttribute('data-share');
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const shareUrls = {
          'whatsapp': `https://wa.me/?text=${title}%20${url}`,
          'twitter': `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
          'pinterest': `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
          'facebook': `https://www.facebook.com/sharer/sharer.php?u=${url}`
        };
        if (platform === 'copy') {
          navigator.clipboard.writeText(window.location.href).then(() => {
            btn.textContent = '✓ Copied!';
            setTimeout(() => { btn.textContent = 'Copy Link'; }, 2000);
          });
        } else if (shareUrls[platform]) {
          window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
      });
    });
  };
  initShareButtons();

  /* ==========================================================
     13. COLLECTION MANAGER (Filters, Sort, Grid, Pagination)
     ========================================================== */
  const initCollectionManager = () => {
    const collectionGrid = document.getElementById('collection-grid');
    if (!collectionGrid || !window.StoreData) return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get('category') || 'all';

    let state = {
      category: urlCategory,
      categories: [],
      colors: [],
      sizes: [],
      priceMin: null,
      priceMax: null,
      inStock: false,
      sortBy: 'featured',
      gridCols: 3,
      page: 1,
      perPage: 12
    };

    const allProducts = StoreData.getProducts();

    // DOM refs
    const sortSelect = document.getElementById('sort-by');
    const filterTrigger = document.getElementById('filter-trigger');
    const filterSidebar = document.getElementById('filter-sidebar');
    const filterClose = document.getElementById('filter-close');
    const productCounter = document.querySelector('.toolbar-counter');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const progressFill = document.getElementById('progress-bar-fill');
    const activePills = document.getElementById('active-filter-pills') || document.querySelector('.active-filters');
    const gridBtns = document.querySelectorAll('.grid-view-btn, [data-grid-cols]');
    const clearAllBtn = document.querySelector('[data-clear-filters]');

    // Collection Hero dynamic
    const collections = StoreData.getCollections();
    const matchedCol = collections.find(c => c.handle === urlCategory || c.handle.toLowerCase() === urlCategory.toLowerCase());
    if (matchedCol) {
      document.title = matchedCol.title + ' — KCCLOTHING';
      const heroTitle = document.querySelector('.collection-hero__title');
      const heroDesc = document.querySelector('.collection-hero__desc');
      const heroBg = document.querySelector('.collection-hero__bg img');
      const breadcrumbSpan = document.querySelector('.breadcrumbs span:last-child');
      if (heroTitle) heroTitle.textContent = matchedCol.title;
      if (heroDesc) heroDesc.textContent = matchedCol.description;
      if (heroBg && matchedCol.image) heroBg.src = matchedCol.image;
      if (breadcrumbSpan) breadcrumbSpan.textContent = matchedCol.title;
    }

    // Render product card HTML
    const renderCard = (p) => {
      const isWished = Wishlist.has(p.id);
      const swatches = (p.colors || []).map(c => `<div class="card-swatch-dot" style="background:#52525b;" title="${c}"></div>`).join('');
      const compareHtml = p.compare_at_price > p.price ? `<span class="product-card__compare-price">Rs. ${Number(p.compare_at_price).toFixed(2)}</span>` : '';
      const badge = (p.tags && p.tags[0]) ? p.tags[0] : 'New Drop';
      const mediaList = (p.media && p.media.length > 0) ? p.media : [p.image];
      const encodedImages = JSON.stringify(mediaList).replace(/"/g, '&quot;');
      const scrubBars = mediaList.length > 1 ? `
        <div class="card-scrub-indicators">
          ${mediaList.map((_, idx) => `<span class="card-scrub-bar ${idx === 0 ? 'is-active' : ''}"></span>`).join('')}
        </div>
      ` : '';

      const sizes = (p.sizes && p.sizes.length > 0) ? p.sizes : ['S', 'M', 'L', 'XL', 'XXL'];
      const sizeButtons = sizes.map(sz => `
        <button type="button" class="quick-size-btn" data-product-id="${p.id}" data-product-title="${p.title.replace(/"/g, '&quot;')}" data-size="${sz}" data-price="${p.price}" data-image="${p.image}">${sz}</button>
      `).join('');

      return `
        <div class="product-card scroll-reveal scroll-reveal--visible" data-product-id="${p.id}" data-price="${p.price}">
          <div class="product-card__image-wrap" data-images="${encodedImages}">
            <a href="product.html?id=${p.id}" class="product-card__image-link" style="display:block;width:100%;height:100%;">
              <img src="${p.image}" alt="${p.title}" class="product-card__image" loading="lazy">
            </a>
            ${scrubBars}
            <span class="product-card__badge">${badge}</span>
            <button class="product-card__wishlist ${isWished ? 'product-card__wishlist--active' : ''}" data-wishlist-toggle="${p.id}" aria-label="Wishlist" onclick="event.preventDefault();event.stopPropagation();">
              <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="${isWished ? 'currentColor' : 'none'}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            <button type="button" class="product-card__quick-add" data-card-quick-toggle="${p.id}">+ Quick Add</button>

            <!-- In-Card Quick Add Variant Overlay -->
            <div class="card-quick-overlay" id="quick-overlay-${p.id}">
              <div class="card-quick-overlay__header">
                <span class="card-quick-overlay__title">Select Size</span>
                <button type="button" class="card-quick-overlay__close" data-close-overlay aria-label="Close">&times;</button>
              </div>
              <div class="card-quick-overlay__sizes">
                ${sizeButtons}
              </div>
            </div>
          </div>
          <div class="product-card__info">
            <a href="product.html?id=${p.id}" class="product-card__title-link"><h3 class="product-card__title">${p.title}</h3></a>
            <div class="product-card__price">
              ${compareHtml}
              <span class="product-card__current-price">Rs. ${Number(p.price).toFixed(2)}</span>
            </div>
            <div class="product-card__swatches">${swatches}</div>
          </div>
        </div>
      `;
    };

    // Main render function
    const render = () => {
      let products = [...allProducts];

      // Apply collection filter from URL
      if (state.category && state.category !== 'all') {
        const col = StoreData.getCollectionById(state.category);
        if (col && col.product_ids) {
          products = products.filter(p => col.product_ids.includes(p.id));
        }
      }

      // Apply facet filters
      products = StoreData.filterProducts(products, {
        categories: state.categories,
        colors: state.colors,
        sizes: state.sizes,
        priceMin: state.priceMin,
        priceMax: state.priceMax,
        inStock: state.inStock
      });

      // Sort
      products = StoreData.sortProducts(products, state.sortBy);

      const total = products.length;
      const visible = products.slice(0, state.page * state.perPage);

      // Render grid
      collectionGrid.innerHTML = visible.map(renderCard).join('');
      collectionGrid.className = `collection-grid collection-grid--${state.gridCols}col`;

      // Update counter
      if (productCounter) productCounter.textContent = `Showing ${visible.length} of ${total} pieces`;

      // Progress bar
      if (progressFill) progressFill.style.width = total > 0 ? `${Math.round((visible.length / total) * 100)}%` : '0%';

      // Load more button
      if (loadMoreBtn) loadMoreBtn.style.display = visible.length < total ? 'inline-flex' : 'none';

      // Bind quick add buttons
      collectionGrid.querySelectorAll('[data-quick-add]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const prodId = btn.getAttribute('data-quick-add');
          const prod = StoreData.getProductById(prodId);
          if (prod && window.SideCart) {
            SideCart.addItem({
              id: prod.id, title: prod.title, price: prod.price,
              image: prod.image, color: prod.colors?.[0] || 'Standard', size: prod.sizes?.[0] || 'M'
            });
          }
        });
      });

      // Bind wishlist buttons
      collectionGrid.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = btn.getAttribute('data-wishlist-toggle');
          Wishlist.toggle(id);
          render();
        });
      });

      renderActivePills();
    };

    // Active filter pills
    const renderActivePills = () => {
      if (!activePills) return;
      let html = '';
      state.categories.forEach(c => { html += `<span class="filter-pill">${c} <button data-remove-filter="category" data-value="${c}">&times;</button></span>`; });
      state.colors.forEach(c => { html += `<span class="filter-pill">${c} <button data-remove-filter="color" data-value="${c}">&times;</button></span>`; });
      state.sizes.forEach(s => { html += `<span class="filter-pill">Size ${s} <button data-remove-filter="size" data-value="${s}">&times;</button></span>`; });
      if (state.inStock) html += `<span class="filter-pill">In Stock <button data-remove-filter="inStock">&times;</button></span>`;
      if (state.priceMin || state.priceMax) html += `<span class="filter-pill">Rs. ${state.priceMin || 0}-Rs. ${state.priceMax || '∞'} <button data-remove-filter="price">&times;</button></span>`;
      if (html) html += `<button class="filter-pill filter-pill--clear" data-clear-filters>Clear All</button>`;
      activePills.innerHTML = html;

      activePills.querySelectorAll('[data-remove-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.getAttribute('data-remove-filter');
          const val = btn.getAttribute('data-value');
          if (type === 'category') state.categories = state.categories.filter(c => c !== val);
          else if (type === 'color') state.colors = state.colors.filter(c => c !== val);
          else if (type === 'size') state.sizes = state.sizes.filter(s => s !== val);
          else if (type === 'inStock') state.inStock = false;
          else if (type === 'price') { state.priceMin = null; state.priceMax = null; }
          state.page = 1;
          syncSidebarUI();
          render();
        });
      });
      activePills.querySelectorAll('[data-clear-filters]').forEach(btn => {
        btn.addEventListener('click', () => {
          state.categories = []; state.colors = []; state.sizes = [];
          state.priceMin = null; state.priceMax = null; state.inStock = false;
          state.page = 1;
          syncSidebarUI();
          render();
        });
      });
    };

    // Sync sidebar checkboxes/chips to state
    const syncSidebarUI = () => {
      if (!filterSidebar) return;
      filterSidebar.querySelectorAll('input[data-filter-category]').forEach(cb => { cb.checked = state.categories.includes(cb.value); });
      filterSidebar.querySelectorAll('[data-filter-color]').forEach(chip => { chip.classList.toggle('is-active', state.colors.includes(chip.getAttribute('data-filter-color'))); });
      filterSidebar.querySelectorAll('[data-filter-size]').forEach(chip => { chip.classList.toggle('is-active', state.sizes.includes(chip.getAttribute('data-filter-size'))); });
      const priceMin = filterSidebar.querySelector('#filter-price-min');
      const priceMax = filterSidebar.querySelector('#filter-price-max');
      if (priceMin) priceMin.value = state.priceMin || '';
      if (priceMax) priceMax.value = state.priceMax || '';
      const inStockCb = filterSidebar.querySelector('#filter-in-stock');
      if (inStockCb) inStockCb.checked = state.inStock;
    };

    // Bind sidebar filter events
    if (filterSidebar) {
      filterSidebar.querySelectorAll('input[data-filter-category]').forEach(cb => {
        cb.addEventListener('change', () => {
          if (cb.checked) { if (!state.categories.includes(cb.value)) state.categories.push(cb.value); }
          else { state.categories = state.categories.filter(c => c !== cb.value); }
          state.page = 1; render();
        });
      });

      filterSidebar.querySelectorAll('[data-filter-color]').forEach(chip => {
        chip.addEventListener('click', () => {
          const color = chip.getAttribute('data-filter-color');
          if (state.colors.includes(color)) state.colors = state.colors.filter(c => c !== color);
          else state.colors.push(color);
          chip.classList.toggle('is-active');
          state.page = 1; render();
        });
      });

      filterSidebar.querySelectorAll('[data-filter-size]').forEach(chip => {
        chip.addEventListener('click', () => {
          const size = chip.getAttribute('data-filter-size');
          if (state.sizes.includes(size)) state.sizes = state.sizes.filter(s => s !== size);
          else state.sizes.push(size);
          chip.classList.toggle('is-active');
          state.page = 1; render();
        });
      });

      const priceMin = filterSidebar.querySelector('#filter-price-min');
      const priceMax = filterSidebar.querySelector('#filter-price-max');
      const applyPrice = () => {
        state.priceMin = priceMin && priceMin.value ? Number(priceMin.value) : null;
        state.priceMax = priceMax && priceMax.value ? Number(priceMax.value) : null;
        state.page = 1; render();
      };
      if (priceMin) priceMin.addEventListener('change', applyPrice);
      if (priceMax) priceMax.addEventListener('change', applyPrice);

      const inStockCb = filterSidebar.querySelector('#filter-in-stock');
      if (inStockCb) {
        inStockCb.addEventListener('change', () => { state.inStock = inStockCb.checked; state.page = 1; render(); });
      }
    }

    // Sort dropdown
    if (sortSelect) {
      sortSelect.addEventListener('change', () => { state.sortBy = sortSelect.value; state.page = 1; render(); });
    }

    // Grid view switcher
    gridBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cols = parseInt(btn.getAttribute('data-grid-cols') || btn.getAttribute('data-cols'));
        if (cols) {
          state.gridCols = cols;
          gridBtns.forEach(b => b.classList.remove('grid-view-btn--active'));
          btn.classList.add('grid-view-btn--active');
          render();
        }
      });
    });

    // Load more
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => { state.page++; render(); });
    }

    // Mobile filter sidebar toggle
    if (filterTrigger && filterSidebar) {
      filterTrigger.addEventListener('click', () => { filterSidebar.classList.toggle('filter-sidebar--open'); });
    }
    if (filterClose && filterSidebar) {
      filterClose.addEventListener('click', () => { filterSidebar.classList.remove('filter-sidebar--open'); });
    }

    // Clear All button (standalone)
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        state.categories = []; state.colors = []; state.sizes = [];
        state.priceMin = null; state.priceMax = null; state.inStock = false;
        state.page = 1; syncSidebarUI(); render();
      });
    }

    // Initial render
    render();
  };
  initCollectionManager();

  /* ==========================================================
     14. LIVE SEARCH MODAL
     ========================================================== */
  const initSearchModal = () => {
    const searchBtns = document.querySelectorAll('.header-icon[aria-label="Search"], button[aria-label="Search"]');
    if (searchBtns.length === 0 || !window.StoreData) return;

    // Create search modal
    let searchModal = document.getElementById('search-modal');
    if (!searchModal) {
      searchModal = document.createElement('div');
      searchModal.id = 'search-modal';
      searchModal.className = 'search-modal';
      searchModal.innerHTML = `
        <div class="search-modal__backdrop"></div>
        <div class="search-modal__container">
          <div class="search-modal__header">
            <input type="text" class="search-modal__input" placeholder="Search products..." autocomplete="off" id="search-input">
            <button class="search-modal__close" aria-label="Close search">&times;</button>
          </div>
          <div class="search-modal__results" id="search-results"></div>
        </div>
      `;
      document.body.appendChild(searchModal);
    }

    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    const openSearch = () => {
      searchModal.classList.add('search-modal--active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput.focus(), 100);
    };
    const closeSearch = () => {
      searchModal.classList.remove('search-modal--active');
      document.body.style.overflow = '';
      searchInput.value = '';
      searchResults.innerHTML = '';
    };

    searchBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openSearch(); }));
    searchModal.querySelector('.search-modal__backdrop').addEventListener('click', closeSearch);
    searchModal.querySelector('.search-modal__close').addEventListener('click', closeSearch);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && searchModal.classList.contains('search-modal--active')) closeSearch(); });

    let debounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const q = searchInput.value.trim();
        if (!q) { searchResults.innerHTML = '<p class="search-modal__empty">Start typing to search...</p>'; return; }
        const results = StoreData.searchProducts(q);
        if (results.length === 0) {
          searchResults.innerHTML = `<p class="search-modal__empty">No products found for "${q}"</p>`;
        } else {
          searchResults.innerHTML = results.map(p => `
            <a href="product.html?id=${p.id}" class="search-result-item">
              <img src="${p.image}" alt="${p.title}" class="search-result-item__img">
              <div class="search-result-item__info">
                <div class="search-result-item__title">${p.title}</div>
                <div class="search-result-item__price">Rs. ${Number(p.price).toFixed(2)}</div>
              </div>
            </a>
          `).join('');
        }
      }, 200);
    });
  };
  initSearchModal();

  /* ==========================================================
  /* ==========================================================
     15. WISHLIST / SAVED FAVORITES SYSTEM (ROCK SOLID)
     ========================================================== */
  const WISHLIST_KEY = 'nevermind_wishlist';

  const Wishlist = {
    _ids: [],
    
    init() {
      try {
        const stored = localStorage.getItem(WISHLIST_KEY);
        this._ids = stored ? JSON.parse(stored).map(String) : [];
      } catch (e) {
        this._ids = [];
      }
      this.syncUI();
      this.bindGlobalEvents();
    },

    save() {
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(this._ids));
      } catch (e) {}
      this.syncUI();
      if (typeof renderAccountFavorites === 'function') {
        renderAccountFavorites();
      }
    },

    has(id) {
      if (!id) return false;
      return this._ids.includes(String(id));
    },

    add(id) {
      id = String(id);
      if (!this._ids.includes(id)) {
        this._ids.push(id);
        this.save();
        if (window.showToast) window.showToast('Added to Saved Favorites ❤️');
      }
    },

    remove(id) {
      id = String(id);
      this._ids = this._ids.filter(i => i !== id);
      this.save();
      if (window.showToast) window.showToast('Removed from Saved Favorites');
    },

    toggle(id) {
      if (!id) return;
      id = String(id);
      if (this.has(id)) {
        this.remove(id);
      } else {
        this.add(id);
      }
    },

    syncUI() {
      const ids = this._ids;
      
      // Update count badges
      document.querySelectorAll('.wishlist-count, .favorites-count').forEach(el => {
        el.textContent = ids.length;
        if (el.classList.contains('wishlist-count')) {
          el.style.display = ids.length > 0 ? 'flex' : 'none';
        }
      });
      const accountBadge = document.getElementById('account-favs-badge');
      if (accountBadge) {
        accountBadge.textContent = `${ids.length} Piece${ids.length === 1 ? '' : 's'}`;
      }

      // Update all wishlist buttons on the page
      document.querySelectorAll('[data-wishlist-toggle], .product-card__wishlist, .btn-wishlist, #wishlist-btn').forEach(btn => {
        let btnId = btn.getAttribute('data-wishlist-toggle');
        if (!btnId) {
          const card = btn.closest('.product-card, .farak-card, [data-product-id]');
          if (card) {
            btnId = card.getAttribute('data-product-id') || card.getAttribute('data-id');
          }
        }
        if (!btnId && window.currentProduct) {
          btnId = window.currentProduct.id;
        }

        if (btnId) {
          const isActive = ids.includes(String(btnId));
          btn.classList.toggle('product-card__wishlist--active', isActive);
          btn.classList.toggle('btn-wishlist--active', isActive);
          const svg = btn.querySelector('svg');
          if (svg) {
            svg.style.fill = isActive ? '#dc2626' : 'none';
            svg.style.stroke = isActive ? '#dc2626' : 'currentColor';
          }
        }
      });
    },

    bindGlobalEvents() {
      if (this._eventsBound) return;
      this._eventsBound = true;

      // Global capture-phase listener: intercepts ANY heart button click anywhere
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-wishlist-toggle], .product-card__wishlist, .btn-wishlist, #wishlist-btn');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        let id = btn.getAttribute('data-wishlist-toggle');
        if (!id) {
          const card = btn.closest('.product-card, .farak-card, [data-product-id]');
          if (card) {
            id = card.getAttribute('data-product-id') || card.getAttribute('data-id');
          }
        }
        if (!id && window.currentProduct) {
          id = window.currentProduct.id;
        }

        if (id) {
          this.toggle(id);
        }
      }, true); // TRUE = capture phase, so it ALWAYS runs before anything can stopPropagation!
    },

    getItems() {
      if (!window.StoreData) return [];
      return this._ids.map(id => StoreData.getProductById(id)).filter(Boolean);
    }
  };

  window.Wishlist = Wishlist;
  Wishlist.init();

  /* ==========================================================
  /* ==========================================================
     16. LUXURY AJAX SIDE CART DRAWER SYSTEM
     ========================================================== */
  const FREE_SHIPPING_THRESHOLD = 9900;
  const CART_STORAGE_KEY = 'nevermind_cart_items';

  const SideCart = {
    items: [],

    init() {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) this.items = JSON.parse(saved);
      } catch (e) { this.items = []; }
      this.bindEvents();
      this.syncShopify();
      this.render();
    },

    save() {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
      } catch (e) {}
      this.render();
    },

    syncShopify() {
      fetch('/cart.js')
        .then(res => {
          if (!res.ok) throw new Error('Not Shopify runtime');
          return res.json();
        })
        .then(cart => {
          if (cart && Array.isArray(cart.items) && cart.items.length > 0) {
            this.items = cart.items.map(i => ({
              id: i.variant_id || i.id,
              key: i.key,
              title: i.product_title || i.title,
              price: (i.price / 100).toFixed(2),
              image: i.image || i.featured_image?.url || '',
              color: (i.variant_options && i.variant_options[0]) || 'Standard',
              size: (i.variant_options && i.variant_options[1]) || i.variant_title || 'M',
              quantity: i.quantity
            }));
            this.save();
          }
        })
        .catch(() => {});
    },

    open() {
      const backdrop = document.getElementById('side-cart-backdrop');
      const drawer = document.getElementById('side-cart-drawer');
      if (backdrop) backdrop.classList.add('side-cart-backdrop--active');
      if (drawer) {
        drawer.classList.add('side-cart-drawer--open');
        drawer.setAttribute('aria-hidden', 'false');
      }
      document.body.style.overflow = 'hidden';
      this.syncShopify();
    },

    close() {
      const backdrop = document.getElementById('side-cart-backdrop');
      const drawer = document.getElementById('side-cart-drawer');
      if (backdrop) backdrop.classList.remove('side-cart-backdrop--active');
      if (drawer) {
        drawer.classList.remove('side-cart-drawer--open');
        drawer.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    },

    addItem(newItem) {
      const existing = this.items.find(i => String(i.id) === String(newItem.id) && i.color === newItem.color && i.size === newItem.size);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + (newItem.quantity || 1);
      } else {
        this.items.push({
          id: newItem.id,
          title: newItem.title,
          price: newItem.price,
          image: newItem.image,
          color: newItem.color || 'Standard',
          size: newItem.size || 'M',
          quantity: newItem.quantity || 1
        });
      }
      this.save();
      this.open();
    },

    addShopifyItem(variantId, details) {
      // 1. Instant optimistic add to local drawer
      this.addItem({
        id: variantId || details.id || Date.now(),
        title: details.title || 'Streetwear Piece',
        price: details.price || 59.99,
        image: details.image || '',
        color: details.color || 'Standard',
        size: details.size || 'M',
        quantity: details.quantity || 1
      });

      if (window.showToast) {
        window.showToast(`Added to Bag: ${details.title || 'Item'} (${details.size || 'M'})`);
      }

      // 2. Post to Shopify Ajax Cart API
      if (variantId) {
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: details.quantity || 1 })
        })
        .then(r => r.json())
        .then(() => {
          this.syncShopify();
        })
        .catch(err => {
          console.warn('Shopify Cart Add notice:', err);
        });
      }
    },

    updateQty(index, delta) {
      if (!this.items[index]) return;
      const item = this.items[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        this.removeItem(index);
        return;
      }
      item.quantity = newQty;
      this.save();

      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: String(item.key || item.id), quantity: newQty })
      }).then(() => this.syncShopify()).catch(() => {});
    },

    removeItem(index) {
      if (!this.items[index]) return;
      const item = this.items[index];
      this.items.splice(index, 1);
      this.save();

      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: String(item.key || item.id), quantity: 0 })
      }).then(() => this.syncShopify()).catch(() => {});
    },

    render() {
      const countBadges = document.querySelectorAll('.cart-count, #side-cart-badge-count');
      const itemsList = document.getElementById('side-cart-items-list');
      const emptyState = document.getElementById('side-cart-empty');
      const footer = document.getElementById('side-cart-footer');
      const subtotalEl = document.getElementById('side-cart-subtotal');
      const shippingText = document.getElementById('side-cart-shipping-text');
      const shippingBar = document.getElementById('side-cart-shipping-bar');

      const totalCount = this.items.reduce((sum, i) => sum + (i.quantity || 1), 0);
      const subtotal = this.items.reduce((sum, i) => sum + ((Number(i.price) || 0) * (i.quantity || 1)), 0);

      countBadges.forEach((el) => {
        el.textContent = totalCount;
        if (el.classList.contains('cart-count')) el.style.display = totalCount > 0 ? 'flex' : 'none';
      });

      if (shippingText && shippingBar) {
        if (subtotal >= FREE_SHIPPING_THRESHOLD) {
          shippingText.innerHTML = `🎉 <strong>You've unlocked FREE Shipping!</strong>`;
          shippingBar.style.width = '100%';
          shippingBar.classList.add('side-cart-shipping-bar--unlocked');
        } else {
          const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
          const percent = Math.min(Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100), 99);
          shippingText.innerHTML = `Add <strong>Rs. ${remaining}</strong> more for <strong>FREE Worldwide Shipping</strong>`;
          shippingBar.style.width = `${percent}%`;
          shippingBar.classList.remove('side-cart-shipping-bar--unlocked');
        }
      }

      if (this.items.length === 0) {
        if (itemsList) itemsList.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (footer) footer.style.display = 'none';
      } else {
        if (emptyState) emptyState.style.display = 'none';
        if (footer) footer.style.display = 'block';
        if (subtotalEl) subtotalEl.textContent = 'Rs. ' + subtotal.toFixed(2);

        if (itemsList) {
          itemsList.innerHTML = this.items.map((item, idx) => `
            <div class="side-cart-item">
              <div class="side-cart-item__thumb"><img src="${item.image}" alt="${item.title}"></div>
              <div class="side-cart-item__info">
                <div>
                  <div class="side-cart-item__top">
                    <a href="${item.url || '/products/' + (item.prodId || item.id)}" class="side-cart-item__title">${item.title}</a>
                    <button type="button" class="side-cart-item-remove" onclick="window.SideCart.removeItem(${idx})" aria-label="Remove">Remove</button>
                  </div>
                  <div class="side-cart-item__variant">${item.color} / ${item.size}</div>
                </div>
                <div class="side-cart-item__bottom">
                  <div class="side-cart-qty">
                    <button type="button" class="side-cart-qty-btn" onclick="window.SideCart.updateQty(${idx}, -1)">−</button>
                    <span class="side-cart-qty-val">${item.quantity}</span>
                    <button type="button" class="side-cart-qty-btn" onclick="window.SideCart.updateQty(${idx}, 1)">+</button>
                  </div>
                  <div class="side-cart-item__price">Rs. ${(Number(item.price) * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            </div>
          `).join('');
        }
      }

      // Update sticky ATC bar price if present
      const stickyPrice = document.querySelector('.sticky-atc-price');
      if (stickyPrice) {
        const pdpPrice = document.getElementById('product-price-current');
        if (pdpPrice) stickyPrice.textContent = pdpPrice.textContent;
      }
    },

    bindEvents() {
      const backdrop = document.getElementById('side-cart-backdrop');
      const drawer = document.getElementById('side-cart-drawer');
      const closeBtn = document.getElementById('side-cart-close');

      document.querySelectorAll('.header-action-btn--cart, .header-icon--cart, [data-cart-trigger]').forEach((btn) => {
        btn.addEventListener('click', (e) => { e.preventDefault(); this.open(); });
      });

      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (backdrop) backdrop.addEventListener('click', () => this.close());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('side-cart-drawer--open')) this.close();
      });

      // Product page Add to Cart form handler
      const atcButton = document.getElementById('add-to-cart');
      if (atcButton) {
        atcButton.addEventListener('click', (e) => {
          e.preventDefault();
          if (atcButton.disabled) return;
          const form = atcButton.closest('form');
          const variantInput = form ? form.querySelector('[name="id"]') : null;
          const variantId = variantInput ? variantInput.value : null;

          const title = document.getElementById('product-title')?.textContent?.trim() || 'Product';
          const priceStr = document.getElementById('product-price-current')?.textContent?.replace(/[^0-9.]/g, '') || '0';
          const price = parseFloat(priceStr) || 59.99;
          const image = document.getElementById('gallery-main-img')?.src || '';
          const colorActive = document.querySelector('.variant-group[data-option-name="Color"] .is-active')?.getAttribute('data-value') ||
                              document.getElementById('option-0-label')?.textContent?.trim() || 'Standard';
          const sizeActive = document.querySelector('.variant-group[data-option-name="Size"] .is-active')?.getAttribute('data-value') ||
                             document.getElementById('option-1-label')?.textContent?.trim() || 'M';
          const qtyInput = document.querySelector('[data-qty-value]');
          const qty = qtyInput ? (parseInt(qtyInput.value || qtyInput.textContent) || 1) : 1;

          this.addShopifyItem(variantId, {
            id: variantId || 1,
            title,
            price,
            image,
            color: colorActive,
            size: sizeActive,
            quantity: qty
          });
        });
      }

      // Dynamic "Pairs well with" upsell button — uses data-* attrs set by Liquid
      document.addEventListener('click', (e) => {
        const upsellBtn = e.target.closest('.btn-upsell-add[data-upsell-variant-id]');
        if (!upsellBtn) return;
        const variantId = upsellBtn.getAttribute('data-upsell-variant-id');
        const title     = upsellBtn.getAttribute('data-upsell-title') || 'Product';
        const price     = parseFloat(upsellBtn.getAttribute('data-upsell-price')) || 0;
        const image     = upsellBtn.getAttribute('data-upsell-image') || '';
        const url       = upsellBtn.getAttribute('data-upsell-url') || '';
        this.addShopifyItem(variantId, { id: variantId, title, price, image, url, color: 'Standard', size: 'One Size', quantity: 1 });
      });
    }
  };

  window.SideCart = SideCart;
  SideCart.init();


  /* ==========================================================
     16B. SIDE CART DISCOUNT CODE & AUTOMATIC DISCOUNTS
     ========================================================== */
  (function initSideCartDiscounts() {
    // Use event delegation so it works even if DOM was already loaded
    document.addEventListener('click', function(e) {
      // Toggle discount form
      var toggle = e.target.closest('#side-cart-discount-toggle');
      if (toggle) {
        var formWrap = document.getElementById('side-cart-discount-form');
        if (formWrap) {
          var isOpen = formWrap.style.display !== 'none';
          formWrap.style.display = isOpen ? 'none' : 'block';
          toggle.classList.toggle('is-open', !isOpen);
        }
        return;
      }

      // Apply discount code
      var applyBtn = e.target.closest('#side-cart-discount-apply');
      if (applyBtn) {
        var discountInput = document.getElementById('side-cart-discount-input');
        var discountMsg = document.getElementById('side-cart-discount-msg');
        var code = discountInput ? discountInput.value.trim() : '';
        if (!code) return;
        applyBtn.textContent = '...';
        applyBtn.disabled = true;

        fetch('/discount/' + encodeURIComponent(code), { method: 'GET', redirect: 'follow' })
        .then(function() { return fetch('/cart.js').then(function(r) { return r.json(); }); })
        .then(function(cart) {
          applyBtn.textContent = 'Apply';
          applyBtn.disabled = false;
          if (cart.total_discount && cart.total_discount > 0) {
            if (discountMsg) {
              discountMsg.style.display = 'block';
              discountMsg.className = 'side-cart-discount-msg side-cart-discount-msg--success';
              discountMsg.innerHTML = '\u2713 Discount code <strong>' + code + '</strong> applied!';
            }
            updateCartTotals(cart);
          } else {
            if (discountMsg) {
              discountMsg.style.display = 'block';
              discountMsg.className = 'side-cart-discount-msg side-cart-discount-msg--error';
              discountMsg.textContent = 'This discount code is not valid.';
            }
          }
        })
        .catch(function() {
          applyBtn.textContent = 'Apply';
          applyBtn.disabled = false;
          if (discountMsg) {
            discountMsg.style.display = 'block';
            discountMsg.className = 'side-cart-discount-msg side-cart-discount-msg--error';
            discountMsg.textContent = 'Could not apply code. Try again.';
          }
        });
        return;
      }
    });

    // Enter key on discount input
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target && e.target.id === 'side-cart-discount-input') {
        e.preventDefault();
        var btn = document.getElementById('side-cart-discount-apply');
        if (btn) btn.click();
      }
    });

    function updateCartTotals(cart) {
      var autoDiscEl = document.getElementById('side-cart-auto-discounts');
      var subtotalEl = document.getElementById('side-cart-subtotal');

      // Show discount lines
      var discountLines = [];
      if (cart.cart_level_discount_applications && cart.cart_level_discount_applications.length > 0) {
        cart.cart_level_discount_applications.forEach(function(d) {
          discountLines.push({ title: d.title || 'Discount', amount: (d.total_allocated_amount / 100).toFixed(2) });
        });
      }
      if (cart.items) {
        cart.items.forEach(function(item) {
          if (item.line_level_discount_allocations && item.line_level_discount_allocations.length > 0) {
            item.line_level_discount_allocations.forEach(function(d) {
              var t = (d.discount_application && d.discount_application.title) || 'Discount';
              var existing = discountLines.find(function(dl) { return dl.title === t; });
              if (!existing) {
                discountLines.push({ title: t, amount: (d.amount / 100).toFixed(2) });
              } else {
                existing.amount = (parseFloat(existing.amount) + (d.amount / 100)).toFixed(2);
              }
            });
          }
        });
      }

      if (autoDiscEl) {
        if (discountLines.length > 0) {
          autoDiscEl.style.display = 'block';
          autoDiscEl.innerHTML = discountLines.map(function(d) {
            return '<div class="side-cart-discount-line"><span class="side-cart-discount-line__tag">🏷 ' + d.title + '</span><span class="side-cart-discount-line__amount">-Rs. ' + d.amount + '</span></div>';
          }).join('');
        } else {
          autoDiscEl.style.display = 'none';
          autoDiscEl.innerHTML = '';
        }
      }

      // Update subtotal with Shopify's real total (after discounts)
      if (subtotalEl && cart.total_price !== undefined) {
        subtotalEl.textContent = 'Rs. ' + (cart.total_price / 100).toFixed(2);
      }
    }

    // Override syncShopify to also update discounts + real total
    var _origSync = window.SideCart.syncShopify;
    window.SideCart.syncShopify = function() {
      fetch('/cart.js')
        .then(function(res) { if (!res.ok) throw new Error('fail'); return res.json(); })
        .then(function(cart) {
          if (cart && Array.isArray(cart.items) && cart.items.length > 0) {
            window.SideCart.items = cart.items.map(function(i) {
              return {
                id: i.variant_id || i.id, key: i.key,
                title: i.product_title || i.title,
                price: (i.price / 100).toFixed(2),
                image: i.image || (i.featured_image && i.featured_image.url) || '',
                color: (i.variant_options && i.variant_options[0]) || 'Standard',
                size: (i.variant_options && i.variant_options[1]) || i.variant_title || 'M',
                quantity: i.quantity
              };
            });
            window.SideCart.save();
          }
          updateCartTotals(cart);
        })
        .catch(function() {});
    };
  })();

  /* ==========================================================
     17. TOAST NOTIFICATION SYSTEM
     ========================================================== */
  window.showToast = (message, duration) => {
    duration = duration || 3000;
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.style.cssText = 'background:#171717;color:#fff;padding:12px 20px;border-radius:6px;font-size:13px;font-weight:500;font-family:Inter,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.15);transform:translateX(120%);transition:transform 0.3s ease;';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);
    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  /* ==========================================================
     18. MULTI-IMAGE HOVER SCRUBBER ON PRODUCT CARDS
     ========================================================== */
  const initCardImageScrubber = () => {
    const handleScrub = (wrap, clientX) => {
      const img = wrap.querySelector('.product-card__image, .farak-card__img, img');
      if (!img) return;

      let images = [];
      const dataImgs = wrap.getAttribute('data-images');
      if (dataImgs) {
        try { images = JSON.parse(dataImgs); } catch (e) {}
      }

      if (!images || images.length <= 1) {
        const card = wrap.closest('[data-product-id]');
        if (card && window.StoreData) {
          const pid = card.getAttribute('data-product-id');
          const p = StoreData.getProductById(pid);
          if (p && p.media && p.media.length > 1) {
            images = p.media;
            wrap.setAttribute('data-images', JSON.stringify(images));
          }
        }
      }

      if (!images || images.length <= 1) return;

      // Ensure scrub indicators exist
      let indicatorWrap = wrap.querySelector('.card-scrub-indicators');
      if (!indicatorWrap) {
        indicatorWrap = document.createElement('div');
        indicatorWrap.className = 'card-scrub-indicators';
        indicatorWrap.innerHTML = images.map((_, idx) => `<span class="card-scrub-bar ${idx === 0 ? 'is-active' : ''}"></span>`).join('');
        wrap.appendChild(indicatorWrap);
      }

      const rect = wrap.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const ratio = x / rect.width;
      const index = Math.min(images.length - 1, Math.max(0, Math.floor(ratio * images.length)));

      if (!wrap.getAttribute('data-initial-image')) {
        wrap.setAttribute('data-initial-image', img.src);
      }

      if (img.src !== images[index]) {
        img.src = images[index];
      }

      const bars = indicatorWrap.querySelectorAll('.card-scrub-bar');
      bars.forEach((b, i) => b.classList.toggle('is-active', i === index));
    };

    const handleLeave = (wrap) => {
      const img = wrap.querySelector('.product-card__image, .farak-card__img, img');
      if (!img) return;
      const initial = wrap.getAttribute('data-initial-image');
      if (initial && img.src !== initial) {
        img.src = initial;
      }
      const indicatorWrap = wrap.querySelector('.card-scrub-indicators');
      if (indicatorWrap) {
        const bars = indicatorWrap.querySelectorAll('.card-scrub-bar');
        bars.forEach((b, i) => b.classList.toggle('is-active', i === 0));
      }
    };

    // Document-level event delegation for mouse movements
    document.addEventListener('mousemove', (e) => {
      const wrap = e.target.closest('.product-card__image-wrap, .farak-card__img-wrap');
      if (wrap) {
        handleScrub(wrap, e.clientX);
      }
    });

    document.addEventListener('mouseout', (e) => {
      const wrap = e.target.closest('.product-card__image-wrap, .farak-card__img-wrap');
      if (wrap && !wrap.contains(e.relatedTarget)) {
        handleLeave(wrap);
      }
    });

    // Touch support (swipe horizontally across card on mobile)
    document.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const wrap = e.target.closest('.product-card__image-wrap, .farak-card__img-wrap');
        if (wrap) {
          handleScrub(wrap, e.touches[0].clientX);
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const wrap = e.target.closest('.product-card__image-wrap, .farak-card__img-wrap');
      if (wrap) {
        handleLeave(wrap);
      }
    });
  };

  initCardImageScrubber();

  /* ==========================================================
     19. IN-CARD QUICK ADD OVERLAY & DIRECT AJAX ADD-TO-CART
     ========================================================== */
  const initCardQuickAdd = () => {
    document.addEventListener('click', (e) => {
      // 1. Click "+ Quick Add" toggle button
      const toggleBtn = e.target.closest('[data-card-quick-toggle], .product-card__quick-add, .farak-card__quick-add');
      if (toggleBtn) {
        e.preventDefault();
        e.stopPropagation();

        const wrap = toggleBtn.closest('.product-card__image-wrap, .farak-card__img-wrap');
        if (!wrap) return;

        // Close any other open overlays first
        document.querySelectorAll('.card-quick-overlay--active').forEach((ov) => {
          if (ov !== wrap.querySelector('.card-quick-overlay')) {
            ov.classList.remove('card-quick-overlay--active');
          }
        });

        let overlay = wrap.querySelector('.card-quick-overlay');
        if (!overlay) {
          const card = wrap.closest('[data-product-id]');
          const pid = card ? card.getAttribute('data-product-id') : null;
          let sizes = ['S', 'M', 'L', 'XL', 'XXL'];
          let prod = null;
          if (pid && window.StoreData) {
            prod = StoreData.getProductById(pid);
            if (prod && prod.sizes && prod.sizes.length > 0) sizes = prod.sizes;
          }
          overlay = document.createElement('div');
          overlay.className = 'card-quick-overlay';
          overlay.innerHTML = `
            <div class="card-quick-overlay__header">
              <span class="card-quick-overlay__title">Select Size</span>
              <button type="button" class="card-quick-overlay__close" data-close-overlay aria-label="Close">&times;</button>
            </div>
            <div class="card-quick-overlay__sizes">
              ${sizes.map(s => `<button type="button" class="quick-size-btn" data-product-id="${pid || ''}" data-product-title="${(prod ? prod.title : '').replace(/"/g, '&quot;')}" data-size="${s}" data-price="${prod ? prod.price : ''}" data-image="${prod ? prod.image : ''}">${s}</button>`).join('')}
            </div>
          `;
          wrap.appendChild(overlay);
        }

        overlay.classList.toggle('card-quick-overlay--active');
        return;
      }

      // 2. Click close button ✕
      const closeBtn = e.target.closest('[data-close-overlay], .card-quick-overlay__close');
      if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const overlay = closeBtn.closest('.card-quick-overlay');
        if (overlay) overlay.classList.remove('card-quick-overlay--active');
        return;
      }

      // 3. Click size button -> DIRECT ADD TO CART (No Page Open!)
      const sizeBtn = e.target.closest('.quick-size-btn');
      if (sizeBtn) {
        e.preventDefault();
        e.stopPropagation();

        const variantId = sizeBtn.getAttribute('data-variant-id');
        const prodId = sizeBtn.getAttribute('data-product-id');
        const chosenSize = sizeBtn.getAttribute('data-size') || sizeBtn.getAttribute('data-variant-title') || sizeBtn.textContent.trim();
        const prodTitle = sizeBtn.getAttribute('data-product-title') || 'Luxury Streetwear';
        const price = parseFloat(sizeBtn.getAttribute('data-price')) || 59.99;
        const image = sizeBtn.getAttribute('data-image') || '';

        // Close overlay immediately
        const overlay = sizeBtn.closest('.card-quick-overlay');
        if (overlay) overlay.classList.remove('card-quick-overlay--active');

        // Execute Direct Add To Bag via SideCart!
        if (window.SideCart) {
          window.SideCart.addShopifyItem(variantId, {
            id: prodId || variantId,
            title: prodTitle,
            price: price,
            image: image,
            size: chosenSize,
            color: 'Standard',
            quantity: 1
          });
        }
        return;
      }

      // 4. Click outside to dismiss any open overlays
      if (!e.target.closest('.card-quick-overlay') && !e.target.closest('.product-card__quick-add') && !e.target.closest('.farak-card__quick-add')) {
        document.querySelectorAll('.card-quick-overlay--active').forEach(ov => {
          ov.classList.remove('card-quick-overlay--active');
        });
      }
    }, true);
  };

  initCardQuickAdd();

  /* ==========================================================
     20. PREDICTIVE AJAX LIVE SEARCH WITH INSTANT THUMBNAILS
     ========================================================== */
  const initLiveSearch = () => {
    const searchModal = document.getElementById('search-modal');
    const searchBackdrop = document.getElementById('search-modal-backdrop');
    const searchClose = document.getElementById('search-modal-close');
    const searchInput = document.getElementById('live-search-input');
    const searchClear = document.getElementById('live-search-clear');
    const trendingBox = document.getElementById('search-trending');
    const liveResultsBox = document.getElementById('search-live-results');
    const liveProductsContainer = document.getElementById('search-live-products');
    const emptyState = document.getElementById('search-empty-state');
    const viewAllBtn = document.getElementById('btn-search-view-all');
    const queryDisplay = document.getElementById('search-query-display');

    if (!searchModal) return;

    const openSearch = () => {
      searchModal.style.display = 'block';
      if (searchBackdrop) searchBackdrop.style.display = 'block';
      document.body.style.overflow = 'hidden';
      setTimeout(() => { if (searchInput) searchInput.focus(); }, 100);
    };

    const closeSearch = () => {
      searchModal.style.display = 'none';
      if (searchBackdrop) searchBackdrop.style.display = 'none';
      document.body.style.overflow = '';
    };

    // Open triggers
    document.querySelectorAll('a[href*="/search"], .header-icon[aria-label="Search"]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
      });
    });

    if (searchClose) searchClose.addEventListener('click', closeSearch);
    if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearch);

    // Keyboard shortcuts (Esc, Cmd+K, /)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.style.display === 'block') {
        closeSearch();
      }
      if ((e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        openSearch();
      }
    });

    // Trending Search Pills Click
    document.querySelectorAll('.search-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-query');
        if (searchInput) {
          searchInput.value = query;
          performSearch(query);
        }
      });
    });

    // Clear Search Input
    if (searchClear && searchInput) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        trendingBox.style.display = 'block';
        liveResultsBox.style.display = 'none';
        emptyState.style.display = 'none';
        searchInput.focus();
      });
    }

    // Debounced Live Query Handler
    let debounceTimer;
    const performSearch = (rawQuery) => {
      const query = rawQuery.trim();
      if (searchClear) searchClear.style.display = query.length > 0 ? 'block' : 'none';

      if (query.length < 2) {
        if (trendingBox) trendingBox.style.display = 'block';
        if (liveResultsBox) liveResultsBox.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
        return;
      }

      if (trendingBox) trendingBox.style.display = 'none';

      // 1. Fetch from Shopify Predictive Search API
      fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[options][unavailable_products]=show&resources[options][fields]=title,product_type,variants.title,vendor`)
        .then(res => {
          if (!res.ok) throw new Error('Not Shopify Search Endpoint');
          return res.json();
        })
        .then(data => {
          const products = data.resources?.results?.products || [];
          renderSearchResults(products, query);
        })
        .catch(() => {
          // 2. Fallback to Local Catalog Search
          let results = [];
          if (window.StoreData && StoreData.products) {
            results = StoreData.products.filter(p => 
              p.title.toLowerCase().includes(query.toLowerCase()) || 
              (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
            );
          }
          renderSearchResults(results, query);
        });
    };

    const renderSearchResults = (products, query) => {
      if (viewAllBtn) {
        viewAllBtn.href = `/search?q=${encodeURIComponent(query)}`;
        viewAllBtn.textContent = `View all matching results (${products.length}) ?`;
      }

      if (!products || products.length === 0) {
        if (liveResultsBox) liveResultsBox.style.display = 'none';
        if (emptyState) {
          emptyState.style.display = 'block';
          if (queryDisplay) queryDisplay.textContent = query;
        }
        return;
      }

      if (emptyState) emptyState.style.display = 'none';
      if (liveResultsBox) liveResultsBox.style.display = 'block';

      if (liveProductsContainer) {
        liveProductsContainer.innerHTML = products.slice(0, 6).map(p => {
          const img = p.featured_image?.url || p.image || p.featured_media || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300';
          const title = p.title;
          const price = p.price ? (typeof p.price === 'number' ? `Rs. ${(p.price > 1000 ? p.price/100 : p.price).toFixed(2)}` : p.price) : 'Rs. 5999';
          const url = p.url || `product.html?id=${p.id}`;

          return `
            <a href="${url}" class="search-product-card">
              <div class="search-product-card__thumb">
                <img src="${img}" alt="${title}" loading="lazy">
              </div>
              <div class="search-product-card__info">
                <span class="search-product-card__tag">Ready to Dispatch</span>
                <h4 class="search-product-card__title">${title}</h4>
                <span class="search-product-card__price">${price}</span>
              </div>
            </a>
          `;
        }).join('');
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => performSearch(e.target.value), 250);
      });
    }
  };

  /* ==========================================================
     21. INTERACTIVE SHOP THE LOOK HOTSPOT OUTFIT BUILDER
     ========================================================== */
  const initShopTheLook = () => {
    document.addEventListener('click', (e) => {
      // Hotspot Pin click
      const pin = e.target.closest('.look-hotspot-pin');
      if (pin) {
        e.preventDefault();
        const section = pin.closest('.shop-the-look-section');
        if (!section) return;

        const pinIndex = pin.getAttribute('data-pin-index');
        section.querySelectorAll('.look-hotspot-pin').forEach(p => p.classList.remove('is-active'));
        pin.classList.add('is-active');

        section.querySelectorAll('.look-product-card').forEach((card, idx) => {
          card.classList.toggle('is-active', String(idx) === String(pinIndex));
          if (String(idx) === String(pinIndex)) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
        return;
      }

      // Look Size Pill Click
      const sizePill = e.target.closest('.look-size-pill');
      if (sizePill) {
        e.preventDefault();
        const picker = sizePill.closest('.look-size-picker');
        if (picker) {
          picker.querySelectorAll('.look-size-pill').forEach(p => p.classList.remove('is-active'));
          sizePill.classList.add('is-active');
        }
        return;
      }

      // Add Individual Look Piece to Bag
      const addPieceBtn = e.target.closest('.btn-look-add');
      if (addPieceBtn) {
        e.preventDefault();
        const card = addPieceBtn.closest('.look-product-card');
        const activeSize = card ? card.querySelector('.look-size-pill.is-active')?.getAttribute('data-size') || 'M' : 'M';
        const variantId = addPieceBtn.getAttribute('data-variant-id');
        const prodId = addPieceBtn.getAttribute('data-product-id');
        const title = addPieceBtn.getAttribute('data-product-title') || 'Archival Streetwear';
        const price = parseFloat(addPieceBtn.getAttribute('data-price')) || 59.99;
        const image = addPieceBtn.getAttribute('data-image');

        if (window.SideCart) {
          window.SideCart.addShopifyItem(variantId, {
            id: prodId || variantId,
            title,
            price,
            image,
            size: activeSize,
            color: 'Standard',
            quantity: 1
          });
        }
        return;
      }

      // Bundle Full 3-Piece Look to Bag
      const bundleBtn = e.target.closest('.btn-bundle-buy');
      if (bundleBtn) {
        e.preventDefault();
        const section = bundleBtn.closest('.shop-the-look-section');
        if (!section) return;

        const cards = section.querySelectorAll('.look-product-card');
        cards.forEach((card, i) => {
          const btn = card.querySelector('.btn-look-add');
          if (btn && window.SideCart) {
            const variantId = btn.getAttribute('data-variant-id');
            const prodId = btn.getAttribute('data-product-id');
            const title = btn.getAttribute('data-product-title') || 'Complete Look Piece';
            const price = parseFloat(btn.getAttribute('data-price')) || 49.99;
            const image = btn.getAttribute('data-image');
            const size = card.querySelector('.look-size-pill.is-active')?.getAttribute('data-size') || 'M';

            SideCart.addItem({
              id: prodId || (Date.now() + i),
              title,
              price,
              image,
              size,
              color: 'Look Bundle',
              quantity: 1
            });
          }
        });

        if (window.showToast) {
          window.showToast('? Complete 3-Piece Look Added to Bag!');
        }
        if (window.SideCart) {
          window.SideCart.open();
        }
      }
    });
  };

  /* ==========================================================
     22. TIKTOK / REELS 9:16 VERTICAL VIDEO CAROUSEL
     ========================================================== */
  const initVideoReels = () => {
    // 1. Audio Mute / Unmute Toggle
    document.addEventListener('click', (e) => {
      const soundBtn = e.target.closest('.video-reel-sound-btn');
      if (soundBtn) {
        e.preventDefault();
        e.stopPropagation();
        const card = soundBtn.closest('.video-reel-card');
        const video = card ? card.querySelector('.video-reel-player') : null;
        if (!video) return;

        video.muted = !video.muted;
        const iconMuted = soundBtn.querySelector('.icon-muted');
        const iconUnmuted = soundBtn.querySelector('.icon-unmuted');
        if (iconMuted && iconUnmuted) {
          iconMuted.style.display = video.muted ? 'block' : 'none';
          iconUnmuted.style.display = video.muted ? 'none' : 'block';
        }
        return;
      }

      // 2. Add to Bag from Reel Floating Product Card
      const addBtn = e.target.closest('.video-reel-prod-add');
      if (addBtn) {
        e.preventDefault();
        e.stopPropagation();
        const varId = addBtn.getAttribute('data-variant-id');
        const pTitle = addBtn.getAttribute('data-product-title') || 'Garment';
        const pPrice = parseFloat(addBtn.getAttribute('data-price')) || 59.99;
        const pImg = addBtn.getAttribute('data-image') || '';

        if (window.CartDrawer && typeof window.CartDrawer.addItem === 'function') {
          window.CartDrawer.addItem(varId, {
            id: varId,
            title: pTitle,
            price: pPrice,
            image: pImg,
            size: 'M',
            quantity: 1
          });
          if (typeof window.CartDrawer.open === 'function') {
            window.CartDrawer.open();
          }
        }
        return;
      }

      // 3. Play / Pause click on video
      const mediaWrap = e.target.closest('.video-reel-media');
      if (mediaWrap && !e.target.closest('.video-reel-product-card') && !e.target.closest('.video-reel-sound-btn')) {
        const video = mediaWrap.querySelector('.video-reel-player');
        if (video) {
          if (video.paused) {
            video.play();
            mediaWrap.classList.remove('is-paused');
          } else {
            video.pause();
            mediaWrap.classList.add('is-paused');
          }
        }
      }
    });

    // 3. Arrow Navigation for Reels Track
    document.querySelectorAll('.video-reels-section').forEach((section) => {
      const track = section.querySelector('.video-reels-track');
      const prevBtn = section.querySelector('.video-reels-arrow--prev');
      const nextBtn = section.querySelector('.video-reels-arrow--next');

      if (track && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => track.scrollBy({ left: -320, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => track.scrollBy({ left: 320, behavior: 'smooth' }));
      }
    });

    // 4. Autoplay on Viewport Intersection
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const video = entry.target.querySelector('.video-reel-player');
          if (!video) return;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.4 });

      document.querySelectorAll('.video-reel-card').forEach(card => observer.observe(card));
    }
  };

  /* ==========================================================
     23. PERSISTENT RECENTLY VIEWED PRODUCTS TRACKER
     ========================================================== */
  const RECENTLY_VIEWED_KEY = 'kc_recent_products_v2';
  const DISMISSED_RECENT_KEY = 'kc_dismissed_recent_v2';

  const initRecentlyViewed = () => {
    // 1. Dwell Tracking (PDP): Record product only if customer spends at least 3 seconds on product page
    const pdpScript = document.getElementById('current-pdp-data');
    let pdpProductData = null;

    if (pdpScript) {
      try {
        pdpProductData = JSON.parse(pdpScript.textContent);
      } catch (e) {}
    } else {
      const pdpTitle = document.getElementById('product-title') || document.querySelector('.product-title');
      if (pdpTitle) {
        const title = pdpTitle.textContent.trim();
        const price = document.getElementById('product-price-current')?.textContent?.trim() || 'Rs. 5,999';
        const image = document.getElementById('gallery-main-img')?.src || document.querySelector('.gallery-main__image')?.src || '';
        const url = window.location.pathname + window.location.search;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id') || window.location.pathname.split('/').pop();
        const variantInput = document.getElementById('selected-variant-id');
        const variantId = variantInput ? variantInput.value : null;

        pdpProductData = { id, title, price, image, url, variantId };
      }
    }

    if (pdpProductData && pdpProductData.title) {
      // Record to recently viewed list immediately
      try {
        let recents = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
        recents = recents.filter(item => String(item.id) !== String(pdpProductData.id) && item.title !== pdpProductData.title);
        recents.unshift(pdpProductData);
        if (recents.length > 8) recents = recents.slice(0, 8);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recents));
      } catch (e) {}
    }

    // 2. Render static recently viewed sections (e.g. grid in templates if present)
    document.querySelectorAll('.recently-viewed-section').forEach((section) => {
      const grid = section.querySelector('.recently-viewed-grid');
      const clearBtn = section.querySelector('.btn-clear-recent');
      if (!grid) return;

      let recents = [];
      try { recents = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]'); } catch (e) {}

      if (!recents || recents.length === 0) {
        section.style.display = 'none';
        return;
      }

      section.style.display = 'block';
      const limit = parseInt(grid.getAttribute('data-limit')) || 4;
      const itemsToShow = recents.slice(0, limit);

      grid.innerHTML = itemsToShow.map(item => `
        <div class="product-card farak-card" data-product-id="${item.id}">
          <div class="product-card__image-wrap farak-card__img-wrap">
            <a href="${item.url}"><img src="${item.image}" alt="${item.title}" class="product-card__image farak-card__img" loading="lazy"></a>
            <button type="button" class="product-card__wishlist" data-wishlist-toggle="${item.id}" aria-label="Add to Favorites" onclick="if(window.Wishlist){Wishlist.toggle('${item.id}');}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            <button type="button" class="product-card__quick-add farak-card__quick-add" data-card-quick-toggle>+ Quick Add</button>
          </div>
          <div class="product-card__info farak-card__info">
            <a href="${item.url}" class="product-card__title-link"><h3 class="product-card__title farak-card__title">${item.title}</h3></a>
            <div class="product-card__price farak-card__price"><span class="price-current">${item.price}</span></div>
          </div>
        </div>
      `).join('');

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          localStorage.removeItem(RECENTLY_VIEWED_KEY);
          section.style.display = 'none';
          if (window.showToast) window.showToast('Browsing history cleared');
        });
      }
    });

    // 3. Floating Popup Stack on Bottom Right (Max 2 recent products)
    const renderFloatingPopupStack = () => {
      const popupStack = document.getElementById('recent-products-popup-stack');
      if (!popupStack) return;

      let recents = [];
      try { recents = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]'); } catch (e) {}

      if (!recents || recents.length === 0) return;

      let dismissedIds = [];
      try { dismissedIds = JSON.parse(sessionStorage.getItem(DISMISSED_RECENT_KEY) || '[]'); } catch (e) {}

      // Filter out dismissed items
      const availableRecents = recents.filter(item => !dismissedIds.includes(String(item.id)));
      if (availableRecents.length === 0) return;

      // Limit stack to maximum 2 items
      const itemsToDisplay = availableRecents.slice(0, 2);

      popupStack.innerHTML = itemsToDisplay.map((item) => `
        <div class="recent-popup-card" data-recent-id="${item.id}" id="recent-popup-card-${item.id}">
          <button type="button" class="recent-popup-card__close-btn" data-close-recent="${item.id}" aria-label="Close popup">✕</button>
          <div class="recent-popup-card__img-wrap">
            <a href="${item.url}">
              <img src="${item.image}" alt="${item.title}" class="recent-popup-card__img">
            </a>
          </div>
          <div class="recent-popup-card__info">
            <span class="recent-popup-card__badge">RECENTLY VIEWED</span>
            <a href="${item.url}" class="recent-popup-card__title" title="${item.title}">${item.title}</a>
            <div class="recent-popup-card__row">
              <span class="recent-popup-card__price">${item.price}</span>
              <button type="button" class="recent-popup-card__add-btn" data-add-recent-variant="${item.variantId || ''}" data-recent-title="${item.title.replace(/"/g, '&quot;')}" data-recent-price="${item.price}" data-recent-image="${item.image}" data-recent-url="${item.url}">
                + ADD
              </button>
            </div>
          </div>
        </div>
      `).join('');

      // Slide-in cards after 3 seconds with staggered transition
      setTimeout(() => {
        const cards = popupStack.querySelectorAll('.recent-popup-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('is-visible');
          }, index * 200);
        });

        // Every 5 seconds: trigger 3-pulse flash animation (small expansion and contraction 3 times)
        setInterval(() => {
          const visibleCards = popupStack.querySelectorAll('.recent-popup-card.is-visible:not(.is-dismissed)');
          visibleCards.forEach(card => {
            card.classList.remove('is-pulsing');
            // Force browser reflow so the 3-pulse animation restarts cleanly
            void card.offsetWidth;
            card.classList.add('is-pulsing');
          });
        }, 5000);
      }, 3000);

      // Event delegation for close button and quick add button
      popupStack.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('[data-close-recent]');
        if (closeBtn) {
          e.preventDefault();
          e.stopPropagation();
          const cardId = closeBtn.getAttribute('data-close-recent');
          const card = document.getElementById(`recent-popup-card-${cardId}`);
          if (card) {
            card.classList.add('is-dismissed');
            setTimeout(() => card.remove(), 450);

            try {
              let currentDismissed = JSON.parse(sessionStorage.getItem(DISMISSED_RECENT_KEY) || '[]');
              if (!currentDismissed.includes(String(cardId))) {
                currentDismissed.push(String(cardId));
                sessionStorage.setItem(DISMISSED_RECENT_KEY, JSON.stringify(currentDismissed));
              }
            } catch (err) {}
          }
          return;
        }

        const addBtn = e.target.closest('[data-add-recent-variant]');
        if (addBtn) {
          e.preventDefault();
          e.stopPropagation();
          const variantId = addBtn.getAttribute('data-add-recent-variant');
          const title = addBtn.getAttribute('data-recent-title');
          const price = addBtn.getAttribute('data-recent-price');
          const image = addBtn.getAttribute('data-recent-image');
          const recentUrl = addBtn.getAttribute('data-recent-url');

          if (window.SideCart) {
            addBtn.innerHTML = 'ADDING...';
            addBtn.disabled = true;

            window.SideCart.addShopifyItem(variantId, {
              title: title,
              price: price,
              image: image,
              size: 'M',
              quantity: 1
            });

            addBtn.innerHTML = 'ADDED ✓';
            setTimeout(() => {
              addBtn.innerHTML = '+ ADD';
              addBtn.disabled = false;
            }, 2000);
          } else if (recentUrl) {
            window.location.href = recentUrl;
          }
        }
      });
    };

    renderFloatingPopupStack();
  };

  /* ==========================================================
     24. RESTOCK NOTIFICATION MODAL HANDLER
     ========================================================== */
  const initRestockModal = () => {
    const backdrop = document.getElementById('restock-modal-backdrop');
    const closeBtn = document.getElementById('restock-modal-close');

    const closeModal = () => {
      if (backdrop) backdrop.style.display = 'none';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    window.openRestockModal = (productTitle, variantTitle) => {
      const prodName = document.getElementById('restock-product-name');
      const varName = document.getElementById('restock-variant-name');
      if (prodName) prodName.textContent = productTitle || 'Streetwear Piece';
      if (varName) varName.textContent = variantTitle || 'Selected Size';
      if (backdrop) backdrop.style.display = 'flex';
    };

    window.handleRestockSubmit = (form) => {
      const email = form.querySelector('input[type="email"]')?.value;
      const successMsg = document.getElementById('restock-success-msg');
      if (form) form.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
      if (window.showToast) {
        window.showToast(`? You're subscribed for restock alerts: ${email}`);
      }
    };
  };

  /* ==========================================================
     20. STICKY MOBILE ADD-TO-BAG BAR OBSERVER
     ========================================================== */
  const initStickyMobileATC = () => {
    const atcBtn = document.getElementById('add-to-cart');
    const stickyBar = document.getElementById('sticky-mobile-atc-bar');
    const stickyBtn = document.getElementById('btn-sticky-mobile-atc');

    if (!stickyBar || !atcBtn) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            stickyBar.classList.add('is-visible');
          } else {
            stickyBar.classList.remove('is-visible');
          }
        });
      }, { rootMargin: '0px', threshold: 0 });

      observer.observe(atcBtn);
    } else {
      window.addEventListener('scroll', () => {
        const rect = atcBtn.getBoundingClientRect();
        if (rect.bottom < 0) {
          stickyBar.classList.add('is-visible');
        } else {
          stickyBar.classList.remove('is-visible');
        }
      });
    }

    if (stickyBtn) {
      stickyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (atcBtn) {
          atcBtn.click();
        }
      });
    }
  };

  /* ==========================================================
     21. DYNAMIC DELIVERY DATE & COUNTDOWN ESTIMATOR
     ========================================================== */
  const initDeliveryEstimator = () => {
    const deliveryEl = document.getElementById('pdp-delivery-date');
    const timerEl = document.getElementById('pdp-countdown-timer');

    if (deliveryEl) {
      const today = new Date();
      let deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 4);

      // Skip Sunday if hits Sunday
      if (deliveryDate.getDay() === 0) {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
      }

      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      const formattedDate = deliveryDate.toLocaleDateString('en-US', options);
      deliveryEl.textContent = `${formattedDate} (Express Delivery)`;
    }

    if (timerEl) {
      const updateTimer = () => {
        const now = new Date();
        const cutoff = new Date();
        cutoff.setHours(18, 0, 0, 0); // 6 PM cutoff

        if (now > cutoff) {
          cutoff.setDate(cutoff.getDate() + 1);
        }

        const diff = cutoff - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const pad = (n) => String(n).padStart(2, '0');
        timerEl.textContent = `${pad(hours)} hrs ${pad(mins)} mins ${pad(secs)} secs`;
      };

      updateTimer();
      setInterval(updateTimer, 1000);
    }
  };

  /* ==========================================================
     22. COLLECTION FILTER DRAWER & GRID SWITCHER
     ========================================================== */
  const initCollectionFilters = () => {
    const trigger = document.getElementById('filter-trigger');
    const sidebar = document.getElementById('filter-sidebar');
    const closeBtn = document.getElementById('filter-drawer-close');
    const backdrop = document.getElementById('filter-backdrop');
    const grid = document.getElementById('collection-grid');
    const gridBtns = document.querySelectorAll('.btn-grid-view');

    const openDrawer = () => {
      if (sidebar) sidebar.classList.add('filter-sidebar--open');
      if (backdrop) backdrop.classList.add('filter-backdrop--active');
      if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
      }
    };

    const closeDrawer = () => {
      if (sidebar) sidebar.classList.remove('filter-sidebar--open');
      if (backdrop) backdrop.classList.remove('filter-backdrop--active');
      document.body.style.overflow = '';
    };

    if (trigger) trigger.addEventListener('click', (e) => { e.preventDefault(); openDrawer(); });
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Grid View Switcher
    gridBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cols = btn.getAttribute('data-cols');
        if (!grid || !cols) return;

        grid.classList.remove('grid--1-col', 'grid--2-col', 'grid--3-col', 'grid--4-col');
        grid.classList.add(`grid--${cols}-col`);

        gridBtns.forEach(b => b.classList.remove('btn-grid-view--active'));
        btn.classList.add('btn-grid-view--active');
      });
    });

    // Interactive Color & Size Filter Chips
    const colorChips = document.querySelectorAll('[data-filter-color]');
    const sizeChips = document.querySelectorAll('[data-filter-size]');
    const productCards = document.querySelectorAll('#collection-grid .product-card');

    let selectedColors = [];
    let selectedSizes = [];

    const applyClientFilters = () => {
      let visibleCount = 0;
      productCards.forEach((card) => {
        const cardColors = (card.getAttribute('data-colors') || '').toLowerCase();
        const cardSizes = (card.getAttribute('data-sizes') || '').toLowerCase();

        let matchesColor = selectedColors.length === 0 || selectedColors.some(c => cardColors.includes(c));
        let matchesSize = selectedSizes.length === 0 || selectedSizes.some(s => cardSizes.includes(s));

        if (matchesColor && matchesSize) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update empty state if no products match
      let emptyMsg = document.getElementById('filter-empty-msg');
      if (visibleCount === 0 && productCards.length > 0) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.id = 'filter-empty-msg';
          emptyMsg.className = 'collection-empty';
          emptyMsg.style.gridColumn = '1 / -1';
          emptyMsg.style.textAlign = 'center';
          emptyMsg.style.padding = '60px 20px';
          emptyMsg.innerHTML = '<p style="font-size: 16px; color: #525252;">No products match the selected filters.</p>';
          if (grid) grid.appendChild(emptyMsg);
        }
        emptyMsg.style.display = 'block';
      } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
      }
    };

    colorChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const color = chip.getAttribute('data-filter-color');
        if (selectedColors.includes(color)) {
          selectedColors = selectedColors.filter(c => c !== color);
          chip.classList.remove('filter-color-chip--active');
        } else {
          selectedColors.push(color);
          chip.classList.add('filter-color-chip--active');
        }
        applyClientFilters();
      });
    });

    sizeChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const size = chip.getAttribute('data-filter-size');
        if (selectedSizes.includes(size)) {
          selectedSizes = selectedSizes.filter(s => s !== size);
          chip.classList.remove('filter-size-chip--active');
        } else {
          selectedSizes.push(size);
          chip.classList.add('filter-size-chip--active');
        }
        applyClientFilters();
      });
    });

    // Clear All button resets Color & Size chips
    const clearBtn = document.querySelector('.btn-clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        selectedColors = [];
        selectedSizes = [];
        colorChips.forEach(c => c.classList.remove('filter-color-chip--active'));
        sizeChips.forEach(s => s.classList.remove('filter-size-chip--active'));
        applyClientFilters();
      });
    }
  };

  /* ==========================================================
     23. CREATIVE LUXURY PRELOADER ANIMATION
     ========================================================== */
  const initCreativePreloader = () => {
    const preloader = document.getElementById('creative-preloader');
    const preloaderLogo = document.getElementById('preloader-logo-wrap');
    const headerLogo = document.getElementById('header-logo') || document.querySelector('.logo');
    const barWrap = document.querySelector('.creative-preloader__bar-wrap');

    if (!preloader || !preloaderLogo) return;

    // Session Storage Check: Play preloader only ONCE per browser session
    try {
      if (sessionStorage.getItem('hasSeenCreativePreloader') === 'true') {
        preloader.classList.add('is-hidden');
        preloader.style.display = 'none';
        return;
      }
    } catch (e) {}

    // Sync preloader dark theme with header theme
    const headerEl = document.getElementById('header') || document.querySelector('.header');
    if (headerEl && headerEl.classList.contains('header--theme-dark')) {
      preloader.classList.add('creative-preloader--dark');
    }

    // Clone exact header logo image/text into preloader logo wrap
    if (headerLogo) {
      const headerImg = headerLogo.querySelector('img');
      const headerTextSpan = headerLogo.querySelector('.logo-text');
      const textContent = headerTextSpan ? headerTextSpan.textContent.trim() : headerLogo.textContent.trim();

      if (headerImg) {
        const clonedImg = headerImg.cloneNode(true);
        clonedImg.className = 'preloader-logo-img';
        clonedImg.classList.remove('logo--invert');
        clonedImg.removeAttribute('id');
        clonedImg.removeAttribute('width');
        clonedImg.removeAttribute('height');
        clonedImg.style.width = '260px';
        clonedImg.style.maxWidth = '280px';
        clonedImg.style.maxHeight = '130px';
        clonedImg.style.objectFit = 'contain';
        clonedImg.style.imageRendering = '-webkit-optimize-contrast';
        preloaderLogo.innerHTML = '';
        preloaderLogo.appendChild(clonedImg);
      } else if (textContent) {
        preloaderLogo.innerHTML = `<span class="preloader-logo-text">${textContent}</span>`;
      }
    }

    // Lock scrolling during preloader intro
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      // Fade out loading bar
      if (barWrap) barWrap.style.opacity = '0';

      // Calculate FLIP animation vectors (Scales down big logo to header logo size)
      if (headerLogo && preloaderLogo) {
        const sourceRect = preloaderLogo.getBoundingClientRect();
        const targetRect = headerLogo.getBoundingClientRect();

        if (targetRect.width > 0 && targetRect.height > 0) {
          const deltaX = (targetRect.left + targetRect.width / 2) - (sourceRect.left + sourceRect.width / 2);
          const deltaY = (targetRect.top + targetRect.height / 2) - (sourceRect.top + sourceRect.height / 2);
          const scaleRatio = targetRect.width / sourceRect.width;

          preloaderLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleRatio > 0 ? scaleRatio : 0.5})`;
        }
      }

      // Fade out preloader background overlay to reveal page
      preloader.classList.add('is-fading');
      document.body.style.overflow = '';

      // Mark preloader as seen for current browser session
      try {
        sessionStorage.setItem('hasSeenCreativePreloader', 'true');
      } catch (e) {}

      // Complete preloader transition smoothly
      setTimeout(() => {
        preloader.classList.add('is-hidden');
      }, 850);

    }, 1500);
  };

  // Initialize all flagship modules
  initLiveSearch();
  initShopTheLook();
  initVideoReels();
  initRecentlyViewed();
  initRestockModal();
  initStickyMobileATC();
  initDeliveryEstimator();
  initCollectionFilters();
  initCreativePreloader();

});


// Global Collection Sort Handler (Preserves active filter parameters)
window.handleSortChange = function(sortValue) {
  if (!sortValue) return;
  const url = new URL(window.location.href);
  url.searchParams.set('sort_by', sortValue);
  window.location.href = url.toString();
};

// Instant BUY NOW Direct Checkout Handler
window.handleDirectCheckout = function(e) {
  if (e) e.preventDefault();
  const form = document.getElementById('product-form');
  const variantInput = document.getElementById('selected-variant-id');
  const variantId = variantInput ? variantInput.value : null;

  if (variantId) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    })
    .then(() => {
      window.location.href = '/checkout';
    })
    .catch(() => {
      window.location.href = `/cart/${variantId}:1?checkout=true`;
    });
  } else if (form) {
    form.submit();
  }
};

