<script>
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

        searchInput.addEventListener('keyup', performSearch);
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

        function openMenu() {
            backdrop.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                backdrop.style.opacity = '1';
                mobileMenu.classList.add('is-open');
            }, 10);
        }

        function closeMenu() {
            backdrop.style.opacity = '0';
            mobileMenu.classList.remove('is-open');
            setTimeout(() => {
                backdrop.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }

        menuBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (e.target.closest('#planes-toggle-btn')) return;
                closeMenu();
            });
        });

        desktopPlansBtn.addEventListener('click', () => {
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

        document.addEventListener('click', (e) => {
            if (!document.getElementById('desktop-plans-menu-container').contains(e.target)) {
                 desktopPlansSubmenu.classList.add('opacity-0', '-translate-y-2');
                setTimeout(() => {
                    desktopPlansSubmenu.classList.add('hidden');
                }, 300);
            }
        });


	    // --- LÓGICA DE BOTONES PAYPAL (VERSIÓN FINAL Y CORREGIDA) ---
	
	    const handleSubscription = (data, planName, planId) => {
	        console.log(`Iniciando verificación para el plan ${planName} con ID de suscripción: ${data.subscriptionID}`);
	        
	        const VERIFY_URL = 'https://profcr-geminichat-backend-b9ca0429e705.herokuapp.com/api/verify-subscription';
	
	        fetch(VERIFY_URL, {
	            method: 'POST',
	            headers: { 'Content-Type': 'application/json' },
	            body: JSON.stringify({
	                subscriptionID: data.subscriptionID,
	                planId: planId,       // <-- ESTA LÍNEA ARREGLA LA CONEXIÓN
	                planName: planName    // <-- Y ESTA TAMBIÉN
	            })
	        })
	        .then(response => {
	            // Primero, verificamos si la respuesta del servidor fue exitosa (código 200)
	            if (!response.ok) {
	                // Si no, lanzamos un error para que lo capture el .catch()
	                throw new Error(`El servidor respondió con un error: ${response.status}`);
	            }
	            return response.json();
	        })
	        .then(result => {
	            if (result.status === 'verificado') {
	                alert(`¡Gracias por tu suscripción al plan ${planName}! Tu sitio web está siendo creado y recibirás un correo en breve.`);
	            } else {
	                // Esto podría pasar si la suscripción no está activa por alguna razón
	                alert('La verificación de tu pago no fue exitosa. Por favor, contacta a soporte.');
	            }
	        })
	        .catch(error => {
	            console.error('Error durante el proceso de verificación:', error);
	            alert('Ocurrió un error al conectar con nuestros servicios. Por favor, contacta a soporte para confirmar tu suscripción.');
	        });
	    };
	
	    // Botones de PayPal (cada uno llama a la función de arriba con los datos correctos)
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


        // --- LÓGICA DEL POPUP ---
        const popupContainer = document.getElementById('popup-container');
        const popupBackdrop = document.getElementById('popup-backdrop');
        const popupBox = document.getElementById('popup-box');
        const popupCloseBtn = document.getElementById('popup-close-btn');
        const popupActionBtn = document.getElementById('popup-action-btn');

        const showPopup = () => {
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
            popupBackdrop.classList.add('opacity-0');
            popupBox.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                popupContainer.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        };
        
        popupCloseBtn.addEventListener('click', () => hidePopup());
        popupActionBtn.addEventListener('click', () => hidePopup());
        popupBackdrop.addEventListener('click', () => hidePopup());

        setTimeout(showPopup, 7000);

        // --- LÓGICA DEL CHATBOT CON CONEXIÓN A GEMINI ---
        
        // CORRECCIÓN: Nunca se debe exponer una API Key en el código del cliente.
        // Guárdala en un entorno seguro en el servidor y crea un endpoint que tu frontend pueda llamar.
        const GEMINI_API_KEY = ""; // DEJA ESTO VACÍO. La plataforma lo gestionará.

        const chatToggleBtn = document.getElementById('chat-toggle-btn');
        const chatWindow = document.getElementById('chat-window');
        const chatIconOpen = document.getElementById('chat-icon-open');
        const chatIconClose = document.getElementById('chat-icon-close');
        const chatMessages = document.getElementById('chat-messages');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const chatSendBtn = document.getElementById('chat-send-btn');
        
        let conversationHistory = [];

        chatToggleBtn.addEventListener('click', () => {
            const isHidden = chatWindow.classList.contains('hidden');
            if (isHidden) {
                chatWindow.classList.remove('hidden');
                setTimeout(() => {
                    chatWindow.classList.remove('opacity-0', 'translate-y-4');
                }, 10);
                chatIconOpen.classList.add('hidden');
                chatIconClose.classList.remove('hidden');
            } else {
                chatWindow.classList.add('opacity-0', 'translate-y-4');
                setTimeout(() => {
                    chatWindow.classList.add('hidden');
                }, 300);
                chatIconOpen.classList.remove('hidden');
                chatIconClose.classList.add('hidden');
            }
        });

        const addMessage = (text, sender) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('flex', sender === 'user' ? 'justify-end' : 'justify-start');
            
            const bubble = document.createElement('div');
            bubble.classList.add('chat-bubble', 'p-3', 'rounded-lg');
            bubble.classList.add(sender === 'user' ? 'bg-blue-600' : 'bg-gray-200', sender === 'user' ? 'text-white' : 'text-gray-800');
            bubble.classList.add(sender === 'user' ? 'rounded-br-none' : 'rounded-bl-none');
            bubble.textContent = text;
            
            messageDiv.appendChild(bubble);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };
        
        const addTypingIndicator = () => {
            const typingDiv = document.createElement('div');
            typingDiv.id = 'typing-indicator';
            typingDiv.classList.add('flex', 'justify-start');
            typingDiv.innerHTML = `
                <div class="chat-bubble bg-gray-200 p-3 rounded-lg rounded-bl-none">
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>`;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };
        
        const removeTypingIndicator = () => {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();
        };

        const getGeminiResponse = async (userInput) => {
            // La URL de tu nuevo backend. Cuando lo despliegues, esta URL cambiará.
            const API_URL = 'https://profcr-geminichat-backend-b9ca0429e705.herokuapp.com/api/chat';

            // Preparamos el historial para enviarlo al backend
            const historyForApi = conversationHistory.map(item => ({
                role: item.role,
                parts: item.parts.map(p => ({ text: p.text }))
            }));

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        // Enviamos el historial y el nuevo mensaje por separado
                        history: historyForApi,
                        message: userInput
                    })
                });

                if (!response.ok) {
                    throw new Error(`Error en el servidor: ${response.statusText}`);
                }

                const data = await response.json();
                const aiResponse = data.response;

                // Actualizamos el historial localmente
                conversationHistory.push({ role: "user", parts: [{ text: userInput }] });
                conversationHistory.push({ role: "model", parts: [{ text: aiResponse }] });
                
                return aiResponse;

            } catch (error) {
                console.error("Error al contactar el backend:", error);
                return "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, intenta de nuevo más tarde.";
            }
        };

        // Modifica también la función handleChatSubmit para que no actualice el historial,
        // ya que getGeminiResponse ahora se encarga de eso.
        const handleChatSubmit = async (e) => {
            e.preventDefault();
            const userMessage = chatInput.value.trim();
            if (userMessage === '') return;

            addMessage(userMessage, 'user');
            chatInput.value = '';
            chatSendBtn.disabled = true;

            addTypingIndicator();

            // Llamamos a la función actualizada
            const aiResponse = await getGeminiResponse(userMessage);

            removeTypingIndicator();
            addMessage(aiResponse, 'ai');
            chatSendBtn.disabled = false;
        };

        chatForm.addEventListener('submit', handleChatSubmit);
        chatInput.addEventListener('input', () => {
            chatSendBtn.disabled = chatInput.value.trim() === '';
        });

		// CORRECCIÓN: Los 'await' de nivel superior solo funcionan en módulos de ES.
        // Se envolvieron en una función asíncrona autoejecutable para corregir el error de sintaxis.
        (async () => {
            try {
                // --- Ejemplo de Fetch a un endpoint de Github ---
                // Esto requeriría un backend para funcionar, es solo un ejemplo.
                // const response = await fetch('/github', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify({ endpoint: 'repos/ApoloSolInvictus/profcr', method: 'GET' })
                // });
                // const data = await response.json();
                console.log("Ejemplo de fetch a /github (simulado): listo.");

                // --- Ejemplo de Fetch para crear un sitio ---
                // Esto también requeriría un backend.
                // await fetch('/crear-sitio', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify({
                //     nombreCliente: "Juan Pérez",
                //     nombreSitio: "Portafolio Juan",
                //     descripcion: "Diseñador web en Costa Rica.",
                //     color: "#123456",
                //     emailCliente: "juan@correo.com"
                //   })
                // });
                console.log("Ejemplo de fetch a /crear-sitio (simulado): listo.");
            } catch (error) {
                console.error("Error en las funciones asíncronas de ejemplo:", error);
            }
		})();
    });
    </script>