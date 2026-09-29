import os

theme_dir = r"e:\jgbjkeg\shopify-theme"
theme_css = os.path.join(theme_dir, "assets", "theme.css")

css_append = """
/* ==========================================================
   COMPREHENSIVE MOBILE OPTIMIZATIONS & SAFETY MARGINS
   ========================================================== */
@media (max-width: 768px) {
  /* Product Page Safety & Stacking */
  .product-main {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 24px var(--container-padding, 16px) 48px;
  }
  
  .product-details-inner {
    grid-template-columns: 1fr !important;
    gap: 32px !important;
    padding: 0 var(--container-padding, 16px);
  }

  /* UGC / Community Section */
  .ugc-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 8px !important;
    padding: 0 var(--container-padding, 16px) !important;
  }
  
  /* Brand Perks */
  .brand-perks__grid {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
    padding: 0 var(--container-padding, 16px) !important;
  }

  /* Craftsmanship / Editorial */
  .craft-grid, .shop-the-look-grid, .collection-editorial-banner {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
    padding: 0 var(--container-padding, 16px) !important;
  }

  /* Footer */
  .footer__grid, .farak-footer__grid {
    grid-template-columns: 1fr !important;
    gap: 32px !important;
    padding-left: var(--container-padding, 16px) !important;
    padding-right: var(--container-padding, 16px) !important;
  }
  
  /* Motion / Video Reels */
  .video-reels-track-wrap {
    margin-top: 16px;
    padding-left: 0; /* Keep full width, but prevent horizontal scroll bug */
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .video-reels-track {
    padding-left: var(--container-padding, 16px);
    padding-right: var(--container-padding, 16px);
    gap: 12px;
  }

  /* General Safety Margin for anything missing it */
  .section-header, .rich-text, .page-width {
    padding-left: var(--container-padding, 16px) !important;
    padding-right: var(--container-padding, 16px) !important;
  }
  
  /* Fix gallery on mobile to not take up massive screen height if it's grid/stacked */
  .gallery-expanded-wrapper {
    gap: 12px !important;
  }
}

@media (max-width: 480px) {
  /* Extra small phone tweaks */
  .ugc-grid {
    grid-template-columns: 1fr !important;
  }
  .gallery-thumb {
    width: 60px !important;
    height: 80px !important;
  }
}
"""

with open(theme_css, "a", encoding="utf-8") as f:
    f.write("\n" + css_append)

print("Mobile optimizations appended.")
