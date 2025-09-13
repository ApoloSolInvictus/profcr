document.addEventListener('DOMContentLoaded', () => {

    // --- BASE DE DATOS LOCAL DE EJEMPLO ---
    const database = [
        { name: 'Arq. Sofía Castro', category: 'Plan Esencial', location: 'Ejemplo', description: 'Diseño de CV Digital en ProfCR, si desea obtenerlo siga las instrucciones de este sitio web.', imageUrl: 'images/modelo1.jpg', subdomain: 'esencial', tags: ['arquitecta', 'diseño', 'planos', 'construccion', 'cartago', 'sofia', 'castro'] },
        { name: 'Barbería Luka', category: 'Plan Crecimiento', location: 'San Pedro', description: 'Diseño de Portafolios en ProfCR, ahora utilice el buscador de perfiles, escriba sólo una "s" y vea todos.', imageUrl: 'images/modelo2.jpg', subdomain: 'crecimiento', tags: ['barberia', 'san pedro', 'cortes', 'pelo', 'barba', 'luka'] },
        { name: 'Abogados García & Asoc.', category: 'Plan Impacto', location: 'San José', description: 'Diseño de Blog en ProfCR, si después de ver todo le interesa un sitio web, eliga un plan y suscribase.', imageUrl: 'images/modelo3.jpg', subdomain: 'impacto', tags: ['abogados', 'legal', 'san jose', 'familia', 'comercial', 'garcia'] },
        { name: 'Maskotitas', category: 'Veterinaria', location: 'Rohrmoser', description: 'Especialistas en cirugías de mascotas, y tienda de productos y medicinas de veterinaria.', imageUrl: 'images/modelo4.jpg', subdomain: 'modelo4', tags: ['veterinario', 'mascotas', 'san jose', 'familia', 'cirugia', 'maskotitas'] },
        { name: 'Barbería Europa', category: 'Cuidado Personal', location: 'Rohrmoser', description: 'Especialistas en cortes de pelo europeos y clásicos estilos.', imageUrl: 'images/modelo5.jpg', subdomain: 'modelo5', tags: ['barberia', 'san jose', 'cortes', 'pelo', 'barba', 'europa'] },
        { name: 'Arq. Ronny Woods', category: 'Arquitectura y Diseño', location: 'Rohrmoser', description: 'Diseño de planos arquitectónicos para proyectos residenciales y comerciales. Creatividad y funcionalidad.', imageUrl: 'images/modelo6.jpg', subdomain: 'modelo6', tags: ['arquitecta', 'diseño', 'planos', 'construccion', 'san jose', 'ronny', 'woods'] },
        { name: 'Ing. Osvaldo Pérez', category: 'Ingeniero Civil', location: 'Rohrmoser', description: 'Especialistas en construcciones y firmas de planos de ingeniería.', imageUrl: 'images/modelo7.jpg', subdomain: 'modelo7', tags: ['ingeniero', 'diseño', 'planos', 'construccion', 'san jose', 'osvaldo', 'perez'] },
        { name: 'Ing. Kamil Gutierrez', category: 'Ingeniero Civil', location: 'Pavas', description: 'Especialistas en construcciones y firmas de planos de ingeniería.', imageUrl: 'images/modelo8.jpg', subdomain: 'modelo8', tags: ['ingeniero', 'diseño', 'planos', 'construccion', 'san jose', 'kamil', 'gutierrez'] },
        { name: 'Petshop K', category: 'Veterinaria', location: 'Rohrmoser', description: 'Especialistas en cirugías de mascotas, y tienda de productos y medicinas de veterinaria.', imageUrl: 'images/modelo9.jpg', subdomain: 'modelo9', tags: ['veterinario', 'mascotas', 'san jose', 'familia', 'cirugia', 'petshop'] },
    ];

    // --- LÓGICA DEL BUSCADOR ---
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const resultsTitle = document.getElementById('results-title');

    const renderResults = (data) => {
        if (!resultsContainer) return;
        resultsContainer.innerHTML = '';
        if (data.length === 0) {
            resultsContainer.innerHTML = `<p class="col-span-full text-center text-gray-500">No se encontraron resultados para tu búsqueda.</p>`;
            return;
        }
        data.forEach((item, index) => {
            const profileUrl = `https://${item.subdomain}.profcr.com`;
            const card = `
            <a href="${profileUrl}" target="_blank" class="block bg-white rounded-2xl overflow-hidden card-hover border border-gray-200/50 animate-fade-in-up" style="animation-delay: ${index * 100}ms;">
                <div class="w-full h-56 bg-gray-200">
                    <img src="${item.imageUrl}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/eeeeee/999999?text=Imagen+no+disponible';">
                </div>
                <div class="p-6">
                    <p class="text-sm font-medium text-blue-600 mb-1">${item.category} • ${item.location}</p>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">${item.name}</h3>
                    <p class="text-gray-600 text-sm">${item.description}</p>
                </div>
            </a>`;
            resultsContainer.innerHTML += card;
        });
    };
    
    const performSearch = () => {
        if (!searchInput || !resultsTitle) return;
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            resultsTitle.textContent = 'Últimos profesionales agregados';
            renderResults(database.slice(0, 3));
            return;
        }
        resultsTitle.textContent = 'Resultados de la búsqueda';
        const filteredData = database.filter(item => {
            const searchableString = `${item.name} ${item.category} ${item.location} ${item.tags.join(' ')}`.toLowerCase();
            return searchableString.includes(query);
        });
        renderResults(filteredData.slice(0, 9));
    };

    if (searchInput) {
        searchInput.addEventListener('keyup', performSearch);
    }
    renderResults(database.slice(0, 3));

    // --- LÓGICA DE MENÚ MÓVIL Y DESKTOP ---
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('menu-backdrop');
    const menuLinks = document.querySelectorAll('.menu-link');
    const planesToggleBtn = document.getElementById('planes-toggle-btn');
    const planesSubmenu = document.getElementById('planes-submenu');
    const planesChevron = document.getElementById('planes-chevron');
    const desktopPlansBtn = document.getElementById('desktop-plans-btn');
    const desktopPlansSubmenu = document.getElementById('desktop-plans-submenu');

    if (planesToggleBtn && planesSubmenu && planesChevron) {
        planesToggleBtn.addEventListener('click', () => {
            const isOpen = planesSubmenu.style.maxHeight;
            if (isOpen && isOpen !== '0px') {
                planesSubmenu.style.maxHeight = '0px';
                planesChevron.style.transform = 'rotate(0deg)';
            } else {
                planesSubmenu.style.maxHeight = planesSubmenu.scrollHeight + 'px';
                planesChevron.style.transform = 'rotate(180deg)';
            }
        });
    }

    function openMenu() {
        if (!backdrop || !mobileMenu) return;
        backdrop.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            backdrop.style.opacity = '1';
            mobileMenu.classList.add('is-open');
        }, 10);
    }

    function closeMenu() {
        if (!backdrop || !mobileMenu) return;
        backdrop.style.opacity = '0';
        mobileMenu.classList.remove('is-open');
        setTimeout(() => {
            backdrop.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.target.closest('#planes-toggle-btn')) return;
            closeMenu();
        });
    });

    if (desktopPlansBtn) {
        desktopPlansBtn.addEventListener('click', () => {
            if (!desktopPlansSubmenu) return;
            const isHidden = desktopPlansSubmenu.classList.contains('hidden');
            if (isHidden) {
                desktopPlansSubmenu.classList.remove('hidden');
                setTimeout(() => {
                    desktopPlansSubmenu.classList.remove('opacity-0', '-translate-y-2');
                }, 10);
            } else {
                desktopPlansSubmenu.classList.add('opacity-0', '-translate-y-2');
                setTimeout(() => {
                    desktopPlansSubmenu.classList.add('hidden');
                }, 300);
            }
        });
    }

    document.addEventListener('click', (e) => {
        const menuContainer = document.getElementById('desktop-plans-menu-container');
        if (menuContainer && !menuContainer.contains(e.target)) {
            if (desktopPlansSubmenu) {
                desktopPlansSubmenu.classList.add('opacity-0', '-translate-y-2');
                setTimeout(() => {
                    desktopPlansSubmenu.classList.add('hidden');
                }, 300);
            }
        }
    });

    // --- LÓGICA DE BOTONES PAYPAL ---
    const handleSubscription = (data, planName, planId) => {
        console.log(`Iniciando verificación para el plan ${planName} con ID de suscripción: ${data.subscriptionID}`);
        const VERIFY_URL = 'https://profcr-geminichat-backend-b9ca0429e705.herokuapp.com/api/verify-subscription';
        fetch(VERIFY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subscriptionID: data.subscriptionID,
                planId: planId,
                planName: planName
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`El servidor respondió con un error: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.status === 'verificado') {
                alert(`¡Gracias por tu suscripción al plan ${planName}! Tu sitio web está siendo creado y recibirás un correo en breve.`);
            } else {
                alert('La verificación de tu pago no fue exitosa. Por favor, contacta a soporte.');
            }
        })
        .catch(error => {
            console.error('Error durante el proceso de verificación:', error);
            alert('Ocurrió un error al conectar con nuestros servicios. Por favor, contacta a soporte para confirmar tu suscripción.');
        });
    };

    if (typeof paypal !== 'undefined') {
        paypal.Buttons({
            style: { shape: 'pill', color: 'blue', layout: 'vertical', label: 'subscribe' },
            createSubscription: (data, actions) => actions.subscription.create({ plan_id: 'P-8KD45673HW2618100NCYUADY' }),
            onApprove: (data, actions) => handleSubscription(data, 'Esencial', 'P-8KD45673HW2618100NCYUADY')
        }).render('#paypal-button-container-P-8KD45673HW2618100NCYUADY');

        paypal.Buttons({
            style: { shape: 'pill', color: 'gold', layout: 'vertical', label: 'subscribe' },
            createSubscription: (data, actions) => actions.subscription.create({ plan_id: 'P-1T955501L66107610NCYUMBI' }),
            onApprove: (data, actions) => handleSubscription(data, 'Crecimiento', 'P-1T955501L66107610NCYUMBI')
        }).render('#paypal-button-container-P-1T955501L66107610NCYUMBI');

        paypal.Buttons({
            style: { shape: 'pill', color: 'black', layout: 'vertical', label: 'subscribe' },
            createSubscription: (data, actions) => actions.subscription.create({ plan_id: 'P-9DB8761963542112PNCYUFHY' }),
            onApprove: (data, actions) => handleSubscription(data, 'Impacto', 'P-9DB8761963542112PNCYUFHY')
        }).render('#paypal-button-container-P-9DB8761963542112PNCYUFHY');
    }

    // --- LÓGICA DEL POPUP ---
    const popupContainer = document.getElementById('popup-container');
    const popupBackdrop = document.getElementById('popup-backdrop');
    const popupBox = document.getElementById('popup-box');
    const popupCloseBtn = document.getElementById('popup-close-btn');
    const popupActionBtn = document.getElementById('popup-action-btn');

    const showPopup = () => {
        if (!popupContainer || !popupBackdrop || !popupBox) return;
        const popupShown = sessionStorage.getItem('profcrPopupShown');
        if (popupShown) return;
        popupContainer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            popupBackdrop.classList.remove('opacity-0');
            popupBox.classList.remove('opacity-0', 'scale-95');
        }, 10);
        sessionStorage.setItem('profcrPopupShown', 'true');
    };

    const hidePopup = () => {
        if (!popupContainer || !popupBackdrop || !popupBox) return;
        popupBackdrop.classList.add('opacity-0');
        popupBox.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            popupContainer.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };
    
    if (popupCloseBtn) popupCloseBtn.addEventListener('click', hidePopup);
    if (popupActionBtn) popupActionBtn.addEventListener('click', hidePopup);
    if (popupBackdrop) popupBackdrop.addEventListener('click', hidePopup);

    setTimeout(showPopup, 7000);

});
