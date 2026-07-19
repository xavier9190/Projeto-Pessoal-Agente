class AppSidebar extends HTMLElement {
    connectedCallback() {
        this.render();
        this.setupNavigation();
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.pathname, false);
        });
    }

    render() {
        const currentPath = window.location.pathname;
        
        // Define default classes for active and inactive links
        const activeClass = "text-primary font-bold border-r-2 border-primary bg-surface-container-high transition-colors flex items-center gap-3 px-4 py-3 rounded-l-lg";
        const inactiveClass = "text-on-surface-variant flex items-center gap-3 px-4 py-3 hover:bg-surface-container-highest transition-colors rounded-lg group";

        const isChat = currentPath.endsWith('index.html') || currentPath.endsWith('/');
        const isFinanceiro = currentPath.includes('financeiro.html');
        const isCalendario = currentPath.includes('calendario.html');

        this.innerHTML = `
<aside class="flex flex-col h-screen fixed left-0 top-0 w-sidebar-width border-r border-outline-variant bg-surface z-50">
    <div class="p-8">
        <h1 class="font-display-lg text-display-lg font-bold text-primary dark:text-primary">Hub</h1>
        <p class="text-on-surface-variant font-body-md text-body-md opacity-60">Produtividade</p>
    </div>
    <nav class="shrink-0 mt-4 px-4 space-y-2">
        <a href="index.html" class="${isChat ? activeClass : inactiveClass}">
            <span class="material-symbols-outlined ${isChat ? '' : 'group-hover:text-primary'}" data-icon="chat">chat</span>
            <span class="font-body-md text-body-md ${isChat ? '' : 'group-hover:text-primary'}">Chat</span>
        </a>
        <a href="financeiro.html" class="${isFinanceiro ? activeClass : inactiveClass}">
            <span class="material-symbols-outlined ${isFinanceiro ? '' : 'group-hover:text-primary'}" data-icon="account_balance_wallet">account_balance_wallet</span>
            <span class="font-body-md text-body-md ${isFinanceiro ? '' : 'group-hover:text-primary'}">Dashboard Financeiro</span>
        </a>
        <a href="calendario.html" class="${isCalendario ? activeClass : inactiveClass}">
            <span class="material-symbols-outlined ${isCalendario ? '' : 'group-hover:text-primary'}" data-icon="calendar_month">calendar_month</span>
            <span class="font-body-md text-body-md ${isCalendario ? '' : 'group-hover:text-primary'}">Calendário</span>
        </a>
    </nav>

    <!-- Divider -->
    <hr class="mx-4 border-t border-outline-variant opacity-40">

    <!-- Histórico de Conversas -->
    <div class="px-4 pt-4 pb-2 flex-1 overflow-y-auto min-h-0">
        <p class="font-label-md text-label-md text-on-surface-variant opacity-60 uppercase tracking-widest mb-3 px-2">Histórico</p>
        <div class="space-y-1" id="chat-history-list">
            <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-highest transition-colors group cursor-pointer">
                <span class="material-symbols-outlined text-on-surface-variant opacity-60 text-lg group-hover:text-primary transition-colors" style="font-size:18px">chat_bubble</span>
                <div class="overflow-hidden flex-1">
                    <p class="font-body-md text-body-md text-on-surface truncate">Gastos do mês de julho</p>
                    <p class="text-on-surface-variant opacity-50 truncate" style="font-size:11px;line-height:16px">Hoje, 19:32</p>
                </div>
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-highest transition-colors group cursor-pointer">
                <span class="material-symbols-outlined text-on-surface-variant opacity-60 text-lg group-hover:text-primary transition-colors" style="font-size:18px">chat_bubble</span>
                <div class="overflow-hidden flex-1">
                    <p class="font-body-md text-body-md text-on-surface truncate">Reunião amanhã às 14h</p>
                    <p class="text-on-surface-variant opacity-50 truncate" style="font-size:11px;line-height:16px">Hoje, 17:05</p>
                </div>
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-highest transition-colors group cursor-pointer">
                <span class="material-symbols-outlined text-on-surface-variant opacity-60 text-lg group-hover:text-primary transition-colors" style="font-size:18px">chat_bubble</span>
                <div class="overflow-hidden flex-1">
                    <p class="font-body-md text-body-md text-on-surface truncate">Almoço — R$ 45</p>
                    <p class="text-on-surface-variant opacity-50 truncate" style="font-size:11px;line-height:16px">Ontem, 13:20</p>
                </div>
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-highest transition-colors group cursor-pointer">
                <span class="material-symbols-outlined text-on-surface-variant opacity-60 text-lg group-hover:text-primary transition-colors" style="font-size:18px">chat_bubble</span>
                <div class="overflow-hidden flex-1">
                    <p class="font-body-md text-body-md text-on-surface truncate">Planejamento financeiro</p>
                    <p class="text-on-surface-variant opacity-50 truncate" style="font-size:11px;line-height:16px">Seg., 10:41</p>
                </div>
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-highest transition-colors group cursor-pointer">
                <span class="material-symbols-outlined text-on-surface-variant opacity-60 text-lg group-hover:text-primary transition-colors" style="font-size:18px">chat_bubble</span>
                <div class="overflow-hidden flex-1">
                    <p class="font-body-md text-body-md text-on-surface truncate">Evento no Google Calendar</p>
                    <p class="text-on-surface-variant opacity-50 truncate" style="font-size:11px;line-height:16px">Dom., 09:15</p>
                </div>
            </a>
        </div>
    </div>

    <!-- Divider before user profile -->
    <hr class="mx-4 border-t border-outline-variant opacity-40">

    <div class="p-4 mt-2 mb-4">
        <div class="flex items-center gap-3 p-3 glass-panel rounded-xl">
            <img class="w-10 h-10 rounded-full border border-outline-variant object-cover" data-alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdIzylzSZrKbZG-UDMJg7VfehuamNW_pWz4JwWsGCu4qt1-2b8DL3zWdDSboJ4XPuieOelm8oUdMDb5UE49dsW-_lRkeZNkKP6Xlc0LAi6B4_HzCfjY8a1NyIlPjVeSauj1n4Lwn9_-ei3Zsd-sC76kRfuX03SDzpxceJbF6do9GRU9ctq95caMwKYXpnXJh5vXsm5ePDwq0HCRxULQZkQ2Ca-FhNNMfEiG6leMwEmAMFaD0LsHKRHxk4NbVLaIHsVb-Zo6hkSWvg">
            <div class="overflow-hidden">
                <p class="text-on-surface font-semibold truncate">Alexandre S.</p>
                <p class="text-on-surface-variant text-xs truncate">Premium Plan</p>
            </div>
        </div>
    </div>
</aside>
        `;
    }

    setupNavigation() {
        // Intercept clicks on the main navigation links
        const navLinks = this.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('http')) {
                    e.preventDefault();
                    this.loadPage(href, true);
                }
            });
        });
    }

    async loadPage(url, pushState = true) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to load ' + url);
            
            const html = await response.text();
            
            // Parse the new HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Replace Header
            const newHeader = doc.querySelector('header');
            const currentHeader = document.querySelector('header');
            if (newHeader && currentHeader) {
                currentHeader.outerHTML = newHeader.outerHTML;
            }
            
            // Replace Main Content
            const newMain = doc.querySelector('main');
            const currentMain = document.querySelector('main');
            if (newMain && currentMain) {
                currentMain.outerHTML = newMain.outerHTML;
            }

            // Execute scripts inside main/header
            const scripts = document.querySelectorAll('main script, header script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) newScript.src = script.src;
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
            });

            // Update URL
            if (pushState) {
                window.history.pushState({}, '', url);
            }

            // Update title
            if (doc.title) {
                document.title = doc.title;
            }

            // Re-render sidebar to update active state
            this.render();
            this.setupNavigation(); // Re-bind events to new DOM
            
        } catch (error) {
            console.error('Error navigating:', error);
            // Fallback to normal navigation if fetch fails
            window.location.href = url;
        }
    }
}
customElements.define('app-sidebar', AppSidebar);
