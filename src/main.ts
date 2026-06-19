import { initUI } from './core/ui';
import { initAnimations } from './core/animations';
import { initLightbox } from './features/lightbox/lightbox';
import { initOotdFeature } from './features/ootd/ootdApi';
import { initExchangeFeature } from './features/exchange/exchangeApi';
import { enableAdmin } from './lib/auth';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core UI (Menu, Navbar, Easter Egg)
    initUI();

    // 2. Scroll Animations
    initAnimations();

    // 3. Lightbox Feature
    initLightbox();

    // 4. OOTD Feature (Fetch, Upload, Like, Comment)
    initOotdFeature();

    // 5. Size Exchange Feature
    initExchangeFeature();
});

// Expose admin enable function globally
(window as any).enableAdmin = enableAdmin;

// Care Guide Functions (Exposed globally)
(window as any).checkWashing = () => {
    const errorMsg = document.getElementById('wash-error');
    if (errorMsg) errorMsg.classList.remove('hidden');
};

(window as any).checkIron = () => {
    const errorMsg = document.getElementById('iron-error');
    if (errorMsg) errorMsg.classList.remove('hidden');
};
