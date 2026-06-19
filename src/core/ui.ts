export function initUI() {
    // Material Drawer Mobile Menu Toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (btn && menu) {
        const icon = btn.querySelector('i')!;
        const mobileLinks = document.querySelectorAll('.mobile-link');

        function toggleMenu() {
            if (menu!.classList.contains('hidden')) {
                menu!.classList.remove('hidden');
                setTimeout(() => {
                    menu!.classList.add('opacity-100', 'scale-y-100');
                    menu!.classList.remove('opacity-0', 'scale-y-0');
                }, 10);
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                menu!.classList.add('opacity-0', 'scale-y-0');
                menu!.classList.remove('opacity-100', 'scale-y-100');
                setTimeout(() => {
                    menu!.classList.add('hidden');
                }, 300);
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }

        menu.classList.add('opacity-0', 'scale-y-0');
        btn.addEventListener('click', toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!menu!.classList.contains('hidden')) {
                    toggleMenu();
                }
            });
        });
    }

    // Material Top App Bar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('shadow-md-2', 'bg-[#0072CE]/95', 'backdrop-blur-md');
                navbar.classList.remove('bg-[#0072CE]');
            } else {
                navbar.classList.remove('shadow-md-2', 'bg-[#0072CE]/95', 'backdrop-blur-md');
                navbar.classList.add('bg-[#0072CE]');
            }
        });
    }

    // Easter Egg Keylogger
    let keys = '';
    const secret = 'jtk25';
    window.addEventListener('keydown', (e) => {
        keys += e.key.toLowerCase();
        if (keys.endsWith(secret)) {
            const modal = document.getElementById('matrix-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
            keys = '';
        }
    });
}
