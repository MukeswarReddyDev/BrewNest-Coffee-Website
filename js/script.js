// BrewNest Cafe Web App Interactivity Script

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let cart = JSON.parse(localStorage.getItem('coffee_cart')) || [];
  let currentCoupon = null;
  let activeCustomizerItem = null;

  // --- DETECT DIRECTORY PREFIX ---
  const isHtmlSubdir = window.location.pathname.includes('/html/') || window.location.pathname.includes('\\html\\');
  const imgPrefix = isHtmlSubdir ? '../' : '';

  // --- MENU DATA ---
  const menuItems = {
    espresso: { name: 'Espresso', price: 120, desc: 'Rich and bold coffee shot.', img: imgPrefix + 'images/espresso.jpg' },
    cappuccino: { name: 'Cappuccino', price: 180, desc: 'Creamy milk with espresso.', img: imgPrefix + 'images/cappuccino.jpg' },
    latte: { name: 'Latte', price: 200, desc: 'Smooth and delicious coffee.', img: imgPrefix + 'images/latte.jpg' },
    coldcoffee: { name: 'Cold Coffee', price: 220, desc: 'Refreshing chilled coffee.', img: imgPrefix + 'images/coldcoffee.jpg' },
    mocha: { name: 'Mocha', price: 250, desc: 'Chocolate flavored coffee.', img: imgPrefix + 'images/mocha.jpg' },
    americano: { name: 'Americano', price: 150, desc: 'Classic black coffee.', img: imgPrefix + 'images/americano.jpg' },
    flatwhite: { name: 'Flat White', price: 190, desc: 'Smooth ristretto shots with steamed milk and microfoam.', img: imgPrefix + 'images/flatwhite.jpg' },
    macchiato: { name: 'Macchiato', price: 140, desc: 'Bold espresso stained with a dollop of warm milk foam.', img: imgPrefix + 'images/macchiato.jpg' },
    affogato: { name: 'Affogato', price: 210, desc: 'Scoop of vanilla gelato drowned in a hot shot of espresso.', img: imgPrefix + 'images/affogato.jpg' },
    irishcoffee: { name: 'Irish Coffee', price: 280, desc: 'Rich coffee, brown sugar, and a collar of whipped cream.', img: imgPrefix + 'images/irishcoffee.jpg' },
    frappe: { name: 'Frappé', price: 240, desc: 'Chilled whipped instant coffee with cold milk and ice.', img: imgPrefix + 'images/frappe.jpg' },
    turkishcoffee: { name: 'Turkish Coffee', price: 170, desc: 'Traditional unfiltered coffee simmered in a copper pot.', img: imgPrefix + 'images/turkishcoffee.jpg' },
    cortado: { name: 'Cortado', price: 160, desc: 'Equal parts bold espresso and warm steamed milk.', img: imgPrefix + 'images/cortado.jpg' },
    viennacoffee: { name: 'Vienna Coffee', price: 230, desc: 'Double espresso shot topped with rich whipped cream.', img: imgPrefix + 'images/viennacoffee.jpg' },
    nitrocoldbrew: { name: 'Nitro Cold Brew', price: 260, desc: 'Slow-steeped cold brew infused with nitrogen for draft texture.', img: imgPrefix + 'images/nitrocoldbrew.jpg' }
  };

  // --- LIGHTBOX DATA ---
  const galleryImages = [
    imgPrefix + 'images/g1.jpg',
    imgPrefix + 'images/g2.jpg',
    imgPrefix + 'images/g3.jpg'
  ];
  let activeLightboxIndex = 0;

  // --- SELECTORS ---
  const navbar = document.querySelector('.navbar');
  const cartTrigger = document.getElementById('cart-trigger');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartClose = document.getElementById('cartClose');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartCountBadge = document.getElementById('cartCount');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDiscountEl = document.getElementById('cartDiscount');
  const cartGrandTotalEl = document.getElementById('cartGrandTotal');
  const couponInput = document.getElementById('couponInput');
  const btnApplyCoupon = document.getElementById('btnApplyCoupon');
  const btnCheckout = document.getElementById('btnCheckout');

  // Customizer Modal
  const drinkCustomizerModalEl = document.getElementById('drinkCustomizerModal');
  let drinkModal = null;
  if (drinkCustomizerModalEl) {
    drinkModal = new bootstrap.Modal(drinkCustomizerModalEl);
  }
  const modalDrinkImg = document.getElementById('modalDrinkImg');
  const modalDrinkName = document.getElementById('modalDrinkName');
  const modalDrinkDesc = document.getElementById('modalDrinkDesc');
  const modalDrinkPrice = document.getElementById('modalDrinkPrice');
  const btnConfirmAdd = document.getElementById('btnConfirmAdd');

  // Brew Configurator Sliders
  const sliderEspresso = document.getElementById('sliderEspresso');
  const sliderMilk = document.getElementById('sliderMilk');
  const sliderWater = document.getElementById('sliderWater');
  const sliderFoam = document.getElementById('sliderFoam');
  const sliderSyrup = document.getElementById('sliderSyrup');

  // Brew Layers
  const layerEspresso = document.getElementById('layerEspresso');
  const layerMilk = document.getElementById('layerMilk');
  const layerWater = document.getElementById('layerWater');
  const layerFoam = document.getElementById('layerFoam');
  const layerSyrup = document.getElementById('layerSyrup');

  // Brew text labels & recommend button
  const espressoValLabel = document.getElementById('espressoVal');
  const milkValLabel = document.getElementById('milkVal');
  const waterValLabel = document.getElementById('waterVal');
  const foamValLabel = document.getElementById('foamVal');
  const syrupValLabel = document.getElementById('syrupVal');
  const recommendedDrinkName = document.getElementById('recommendedDrinkName');
  const recommendedDrinkDesc = document.getElementById('recommendedDrinkDesc');
  const btnBrewAdd = document.getElementById('btnBrewAdd');

  // --- INITIALIZE ---
  updateCartUI();
  initNavbarScroll();
  initGalleryLightbox();
  initBrewConfigurator();
  initContactForm();

  // --- NAVBAR SCROLL EFFECT ---
  function initNavbarScroll() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Dynamic Active Link selection based on scroll position
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
      let currentSectionId = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop - 120) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // --- CART DRAWER OPEN/CLOSE ---
  if (cartTrigger) cartTrigger.addEventListener('click', toggleCart);
  if (cartClose) cartClose.addEventListener('click', toggleCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', toggleCart);

  function toggleCart() {
    cartDrawer.classList.toggle('open');
    cartBackdrop.classList.toggle('show');
  }

  function openCart() {
    cartDrawer.classList.add('open');
    cartBackdrop.classList.add('show');
  }

  // --- DRINK CUSTOMIZER MODAL CONTROLS ---
  document.querySelectorAll('.btn-add-cart-custom').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const drinkKey = btn.getAttribute('data-drink');
      openCustomizerModal(drinkKey);
    });
  });

  function openCustomizerModal(drinkKey) {
    const item = menuItems[drinkKey];
    if (!item) return;

    activeCustomizerItem = { ...item, key: drinkKey };

    // Set preview details
    modalDrinkImg.src = item.img;
    modalDrinkName.textContent = item.name;
    modalDrinkDesc.textContent = item.desc;
    modalDrinkPrice.textContent = `₹${item.price}`;

    // Reset options
    document.getElementById('milkWhole').checked = true;
    document.getElementById('sweetMedium').checked = true;
    document.querySelectorAll('.custom-addon').forEach(chk => chk.checked = false);
    document.getElementById('modalQty').textContent = '1';

    updateModalPrice();
    drinkModal.show();
  }

  // Handle customizations price updates
  const customOptions = document.querySelectorAll('#drinkCustomizerModal input');
  customOptions.forEach(opt => {
    opt.addEventListener('change', updateModalPrice);
  });

  // Quantity controllers inside modal
  const btnModalMinus = document.getElementById('btnModalMinus');
  const btnModalPlus = document.getElementById('btnModalPlus');
  const modalQtyEl = document.getElementById('modalQty');

  if (btnModalMinus && btnModalPlus) {
    btnModalMinus.addEventListener('click', () => {
      let qty = parseInt(modalQtyEl.textContent);
      if (qty > 1) {
        modalQtyEl.textContent = qty - 1;
        updateModalPrice();
      }
    });

    btnModalPlus.addEventListener('click', () => {
      let qty = parseInt(modalQtyEl.textContent);
      modalQtyEl.textContent = qty + 1;
      updateModalPrice();
    });
  }

  function calculateModalTotal() {
    if (!activeCustomizerItem) return 0;

    let base = activeCustomizerItem.price;

    // Milk addon
    const milkVal = document.querySelector('input[name="milkType"]:checked').value;
    if (milkVal === 'oat' || milkVal === 'almond') {
      base += 40;
    }

    // Addons
    if (document.getElementById('addonEspresso').checked) base += 50;
    if (document.getElementById('addonCream').checked) base += 30;
    if (document.getElementById('addonDrizzle').checked) base += 20;

    // Qty
    const qty = parseInt(modalQtyEl.textContent);
    return base * qty;
  }

  function updateModalPrice() {
    const total = calculateModalTotal();
    modalDrinkPrice.textContent = `₹${total}`;
  }

  // Confirm and Add from Modal
  if (btnConfirmAdd) {
    btnConfirmAdd.addEventListener('click', () => {
      const milkEl = document.querySelector('input[name="milkType"]:checked');
      const sweetEl = document.querySelector('input[name="sweetness"]:checked');
      
      const customizations = {
        milk: milkEl.value.charAt(0).toUpperCase() + milkEl.value.slice(1) + ' Milk',
        sweetness: sweetEl.value.charAt(0).toUpperCase() + sweetEl.value.slice(1),
        addons: []
      };

      if (document.getElementById('addonEspresso').checked) customizations.addons.push('Extra Shot');
      if (document.getElementById('addonCream').checked) customizations.addons.push('Whipped Cream');
      if (document.getElementById('addonDrizzle').checked) customizations.addons.push('Caramel Drizzle');

      const qty = parseInt(modalQtyEl.textContent);
      
      // Calculate unit price including addons
      let unitPrice = activeCustomizerItem.price;
      if (milkEl.value === 'oat' || milkEl.value === 'almond') unitPrice += 40;
      if (document.getElementById('addonEspresso').checked) unitPrice += 50;
      if (document.getElementById('addonCream').checked) unitPrice += 30;
      if (document.getElementById('addonDrizzle').checked) unitPrice += 20;

      // Unique key based on configurations to prevent merging different drinks
      const configSignature = `${activeCustomizerItem.key}-${milkEl.value}-${sweetEl.value}-${customizations.addons.join(',')}`;

      // Check if identical item is already in cart
      const existingIndex = cart.findIndex(i => i.signature === configSignature);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += qty;
      } else {
        cart.push({
          signature: configSignature,
          key: activeCustomizerItem.key,
          name: activeCustomizerItem.name,
          img: activeCustomizerItem.img,
          unitPrice: unitPrice,
          quantity: qty,
          customs: customizations
        });
      }

      drinkModal.hide();
      updateCartUI();
      openCart();
    });
  }

  // --- CART STATE UPDATES ---
  function updateCartUI() {
    localStorage.setItem('coffee_cart', JSON.stringify(cart));
    
    // Count Badge
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalCount;
    cartCountBadge.style.display = totalCount > 0 ? 'flex' : 'none';

    // Clear Container
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-state">
          <i class="fs-1 mb-3">🛒</i>
          <h5>Your cart is empty</h5>
          <p class="text-muted">Select coffee drinks to order</p>
        </div>
      `;
      cartSubtotalEl.textContent = '₹0';
      cartDiscountEl.textContent = '₹0';
      cartGrandTotalEl.textContent = '₹0';
      btnCheckout.disabled = true;
      return;
    }

    btnCheckout.disabled = false;
    let subtotal = 0;

    cart.forEach((item, index) => {
      const itemCost = item.unitPrice * item.quantity;
      subtotal += itemCost;

      const addonsStr = item.customs.addons.length > 0 ? `, ${item.customs.addons.join(', ')}` : '';
      const customString = `${item.customs.milk}, ${item.customs.sweetness}${addonsStr}`;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.img}" class="cart-item-img">
        <div class="cart-item-info">
          <h6>${item.name}</h6>
          <div class="cart-item-customizations">${customString}</div>
          <div class="cart-item-qty">
            <button class="qty-btn btn-qty-minus" data-index="${index}">-</button>
            <span class="fw-bold">${item.quantity}</span>
            <button class="qty-btn btn-qty-plus" data-index="${index}">+</button>
          </div>
        </div>
        <div class="cart-item-price">
          <button class="cart-item-remove" data-index="${index}">✕</button>
          <span class="fw-bold">₹${itemCost}</span>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    // Subtotal
    cartSubtotalEl.textContent = `₹${subtotal}`;

    // Coupon calculation
    let discount = 0;
    if (currentCoupon === 'BREWNEST20') {
      discount = Math.round(subtotal * 0.20);
    } else if (currentCoupon === 'BREW10') {
      discount = Math.round(subtotal * 0.10);
    }

    cartDiscountEl.textContent = `₹${discount}`;
    cartGrandTotalEl.textContent = `₹${subtotal - discount}`;

    // Event listeners inside cart
    document.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          cart.splice(index, 1);
        }
        updateCartUI();
      });
    });

    document.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        cart[index].quantity++;
        updateCartUI();
      });
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        cart.splice(index, 1);
        updateCartUI();
      });
    });
  }

  // Apply Coupon
  if (btnApplyCoupon) {
    btnApplyCoupon.addEventListener('click', () => {
      const val = couponInput.value.trim().toUpperCase();
      if (val === 'BREWNEST20') {
        currentCoupon = 'BREWNEST20';
        alert('Promo code Applied! 20% discount added.');
        updateCartUI();
      } else if (val === 'BREW10') {
        currentCoupon = 'BREW10';
        alert('Promo code Applied! 10% discount added.');
        updateCartUI();
      } else if (val === '') {
        alert('Please enter a coupon code.');
      } else {
        alert('Invalid Coupon Code! Try BREWNEST20 or BREW10');
      }
    });
  }

  // Simulation Checkout Button
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      // Simulate Order Success
      const grandTotal = cartGrandTotalEl.textContent;
      alert(`Order Placed Successfully!\nTotal Paid: ${grandTotal}\nThank you for choosing BrewNest Cafe!`);
      cart = [];
      currentCoupon = null;
      couponInput.value = '';
      updateCartUI();
      toggleCart();
    });
  }

  // --- INTERACTIVE BREW CONFIGURATOR ---
  function initBrewConfigurator() {
    if (!sliderEspresso) return;

    function updateBrewLayers() {
      const espresso = parseInt(sliderEspresso.value);
      const milk = parseInt(sliderMilk.value);
      const water = parseInt(sliderWater.value);
      const foam = parseInt(sliderFoam.value);
      const syrup = parseInt(sliderSyrup.value);

      // Write values to labels
      espressoValLabel.textContent = `${espresso}%`;
      milkValLabel.textContent = `${milk}%`;
      waterValLabel.textContent = `${water}%`;
      foamValLabel.textContent = `${foam}%`;
      syrupValLabel.textContent = `${syrup}%`;

      // Sum ratios
      const total = espresso + milk + water + foam + syrup;
      const factor = total > 0 ? (100 / total) : 0;

      // Adjust heights proportionally inside the 100% limit of the cup
      const espressoHeight = (espresso * factor).toFixed(1);
      const milkHeight = (milk * factor).toFixed(1);
      const waterHeight = (water * factor).toFixed(1);
      const foamHeight = (foam * factor).toFixed(1);
      const syrupHeight = (syrup * factor).toFixed(1);

      layerEspresso.style.height = `${espressoHeight}%`;
      layerMilk.style.height = `${milkHeight}%`;
      layerWater.style.height = `${waterHeight}%`;
      layerFoam.style.height = `${foamHeight}%`;
      layerSyrup.style.height = `${syrupHeight}%`;

      // Display height percentage inside cup layers
      layerEspresso.textContent = espressoHeight > 10 ? `Espresso (${Math.round(espressoHeight)}%)` : '';
      layerMilk.textContent = milkHeight > 10 ? `Milk (${Math.round(milkHeight)}%)` : '';
      layerWater.textContent = waterHeight > 10 ? `Water (${Math.round(waterHeight)}%)` : '';
      layerFoam.textContent = foamHeight > 10 ? `Foam (${Math.round(foamHeight)}%)` : '';
      layerSyrup.textContent = syrupHeight > 10 ? `Syrup (${Math.round(syrupHeight)}%)` : '';

      // Determine Recipe matching
      let match = 'Custom Signature Cup';
      let desc = 'A personalized ratio of quality ingredients brewed by you.';
      let drinkKey = '';

      if (espresso > 40 && milk === 0 && water === 0 && foam === 0 && syrup === 0) {
        match = 'Espresso';
        desc = 'A clean, bold extract of our finest signature roasted beans.';
        drinkKey = 'espresso';
      } else if (espresso > 25 && water > 45 && milk === 0 && foam === 0) {
        match = 'Americano';
        desc = 'Hot water poured over double shots of bold espresso.';
        drinkKey = 'americano';
      } else if (espresso > 15 && milk > 40 && foam > 20 && syrup === 0) {
        match = 'Cappuccino';
        desc = 'Perfect harmony of espresso, velvet steamed milk, and rich foam.';
        drinkKey = 'cappuccino';
      } else if (espresso > 15 && milk > 55 && foam <= 15 && syrup === 0) {
        match = 'Latte';
        desc = 'Smooth espresso blended with sweet, creamy steamed milk.';
        drinkKey = 'latte';
      } else if (espresso > 15 && milk > 40 && syrup > 15) {
        match = 'Mocha';
        desc = 'A chocolate-infused latte with a sweet cocoa finish.';
        drinkKey = 'mocha';
      } else if (espresso > 10 && milk > 50 && syrup === 0 && water === 0 && foam === 0) {
        match = 'Cold Coffee';
        desc = 'Chilled milk and coffee blended together for a refreshing finish.';
        drinkKey = 'coldcoffee';
      }

      recommendedDrinkName.textContent = match;
      recommendedDrinkDesc.textContent = desc;

      // Enable Add recommendation button
      if (drinkKey) {
        btnBrewAdd.disabled = false;
        btnBrewAdd.textContent = `Customize & Order ${match}`;
        btnBrewAdd.setAttribute('data-drink-match', drinkKey);
      } else {
        btnBrewAdd.disabled = true;
        btnBrewAdd.textContent = 'Mix components to match menu';
      }
    }

    // Attach listeners
    [sliderEspresso, sliderMilk, sliderWater, sliderFoam, sliderSyrup].forEach(slider => {
      slider.addEventListener('input', updateBrewLayers);
    });

    // Button trigger
    btnBrewAdd.addEventListener('click', () => {
      const matchKey = btnBrewAdd.getAttribute('data-drink-match');
      if (matchKey) {
        openCustomizerModal(matchKey);
      }
    });

    // Initial trigger
    updateBrewLayers();
  }

  // --- GALLERY LIGHTBOX ---
  function initGalleryLightbox() {
    const lightboxModal = document.getElementById('lightboxModal');
    if (!lightboxModal) return;

    const lightboxImg = lightboxModal.querySelector('.lightbox-img');
    const lightboxClose = lightboxModal.querySelector('.lightbox-close');
    const lightboxPrev = lightboxModal.querySelector('.lightbox-prev');
    const lightboxNext = lightboxModal.querySelector('.lightbox-next');

    // Click images to open
    document.querySelectorAll('.gallery-grid img').forEach((img, idx) => {
      img.addEventListener('click', () => {
        activeLightboxIndex = idx;
        openLightbox();
      });
    });

    function openLightbox() {
      lightboxImg.src = galleryImages[activeLightboxIndex];
      lightboxModal.style.display = 'flex';
      setTimeout(() => {
        lightboxModal.classList.add('show');
      }, 50);
    }

    function closeLightbox() {
      lightboxModal.classList.remove('show');
      setTimeout(() => {
        lightboxModal.style.display = 'none';
      }, 300);
    }

    function prevImage() {
      activeLightboxIndex = (activeLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[activeLightboxIndex];
    }

    function nextImage() {
      activeLightboxIndex = (activeLightboxIndex + 1) % galleryImages.length;
      lightboxImg.src = galleryImages[activeLightboxIndex];
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

    // Click backdrop to close
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightboxModal.classList.contains('show')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      }
    });
  }

  // --- CONTACT AND NEWSLETTER SUBMISSIONS ---
  function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const msg = document.getElementById('contactMsg').value.trim();

        if (!name || !email || !msg) {
          alert('Please fill out all fields.');
          return;
        }

        const btn = contactForm.querySelector('button');
        const origText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Sending Message...';

        setTimeout(() => {
          alert(`Thank you, ${name}! Your message has been sent. We'll reply to ${email} soon.`);
          contactForm.reset();
          btn.disabled = false;
          btn.textContent = origText;
        }, 1500);
      });
    }

    // Newsletter footer
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input');
        const email = emailInput.value.trim();
        
        if (!email) return;

        alert(`Subscribed successfully with: ${email}!\nCheck your inbox for a free promo code.`);
        newsletterForm.reset();
      });
    }
  }
});
