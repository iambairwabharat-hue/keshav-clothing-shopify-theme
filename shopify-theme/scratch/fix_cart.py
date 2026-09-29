import os
import re

theme_dir = r"e:\jgbjkeg\shopify-theme"

# ============================================
# 1. FIX theme.js - Replace $ with Rs.
# ============================================
js_path = os.path.join(theme_dir, "assets", "theme.js")
with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

# Fix FREE_SHIPPING_THRESHOLD
js = js.replace("const FREE_SHIPPING_THRESHOLD = 99.00;", "const FREE_SHIPPING_THRESHOLD = 9900;")
js = js.replace("const FREE_SHIPPING_THRESHOLD = 99;", "const FREE_SHIPPING_THRESHOLD = 9900;")

# Fix shipping text $ to Rs.
js = js.replace('shippingText.innerHTML = `Add <strong>$${remaining}</strong> more for <strong>FREE Worldwide Shipping</strong>`;',
                'shippingText.innerHTML = `Add <strong>Rs. ${remaining}</strong> more for <strong>FREE Worldwide Shipping</strong>`;')

# Fix subtotal $ to Rs.
js = js.replace("subtotalEl.textContent = '$' + subtotal.toFixed(2);",
                "subtotalEl.textContent = 'Rs. ' + subtotal.toFixed(2);")

# Fix item price $ to Rs.
js = js.replace('<div class="side-cart-item__price">$${(Number(item.price) * item.quantity).toFixed(2)}</div>',
                '<div class="side-cart-item__price">Rs. ${(Number(item.price) * item.quantity).toFixed(2)}</div>')

# ============================================
# 2. ADD discount code JS (if not already there)
# ============================================
if "initSideCartDiscounts" not in js:
    discount_js = '''
  /* ==========================================================
     16B. SIDE CART DISCOUNT CODE & AUTOMATIC DISCOUNTS
     ========================================================== */
  (function initSideCartDiscounts() {
    document.addEventListener('DOMContentLoaded', function() {
      var toggleBtn = document.getElementById('side-cart-discount-toggle');
      var formWrap = document.getElementById('side-cart-discount-form');
      if (toggleBtn && formWrap) {
        toggleBtn.addEventListener('click', function() {
          var isOpen = formWrap.style.display !== 'none';
          formWrap.style.display = isOpen ? 'none' : 'flex';
          toggleBtn.classList.toggle('is-open', !isOpen);
        });
      }

      var applyBtn = document.getElementById('side-cart-discount-apply');
      var discountInput = document.getElementById('side-cart-discount-input');
      var discountMsg = document.getElementById('side-cart-discount-msg');
      if (applyBtn && discountInput) {
        applyBtn.addEventListener('click', function() {
          var code = discountInput.value.trim();
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
                discountMsg.innerHTML = '\\u2713 Discount code <strong>' + code + '</strong> applied!';
              }
              updateAutoDiscounts(cart);
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
        });

        discountInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') { e.preventDefault(); applyBtn.click(); }
        });
      }
    });

    function updateAutoDiscounts(cart) {
      var autoDiscEl = document.getElementById('side-cart-auto-discounts');
      if (!autoDiscEl) return;
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
      if (discountLines.length > 0) {
        autoDiscEl.style.display = 'block';
        autoDiscEl.innerHTML = discountLines.map(function(d) {
          return '<div class="side-cart-discount-line"><span class="side-cart-discount-line__tag">\\ud83c\\udff7 ' + d.title + '</span><span class="side-cart-discount-line__amount">-Rs. ' + d.amount + '</span></div>';
        }).join('');
      } else {
        autoDiscEl.style.display = 'none';
        autoDiscEl.innerHTML = '';
      }
    }

    var origSync = window.SideCart.syncShopify.bind(window.SideCart);
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
          updateAutoDiscounts(cart);
        })
        .catch(function() {});
    };
    window._updateAutoDiscounts = updateAutoDiscounts;
  })();
'''
    # Insert before the toast notification section
    js = js.replace("  /* ==========================================================\n     17. TOAST NOTIFICATION SYSTEM",
                     discount_js + "\n  /* ==========================================================\n     17. TOAST NOTIFICATION SYSTEM")
    # Try alternate line endings
    if "initSideCartDiscounts" not in js:
        js = js.replace("  /* ==========================================================\r\n     17. TOAST NOTIFICATION SYSTEM",
                         discount_js + "\n  /* ==========================================================\r\n     17. TOAST NOTIFICATION SYSTEM")

with open(js_path, "w", encoding="utf-8") as f:
    f.write(js)

# Verify
with open(js_path, "r", encoding="utf-8") as f:
    verify = f.read()
print(f"Rs. occurrences: {verify.count('Rs. ')}")
dollar_in_sub = "'$'" in verify
print(f"Dollar still in subtotal: {dollar_in_sub}")
print(f"Discount section: {'initSideCartDiscounts' in verify}")
print(f"FREE_SHIPPING = 9900: {'FREE_SHIPPING_THRESHOLD = 9900' in verify}")

# ============================================
# 3. UPDATE cart-drawer.liquid - Add discount code HTML
# ============================================
drawer_path = os.path.join(theme_dir, "snippets", "cart-drawer.liquid")
with open(drawer_path, "r", encoding="utf-8") as f:
    drawer = f.read()

if "side-cart-discount-section" not in drawer:
    discount_html = '''    <!-- Discount / Coupon Code -->
    <div class="side-cart-discount-section" id="side-cart-discount-section">
      <div class="side-cart-discount-toggle" id="side-cart-discount-toggle">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
        <span>Have a discount code?</span>
        <svg class="side-cart-discount-chevron" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="side-cart-discount-form" id="side-cart-discount-form" style="display: none;">
        <div class="side-cart-discount-input-wrap">
          <input type="text" class="side-cart-discount-input" id="side-cart-discount-input" placeholder="Enter discount code" autocomplete="off">
          <button type="button" class="side-cart-discount-apply" id="side-cart-discount-apply">Apply</button>
        </div>
        <div class="side-cart-discount-msg" id="side-cart-discount-msg" style="display: none;"></div>
      </div>
    </div>

    <!-- Automatic Discounts -->
    <div class="side-cart-auto-discounts" id="side-cart-auto-discounts" style="display: none;"></div>

'''
    # Insert right after the footer div opens
    drawer = drawer.replace('  <div class="side-cart-footer" id="side-cart-footer">\n    <div class="side-cart-subtotal-row">',
                            '  <div class="side-cart-footer" id="side-cart-footer">\n' + discount_html + '    <div class="side-cart-subtotal-row">')
    if "side-cart-discount-section" not in drawer:
        drawer = drawer.replace('  <div class="side-cart-footer" id="side-cart-footer">\r\n    <div class="side-cart-subtotal-row">',
                                '  <div class="side-cart-footer" id="side-cart-footer">\r\n' + discount_html + '    <div class="side-cart-subtotal-row">')

    with open(drawer_path, "w", encoding="utf-8") as f:
        f.write(drawer)
    print(f"Cart drawer updated: {'side-cart-discount-section' in drawer}")
else:
    print("Cart drawer already has discount section")

# ============================================
# 4. UPDATE theme.css - Add discount CSS
# ============================================
css_path = os.path.join(theme_dir, "assets", "theme.css")
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

if "side-cart-discount-section" not in css:
    discount_css = '''

/* ==========================================================
   SIDE CART DISCOUNT / COUPON CODE
   ========================================================== */
.side-cart-discount-section {
  padding: 0 0 16px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 16px;
}
.side-cart-discount-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #404040;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.2s ease;
}
.side-cart-discount-toggle:hover { color: #171717; }
.side-cart-discount-chevron {
  margin-left: auto;
  transition: transform 0.25s ease;
}
.side-cart-discount-toggle.is-open .side-cart-discount-chevron {
  transform: rotate(180deg);
}
.side-cart-discount-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}
.side-cart-discount-input-wrap {
  display: flex;
  gap: 8px;
}
.side-cart-discount-input {
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid #d4d4d4;
  border-radius: 6px;
  font-size: 13px;
  font-family: var(--font-body, 'Inter', sans-serif);
  outline: none;
  transition: border-color 0.2s ease;
}
.side-cart-discount-input:focus { border-color: #171717; }
.side-cart-discount-apply {
  padding: 10px 18px;
  background: #171717;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}
.side-cart-discount-apply:hover { background: #333; }
.side-cart-discount-apply:disabled { opacity: 0.5; cursor: not-allowed; }
.side-cart-discount-msg { font-size: 12px; padding: 6px 0; line-height: 1.4; }
.side-cart-discount-msg--success { color: #16a34a; }
.side-cart-discount-msg--error { color: #dc2626; }
.side-cart-auto-discounts { margin-bottom: 12px; }
.side-cart-discount-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  margin-bottom: 6px;
  font-size: 13px;
}
.side-cart-discount-line__tag { font-weight: 600; color: #166534; }
.side-cart-discount-line__amount { font-weight: 700; color: #16a34a; }
'''
    css += discount_css
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css)
    print("CSS discount styles added")
else:
    print("CSS already has discount styles")

print("\n=== ALL FIXES APPLIED SUCCESSFULLY ===")
