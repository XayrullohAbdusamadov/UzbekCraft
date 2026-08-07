/* ==========================================================================
   UZBEKCRAFT 3D GAME ENGINE - PROFESSIONAL LANDMARK EDITION
   ========================================================================== */

(function() {
  'use strict';

  // --- GAME CONFIGURATION ---
  const BLOCK_SIZE = 1;
  const CHUNK_HEIGHT_MAX = 150;
  const PLANET_CURVATURE = 0.0007;

  const BLOCKS = {
    AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, SAND: 4, SNOW: 5,
    WOOD: 6, LEAVES: 7, CACTUS: 8, COAL: 9, GOLD: 10, DIAMOND: 11,
    PLANKS: 12, LANTERN: 13, WATER: 14, BLUE_TILE: 15, RED_BRICK: 16,
    WHITE_MARBLE: 17, GLAZED_BLUE: 18, BEDROCK: 19, IRON: 20,
    DARK_STONE: 21, GLASS: 22, TERRACOTTA: 23, COPPER: 24,
    SWORD: 25, BOW: 26, BOMB: 27, SOFA: 28, TABLE: 29, CHAIR: 30, FLOWER: 31,
    AVTOMAT: 32, TORCH: 33, BUCKET: 34, WATER_BUCKET: 35,
    AVTOMAT: 32, TORCH: 33, BUCKET: 34, WATER_BUCKET: 35,
    AXE: 36, APPLE: 37, BREAD: 38, COOKED_MEAT: 39, MEAT_MUTTON: 40,
    PICKAXE: 41, SHOVEL: 42, HOE: 43, CRAFTING_TABLE: 44, FURNACE: 45,
    CHEST: 46, OBSIDIAN: 47, GLOWSTONE: 48, PUMPKIN: 49, HAY_BALE: 50, MOSSY_STONE: 51,
    WINDOW: 52, DOOR: 53, MEAT_EAGLE: 54
  };

  const BLOCK_INFO = {
    [BLOCKS.GRASS]:          { name: "O't",                 color: '#4caf50' },
    [BLOCKS.DIRT]:           { name: "Tuproq",               color: '#795548' },
    [BLOCKS.STONE]:          { name: "Tosh",                 color: '#9e9e9e' },
    [BLOCKS.SAND]:           { name: "Qum",                  color: '#fdd835' },
    [BLOCKS.SNOW]:           { name: "Qor",                  color: '#eceff1' },
    [BLOCKS.WOOD]:           { name: "Yog'och",              color: '#6d4c41' },
    [BLOCKS.LEAVES]:         { name: "Barg",                 color: '#388e3c' },
    [BLOCKS.CACTUS]:         { name: "Kaktus",               color: '#2e7d32' },
    [BLOCKS.COAL]:           { name: "Ko'mir",               color: '#455a64' },
    [BLOCKS.GOLD]:           { name: "Oltin",                color: '#ffd600' },
    [BLOCKS.DIAMOND]:        { name: "Olmos",                color: '#00bcd4' },
    [BLOCKS.PLANKS]:         { name: "Taxta",                color: '#a1887f' },
    [BLOCKS.LANTERN]:        { name: "Chiroq",               color: '#ff9800', isLuminous: true },
    [BLOCKS.WATER]:          { name: "Suv",                  color: '#1e88e5' },
    [BLOCKS.BLUE_TILE]:      { name: "Moviy Koshin",         color: '#29b6f6' },
    [BLOCKS.RED_BRICK]:      { name: "G'isht",              color: '#c62828' },
    [BLOCKS.WHITE_MARBLE]:   { name: "Oq Mramor",            color: '#f5f5f5' },
    [BLOCKS.GLAZED_BLUE]:    { name: "Zangori Koshin",       color: '#0288d1' },
    [BLOCKS.BEDROCK]:        { name: "Bedrock",              color: '#212121' },
    [BLOCKS.IRON]:           { name: "Temir",                color: '#b0bec5' },
    [BLOCKS.DARK_STONE]:     { name: "Qora Tosh",            color: '#37474f' },
    [BLOCKS.GLASS]:          { name: "Shisha",               color: '#80deea' },
    [BLOCKS.TERRACOTTA]:     { name: "Terrakota",            color: '#bf360c' },
    [BLOCKS.COPPER]:         { name: "Mis",                  color: '#ff7043' },
    [BLOCKS.SWORD]:          { name: "Qilich",               color: '#00bcd4', isWeapon: true },
    [BLOCKS.BOW]:            { name: "Kamon",                color: '#8d6e63', isWeapon: true },
    [BLOCKS.BOMB]:           { name: "Bomba",                color: '#ef5350', isWeapon: true },
    [BLOCKS.SOFA]:           { name: "Divan (Yotadigan)",   color: '#ab47bc', isFurniture: true },
    [BLOCKS.TABLE]:          { name: "Stol",                 color: '#8d6e63', isFurniture: true },
    [BLOCKS.CHAIR]:          { name: "Stul",                 color: '#a1887f', isFurniture: true },
    [BLOCKS.FLOWER]:         { name: "Gul",                  color: '#ec407a', isFurniture: true },
    [BLOCKS.AVTOMAT]:        { name: "Avtomat",              color: '#607d8b', isWeapon: true },
    [BLOCKS.TORCH]:          { name: "Mashala (Olov)",       color: '#ff5722', isLuminous: true, isFurniture: true },
    [BLOCKS.BUCKET]:         { name: "Chelak",               color: '#b0bec5', isWeapon: true },
    [BLOCKS.WATER_BUCKET]:   { name: "Suvli chelak",         color: '#29b6f6', isWeapon: true },
    [BLOCKS.AXE]:            { name: "Temir Bolta",          color: '#78909c', isWeapon: true },
    [BLOCKS.APPLE]:          { name: "Olma",                 color: '#ef5350', isWeapon: true, isFood: true, hungerRestore: 25 },
    [BLOCKS.BREAD]:          { name: "Non",                  color: '#ffa726', isWeapon: true, isFood: true, hungerRestore: 30 },
    [BLOCKS.COOKED_MEAT]:    { name: "Qovurilgan go'sht",    color: '#8d6e63', isWeapon: true, isFood: true, hungerRestore: 40 },
    [BLOCKS.MEAT_MUTTON]:    { name: "Qo'y go'shti",         color: '#e57373', isWeapon: true, isFood: true, hungerRestore: 30 },
    [BLOCKS.MEAT_EAGLE]:     { name: "Burgut go'shti",       color: '#d81b60', isWeapon: true, isFood: true, hungerRestore: 45 },
    [BLOCKS.WINDOW]:         { name: "Deraza (Oyna)",       color: '#80deea', isFurniture: true },
    [BLOCKS.DOOR]:           { name: "Yog'och Eshik",       color: '#a1887f', isFurniture: true },
    [BLOCKS.PICKAXE]:        { name: "Temir Kirka",          color: '#78909c', isWeapon: true, isPickaxe: true },
    [BLOCKS.SHOVEL]:         { name: "Temir Kurak",          color: '#78909c', isWeapon: true, isShovel: true },
    [BLOCKS.HOE]:            { name: "Temir Ketmon",         color: '#78909c', isWeapon: true, isHoe: true },
    [BLOCKS.CRAFTING_TABLE]: { name: "Hunarmandchilik stoli",color: '#8d6e63', isFurniture: true },
    [BLOCKS.FURNACE]:        { name: "Pechka (Furnace)",     color: '#546e7a', isFurniture: true },
    [BLOCKS.CHEST]:          { name: "Sandiq (Chest)",       color: '#a1887f', isFurniture: true },
    [BLOCKS.OBSIDIAN]:       { name: "Obsidian",             color: '#1a102f' },
    [BLOCKS.GLOWSTONE]:      { name: "Nurlanuvchi Tosh",     color: '#ffb300', isLuminous: true },
    [BLOCKS.PUMPKIN]:        { name: "Qovoq (Pumpkin)",      color: '#ef6c00', isFurniture: true },
    [BLOCKS.HAY_BALE]:       { name: "Somon Taxlami",        color: '#fbc02d' },
    [BLOCKS.MOSSY_STONE]:    { name: "Moxli Tosh",           color: '#558b2f' }
  };

  function getItemIconHTML(bId) {
    if (bId === undefined || bId === BLOCKS.AIR) return '';
    
    // Weapons/Tools
    if (bId === BLOCKS.SWORD) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Blade -->
        <path d="M28 4 L4 28 L2 26 L26 2 Z" fill="#00e5ff" stroke="#00acc1" stroke-width="1"/>
        <path d="M28 4 L14 18 L16 16 Z" fill="#e0f7fa"/>
        <!-- Guard -->
        <path d="M8 20 L4 24 L5 25 L9 21 Z" fill="#37474f"/>
        <path d="M20 8 L24 4 L25 5 L21 9 Z" fill="#37474f"/>
        <path d="M9 19 L13 23 L11 25 L7 21 Z" fill="#ffd600"/>
        <!-- Hilt -->
        <rect x="5" y="23" width="4" height="4" fill="#795548" transform="rotate(45 7 25)"/>
        <circle cx="4" cy="28" r="2" fill="#ffd600"/>
      </svg>`;
    }
    if (bId === BLOCKS.AXE) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Handle -->
        <line x1="8" y1="24" x2="24" y2="8" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>
        <!-- Axe Head -->
        <path d="M20 6 L26 12 L22 16 L18 10 Z" fill="#90a4ae" stroke="#37474f" stroke-width="1"/>
        <path d="M22 6 L28 10 L28 14 L24 10 Z" fill="#cfd8dc"/>
      </svg>`;
    }
    if (bId === BLOCKS.BOW) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Bow Limbs -->
        <path d="M26 6 C18 2, 8 8, 6 26" fill="none" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>
        <path d="M26 6 C22 10, 10 22, 6 26" fill="none" stroke="#5d4037" stroke-width="1"/>
        <!-- String -->
        <line x1="26" y1="6" x2="6" y2="26" stroke="#e0e0e0" stroke-width="1.5"/>
        <!-- Arrow -->
        <line x1="22" y1="22" x2="10" y2="10" stroke="#eeeeee" stroke-width="2"/>
        <polygon points="10,10 14,10 10,14" fill="#cfd8dc"/>
      </svg>`;
    }
    if (bId === BLOCKS.BOMB) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Red TNT Body -->
        <rect x="3" y="6" width="26" height="22" rx="2" fill="#ef5350" stroke="#b71c1c" stroke-width="1.5"/>
        <!-- Warning stripes -->
        <path d="M3 6 L10 6 L3 13 Z M18 6 L25 6 L11 20 L11 28 Z M29 20 L29 27 L28 28 L21 28 Z" fill="#ffeb3b" opacity="0.85"/>
        <!-- TNT Text -->
        <rect x="5" y="11" width="22" height="12" fill="#ffffff" rx="1"/>
        <text x="16" y="21" font-family="monospace" font-weight="900" font-size="10" text-anchor="middle" fill="#111111">TNT</text>
        <!-- Fuse -->
        <path d="M16 6 Q18 2, 22 2" fill="none" stroke="#ffb74d" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    }
    if (bId === BLOCKS.AVTOMAT) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Stock -->
        <path d="M2 14 L8 14 L8 22 L2 20 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="1"/>
        <!-- Body -->
        <rect x="8" y="15" width="14" height="5" fill="#37474f" stroke="#212121" stroke-width="1"/>
        <!-- Grip -->
        <rect x="15" y="20" width="3" height="6" transform="skewX(-15)" fill="#212121"/>
        <!-- Magazine -->
        <path d="M11 20 Q12 25, 9 28 L12 28 Q15 24, 14 20 Z" fill="#212121"/>
        <!-- Barrel -->
        <rect x="22" y="16" width="7" height="2" fill="#cfd8dc"/>
        <rect x="29" y="15" width="1" height="4" fill="#37474f"/>
      </svg>`;
    }
    if (bId === BLOCKS.TORCH) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Handle -->
        <rect x="13" y="16" width="6" height="14" rx="1" fill="#795548" stroke="#4e342e" stroke-width="1"/>
        <rect x="12" y="13" width="8" height="4" fill="#5d4037"/>
        <!-- Flame -->
        <path d="M16 2 C12 6, 12 12, 16 14 C20 12, 20 6, 16 2 Z" fill="#ff3d00"/>
        <path d="M16 5 C14 8, 14 12, 16 13 C18 12, 18 8, 16 5 Z" fill="#ffc107"/>
      </svg>`;
    }
    if (bId === BLOCKS.LANTERN) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Hanger ring -->
        <circle cx="16" cy="5" r="3" fill="none" stroke="#cfd8dc" stroke-width="2"/>
        <!-- Top cap -->
        <path d="M8 12 L24 12 L20 8 L12 8 Z" fill="#ffd600" stroke="#f57f17" stroke-width="1"/>
        <!-- Glass body -->
        <rect x="10" y="12" width="12" height="12" rx="1" fill="#fff9c4" opacity="0.8"/>
        <line x1="16" y1="12" x2="16" y2="24" stroke="#ffb300" stroke-width="1.5"/>
        <!-- Guard bars -->
        <rect x="9" y="12" width="14" height="12" fill="none" stroke="#f57f17" stroke-width="1.5"/>
        <!-- Bottom base -->
        <rect x="8" y="24" width="16" height="3" fill="#ffd600"/>
      </svg>`;
    }
    if (bId === BLOCKS.SOFA) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Backrest -->
        <rect x="4" y="6" width="24" height="12" rx="2" fill="#ab47bc" stroke="#7b1fa2" stroke-width="1.5"/>
        <!-- Left armrest -->
        <rect x="2" y="14" width="4" height="12" rx="1" fill="#8e24aa"/>
        <!-- Right armrest -->
        <rect x="26" y="14" width="4" height="12" rx="1" fill="#8e24aa"/>
        <!-- Seat cushions -->
        <rect x="6" y="16" width="20" height="8" rx="1" fill="#ba68c8"/>
        <!-- Legs -->
        <rect x="5" y="26" width="3" height="3" fill="#5d4037"/>
        <rect x="24" y="26" width="3" height="3" fill="#5d4037"/>
      </svg>`;
    }
    if (bId === BLOCKS.WINDOW) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Outer Frame -->
        <rect x="4" y="4" width="24" height="24" rx="2" fill="#80deea" stroke="#00acc1" stroke-width="2"/>
        <!-- Window Panes -->
        <line x1="16" y1="4" x2="16" y2="28" stroke="#00838f" stroke-width="2"/>
        <line x1="4" y1="16" x2="28" y2="16" stroke="#00838f" stroke-width="2"/>
        <!-- Glass shine -->
        <path d="M6 6 L12 6 L6 12 Z M18 18 L24 18 L18 24 Z" fill="#e0f7fa" opacity="0.6"/>
      </svg>`;
    }
    if (bId === BLOCKS.DOOR) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Door Frame & Body -->
        <rect x="6" y="2" width="20" height="28" rx="2" fill="#8d6e63" stroke="#4e342e" stroke-width="2"/>
        <!-- Door Panels -->
        <rect x="9" y="5" width="14" height="9" fill="#a1887f" stroke="#5d4037" stroke-width="1"/>
        <rect x="9" y="17" width="14" height="11" fill="#a1887f" stroke="#5d4037" stroke-width="1"/>
        <!-- Handle -->
        <circle cx="20" cy="16" r="2" fill="#ffd600"/>
      </svg>`;
    }
    if (bId === BLOCKS.MEAT_EAGLE) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Eagle Meat leg -->
        <path d="M8 20 C6 12, 14 6, 22 8 C26 12, 24 22, 16 22 Z" fill="#d81b60" stroke="#880e4f" stroke-width="1.5"/>
        <path d="M12 14 C14 10, 18 10, 20 12 Z" fill="#ff4081" opacity="0.6"/>
        <!-- Bone -->
        <line x1="8" y1="20" x2="4" y2="26" stroke="#f5f5f5" stroke-width="3" stroke-linecap="round"/>
        <circle cx="4" cy="26" r="2" fill="#e0e0e0"/>
      </svg>`;
    }
    if (bId === BLOCKS.TABLE) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Table top (inclined perspective) -->
        <polygon points="4,12 28,12 24,18 8,18" fill="#8d6e63" stroke="#5d4037" stroke-width="1.5"/>
        <!-- Legs -->
        <rect x="7" y="18" width="3" height="10" fill="#5d4037"/>
        <rect x="11" y="18" width="2" height="7" fill="#4e342e"/>
        <rect x="19" y="18" width="2" height="7" fill="#4e342e"/>
        <rect x="22" y="18" width="3" height="10" fill="#5d4037"/>
      </svg>`;
    }
    if (bId === BLOCKS.CHAIR) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Backrest rails -->
        <rect x="8" y="4" width="3" height="14" fill="#8d6e63"/>
        <rect x="21" y="4" width="3" height="14" fill="#8d6e63"/>
        <rect x="11" y="6" width="10" height="3" fill="#a1887f"/>
        <rect x="11" y="11" width="10" height="3" fill="#a1887f"/>
        <!-- Seat -->
        <polygon points="6,16 26,16 23,20 9,20" fill="#a1887f" stroke="#8d6e63" stroke-width="1"/>
        <!-- Legs -->
        <rect x="8" y="20" width="3" height="9" fill="#5d4037"/>
        <rect x="21" y="20" width="3" height="9" fill="#5d4037"/>
      </svg>`;
    }
    if (bId === BLOCKS.FLOWER) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Flower Pot -->
        <polygon points="11,22 21,22 19,30 13,30" fill="#bf360c" stroke="#870000" stroke-width="1"/>
        <!-- Stem -->
        <line x1="16" y1="22" x2="16" y2="12" stroke="#4caf50" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Leaves -->
        <path d="M16 18 Q12 16, 13 14 Q16 16, 16 18 Z" fill="#4caf50"/>
        <path d="M16 16 Q20 14, 19 12 Q16 14, 16 16 Z" fill="#4caf50"/>
        <!-- Flower Petals -->
        <circle cx="16" cy="10" r="4" fill="#ec407a"/>
        <circle cx="13" cy="8" r="3" fill="#e91e63"/>
        <circle cx="19" cy="8" r="3" fill="#e91e63"/>
        <circle cx="16" cy="6" r="3.5" fill="#f48fb1"/>
        <circle cx="16" cy="9" r="1.5" fill="#ffeb3b"/>
      </svg>`;
    }
    if (bId === BLOCKS.BUCKET) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <path d="M6 14 C6 4, 26 4, 26 14" fill="none" stroke="#cfd8dc" stroke-width="2"/>
        <polygon points="8,12 24,12 20,28 12,28" fill="#b0bec5" stroke="#78909c" stroke-width="1.5"/>
        <line x1="8" y1="17" x2="24" y2="17" stroke="#78909c" stroke-width="1.5"/>
      </svg>`;
    }
    if (bId === BLOCKS.WATER_BUCKET) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <path d="M6 14 C6 4, 26 4, 26 14" fill="none" stroke="#cfd8dc" stroke-width="2"/>
        <polygon points="8,12 24,12 20,28 12,28" fill="#b0bec5" stroke="#78909c" stroke-width="1.5"/>
        <polygon points="9.5,13 22.5,13 21,17 11,17" fill="#29b6f6"/>
        <line x1="8" y1="17" x2="24" y2="17" stroke="#78909c" stroke-width="1.5"/>
      </svg>`;
    }
    if (bId === BLOCKS.APPLE) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <path d="M16 4 C18 2, 22 4, 20 8 Z" fill="#4caf50"/>
        <line x1="16" y1="4" x2="16" y2="10" stroke="#5d4037" stroke-width="2"/>
        <path d="M16 10 C10 10, 5 14, 5 20 C5 26, 11 29, 16 27 C21 29, 27 26, 27 20 C27 14, 22 10, 16 10 Z" fill="#ef5350" stroke="#b71c1c" stroke-width="1.5"/>
        <circle cx="11" cy="15" r="2" fill="#ffffff" opacity="0.6"/>
      </svg>`;
    }
    if (bId === BLOCKS.BREAD) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <ellipse cx="16" cy="18" rx="13" ry="8" fill="#ffa726" stroke="#e65100" stroke-width="1.5"/>
        <path d="M9 16 L12 20 M14 15 L17 19 M19 14 L22 18" stroke="#ffe0b2" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    }
    if (bId === BLOCKS.COOKED_MEAT) {
      return getMeatIconHTML('#8d6e63', "Qovurilgan go'sht");
    }
    if (bId === BLOCKS.MEAT_MUTTON) {
      return getMeatIconHTML('#e57373', "Qo'y go'shti");
    }
    if (bId === BLOCKS.PICKAXE) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <line x1="8" y1="24" x2="24" y2="8" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>
        <path d="M12 6 C16 4, 26 4, 26 12 L22 14 C22 9, 17 8, 14 10 Z" fill="#90a4ae" stroke="#37474f" stroke-width="1"/>
      </svg>`;
    }
    if (bId === BLOCKS.SHOVEL) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <line x1="8" y1="24" x2="22" y2="10" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>
        <polygon points="20,6 26,12 22,16 16,10" fill="#90a4ae" stroke="#37474f" stroke-width="1"/>
      </svg>`;
    }
    if (bId === BLOCKS.HOE) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <line x1="8" y1="24" x2="22" y2="10" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>
        <path d="M22 10 L28 8 L24 16 L20 12 Z" fill="#90a4ae" stroke="#37474f" stroke-width="1"/>
      </svg>`;
    }
    if (bId === BLOCKS.CHEST) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <rect x="4" y="8" width="24" height="18" rx="2" fill="#a1887f" stroke="#4e342e" stroke-width="1.5"/>
        <line x1="4" y1="14" x2="28" y2="14" stroke="#4e342e" stroke-width="1.5"/>
        <rect x="14" y="12" width="4" height="5" fill="#ffd600" stroke="#f57f17" stroke-width="1"/>
      </svg>`;
    }
    if (bId === BLOCKS.FURNACE) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <rect x="4" y="6" width="24" height="20" rx="2" fill="#546e7a" stroke="#263238" stroke-width="1.5"/>
        <circle cx="16" cy="18" r="5" fill="#ff5722" stroke="#b71c1c" stroke-width="1"/>
        <circle cx="16" cy="18" r="2.5" fill="#ffeb3b"/>
      </svg>`;
    }
    if (bId === BLOCKS.PUMPKIN) {
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <rect x="14" y="3" width="4" height="4" fill="#388e3c"/>
        <rect x="4" y="7" width="24" height="20" rx="4" fill="#ef6c00" stroke="#e65100" stroke-width="1.5"/>
        <polygon points="10,12 13,15 7,15" fill="#212121"/>
        <polygon points="22,12 25,15 19,15" fill="#212121"/>
        <polygon points="16,16 18,18 14,18" fill="#212121"/>
        <path d="M9 22 L11 20 L13 22 L15 20 L17 22 L19 20 L21 22 L23 20" fill="none" stroke="#212121" stroke-width="1.5"/>
      </svg>`;
    }
    
    // Isometric 3D block representation
    const color = BLOCK_INFO[bId]?.color || '#9e9e9e';
    const adjustColor = (hex, percent) => {
      let num = parseInt(hex.replace('#',''), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (G<255?G<0?0:G:255)*0x100 + (B<255?B<0?0:B:255)).toString(16).slice(1);
    };
    const topColor = adjustColor(color, 15);
    const leftColor = adjustColor(color, -10);
    const rightColor = adjustColor(color, -25);
    
    return `<svg viewBox="0 0 32 32" width="100%" height="100%">
      <!-- Top Face -->
      <polygon points="16,4 28,10 16,16 4,10" fill="${topColor}" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
      <!-- Left Face -->
      <polygon points="4,10 16,16 16,28 4,22" fill="${leftColor}" stroke="rgba(0,0,0,0.15)" stroke-width="0.5"/>
      <!-- Right Face -->
      <polygon points="16,16 28,10 28,22 16,28" fill="${rightColor}" stroke="rgba(0,0,0,0.25)" stroke-width="0.5"/>
    </svg>`;
  }

  // --- AUDIO SYNTHESIZER ---
  class SoundEngine {
    constructor() { this.ctx = null; this.sfxVolume = 0.8; this.musicVolume = 0.6; this.musicTimer = null; }
    init() {
      if (!this.ctx) { const A = window.AudioContext || window.webkitAudioContext; if (A) this.ctx = new A(); }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }
    playSFX(type) {
      if (!this.ctx || this.sfxVolume <= 0) return;
      const t = this.ctx.currentTime;
      const createNoiseBuffer = (duration) => {
        const size = this.ctx.sampleRate * duration;
        const buf = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < size; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        return buf;
      };

      if (type === 'dig_loop') {
        const noise = this.ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(0.05);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500 + Math.random() * 300, t);
        filter.Q.value = 2.0;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08 * this.sfxVolume, t);
        gain.gain.linearRampToValueAtTime(0.005, t + 0.05);
        noise.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
        noise.start(t);
      } else if (type === 'break') {
        const noise = this.ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(0.18);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, t);
        filter.Q.value = 1.0;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
        noiseGain.gain.linearRampToValueAtTime(0.005, t + 0.18);
        noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(this.ctx.destination);
        noise.start(t);

        const osc = this.ctx.createOscillator();
        const thumpGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.14);
        thumpGain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
        thumpGain.gain.linearRampToValueAtTime(0.005, t + 0.14);
        osc.connect(thumpGain); thumpGain.connect(this.ctx.destination);
        osc.start(t); osc.stop(t + 0.14);
      } else if (type === 'place') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'triangle'; osc.frequency.setValueAtTime(90, t); osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);
        gain.gain.setValueAtTime(0.4 * this.sfxVolume, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.08);
        osc.start(t); osc.stop(t + 0.08);
      } else if (type === 'jump') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(150, t); osc.frequency.exponentialRampToValueAtTime(340, t + 0.15);
        gain.gain.setValueAtTime(0.25 * this.sfxVolume, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.15);
        osc.start(t); osc.stop(t + 0.15);
      } else if (type === 'famous') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(260, t); osc.frequency.exponentialRampToValueAtTime(200, t + 0.3);
        gain.gain.setValueAtTime(0.35 * this.sfxVolume, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
        osc.start(t); osc.stop(t + 0.3);
      } else if (type === 'swing') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'triangle'; osc.frequency.setValueAtTime(300, t); osc.frequency.exponentialRampToValueAtTime(100, t + 0.12);
        gain.gain.setValueAtTime(0.2 * this.sfxVolume, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.12);
        osc.start(t); osc.stop(t + 0.12);
      } else if (type === 'hit') {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1046.5, t); // C6
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.5, t); // E6

        gainNode.gain.setValueAtTime(0.2 * this.sfxVolume, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        osc1.start(t); osc1.stop(t + 0.15);
        osc2.start(t); osc2.stop(t + 0.15);
      } else if (type === 'shoot') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, t); osc.frequency.exponentialRampToValueAtTime(150, t + 0.1);
        gain.gain.setValueAtTime(0.18 * this.sfxVolume, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.1);
        osc.start(t); osc.stop(t + 0.1);
      } else if (type === 'pickup') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, t); // D5
        osc.frequency.setValueAtTime(880, t + 0.08); // A5
        gain.gain.setValueAtTime(0.2 * this.sfxVolume, t);
        gain.gain.linearRampToValueAtTime(0.001, t + 0.22);
        osc.start(t); osc.stop(t + 0.22);
      } else if (type === 'kill') {
        // Detailed whimpering animal cry followed by a dissolving pitch fall
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const noise = this.ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(0.55);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, t);
        filter.frequency.exponentialRampToValueAtTime(80, t + 0.55);

        const gainOsc = this.ctx.createGain();
        const gainNoise = this.ctx.createGain();

        osc1.connect(gainOsc);
        osc2.connect(gainOsc);
        gainOsc.connect(this.ctx.destination);

        noise.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(this.ctx.destination);

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(320, t);
        osc1.frequency.linearRampToValueAtTime(450, t + 0.12);
        osc1.frequency.exponentialRampToValueAtTime(90, t + 0.5);

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(160, t);
        osc2.frequency.linearRampToValueAtTime(225, t + 0.12);
        osc2.frequency.exponentialRampToValueAtTime(45, t + 0.5);

        gainOsc.gain.setValueAtTime(0.35 * this.sfxVolume, t);
        gainOsc.gain.linearRampToValueAtTime(0.45 * this.sfxVolume, t + 0.12);
        gainOsc.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        gainNoise.gain.setValueAtTime(0.15 * this.sfxVolume, t);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

        osc1.start(t); osc1.stop(t + 0.5);
        osc2.start(t); osc2.stop(t + 0.5);
        noise.start(t);
      } else if (type === 'explode') {
        const duration = 1.25;
        const noise = this.ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(duration);
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, t);
        filter.frequency.exponentialRampToValueAtTime(15, t + duration);
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1.4 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(t);
        
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(25, t + 0.7);
        oscGain.gain.setValueAtTime(1.8 * this.sfxVolume, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
        
        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.7);
      } else if (type === 'eat') {
        for (let i = 0; i < 3; i++) {
          const tSub = t + i * 0.08;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320 + Math.random() * 120, tSub);
          osc.frequency.linearRampToValueAtTime(110, tSub + 0.07);
          gain.gain.setValueAtTime(0.6 * this.sfxVolume, tSub);
          gain.gain.exponentialRampToValueAtTime(0.01, tSub + 0.07);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(tSub);
          osc.stop(tSub + 0.07);
        }
      }
    }
    startAmbientMusic() {
      // Ambient music disabled as requested
      return;
    }
  }
  const soundEngine = new SoundEngine();

  // --- HD TEXTURE ENGINE ---
  function createPixelTexture(blockId, side = 'all') {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const colors = {
      [BLOCKS.GRASS]: side === 'top' ? '#4caf50' : side === 'bottom' ? '#6d4c41' : '#5d4037',
      [BLOCKS.DIRT]: '#5d4037', [BLOCKS.STONE]: '#757575', [BLOCKS.SAND]: '#fbc02d',
      [BLOCKS.SNOW]: '#eceff1', [BLOCKS.WOOD]: side === 'top' ? '#8d6e63' : '#4e342e',
      [BLOCKS.LEAVES]: '#1b5e20', [BLOCKS.CACTUS]: '#1b5e20', [BLOCKS.COAL]: '#757575',
      [BLOCKS.GOLD]: '#757575', [BLOCKS.DIAMOND]: '#757575', [BLOCKS.PLANKS]: '#8d6e63',
      [BLOCKS.LANTERN]: '#ff9800', [BLOCKS.WATER]: '#0288d1', [BLOCKS.BLUE_TILE]: '#00acc1',
      [BLOCKS.RED_BRICK]: '#c62828', [BLOCKS.WHITE_MARBLE]: '#eeeeee',
      [BLOCKS.GLAZED_BLUE]: '#01579b', [BLOCKS.BEDROCK]: '#212121',
      [BLOCKS.IRON]: '#757575', [BLOCKS.DARK_STONE]: '#37474f',
      [BLOCKS.GLASS]: '#80deea', [BLOCKS.TERRACOTTA]: '#bf360c', [BLOCKS.COPPER]: '#ff7043',
      [BLOCKS.BOMB]: '#b71c1c', [BLOCKS.SOFA]: '#7b1fa2', [BLOCKS.TABLE]: '#5d4037',
      [BLOCKS.CHAIR]: '#6d4c41', [BLOCKS.FLOWER]: '#e91e63',
      [BLOCKS.AVTOMAT]: '#37474f', [BLOCKS.TORCH]: '#8d6e63',
      [BLOCKS.CRAFTING_TABLE]: '#8d6e63', [BLOCKS.FURNACE]: '#546e7a',
      [BLOCKS.CHEST]: '#a1887f', [BLOCKS.OBSIDIAN]: '#140d21',
      [BLOCKS.GLOWSTONE]: '#ffd600', [BLOCKS.PUMPKIN]: '#ef6c00',
      [BLOCKS.HAY_BALE]: side === 'top' ? '#fbc02d' : '#f57f17',
      [BLOCKS.MOSSY_STONE]: '#757575'
    };
    ctx.fillStyle = colors[blockId] || '#ffffff';
    ctx.fillRect(0, 0, 32, 32);

    // Random pixel noise for organic texture feel
    for (let x = 0; x < 32; x++) {
      for (let y = 0; y < 32; y++) {
        const r = (Math.random() - 0.5) * 26;
        ctx.fillStyle = r > 0 ? `rgba(255,255,255,${r / 200})` : `rgba(0,0,0,${-r / 200})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // --- GRASS SIDE DRIP ---
    if (blockId === BLOCKS.GRASS && side === 'side') {
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(0, 0, 32, 10);
      for (let x = 0; x < 32; x += 2) {
        const dropH = Math.floor(Math.random() * 6) + 2;
        ctx.fillRect(x, 10, 2, dropH);
      }
    }

    // --- WOOD BARK & RINGS ---
    if (blockId === BLOCKS.WOOD) {
      if (side === 'top') {
        ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 2;
        ctx.strokeRect(6, 6, 20, 20); ctx.strokeRect(12, 12, 8, 8);
      } else {
        ctx.fillStyle = '#3e2723';
        for (let x = 2; x < 32; x += 6) ctx.fillRect(x, 0, 2, 32);
      }
    }

    // --- CARVED PUMPKIN ---
    if (blockId === BLOCKS.PUMPKIN) {
      if (side === 'top') {
        ctx.fillStyle = '#2e7d32'; // Stem
        ctx.fillRect(12, 12, 8, 8);
        ctx.fillStyle = '#1b5e20';
        ctx.fillRect(14, 14, 4, 4);
      } else if (side === 'face') {
        // Carved Black Face with inner orange glow
        ctx.fillStyle = '#111111';
        // Left Eye (Triangle)
        ctx.beginPath(); ctx.moveTo(6, 8); ctx.lineTo(12, 8); ctx.lineTo(9, 14); ctx.fill();
        // Right Eye (Triangle)
        ctx.beginPath(); ctx.moveTo(20, 8); ctx.lineTo(26, 8); ctx.lineTo(23, 14); ctx.fill();
        // Nose
        ctx.beginPath(); ctx.moveTo(16, 14); ctx.lineTo(19, 17); ctx.lineTo(13, 17); ctx.fill();
        // Mouth
        ctx.fillRect(6, 20, 20, 8);
        ctx.fillStyle = '#ef6c00'; // Teeth
        ctx.fillRect(9, 20, 3, 3); ctx.fillRect(19, 20, 3, 3);
        ctx.fillRect(14, 25, 3, 3);
      } else {
        // Pumpkin vertical rib lines
        ctx.fillStyle = '#e65100';
        for (let x = 6; x < 32; x += 7) ctx.fillRect(x, 0, 2, 32);
      }
    }

    // --- HAY BALE ---
    if (blockId === BLOCKS.HAY_BALE) {
      if (side === 'top') {
        ctx.strokeStyle = '#f57f17'; ctx.lineWidth = 2;
        ctx.strokeRect(4, 4, 24, 24); ctx.strokeRect(10, 10, 12, 12);
      } else {
        // Yellow straw streaks
        ctx.fillStyle = '#fbc02d';
        for (let y = 2; y < 32; y += 4) ctx.fillRect(0, y, 32, 2);
        // Red cords
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(8, 0, 4, 32); ctx.fillRect(20, 0, 4, 32);
      }
    }

    // --- CRAFTING TABLE ---
    if (blockId === BLOCKS.CRAFTING_TABLE) {
      if (side === 'top') {
        ctx.fillStyle = '#5d4037'; ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#8d6e63'; ctx.fillRect(3, 3, 26, 26);
        ctx.strokeStyle = '#3e2723'; ctx.lineWidth = 1.5;
        ctx.strokeRect(3, 3, 26, 26);
        ctx.beginPath(); ctx.moveTo(16, 3); ctx.lineTo(16, 29); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(3, 16); ctx.lineTo(29, 16); ctx.stroke();
      } else {
        ctx.fillStyle = '#5d4037'; ctx.fillRect(0, 0, 32, 4);
        ctx.fillStyle = '#212121'; // Saw icon detail
        ctx.fillRect(6, 12, 16, 3); ctx.fillRect(20, 10, 3, 7);
      }
    }

    // --- FURNACE ---
    if (blockId === BLOCKS.FURNACE) {
      if (side === 'front') {
        ctx.fillStyle = '#212121'; ctx.fillRect(6, 10, 20, 16); // Opening
        ctx.fillStyle = '#ff5722'; ctx.fillRect(8, 16, 16, 8); // Fire
        ctx.fillStyle = '#ffeb3b'; ctx.fillRect(12, 18, 8, 4);  // Core flame
      }
    }

    // --- CHEST ---
    if (blockId === BLOCKS.CHEST) {
      ctx.fillStyle = '#3e2723'; ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#a1887f'; ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#212121'; ctx.fillRect(0, 14, 32, 3); // Latch seam
      if (side === 'front') {
        ctx.fillStyle = '#ffd600'; ctx.fillRect(14, 12, 4, 7); // Gold latch
        ctx.fillStyle = '#212121'; ctx.fillRect(15, 14, 2, 3);
      }
    }

    // --- GOLD ORE ---
    if (blockId === BLOCKS.GOLD) {
      ctx.fillStyle = '#ffd600';
      ctx.fillRect(6, 6, 6, 6); ctx.fillRect(18, 10, 8, 6);
      ctx.fillRect(10, 20, 6, 6); ctx.fillRect(22, 22, 5, 5);
    }

    // --- DIAMOND ORE ---
    if (blockId === BLOCKS.DIAMOND) {
      ctx.fillStyle = '#00acc1';
      ctx.fillRect(6, 6, 6, 6); ctx.fillRect(18, 10, 8, 6);
      ctx.fillRect(10, 20, 6, 6); ctx.fillRect(22, 22, 5, 5);
      ctx.fillStyle = '#80deea'; ctx.fillRect(8, 8, 3, 3); ctx.fillRect(20, 12, 3, 3);
    }

    // --- COAL ORE ---
    if (blockId === BLOCKS.COAL) {
      ctx.fillStyle = '#212121';
      ctx.fillRect(6, 6, 7, 7); ctx.fillRect(18, 8, 8, 6);
      ctx.fillRect(8, 20, 6, 6); ctx.fillRect(20, 20, 6, 6);
    }

    // --- IRON ORE ---
    if (blockId === BLOCKS.IRON) {
      ctx.fillStyle = '#d7ccc8';
      ctx.fillRect(6, 6, 6, 6); ctx.fillRect(18, 10, 8, 6);
      ctx.fillRect(10, 20, 6, 6); ctx.fillRect(22, 22, 5, 5);
    }

    // --- OBSIDIAN ---
    if (blockId === BLOCKS.OBSIDIAN) {
      ctx.fillStyle = '#4a148c';
      ctx.fillRect(4, 4, 8, 4); ctx.fillRect(16, 12, 6, 8); ctx.fillRect(8, 22, 10, 4);
    }

    // --- GLOWSTONE ---
    if (blockId === BLOCKS.GLOWSTONE) {
      ctx.fillStyle = '#fff59d';
      ctx.fillRect(4, 4, 8, 8); ctx.fillRect(18, 4, 10, 8);
      ctx.fillRect(4, 18, 10, 10); ctx.fillRect(18, 18, 8, 8);
    }

    // --- MOSSY STONE ---
    if (blockId === BLOCKS.MOSSY_STONE) {
      ctx.fillStyle = '#388e3c';
      ctx.fillRect(2, 4, 8, 6); ctx.fillRect(16, 12, 12, 8); ctx.fillRect(6, 22, 10, 6);
    }

    if (blockId === BLOCKS.BOMB) {
      ctx.fillStyle = '#ffcc00'; ctx.fillRect(0, 0, 32, 4); ctx.fillRect(0, 28, 32, 4);
      ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, 8, 4); ctx.fillRect(16, 0, 8, 4);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(2, 8, 28, 16);
      ctx.fillStyle = '#000000'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center';
      ctx.fillText('TNT', 16, 20);
    }
    if (blockId === BLOCKS.TORCH) {
      ctx.fillStyle = '#ff7043'; ctx.fillRect(12, 2, 8, 12);
      ctx.fillStyle = '#ffeb3b'; ctx.fillRect(14, 4, 4, 6);
      ctx.fillStyle = '#5d4037'; ctx.fillRect(13, 14, 6, 18);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  // --- MATERIALS CACHE ---
  const blockMaterials = {};
  function getBlockMaterials(blockId) {
    if (blockMaterials[blockId]) return blockMaterials[blockId];
    const createMat = (map) => {
      let params = { map, roughness: 0.8, metalness: 0.1 };
      if (blockId === BLOCKS.GLASS) {
        params.transparent = true; params.opacity = 0.35; params.roughness = 0.05; params.metalness = 0.2;
      } else if (blockId === BLOCKS.WATER) {
        params.transparent = true; params.opacity = 0.55; params.roughness = 0.08; params.metalness = 0.1;
      } else if (blockId === BLOCKS.LANTERN || blockId === BLOCKS.GLOWSTONE) {
        params.emissive = new THREE.Color(0xffb300);
        params.emissiveIntensity = 1.2;
        params.roughness = 0.1;
      } else if (blockId === BLOCKS.GOLD || blockId === BLOCKS.DIAMOND) {
        params.roughness = 0.15; params.metalness = 0.9;
      } else if (blockId === BLOCKS.IRON || blockId === BLOCKS.COPPER) {
        params.roughness = 0.3; params.metalness = 0.8;
      } else if (blockId === BLOCKS.BLUE_TILE || blockId === BLOCKS.GLAZED_BLUE) {
        params.roughness = 0.18; params.metalness = 0.15;
      } else if (blockId === BLOCKS.WHITE_MARBLE) {
        params.roughness = 0.12; params.metalness = 0.1;
      } else if (blockId === BLOCKS.STONE || blockId === BLOCKS.DARK_STONE) {
        params.roughness = 0.7; params.metalness = 0.1;
      } else if (blockId === BLOCKS.DIRT || blockId === BLOCKS.SAND) {
        params.roughness = 0.95; params.metalness = 0.0;
      }
      const mat = new THREE.MeshStandardMaterial(params);
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uCameraPos = { value: camera.position };
        shader.vertexShader = `uniform vec3 uCameraPos;\n${shader.vertexShader}`;
        shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
          #include <project_vertex>
          vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
          float distSq = pow(worldPos.x - uCameraPos.x, 2.0) + pow(worldPos.z - uCameraPos.z, 2.0);
          mvPosition.y -= distSq * ${PLANET_CURVATURE};
          gl_Position = projectionMatrix * mvPosition;
        `);
      };
      return mat;
    };
    if (blockId === BLOCKS.GRASS) {
      blockMaterials[blockId] = [
        createMat(createPixelTexture(BLOCKS.GRASS, 'side')), createMat(createPixelTexture(BLOCKS.GRASS, 'side')),
        createMat(createPixelTexture(BLOCKS.GRASS, 'top')), createMat(createPixelTexture(BLOCKS.DIRT)),
        createMat(createPixelTexture(BLOCKS.GRASS, 'side')), createMat(createPixelTexture(BLOCKS.GRASS, 'side'))
      ];
    } else if (blockId === BLOCKS.WOOD) {
      blockMaterials[blockId] = [
        createMat(createPixelTexture(BLOCKS.WOOD, 'side')), createMat(createPixelTexture(BLOCKS.WOOD, 'side')),
        createMat(createPixelTexture(BLOCKS.WOOD, 'top')), createMat(createPixelTexture(BLOCKS.WOOD, 'top')),
        createMat(createPixelTexture(BLOCKS.WOOD, 'side')), createMat(createPixelTexture(BLOCKS.WOOD, 'side'))
      ];
    } else if (blockId === BLOCKS.HAY_BALE) {
      blockMaterials[blockId] = [
        createMat(createPixelTexture(BLOCKS.HAY_BALE, 'side')), createMat(createPixelTexture(BLOCKS.HAY_BALE, 'side')),
        createMat(createPixelTexture(BLOCKS.HAY_BALE, 'top')), createMat(createPixelTexture(BLOCKS.HAY_BALE, 'top')),
        createMat(createPixelTexture(BLOCKS.HAY_BALE, 'side')), createMat(createPixelTexture(BLOCKS.HAY_BALE, 'side'))
      ];
    } else if (blockId === BLOCKS.PUMPKIN) {
      blockMaterials[blockId] = [
        createMat(createPixelTexture(BLOCKS.PUMPKIN, 'face')), createMat(createPixelTexture(BLOCKS.PUMPKIN, 'side')),
        createMat(createPixelTexture(BLOCKS.PUMPKIN, 'top')), createMat(createPixelTexture(BLOCKS.PUMPKIN, 'side')),
        createMat(createPixelTexture(BLOCKS.PUMPKIN, 'side')), createMat(createPixelTexture(BLOCKS.PUMPKIN, 'side'))
      ];
    } else if (blockId === BLOCKS.CRAFTING_TABLE) {
      blockMaterials[blockId] = [
        createMat(createPixelTexture(BLOCKS.CRAFTING_TABLE, 'side')), createMat(createPixelTexture(BLOCKS.CRAFTING_TABLE, 'side')),
        createMat(createPixelTexture(BLOCKS.CRAFTING_TABLE, 'top')), createMat(createPixelTexture(BLOCKS.PLANKS)),
        createMat(createPixelTexture(BLOCKS.CRAFTING_TABLE, 'side')), createMat(createPixelTexture(BLOCKS.CRAFTING_TABLE, 'side'))
      ];
    } else if (blockId === BLOCKS.FURNACE) {
      blockMaterials[blockId] = [
        createMat(createPixelTexture(BLOCKS.FURNACE, 'front')), createMat(createPixelTexture(BLOCKS.FURNACE, 'side')),
        createMat(createPixelTexture(BLOCKS.FURNACE, 'side')), createMat(createPixelTexture(BLOCKS.FURNACE, 'side')),
        createMat(createPixelTexture(BLOCKS.FURNACE, 'side')), createMat(createPixelTexture(BLOCKS.FURNACE, 'side'))
      ];
    } else if (blockId === BLOCKS.CHEST) {
      blockMaterials[blockId] = [
        createMat(createPixelTexture(BLOCKS.CHEST, 'front')), createMat(createPixelTexture(BLOCKS.CHEST, 'side')),
        createMat(createPixelTexture(BLOCKS.CHEST, 'top')), createMat(createPixelTexture(BLOCKS.CHEST, 'side')),
        createMat(createPixelTexture(BLOCKS.CHEST, 'side')), createMat(createPixelTexture(BLOCKS.CHEST, 'side'))
      ];
    } else {
      blockMaterials[blockId] = createMat(createPixelTexture(blockId));
    }
    return blockMaterials[blockId];
  }

  // --- GAME STATE ---
  let scene, camera, renderer, clock, supabase = null;
  let sunMesh, moonMesh, sunLight, ambientLight, starsParticles;
  let playerMesh, playerSkin = 'steve', fpHandGroup = null;
  let isThirdPerson = false, thirdPersonDistance = 6.0;
  let orbitYaw = 0, orbitPitch = 0;
  let activeSlotIndex = 0;
  let currentInventoryTab = 'weapons';
  let hotbarBlocks = [25, 41, 36, 42, 1, 2, 3, 6, 37];
  let worldData = {}, modifiedBlocks = {};
  let currentMapRadius = 250;
  let currentWorldMeta = { name: "Mening Dunyoim", seed: "Uzbekistan2026", map: "minecraft_classic" };
  let dayTime = 0.25;
  let playerPos = new THREE.Vector3(0, 105, 0);
  let playerVel = new THREE.Vector3(0, 0, 0);
  let currentQuestState = 'not_started'; // 'not_started', 'active', 'completed'
  let activeNpc = null;
  let dialogueIndex = 0;
  let yaw = 0, pitch = 0;
  let isGrounded = false, keys = {}, isPointerLocked = false;
  let highlightBox = null, raycaster = new THREE.Raycaster();
  let npcs = [], animals = [], spawnedFurniture = [];
  let meatCollectibles = [];

  function createDefaultInventory(isNewGame = false) {
    const inv = {
      "Qo'y": 0, "Sigir": 0, "Tulki": 0, "Bo'ri": 0, "Burgut": 0,
      "Tuya": 0, "Ot": 0, "Eshak": 0, "Tovuq": 0, "Qoplon": 0,
      "Jun": 0, "Jun (Yung)": 0, "Qo'y go'shti": 0, "Mol go'shti": 0,
      "Tulki go'shti": 0, "Bo'ri go'shti": 0, "Burgut go'shti": 0, "Tuya go'shti": 0,
      "Ot go'shti (Qazi)": 0, "Eshak go'shti": 0, "Tovuq go'shti": 0, "Qoplon go'shti": 0,
      "Olma": 0, "Non": 0, "Qovurilgan go'sht": 0,
      "Yog'och": 0, "Tosh": 0, "Qora Tosh": 0, "Ko'mir": 0,
      "Oltin": 0, "Olmos": 0, "Temir": 0, "Mis": 0,
      "Taxta": 0, "Chiroq": 0, "Mashala (Olov)": 0, "Divan": 0,
      "Stol": 0, "Stul": 0, "Qilich": 0, "Kamon": 0, "Temir Bolta": 0,
      "Temir Kirka": 0, "Temir Kurak": 0, "Temir Ketmon": 0,
      "Hunarmandchilik stoli": 0, "Pechka (Furnace)": 0, "Sandiq (Chest)": 0,
      "Obsidian": 0, "Nurlanuvchi Tosh": 0, "Qovoq (Pumpkin)": 0, "Somon Taxlami": 0, "Moxli Tosh": 0,
      "Bomba": 0, "Avtomat": 0, "Chelak": 0, "Suvli chelak": 0,
      "O't": 0, "Tuproq": 0, "Qum": 0, "Qor": 0, "Barg": 0, "Kaktus": 0,
      "Suv": 0, "Moviy Koshin": 0, "G'isht": 0, "Oq Mramor": 0,
      "Zangori Koshin": 0, "Shisha": 0, "Terrakota": 0, "Gul": 0
    };
    if (isNewGame) {
      inv["O't"] = 20;
      inv["Tuproq"] = 20;
      inv["Tosh"] = 20;
      inv["Yog'och"] = 20;
      inv["Taxta"] = 20;
      inv["Oq Mramor"] = 10;
      inv["Chiroq"] = 5;
      inv["Moviy Koshin"] = 5;
      inv["Mashala (Olov)"] = 10;
      inv["Qilich"] = 1;
      inv["Temir Bolta"] = 1;
      inv["Temir Kirka"] = 1;
      inv["Temir Kurak"] = 1;
      inv["Temir Ketmon"] = 1;
      inv["Kamon"] = 1;
      inv["Olma"] = 5;
      inv["Non"] = 5;
      inv["Qovurilgan go'sht"] = 3;
      inv["Qo'y go'shti"] = 5;
    }
    return inv;
  }

  let meatInventory = createDefaultInventory(true);

  const MEAT_TYPES = {
    "Qo'y":   { name: "Qo'y go'shti", color: '#ff8a80', hexColor: 0xff8a80 },
    "Sigir":  { name: "Mol go'shti", color: '#d50000', hexColor: 0xd50000 },
    "Tulki":  { name: "Tulki go'shti", color: '#ffab40', hexColor: 0xffab40 },
    "Bo'ri":  { name: "Bo'ri go'shti", color: '#90a4ae', hexColor: 0x90a4ae },
    "Burgut": { name: "Burgut go'shti", color: '#5d4037', hexColor: 0x5d4037 },
    "Tuya":   { name: "Tuya go'shti", color: '#ffd180', hexColor: 0xffd180 },
    "Ot":     { name: "Ot go'shti (Qazi)", color: '#3e2723', hexColor: 0x3e2723 },
    "Eshak":  { name: "Eshak go'shti", color: '#78909c', hexColor: 0x78909c },
    "Tovuq":  { name: "Tovuq go'shti", color: '#fff9c4', hexColor: 0xfff9c4 },
    "Qoplon": { name: "Qoplon go'shti", color: '#afb42b', hexColor: 0xafb42b },
    "Jun":    { name: "Jun (Yung)", color: '#ffffff', hexColor: 0xfafafa },
    "Yog'och":{ name: "Yog'och", color: '#8d6e63', hexColor: 0x8d6e63 },
    "Tosh":   { name: "Tosh", color: '#9e9e9e', hexColor: 0x9e9e9e },
    "Qora Tosh":{ name: "Qora Tosh", color: '#37474f', hexColor: 0x37474f },
    "Ko'mir": { name: "Ko'mir", color: '#455a64', hexColor: 0x455a64 },
    "Oltin":  { name: "Oltin", color: '#ffd600', hexColor: 0xffd600 },
    "Olmos":  { name: "Olmos", color: '#00bcd4', hexColor: 0x00bcd4 },
    "Temir":  { name: "Temir", color: '#b0bec5', hexColor: 0xb0bec5 },
    "Mis":    { name: "Mis", color: '#ff7043', hexColor: 0xff7043 }
  };
  const RESOURCE_INFO = {
    [BLOCKS.WOOD]:       { type: "Yog'och", name: "Yog'och", color: 0x6d4c41 },
    [BLOCKS.STONE]:      { type: "Tosh", name: "Tosh", color: 0x9e9e9e },
    [BLOCKS.DARK_STONE]: { type: "Qora Tosh", name: "Qora Tosh", color: 0x37474f },
    [BLOCKS.COAL]:       { type: "Ko'mir", name: "Ko'mir", color: 0x455a64 },
    [BLOCKS.GOLD]:       { type: "Oltin", name: "Oltin", color: 0xffd600 },
    [BLOCKS.DIAMOND]:    { type: "Olmos", name: "Olmos", color: 0x00bcd4 },
    [BLOCKS.IRON]:       { type: "Temir", name: "Temir", color: 0xb0bec5 },
    [BLOCKS.COPPER]:     { type: "Mis", name: "Mis", color: 0xff7043 }
  };
  let isSitting = false, sittingOnCoords = null, targetedFurniture = null;
  let isMiningHeld = false, miningStartTime = 0, miningTargetKey = null, isMiningProgress = 0;
  let miningOverlayMesh = null;
  let isRidingHorse = false, mountedHorse = null, targetedHorse = null;
  let singleToastTimer = null;
  let localPlayerName = localStorage.getItem('uzbekcraft_nickname') || "O'yinchi";
  const MINING_DURATION = 1.5;
  let touchJoystick = { active: false, startX: 0, startY: 0, moveX: 0, moveY: 0 };
  let touchLook = { active: false, lastX: 0, lastY: 0 };
  let frameCount = 0;

  // --- MULTIPLAYER REALTIME VARIABLES ---
  let multiplayerChannel = null;
  const myPlayerId = 'player_' + Math.random().toString(36).substring(2, 11);
  const otherPlayers = {};
  let broadcastCounter = 0;

  // --- HEALTH & COMBAT & HUNGER STATE ---
  let health = 10;
  const MAX_HEALTH = 10;
  let playerHunger = 100;
  const MAX_HUNGER = 100;
  let hungerTimer = 0;
  let starvationTimer = 0;
  let healthRegenTimer = 0;
  let avtomatAmmo = 30;
  let isReloading = false;

  // --- PLACED POINT LIGHTS FOR LANTERNS ---
  const placedLights = {};

  // --- ROBLOX QUEST ENGINE ---
  // --- ROBLOX QUEST ENGINE ---
  const ROBLOX_MISSIONS = [
    {
      id: "m1",
      title: "Topshiriq 1: Bunyodkor (The Builder)",
      desc: "Dunyo bo'ylab 15 ta har qanday blok joylashtiring",
      type: "place_blocks",
      target: 15,
      rewardText: "+10 Olma, +5 Non",
      rewardItems: [
        { name: "Olma", count: 10 },
        { name: "Non", count: 5 }
      ]
    },
    {
      id: "m2",
      title: "Topshiriq 2: O'rmonchi (Tree Chopper)",
      desc: "Bolta yoki qo'l bilan 10 ta Yog'och blokini kesing",
      type: "chop_wood",
      target: 10,
      rewardText: "+1 Temir Bolta, +5 Qovurilgan go'sht",
      rewardItems: [
        { name: "Temir Bolta", count: 1 },
        { name: "Qovurilgan go'sht", count: 5 }
      ]
    },
    {
      id: "m3",
      title: "Topshiriq 3: Konchi (Ore Hunter)",
      desc: "Kirka bilan 5 ta Ko'mir yoki Temir ma'danini qazing",
      type: "mine_ores",
      target: 5,
      rewardText: "+1 Olmos, +3 Oltin",
      rewardItems: [
        { name: "Olmos", count: 1 },
        { name: "Oltin", count: 3 }
      ]
    },
    {
      id: "m4",
      title: "Topshiriq 4: Mergan Ovchi (Hunter)",
      desc: "2 ta hayvonni ovlang yoki taom yeb ochlikni tiklang",
      type: "hunt_or_eat",
      target: 2,
      rewardText: "+1 Kamon, +10 O'q",
      rewardItems: [
        { name: "Kamon", count: 1 }
      ]
    },
    {
      id: "m5",
      title: "Topshiriq 5: Sayyoh Sayyoh (Explorer)",
      desc: "Boshlang'ich nuqtadan 150 metr uzoqlikka sayohat qiling",
      type: "explore_dist",
      target: 150,
      rewardText: "+1 Sandiq, +2 Nurlanuvchi Tosh",
      rewardItems: [
        { name: "Sandiq (Chest)", count: 1 },
        { name: "Nurlanuvchi Tosh", count: 2 }
      ]
    }
  ];

  let currentMissionIndex = 0;
  let userQuestsProgress = {
    m1: 0, m2: 0, m3: 0, m4: 0, m5: 0,
    claimed: { m1: false, m2: false, m3: false, m4: false, m5: false }
  };

  function updateMissionProgress(type, amount = 1) {
    const curMission = ROBLOX_MISSIONS[currentMissionIndex];
    if (!curMission || userQuestsProgress.claimed[curMission.id]) return;

    if (curMission.type === type) {
      userQuestsProgress[curMission.id] = Math.min(curMission.target, (userQuestsProgress[curMission.id] || 0) + amount);
      renderHUDMissionTracker();
    }
  }

  function renderHUDMissionTracker() {
    const curMission = ROBLOX_MISSIONS[currentMissionIndex];
    const elTitle = document.getElementById('hud-mission-title');
    const elStep = document.getElementById('hud-mission-step');
    const elFill = document.getElementById('hud-mission-bar-fill');
    const btnClaim = document.getElementById('btn-hud-claim-mission');

    if (!curMission) {
      if (elTitle) elTitle.textContent = "Hamma Topshiriqlar Bajarildi!";
      if (elStep) elStep.textContent = "Barcha topshiriqlarni muvaffaqiyatli yakunladingiz!";
      if (elFill) elFill.style.width = "100%";
      if (btnClaim) btnClaim.classList.add('hidden');
      return;
    }

    const currentVal = userQuestsProgress[curMission.id] || 0;
    const pct = Math.min(100, Math.floor((currentVal / curMission.target) * 100));

    if (elTitle) elTitle.textContent = curMission.title;
    if (elStep) elStep.textContent = `${curMission.desc} (${currentVal}/${curMission.target})`;
    if (elFill) elFill.style.width = `${pct}%`;

    if (currentVal >= curMission.target && !userQuestsProgress.claimed[curMission.id]) {
      if (btnClaim) btnClaim.classList.remove('hidden');
    } else {
      if (btnClaim) btnClaim.classList.add('hidden');
    }
  }

  function claimMissionReward(mId) {
    const mission = ROBLOX_MISSIONS.find(m => m.id === mId);
    if (!mission || userQuestsProgress.claimed[mId]) return;

    const val = userQuestsProgress[mId] || 0;
    if (val < mission.target) return;

    userQuestsProgress.claimed[mId] = true;

    // Grant rewards
    mission.rewardItems.forEach(item => {
      meatInventory[item.name] = (meatInventory[item.name] || 0) + item.count;
    });

    soundEngine.playSFX('powerup');
    showToast(`TOPSHIRIQ BAJARILDI! Mukofot olindi: ${mission.rewardText}`);

    // Advance to next uncompleted mission
    if (currentMissionIndex < ROBLOX_MISSIONS.length - 1) {
      currentMissionIndex++;
    }

    renderHUDMissionTracker();
    renderMissionsModal();
    renderHotbar();
    renderInventoryGrid();
  }

  function renderMissionsModal() {
    const container = document.getElementById('missions-list-container');
    if (!container) return;
    container.innerHTML = '';

    ROBLOX_MISSIONS.forEach((m) => {
      const val = userQuestsProgress[m.id] || 0;
      const isDone = val >= m.target;
      const isClaimed = userQuestsProgress.claimed[m.id];
      const pct = Math.min(100, Math.floor((val / m.target) * 100));

      const card = document.createElement('div');
      card.className = `mission-card ${isDone ? 'completed' : ''} ${isClaimed ? 'claimed' : ''}`;

      let btnHtml = '';
      if (isClaimed) {
        btnHtml = `<span style="color:#10b981; font-weight:bold; font-size:13px; text-shadow: 0 0 8px rgba(16,185,129,0.3);">Olingan ✓</span>`;
      } else if (isDone) {
        btnHtml = `<button class="btn-claim-mission" onclick="window.claimMission('${m.id}')" style="box-shadow: 0 0 10px rgba(16,185,129,0.4);">Mukofotni Olish!</button>`;
      } else {
        btnHtml = `<span style="color:#cbd5e1; background: rgba(255,255,255,0.06); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-size:12px; font-weight:bold;">${val}/${m.target}</span>`;
      }

      card.innerHTML = `
        <div class="mission-info" style="flex: 1;">
          <div class="mission-title" style="display: flex; align-items: center; gap: 8px; font-size: 14px; letter-spacing: 0.3px; color: #fff;">
            <span class="quest-status-icon">${isClaimed ? '[Bajarildi]' : (isDone ? '[Tayyor]' : '[Kutilmoqda]')}</span>
            ${m.title}
          </div>
          <div style="font-size:12px; color:#94a3b8; margin: 4px 0 6px 22px; font-weight: 500;">${m.desc}</div>
          <div class="mission-reward" style="margin-left: 22px; font-weight: 600; display: flex; align-items: center; gap: 4px; color: #fbbf24;">
            <span>Mukofot:</span> <span style="color: #fff; background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.25); padding: 1px 6px; border-radius: 6px; font-size: 11px;">${m.rewardText}</span>
          </div>
          <div style="margin-left: 22px; margin-top: 8px; display: flex; align-items: center; gap: 8px;">
            <div class="mission-progress-track" style="width: 140px; height: 6px; background: rgba(255,255,255,0.08); border-radius: 4px;">
              <div class="mission-progress-fill" style="width: ${pct}%; height: 100%; border-radius: 4px; background: linear-gradient(90deg, #f59e0b, #10b981);"></div>
            </div>
            <span style="font-size: 10px; color: #64748b; font-weight: bold;">${pct}%</span>
          </div>
        </div>
        <div style="flex-shrink: 0;">${btnHtml}</div>
      `;

      container.appendChild(card);
    });
  }

  window.claimMission = function(mId) {
    claimMissionReward(mId);
  };

  const svgHeartFull = `<svg viewBox="0 0 24 24" width="18" height="18" style="margin-right:2px;display:inline-block;vertical-align:middle;"><path fill="#ef4444" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
  const svgHeartHalf = `<svg viewBox="0 0 24 24" width="18" height="18" style="margin-right:2px;display:inline-block;vertical-align:middle;"><defs><linearGradient id="grad-half"><stop offset="50%" stop-color="#ef4444" /><stop offset="50%" stop-color="#4b5563" /></linearGradient></defs><path fill="url(#grad-half)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
  const svgHeartEmpty = `<svg viewBox="0 0 24 24" width="18" height="18" style="margin-right:2px;display:inline-block;vertical-align:middle;"><path fill="#4b5563" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

  function updateHealthUI() {
    const el = document.getElementById('hud-health');
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const heartValue = health - i * 2;
      if (heartValue >= 2) {
        el.innerHTML += svgHeartFull;
      } else if (heartValue === 1) {
        el.innerHTML += svgHeartHalf;
      } else {
        el.innerHTML += svgHeartEmpty;
      }
    }
  }

  function updateHungerUI() {
    const el = document.getElementById('hud-hunger');
    if (!el) return;
    el.innerHTML = '';
    const totalDrumsticks = 10;
    const isWarning = playerHunger <= 30;

    for (let i = 0; i < totalDrumsticks; i++) {
      const val = playerHunger - i * 10;
      let stateClass = 'empty';
      if (val >= 5) {
        stateClass = 'full';
      }
      const warningClass = (isWarning && val > 0) ? ' warning' : '';
      el.innerHTML += `<span class="hunger-icon ${stateClass}${warningClass}"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block; vertical-align:middle; color:#ffb74d;"><path d="M12 2c-3 0-5 3-5 5c0 1 .4 2.3.8 3.2L3.2 14.8c-.8.8-.8 2 0 2.8c.8.8 2 .8 2.8 0L10.6 13c.9.4 2.2.8 3.2.8c2 0 5-2 5-5C18.8 5 15 2 12 2z"/></svg></span>`;
    }
  }

  function eatFood(blockId) {
    const bInfo = BLOCK_INFO[blockId];
    if (!bInfo) return false;

    const count = meatInventory[bInfo.name] || 0;
    if (count <= 0) {
      showToast(`"${bInfo.name}" tugagan!`);
      return false;
    }

    if (playerHunger >= MAX_HUNGER && health >= MAX_HEALTH) {
      showToast("Qorningiz to'q!");
      return false;
    }

    meatInventory[bInfo.name] -= 1;
    const restoreAmount = bInfo.hungerRestore || 30;
    playerHunger = Math.min(MAX_HUNGER, playerHunger + restoreAmount);

    if (health < MAX_HEALTH) {
      health = Math.min(MAX_HEALTH, health + 1);
      updateHealthUI();
    }

    soundEngine.playSFX('eat');
    updateHungerUI();
    renderHotbar();
    showToast(`+${restoreAmount} Ochlik tiklandi! ("${bInfo.name}" yeyildi)`);
    return true;
  }

  let lastKillerName = "Dushman";
  function damageLocalPlayer(amount, attackerName = null) {
    if (attackerName) lastKillerName = attackerName;
    health = Math.max(0, health - amount);
    updateHealthUI();
    soundEngine.playSFX('hit');

    const flashEl = document.getElementById('damage-flash');
    if (flashEl) {
      flashEl.classList.add('flash');
      flashEl.offsetHeight; // force reflow
      setTimeout(() => flashEl.classList.remove('flash'), 150);
    }

    if (health <= 0) {
      if (multiplayerChannel || (currentWorldMeta && (currentWorldMeta.map === 'online_shooter' || currentWorldMeta.map === 'coop_building'))) {
        const deathModal = document.getElementById('online-death-modal');
        const killerText = document.getElementById('killer-name-text');
        if (killerText) killerText.textContent = `${lastKillerName} sizni o'ldirdi!`;
        if (deathModal) deathModal.classList.remove('hidden');
        if (document.pointerLockElement) document.exitPointerLock();
        showKillFeed(lastKillerName, localPlayerName);
      } else {
        respawnPlayer();
      }
    }
  }

  function respawnPlayer() {
    showToast("Siz halok bo'ldingiz! Qaytadan tug'ilish...");
    health = MAX_HEALTH;
    playerHunger = MAX_HUNGER;
    updateHealthUI();
    updateHungerUI();
    playerPos.set(0, 95, 0);
    playerVel.set(0, 0, 0);
  }

  function addPointLightAt(bx, by, bz) {
    const key = `${bx},${by},${bz}`;
    if (placedLights[key]) return;
    const light = new THREE.PointLight(0xffa726, 2.0, 15);
    light.position.set(bx, by + 0.3, bz);
    scene.add(light);
    placedLights[key] = light;
  }

  function removePointLightAtKey(key) {
    if (placedLights[key]) {
      scene.remove(placedLights[key]);
      delete placedLights[key];
    }
  }

  function initSupabase() {
    const url = localStorage.getItem('uzbekcraft_supabase_url') || 'https://dtpyfzzdfyxeklyrtuew.supabase.co';
    const key = localStorage.getItem('uzbekcraft_supabase_key') || 'sb_publishable_ioYdiKVpVMddnYFH3bABDg_-J9EImd1';
    if (url && key && window.supabase) {
      try {
        supabase = window.supabase.createClient(url, key);
      } catch (e) {
        console.error("Supabase initialization failed:", e);
        supabase = null;
      }
    } else {
      supabase = null;
    }
  }

  function getSkinMaterials(skinName) {
    let colorHead = 0xffdbac;
    let colorBody = 0x10b981; // Steve green
    let colorLegs = 0x1a237e; // Steve blue

    if (skinName === 'temur') {
      colorBody = 0xd97706; colorLegs = 0x991b1b;
    } else if (skinName === 'navoiy') {
      colorBody = 0x0369a1; colorLegs = 0x065f46;
    } else if (skinName === 'ulugbek') {
      colorBody = 0x6d28d9; colorLegs = 0x374151;
    }

    return {
      head: new THREE.MeshStandardMaterial({ color: colorHead, roughness: 0.6 }),
      body: new THREE.MeshStandardMaterial({ color: colorBody, roughness: 0.7 }),
      legs: new THREE.MeshStandardMaterial({ color: colorLegs, roughness: 0.8 })
    };
  }

  function buildDetailedCharacterMesh(skinName) {
    const group = new THREE.Group();
    
    // Skin colors
    const mats = getSkinMaterials(skinName);
    const matBeard = new THREE.MeshLambertMaterial({ color: 0x3d2314 }); // Beard
    const matEye = new THREE.MeshLambertMaterial({ color: 0xffffff }); // White of eye
    const matPupil = new THREE.MeshLambertMaterial({ color: 0x1e88e5 }); // Blue pupils
    const matEyebrow = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Eyebrows
    const matSwordHandle = new THREE.MeshLambertMaterial({ color: 0x795548 }); // Brown handle
    const matSwordBlade = new THREE.MeshLambertMaterial({ color: 0xc0c0c0 }); // Silver blade
    const matBoots = new THREE.MeshLambertMaterial({ color: 0x271a11 }); // Dark brown boots
    const matCape = new THREE.MeshLambertMaterial({ color: 0xb71c1c }); // Dark red cape

    // 1. Head (shifted up from 1.45 to 1.55)
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), mats.head);
    head.position.y = 1.55;
    group.add(head);

    // Eyes
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.02), matEye);
    eyeL.position.set(-0.15, 0.03, 0.301);
    head.add(eyeL);
    
    const pupilL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.02), matPupil);
    pupilL.position.set(-0.13, 0.03, 0.311);
    head.add(pupilL);

    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.02), matEye);
    eyeR.position.set(0.15, 0.03, 0.301);
    head.add(eyeR);

    const pupilR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.02), matPupil);
    pupilR.position.set(0.17, 0.03, 0.311);
    head.add(pupilR);

    // Eyebrows
    const browL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.02), matEyebrow);
    browL.position.set(-0.15, 0.09, 0.305);
    head.add(browL);

    const browR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.02), matEyebrow);
    browR.position.set(0.15, 0.09, 0.305);
    head.add(browR);

    // Beard
    const beard = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.08), matBeard);
    beard.position.set(0, -0.2, 0.28);
    head.add(beard);

    // Uzbek Do'ppi (Skullcap) on top of head
    const doppi = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.62), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
    doppi.position.set(0, 0.31, 0);
    head.add(doppi);
    
    // Do'ppi white mosaic patterns
    const patternL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.63), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    patternL.position.set(-0.3, 0.31, 0);
    head.add(patternL);
    const patternR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.63), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    patternR.position.set(0.3, 0.31, 0);
    head.add(patternR);
    const patternF = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.04, 0.04), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    patternF.position.set(0, 0.31, 0.3);
    head.add(patternF);
    const patternB = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.04, 0.04), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    patternB.position.set(0, 0.31, -0.3);
    head.add(patternB);

    // 2. Body (shifted up from 0.85 to 0.95)
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.35), mats.body);
    body.position.y = 0.95;
    group.add(body);

    // Belt detail (shifted up from 0.6 to 0.7)
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.37), new THREE.MeshLambertMaterial({ color: 0x3e2723 }));
    belt.position.set(0, 0.7, 0);
    group.add(belt);

    // Scabbard on left hip (shifted up from 0.6 to 0.7)
    const scabbard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.06), new THREE.MeshLambertMaterial({ color: 0x3e2723 }));
    scabbard.position.set(-0.32, 0.7, 0.05);
    scabbard.rotation.z = 0.4;
    group.add(scabbard);

    // Royal Cape / Yopinchiq (shifted up from 1.15 to 1.25)
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 1.25, -0.18);
    const capeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.65, 0.04), matCape);
    capeMesh.position.y = -0.325;
    capeGroup.add(capeMesh);
    group.add(capeGroup);

    // 3. Left Leg (shifted up from 0.55 to 0.65)
    const legLGroup = new THREE.Group();
    legLGroup.position.set(-0.16, 0.65, 0);
    const legLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6, 0.3), mats.legs);
    legLMesh.position.y = -0.3;
    legLGroup.add(legLMesh);
    
    // Boot Left
    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.15, 0.32), matBoots);
    bootL.position.set(0, -0.55, 0.01);
    legLGroup.add(bootL);
    group.add(legLGroup);

    // 4. Right Leg (shifted up from 0.55 to 0.65)
    const legRGroup = new THREE.Group();
    legRGroup.position.set(0.16, 0.65, 0);
    const legRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6, 0.3), mats.legs);
    legRMesh.position.y = -0.3;
    legRGroup.add(legRMesh);
    
    // Boot Right
    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.15, 0.32), matBoots);
    bootR.position.set(0, -0.55, 0.01);
    legRGroup.add(bootR);
    group.add(legRGroup);

    // 5. Left Arm (shifted up from 1.1 to 1.2)
    const armLGroup = new THREE.Group();
    armLGroup.position.set(-0.41, 1.2, 0);
    const armLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.22), mats.body);
    armLMesh.position.y = -0.3;
    armLGroup.add(armLMesh);
    group.add(armLGroup);

    // 6. Right Arm (shifted up from 1.1 to 1.2)
    const armRGroup = new THREE.Group();
    armRGroup.position.set(0.41, 1.2, 0);
    const armRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.22), mats.body);
    armRMesh.position.y = -0.3;
    armRGroup.add(armRMesh);

    group.add(armRGroup);

    // References for animation
    group.legL = legLGroup;
    group.legR = legRGroup;
    group.armL = armLGroup;
    group.armR = armRGroup;
    group.cape = capeGroup;

    return group;
  }

  function animateCharacterWalk(mesh, speed, isMoving, grounded = true, isMining = false) {
    if (!mesh) return;
    
    if (mesh.legL && mesh.legR && mesh.armL) {
      if (isMoving && grounded && speed > 0.05) {
        const swingSpeed = 12.0;
        const angle = Math.sin(performance.now() * 0.001 * swingSpeed) * 0.6;
        mesh.legL.rotation.x = angle;
        mesh.legR.rotation.x = -angle;
        mesh.armL.rotation.x = -angle;
      } else {
        mesh.legL.rotation.x = 0;
        mesh.legR.rotation.x = 0;
        mesh.armL.rotation.x = 0;
      }
    }

    if (mesh.armR) {
      if (isMining) {
        const chopSpeed = 25.0;
        mesh.armR.rotation.x = -0.5 + Math.sin(performance.now() * 0.001 * chopSpeed) * 0.8;
      } else if (isMoving && grounded && speed > 0.05) {
        const swingSpeed = 12.0;
        mesh.armR.rotation.x = Math.sin(performance.now() * 0.001 * swingSpeed) * 0.6;
      } else {
        mesh.armR.rotation.x = 0;
      }
    }

    if (mesh.cape) {
      if (isMoving && speed > 0.05) {
        const flutter = Math.sin(performance.now() * 0.015) * 0.08 + 0.25;
        mesh.cape.rotation.x = flutter;
      } else {
        mesh.cape.rotation.x = 0.05;
      }
    }
  }

  function updateOtherPlayer(id, data) {
    if (!otherPlayers[id]) {
      const group = buildDetailedCharacterMesh(data.skin || 'steve');
      scene.add(group);
      otherPlayers[id] = { mesh: group, lastUpdate: Date.now() };
    }
    const p = otherPlayers[id];
    p.mesh.position.set(data.x, data.y, data.z);
    p.mesh.rotation.y = data.yaw + Math.PI;
    p.isMining = data.isMining || false;
    p.lastUpdate = Date.now();
    updateThirdPersonHeldItem(p.mesh, data.activeBlockId);
  }

  function joinMultiplayerRoom() {
    if (!supabase) return;
    
    if (multiplayerChannel) {
      multiplayerChannel.unsubscribe();
    }
    
    Object.keys(otherPlayers).forEach(id => {
      if (otherPlayers[id] && otherPlayers[id].mesh) {
        scene.remove(otherPlayers[id].mesh);
      }
      delete otherPlayers[id];
    });

    const roomName = 'room_' + (currentWorldMeta.name || 'default').toLowerCase().replace(/\s+/g, '_');
    multiplayerChannel = supabase.channel(roomName);
    
    let roomSynced = false;

    multiplayerChannel
      .on('broadcast', { event: 'player_move' }, (payload) => {
        const data = payload.payload;
        if (data.id === myPlayerId) return;
        updateOtherPlayer(data.id, data);
      })
      .on('broadcast', { event: 'block_change' }, (payload) => {
        const { x, y, z, blockId } = payload.payload;
        const key = `${x},${y},${z}`;
        if (blockId === BLOCKS.AIR) {
          removePointLightAtKey(key);
        } else if (BLOCK_INFO[blockId]?.isLuminous) {
          addPointLightAt(x, y, z);
        }
        worldData[key] = blockId;
        modifiedBlocks[key] = blockId;
        renderInstancedWorld();
      })
      .on('broadcast', { event: 'player_hit' }, (payload) => {
        const { targetId, damage } = payload.payload;
        if (targetId === myPlayerId) {
          damageLocalPlayer(damage);
        }
      })
      .on('broadcast', { event: 'query_room_map' }, (payload) => {
        if (payload.payload && payload.payload.requesterId === myPlayerId) return;
        if (multiplayerChannel) {
          multiplayerChannel.send({
            type: 'broadcast',
            event: 'sync_room_map',
            payload: {
              map: currentWorldMeta.map,
              modifiedBlocks: modifiedBlocks
            }
          });
        }
      })
      .on('broadcast', { event: 'sync_room_map' }, (payload) => {
        if (!roomSynced) {
          roomSynced = true;
          const remoteMap = payload.payload.map;
          const remoteModified = payload.payload.modifiedBlocks || {};
          
          // Merge modified blocks
          Object.assign(modifiedBlocks, remoteModified);
          
          if (remoteMap && remoteMap !== currentWorldMeta.map) {
            currentWorldMeta.map = remoteMap;
            generateWorld("Uzbekistan2026", remoteMap);
            const hudBiome = document.getElementById('hud-biome');
            if (hudBiome) hudBiome.textContent = getMapDisplayName(remoteMap) + " (Onlayn)";
            showToast(`Xarita "${getMapDisplayName(remoteMap)}" ga sinxronizatsiya qilindi!`);
          } else {
            // Apply blocks and rebuild
            Object.keys(modifiedBlocks).forEach(k => { worldData[k] = modifiedBlocks[k]; });
            rebuildWorldMesh();
          }
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          showToast("Ko'p o'yinchi xonasiga ulandingiz!");
          // Request current map state from other players
          multiplayerChannel.send({
            type: 'broadcast',
            event: 'query_room_map',
            payload: { requesterId: myPlayerId }
          });
        }
      });
  }

  // --- INITIALIZATION ---
  function init() {
    initSupabase();
    setupThree();
    setupUI();
    setupEvents();
    setupMobileControls();
    animate();
  }

  // --- MINECRAFT STYLE PIXEL TEXTURE GENERATION FOR MATERIALS ---
  const pixelTextureCache = {};
  function getPixelNoiseTexture(colorHex, resolution = 8) {
    const cacheKey = `${colorHex}_${resolution}`;
    if (pixelTextureCache[cacheKey]) return pixelTextureCache[cacheKey];

    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d');

    const colorStr = typeof colorHex === 'string' ? colorHex : ('#' + colorHex.toString(16).padStart(6, '0'));
    ctx.fillStyle = colorStr;
    ctx.fillRect(0, 0, resolution, resolution);

    // Apply pixelated color variance (Minecraft noise)
    for (let x = 0; x < resolution; x++) {
      for (let y = 0; y < resolution; y++) {
        const r = (Math.random() - 0.5) * 35;
        ctx.fillStyle = r > 0 ? `rgba(255,255,255,${r / 255})` : `rgba(0,0,0,${-r / 255})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    pixelTextureCache[cacheKey] = tex;
    return tex;
  }

  // Override THREE.MeshLambertMaterial to automatically map pixelated textures to all non-block models (animals, tools, birds, etc.)
  THREE.MeshLambertMaterial = class extends THREE.MeshStandardMaterial {
    constructor(parameters) {
      let colorVal = 0xffffff;
      if (parameters && parameters.color !== undefined) {
        if (parameters.color instanceof THREE.Color) {
          colorVal = parameters.color.getHex();
        } else {
          colorVal = parameters.color;
        }
      }

      const tex = getPixelNoiseTexture(colorVal, 8);
      const newParams = {
        map: tex,
        roughness: 0.85,
        metalness: 0.1,
        transparent: (parameters && parameters.transparent) || false,
        opacity: (parameters && parameters.opacity !== undefined) ? parameters.opacity : 1.0
      };

      super(newParams);
      this.color = new THREE.Color(0xffffff);
    }
  };

  function setupThree() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.0125); // Denser fog to mask edges
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.02, 500);
    camera.position.set(0, 105, 0);
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    clock = new THREE.Clock();
    ambientLight = new THREE.HemisphereLight(0xffeedd, 0x444466, 0.85);
    scene.add(ambientLight);
    sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(60, 150, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(4096, 4096);
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 300;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0002;
    scene.add(sunLight);
    scene.add(sunLight.target);
    scene.add(camera);

    fpHandGroup = new THREE.Group();
    camera.add(fpHandGroup);

    // Sun mesh
    sunMesh = new THREE.Mesh(new THREE.SphereGeometry(6, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffee58 }));
    scene.add(sunMesh);
    // Moon mesh
    moonMesh = new THREE.Mesh(new THREE.SphereGeometry(4, 12, 12), new THREE.MeshBasicMaterial({ color: 0xeceff1 }));
    scene.add(moonMesh);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCoords = [];
    for (let i = 0; i < 1500; i++) {
      starCoords.push((Math.random() - 0.5) * 800, Math.random() * 300 + 50, (Math.random() - 0.5) * 800);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starCoords, 3));
    starsParticles = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, transparent: true, opacity: 0 }));
    scene.add(starsParticles);

    const boxGeo = new THREE.BoxGeometry(1.02, 1.02, 1.02);
    highlightBox = new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo), new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
    highlightBox.visible = false;
    scene.add(highlightBox);

    const crackGeo = new THREE.BoxGeometry(1.03, 1.03, 1.03);
    const crackMat = new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true, transparent: true, opacity: 0.85 });
    miningOverlayMesh = new THREE.Mesh(crackGeo, crackMat);
    miningOverlayMesh.visible = false;
    scene.add(miningOverlayMesh);
    createPlayerMesh();
  }

  function createPlayerMesh() {
    if (playerMesh) scene.remove(playerMesh);
    playerMesh = buildDetailedCharacterMesh(playerSkin);
    playerMesh.visible = false;
    scene.add(playerMesh);
    
    updateFirstPersonHandMesh();
    updateThirdPersonHeldItem(playerMesh, hotbarBlocks[activeSlotIndex]);
  }

  // ==========================================================================
  // LANDMARK WORLD GENERATORS
  // ==========================================================================

  function generateWorld(seed, mapType) {
    // Clear
    Object.keys(worldData).forEach(k => delete worldData[k]);
    scene.children.filter(c => c.isVoxelMesh || c.isNpc || c.isAnimal || c.isMeatCollectible).forEach(c => scene.remove(c));
    npcs = []; animals = [];
    if (meatCollectibles) {
      meatCollectibles.forEach(c => scene.remove(c));
      meatCollectibles = [];
    }

    currentMapRadius = (mapType === 'earth_globe' || mapType === 'chimgon' || mapType === 'great_wall') ? 140 : 110;
    const R = currentMapRadius;
    const BASE = 90;

    // --- TERRAIN ---
    if (mapType === 'earth_globe') {
      for (let x = -R; x <= R; x++) {
        for (let z = -R; z <= R; z++) {
          const n1 = Math.sin(x * 0.025) * Math.cos(z * 0.02) * 14;
          const n2 = Math.cos(x * 0.04) * Math.sin(z * 0.035) * 8;
          const isOcean = (n1 + n2) < -3;
          const isSnow = Math.abs(z) > R * 0.72;
          const topY = Math.floor(BASE + (isOcean ? -4 : n1 + n2 * 0.5));
          worldData[`${x},0,${z}`] = BLOCKS.BEDROCK;
          for (let y = topY - 4; y <= topY; y++) {
            if (y === topY) worldData[`${x},${y},${z}`] = isOcean ? BLOCKS.WATER : (isSnow ? BLOCKS.SNOW : BLOCKS.GRASS);
            else worldData[`${x},${y},${z}`] = isOcean ? BLOCKS.SAND : BLOCKS.DIRT;
          }
        }
      }
    } else {
      const isSandy = ['pyramids', 'ichan_qala', 'desert', 'colosseum'].includes(mapType);
      const isSnowy = ['chimgon', 'everest', 'snow'].includes(mapType);
      const isClassic = mapType === 'minecraft_classic' || mapType === 'quest_island' || mapType === 'coop_building';
      const isNature = mapType === 'nature_valley' || mapType === 'online_shooter';

      for (let x = -R; x <= R; x++) {
        for (let z = -R; z <= R; z++) {
          let nx = 0;
          if (isClassic) {
            nx = Math.sin(x * 0.02) * Math.cos(z * 0.02) * 11 + Math.sin(x * 0.06) * 3;
          } else if (isNature) {
            nx = Math.sin(x * 0.025) * Math.cos(z * 0.025) * 15 + Math.sin(x * 0.08) * 4;
          } else {
            nx = Math.sin(x * 0.035 + 1.2) * 6 + Math.cos(z * 0.04) * 5;
          }
          
          let topY = Math.floor(BASE + nx);
          worldData[`${x},0,${z}`] = BLOCKS.BEDROCK;

          const lakeNoise = (isClassic || isNature) ? (Math.sin(x * 0.04) * Math.cos(z * 0.04)) : 0;
          const riverNoise = isNature ? (Math.sin(x * 0.03 + z * 0.03) + Math.cos(x * 0.02 - z * 0.05)) : 0;
          
          // Disable lakes on shooter map to maximize tactical arena ground
          const isLake = mapType !== 'online_shooter' && ((isClassic && lakeNoise < -0.42) || (isNature && (lakeNoise < -0.3 || Math.abs(riverNoise) < 0.25)));

          if (isLake) {
            const lakeDepth = Math.floor(BASE - 5);
            const waterLevel = Math.floor(BASE - 1);
            
            // Fill solid ground from bedrock up to lake depth (prevents hollow gaps)
            for (let y = 1; y < lakeDepth - 2; y++) {
              worldData[`${x},${y},${z}`] = BLOCKS.STONE;
            }
            for (let y = lakeDepth - 2; y <= waterLevel; y++) {
              if (y === waterLevel) {
                worldData[`${x},${y},${z}`] = BLOCKS.WATER;
              } else if (y >= waterLevel - 2) {
                worldData[`${x},${y},${z}`] = (isNature && Math.random() < 0.5) ? BLOCKS.DIRT : BLOCKS.SAND;
              } else {
                worldData[`${x},${y},${z}`] = BLOCKS.DIRT;
              }
            }
          } else {
            const hasSandyBorder = (isClassic || isNature) && (lakeNoise < -0.36 || Math.abs(riverNoise) < 0.35);
            
            // Fill solid ground from bedrock up to topY - 5 (prevents hollow cliff overhangs)
            for (let y = 1; y < topY - 5; y++) {
              worldData[`${x},${y},${z}`] = (y < BASE - 15) ? BLOCKS.STONE : BLOCKS.DIRT;
            }
            for (let y = topY - 5; y <= topY; y++) {
              if (y === topY) {
                const bType = hasSandyBorder ? (isNature ? BLOCKS.DIRT : BLOCKS.SAND) : (isSandy ? BLOCKS.SAND : (isSnowy ? BLOCKS.SNOW : BLOCKS.GRASS));
                worldData[`${x},${y},${z}`] = bType;
                
                const flowerProb = (mapType === 'online_shooter') ? 0.0015 : (isNature ? 0.04 : 0.015);
                if ((isClassic || isNature) && bType === BLOCKS.GRASS && Math.random() < flowerProb) {
                  worldData[`${x},${y+1},${z}`] = BLOCKS.FLOWER;
                }
              } else {
                worldData[`${x},${y},${z}`] = isSandy ? BLOCKS.SAND : BLOCKS.DIRT;
              }
            }
          }
        }
      }
    }

    // --- LANDMARKS ---
    const gY = BASE;
    if (mapType === 'registan')         buildRegistan(0, gY, 0);
    else if (mapType === 'ichan_qala')  buildIchanQala(0, gY, 0);
    else if (mapType === 'minorai_kalon') buildMinoraiKalon(0, gY, 0);
    else if (mapType === 'tashkent_tower') buildTashkentTower(0, gY, 0);
    else if (mapType === 'chimgon')     buildChimgon(R, gY);
    else if (mapType === 'pyramids')    buildPyramids(0, gY, 0);
    else if (mapType === 'eiffel')      buildEiffelTower(0, gY, 0);
    else if (mapType === 'colosseum')   buildColosseum(0, gY, 0);
    else if (mapType === 'big_ben')     buildBigBen(0, gY, 0);
    else if (mapType === 'burj_khalifa') buildBurjKhalifa(0, gY, 0);
    else if (mapType === 'great_wall')  buildGreatWall(gY);
    else if (mapType === 'taj_mahal')   buildTajMahal(0, gY, 0);
    else if (mapType === 'quest_island') buildQuestIsland(0, gY, 0);
    else if (mapType === 'online_shooter') buildOnlineShooter(0, gY, 0);
    else if (mapType === 'coop_building') buildCoopBuilding(0, gY, 0);

    // Trees in green maps
    if (!['pyramids', 'colosseum', 'eiffel', 'big_ben', 'ichan_qala'].includes(mapType)) {
      spawnTrees(R, gY, mapType);
    }

    // Skip animals on shooter map as requested
    if (mapType !== 'online_shooter') {
      spawnAnimals(R, gY + 1);
    }
    spawnDecorationsAndOres(R, gY, mapType);

    Object.keys(modifiedBlocks).forEach(k => { worldData[k] = modifiedBlocks[k]; });
    renderInstancedWorld();
    playerPos.set(5, gY + 20, 30);
  }

  function spawnDecorationsAndOres(R, gY, mapType) {
    const isGreen = !['pyramids', 'colosseum', 'snow', 'everest'].includes(mapType);
    
    // 1. Pumpkin Patches
    if (isGreen) {
      const pumpkinCount = 20;
      for (let i = 0; i < pumpkinCount; i++) {
        const px = Math.floor((Math.random() - 0.5) * (R * 1.5));
        const pz = Math.floor((Math.random() - 0.5) * (R * 1.5));
        for (let y = gY + 30; y >= gY - 5; y--) {
          const b = worldData[`${px},${y},${pz}`];
          if (b === BLOCKS.GRASS) {
            setB(px, y + 1, pz, BLOCKS.PUMPKIN);
            if (Math.random() < 0.5) setB(px + 1, y + 1, pz, BLOCKS.PUMPKIN);
            break;
          }
        }
      }
    }

    // 2. Hay Bales near landmarks / squares
    const hayCount = 15;
    for (let i = 0; i < hayCount; i++) {
      const hx = Math.floor((Math.random() - 0.5) * (R * 1.2));
      const hz = Math.floor((Math.random() - 0.5) * (R * 1.2));
      for (let y = gY + 25; y >= gY - 5; y--) {
        const b = worldData[`${hx},${y},${hz}`];
        if (b && b !== BLOCKS.AIR && b !== BLOCKS.WATER) {
          setB(hx, y + 1, hz, BLOCKS.HAY_BALE);
          setB(hx, y + 2, hz, BLOCKS.HAY_BALE);
          if (Math.random() < 0.6) setB(hx + 1, y + 1, hz, BLOCKS.HAY_BALE);
          break;
        }
      }
    }

    // 3. Mossy Stone Boulders
    const mossCount = 25;
    for (let i = 0; i < mossCount; i++) {
      const mx = Math.floor((Math.random() - 0.5) * (R * 1.6));
      const mz = Math.floor((Math.random() - 0.5) * (R * 1.6));
      for (let y = gY + 30; y >= gY - 5; y--) {
        const b = worldData[`${mx},${y},${mz}`];
        if (b && b !== BLOCKS.AIR && b !== BLOCKS.WATER) {
          fillBox(mx, y + 1, mz, mx + 1, y + 2, mz + 1, BLOCKS.MOSSY_STONE);
          break;
        }
      }
    }

    // 4. Exposed Ore Veins & Obsidian in Stone Cliff/Ground
    const oreTypes = [BLOCKS.COAL, BLOCKS.IRON, BLOCKS.GOLD, BLOCKS.DIAMOND, BLOCKS.OBSIDIAN];
    const oreCount = 35;
    for (let i = 0; i < oreCount; i++) {
      const ox = Math.floor((Math.random() - 0.5) * (R * 1.6));
      const oz = Math.floor((Math.random() - 0.5) * (R * 1.6));
      const ore = oreTypes[Math.floor(Math.random() * oreTypes.length)];
      for (let y = gY + 15; y >= gY - 15; y--) {
        const b = worldData[`${ox},${y},${oz}`];
        if (b === BLOCKS.STONE || b === BLOCKS.DARK_STONE || b === BLOCKS.DIRT) {
          setB(ox, y, oz, ore);
          if (Math.random() < 0.5) setB(ox + 1, y, oz, ore);
          if (Math.random() < 0.5) setB(ox, y - 1, oz, ore);
          break;
        }
      }
    }

    // 5. Glowstone Posts at historical square corners
    const glowPosts = [
      { x: -18, z: -18 }, { x: 18, z: -18 }, { x: -18, z: 18 }, { x: 18, z: 18 },
      { x: -35, z: -35 }, { x: 35, z: -35 }, { x: -35, z: 35 }, { x: 35, z: 35 }
    ];
    glowPosts.forEach(p => {
      for (let y = gY + 25; y >= gY - 5; y--) {
        const b = worldData[`${p.x},${y},${p.z}`];
        if (b && b !== BLOCKS.AIR && b !== BLOCKS.WATER) {
          setB(p.x, y + 1, p.z, BLOCKS.WOOD);
          setB(p.x, y + 2, p.z, BLOCKS.WOOD);
          setB(p.x, y + 3, p.z, BLOCKS.GLOWSTONE);
          placedLights[`${p.x},${y+3},${p.z}`] = true;
          break;
        }
      }
    });
  }

  // Helper: set block
  function setB(x, y, z, t) { worldData[`${x},${y},${z}`] = t; }

  // Fill box
  function fillBox(x1, y1, z1, x2, y2, z2, t) {
    for (let x = x1; x <= x2; x++)
      for (let y = y1; y <= y2; y++)
        for (let z = z1; z <= z2; z++)
          setB(x, y, z, t);
  }

  // Hollow box (walls only)
  function hollowBox(x1, y1, z1, x2, y2, z2, t, fill = null) {
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          const wall = x === x1 || x === x2 || z === z1 || z === z2;
          const roof = y === y2;
          const floor2 = y === y1;
          if (wall || roof || floor2) setB(x, y, z, t);
          else if (fill !== null) setB(x, y, z, fill);
        }
      }
    }
  }

  // Draw vertical ring (for domes)
  function dome(cx, cy, cz, rx, ry, rz, t) {
    for (let th = 0; th <= Math.PI; th += 0.08) {
      for (let ph = 0; ph <= Math.PI * 2; ph += 0.05) {
        const x = Math.round(cx + rx * Math.sin(th) * Math.cos(ph));
        const y = Math.round(cy + ry * Math.cos(th));
        const z = Math.round(cz + rz * Math.sin(th) * Math.sin(ph));
        if (y >= cy) setB(x, y, z, t);
      }
    }
  }

  // ==========================================================================
  // UZBEKISTAN LANDMARKS
  // ==========================================================================

  function buildRegistan(vx, vy, vz) {
    // Grand plaza floor
    fillBox(vx - 25, vy, vz - 15, vx + 25, vy, vz + 15, BLOCKS.WHITE_MARBLE);

    // Left madrasa - Ulugbek
    buildMadrasa(vx - 18, vy, vz - 2);
    // Right madrasa - Sher-Dor
    buildMadrasa(vx + 18, vy, vz - 2);
    // Central madrasa - Tillya-Kori
    buildMadrasa(vx, vy, vz - 10, true);

    showToast('Samarqand Registon maydoniga xush kelibsiz!');
  }

  function buildMadrasa(vx, vy, vz, isCentral = false) {
    const w = isCentral ? 14 : 10;
    const h = isCentral ? 22 : 20;
    // Main hall
    hollowBox(vx - w, vy + 1, vz - 6, vx + w, vy + h, vz + 6, BLOCKS.BLUE_TILE, BLOCKS.WHITE_MARBLE);
    // Floor
    fillBox(vx - w, vy, vz - 6, vx + w, vy, vz + 6, BLOCKS.WHITE_MARBLE);
    // Columns
    for (let dx = -w; dx <= w; dx += w * 2) {
      for (let cy = vy + 1; cy <= vy + h; cy++) {
        setB(vx + dx, cy, vz - 6, BLOCKS.GLAZED_BLUE);
        setB(vx + dx, cy, vz + 6, BLOCKS.GLAZED_BLUE);
      }
    }
    // Main dome
    dome(vx, vy + h + 1, vz, 7, 8, 7, BLOCKS.GLAZED_BLUE);
    // Side minarets
    const mH = h + 8;
    for (let side of [-1, 1]) {
      for (let y = vy + 1; y <= vy + mH; y++) {
        const r = y < vy + mH - 3 ? 2 : 1;
        for (let dx = -r; dx <= r; dx++) {
          for (let dz = -r; dz <= r; dz++) {
            if (Math.abs(dx) === r || Math.abs(dz) === r) {
              setB(vx + side * (w - 1) + dx, y, vz - 6 + dz, y % 4 === 0 ? BLOCKS.GLAZED_BLUE : BLOCKS.BLUE_TILE);
            }
          }
        }
      }
      // Minaret cap
      dome(vx + side * (w - 1), vy + mH + 1, vz - 6, 2, 3, 2, BLOCKS.GLAZED_BLUE);
      setB(vx + side * (w - 1), vy + mH + 4, vz - 6, BLOCKS.LANTERN);
    }
    // Archway entrance
    for (let y = vy + 1; y <= vy + 6; y++) {
      setB(vx - 2, y, vz - 6, BLOCKS.AIR);
      setB(vx - 1, y, vz - 6, BLOCKS.AIR);
      setB(vx, y, vz - 6, BLOCKS.AIR);
      setB(vx + 1, y, vz - 6, BLOCKS.AIR);
      setB(vx + 2, y, vz - 6, BLOCKS.AIR);
    }
    // Arabic tilework pattern on facade
    for (let y = vy + 7; y <= vy + h; y += 3) {
      for (let dx = -w + 2; dx <= w - 2; dx += 3) {
        setB(vx + dx, y, vz - 6, BLOCKS.GLAZED_BLUE);
      }
    }
  }

  function buildMinoraiKalon(vx, vy, vz) {
    // Ground plaza
    fillBox(vx - 8, vy, vz - 8, vx + 8, vy, vz + 8, BLOCKS.WHITE_MARBLE);
    // The Kalon Minaret - famous tapering cylinder
    const totalH = 46;
    for (let y = 1; y <= totalH; y++) {
      const r = Math.max(2, Math.round(5 - y * 0.06));
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist <= r && dist > r - 1.5) {
            const band = Math.floor(y / 3) % 2;
            setB(vx + dx, vy + y, vz + dz, band === 0 ? BLOCKS.RED_BRICK : BLOCKS.GLAZED_BLUE);
          }
        }
      }
    }
    // Lantern at top
    for (let dx = -3; dx <= 3; dx++) {
      for (let dz = -3; dz <= 3; dz++) {
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d <= 3) setB(vx + dx, vy + totalH + 1, vz + dz, BLOCKS.BLUE_TILE);
      }
    }
    setB(vx, vy + totalH + 4, vz, BLOCKS.LANTERN);
    // Adjacent mosque
    hollowBox(vx + 12, vy + 1, vz - 8, vx + 26, vy + 14, vz + 8, BLOCKS.BLUE_TILE, BLOCKS.WHITE_MARBLE);
    dome(vx + 19, vy + 15, vz, 6, 7, 6, BLOCKS.GLAZED_BLUE);
  }

  function buildIchanQala(vx, vy, vz) {
    // Outer city walls
    const w = 28;
    for (let y = vy + 1; y <= vy + 10; y++) {
      for (let x = vx - w; x <= vx + w; x++) {
        setB(x, y, vz - w, BLOCKS.RED_BRICK);
        setB(x, y, vz + w, BLOCKS.RED_BRICK);
      }
      for (let z = vz - w; z <= vz + w; z++) {
        setB(vx - w, y, z, BLOCKS.RED_BRICK);
        setB(vx + w, y, z, BLOCKS.RED_BRICK);
      }
    }
    // Battlements
    for (let x = vx - w; x <= vx + w; x += 2) {
      setB(x, vy + 11, vz - w, BLOCKS.RED_BRICK);
      setB(x, vy + 11, vz + w, BLOCKS.RED_BRICK);
    }
    // Gate towers
    for (let corner of [[-w, -w], [w, -w], [-w, w], [w, w]]) {
      const [cx, cz] = corner;
      for (let y = vy + 1; y <= vy + 16; y++) {
        for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) {
          if (Math.abs(dx) === 3 || Math.abs(dz) === 3) setB(vx + cx + dx, y, vz + cz + dz, BLOCKS.RED_BRICK);
        }
      }
      dome(vx + cx, vy + 17, vz + cz, 4, 5, 4, BLOCKS.BLUE_TILE);
    }
    // Islam Khoja minaret (tallest in Khiva)
    buildMinaret(vx + 8, vy, vz, 38);
    // Kalta Minor (unfinished blue minaret)
    buildFatMinaret(vx - 10, vy, vz + 5, 18);
    // Inner mosque
    hollowBox(vx - 8, vy + 1, vz - 10, vx + 6, vy + 12, vz - 2, BLOCKS.WHITE_MARBLE, BLOCKS.AIR);
    dome(vx - 1, vy + 13, vz - 6, 5, 6, 5, BLOCKS.GLAZED_BLUE);
    // Floor within walls
    fillBox(vx - w + 1, vy, vz - w + 1, vx + w - 1, vy, vz + w - 1, BLOCKS.SAND);
  }

  function buildMinaret(vx, vy, vz, h) {
    for (let y = 1; y <= h; y++) {
      const r = Math.max(1, Math.round(4 - y * 0.07));
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
        if (Math.abs(dx) === r || Math.abs(dz) === r) {
          setB(vx + dx, vy + y, vz + dz, y % 3 === 0 ? BLOCKS.GLAZED_BLUE : BLOCKS.RED_BRICK);
        }
      }
    }
    dome(vx, vy + h + 1, vz, 3, 4, 3, BLOCKS.GLAZED_BLUE);
    setB(vx, vy + h + 5, vz, BLOCKS.LANTERN);
  }

  function buildFatMinaret(vx, vy, vz, h) {
    for (let y = 1; y <= h; y++) {
      const r = Math.round(6 - y * 0.15);
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
        if (Math.abs(dx) === r || Math.abs(dz) === r) {
          setB(vx + dx, vy + y, vz + dz, y % 2 === 0 ? BLOCKS.BLUE_TILE : BLOCKS.GLAZED_BLUE);
        }
      }
    }
  }

  function buildTashkentTower(vx, vy, vz) {
    fillBox(vx - 8, vy, vz - 8, vx + 8, vy, vz + 8, BLOCKS.WHITE_MARBLE);
    // Base
    fillBox(vx - 4, vy + 1, vz - 4, vx + 4, vy + 8, vz + 4, BLOCKS.DARK_STONE);
    fillBox(vx - 3, vy + 2, vz - 3, vx + 3, vy + 8, vz + 3, BLOCKS.AIR);
    // Main shaft
    for (let y = vy + 9; y <= vy + 55; y++) {
      const r = y < vy + 30 ? 2 : 1;
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
        setB(vx + dx, y, vz + dz, BLOCKS.IRON);
      }
    }
    // Observation deck at y+38
    fillBox(vx - 6, vy + 38, vz - 6, vx + 6, vy + 42, vz + 6, BLOCKS.GLAZED_BLUE);
    fillBox(vx - 5, vy + 39, vz - 5, vx + 5, vy + 41, vz + 5, BLOCKS.AIR);
    // Second deck at y+50
    fillBox(vx - 4, vy + 50, vz - 4, vx + 4, vy + 53, vz + 4, BLOCKS.BLUE_TILE);
    fillBox(vx - 3, vy + 51, vz - 3, vx + 3, vy + 52, vz + 3, BLOCKS.AIR);
    // Antenna
    for (let y = vy + 54; y <= vy + 70; y++) setB(vx, y, vz, BLOCKS.IRON);
    setB(vx, vy + 71, vz, BLOCKS.LANTERN);
    // Legs (3 support legs, typical TV tower style)
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      for (let h = 1; h <= 18; h++) {
        const frac = 1 - h / 18;
        const lx = Math.round(vx + Math.cos(angle) * 12 * frac);
        const lz = Math.round(vz + Math.sin(angle) * 12 * frac);
        setB(lx, vy + h, lz, BLOCKS.DARK_STONE);
      }
    }
  }

  function buildChimgon(R, vy) {
    for (let x = -R; x <= R; x += 3) {
      for (let z = -R; z <= R; z += 3) {
        const dist = Math.hypot(x, z);
        if (dist > 18) {
          const h = Math.round(12 + Math.sin(x * 0.09) * 20 + Math.cos(z * 0.07) * 18);
          const peakY = vy + h;
          for (let y = vy; y <= Math.min(CHUNK_HEIGHT_MAX - 1, peakY); y++) {
            setB(x, y, z, y > vy + h - 5 ? BLOCKS.SNOW : (y > vy + h - 12 ? BLOCKS.STONE : BLOCKS.DIRT));
          }
        }
      }
    }
  }

  // ==========================================================================
  // WORLD LANDMARKS
  // ==========================================================================

  function buildEiffelTower(vx, vy, vz) {
    fillBox(vx - 20, vy, vz - 20, vx + 20, vy, vz + 20, BLOCKS.GRASS);
    // Ground footprint - 4 leg bases
    const legOff = 16;
    const legs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    
    // LEGS - level 1 (ground to platform 1, y: vy+1 to vy+20)
    for (let h = 1; h <= 20; h++) {
      const frac = h / 20;
      const spread = Math.round(legOff * (1 - frac * 0.85));
      for (const [sx, sz] of legs) {
        const lx = vx + sx * spread;
        const lz = vz + sz * spread;
        // Thick leg = 2x2 blocks
        setB(lx, vy + h, lz, BLOCKS.IRON);
        setB(lx + sx, vy + h, lz, BLOCKS.IRON);
        setB(lx, vy + h, lz + sz, BLOCKS.IRON);
        // Cross braces every 4 levels
        if (h % 4 === 0) {
          setB(lx + sx * 2, vy + h, lz, BLOCKS.DARK_STONE);
          setB(lx, vy + h, lz + sz * 2, BLOCKS.DARK_STONE);
        }
      }
    }
    // First platform (y = vy+20 to vy+22)
    fillBox(vx - 8, vy + 20, vz - 8, vx + 8, vy + 22, vz + 8, BLOCKS.IRON);
    fillBox(vx - 7, vy + 21, vz - 7, vx + 7, vy + 21, vz + 7, BLOCKS.DARK_STONE);

    // LEGS - level 2 (platform 1 to platform 2, y: vy+22 to vy+40)
    for (let h = 23; h <= 40; h++) {
      const frac = (h - 23) / 17;
      const spread = Math.round(8 * (1 - frac * 0.7));
      for (const [sx, sz] of legs) {
        const lx = vx + sx * spread;
        const lz = vz + sz * spread;
        setB(lx, vy + h, lz, BLOCKS.IRON);
        setB(lx + sx, vy + h, lz, BLOCKS.IRON);
        if (h % 4 === 0) {
          setB(lx + sx, vy + h, lz + sz, BLOCKS.DARK_STONE);
        }
      }
    }
    // Second platform (y = vy+40 to vy+43)
    fillBox(vx - 5, vy + 40, vz - 5, vx + 5, vy + 43, vz + 5, BLOCKS.IRON);
    fillBox(vx - 4, vy + 41, vz - 4, vx + 4, vy + 41, vz + 4, BLOCKS.DARK_STONE);

    // MAIN SHAFT (y: vy+43 to vy+80)
    for (let h = 43; h <= 80; h++) {
      const r = h < 60 ? 2 : 1;
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
        if (Math.abs(dx) === r || Math.abs(dz) === r || (dx === 0 && dz === 0)) {
          setB(vx + dx, vy + h, vz + dz, BLOCKS.IRON);
        }
      }
    }
    // Observation top (y: vy+80 to vy+83)
    fillBox(vx - 3, vy + 80, vz - 3, vx + 3, vy + 83, vz + 3, BLOCKS.IRON);
    // Antenna (y: vy+83 to vy+95)
    for (let h = 83; h <= 95; h++) setB(vx, vy + h, vz, BLOCKS.IRON);
    setB(vx, vy + 96, vz, BLOCKS.LANTERN);
  }

  function buildPyramids(vx, vy, vz) {
    // Great Pyramid of Giza
    const size = 22;
    for (let h = 0; h < size; h++) {
      const half = size - h;
      for (let x = vx - half; x <= vx + half; x++) {
        for (let z = vz - half; z <= vz + half; z++) {
          setB(x, vy + 1 + h, z, BLOCKS.SAND);
        }
      }
    }
    // Interior hidden chamber (for exploration)
    fillBox(vx - 3, vy + 3, vz - 3, vx + 3, vy + 8, vz + 3, BLOCKS.AIR);
    // Entrance
    setB(vx, vy + 2, vz + size - 1, BLOCKS.AIR);
    setB(vx, vy + 3, vz + size - 1, BLOCKS.AIR);
    setB(vx, vy + 4, vz + size - 1, BLOCKS.AIR);
    // Sphinx outline (crude but recognizable)
    fillBox(vx + 28, vy + 1, vz - 3, vx + 42, vy + 5, vz + 3, BLOCKS.SAND);
    // Sphinx head
    fillBox(vx + 38, vy + 5, vz - 2, vx + 42, vy + 11, vz + 2, BLOCKS.SAND);
    // Second smaller pyramid
    const size2 = 14;
    for (let h = 0; h < size2; h++) {
      const half = size2 - h;
      for (let x = (vx - 35) - half; x <= (vx - 35) + half; x++) {
        for (let z = vz - half; z <= vz + half; z++) {
          setB(x, vy + 1 + h, z, BLOCKS.SAND);
        }
      }
    }
  }

  function buildColosseum(vx, vy, vz) {
    fillBox(vx - 22, vy, vz - 16, vx + 22, vy, vz + 16, BLOCKS.WHITE_MARBLE);
    // Oval outer wall
    const aR = 20, bR = 14, height = 18;
    for (let th = 0; th < Math.PI * 2; th += 0.04) {
      const ex = Math.round(vx + aR * Math.cos(th));
      const ez = Math.round(vz + bR * Math.sin(th));
      for (let y = vy + 1; y <= vy + height; y++) {
        const mat = (y - vy) % 6 < 2 ? BLOCKS.WHITE_MARBLE : BLOCKS.STONE;
        setB(ex, y, ez, mat);
        setB(ex + 1, y, ez, mat);
      }
    }
    // Arched openings
    for (let th = 0; th < Math.PI * 2; th += Math.PI / 8) {
      const ex = Math.round(vx + aR * Math.cos(th));
      const ez = Math.round(vz + bR * Math.sin(th));
      for (let y = vy + 2; y <= vy + 7; y++) {
        setB(ex, y, ez, BLOCKS.AIR);
        setB(ex + 1, y, ez, BLOCKS.AIR);
      }
    }
    // Inner arena seating tiers
    for (let r = 2; r <= 14; r += 4) {
      for (let th = 0; th < Math.PI * 2; th += 0.15) {
        const sx = Math.round(vx + r * Math.cos(th));
        const sz = Math.round(vz + (r * 0.7) * Math.sin(th));
        const tier = Math.floor(r / 4);
        setB(sx, vy + 1 + tier, sz, BLOCKS.WHITE_MARBLE);
      }
    }
    // Arena floor
    fillBox(vx - 8, vy + 1, vz - 5, vx + 8, vy + 1, vz + 5, BLOCKS.SAND);
  }

  function buildBigBen(vx, vy, vz) {
    fillBox(vx - 8, vy, vz - 8, vx + 8, vy, vz + 8, BLOCKS.STONE);
    // Base structure - Houses of Parliament wing
    hollowBox(vx - 20, vy + 1, vz - 5, vx - 6, vy + 14, vz + 5, BLOCKS.STONE, BLOCKS.AIR);
    // Small turrets along Parliament
    for (let tx = vx - 20; tx <= vx - 6; tx += 4) {
      for (let y = vy + 15; y <= vy + 17; y++) setB(tx, y, vz - 5, BLOCKS.STONE);
      for (let y = vy + 15; y <= vy + 17; y++) setB(tx, y, vz + 5, BLOCKS.STONE);
    }
    // Clock tower - Big Ben shaft
    fillBox(vx - 4, vy + 1, vz - 4, vx + 4, vy + 40, vz + 4, BLOCKS.WHITE_MARBLE);
    fillBox(vx - 3, vy + 2, vz - 3, vx + 3, vy + 39, vz + 3, BLOCKS.AIR);
    // Clock face - 4 sides (colored differently)
    for (let face of [0, 1, 2, 3]) {
      const fz = face < 2 ? (face === 0 ? vz - 4 : vz + 4) : vz;
      const fx = face < 2 ? vx : (face === 2 ? vx - 4 : vx + 4);
      // Clock ring
      for (let y = vy + 28; y <= vy + 36; y++) {
        if (face < 2) setB(fx + 2, y, fz, BLOCKS.GLAZED_BLUE);
        else setB(fx, y, fz + 2, BLOCKS.GLAZED_BLUE);
      }
    }
    // Belfry (y+40 to y+46)
    for (let y = vy + 40; y <= vy + 46; y++) {
      const r = 4;
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
        if (Math.abs(dx) === r || Math.abs(dz) === r) setB(vx + dx, y, vz + dz, BLOCKS.WHITE_MARBLE);
      }
    }
    // Gothic spire
    for (let y = vy + 46; y <= vy + 60; y++) {
      const spread = Math.round(4 * (1 - (y - vy - 46) / 14));
      fillBox(vx - spread, y, vz - spread, vx + spread, y, vz + spread, BLOCKS.DARK_STONE);
    }
    setB(vx, vy + 61, vz, BLOCKS.LANTERN);
  }

  function buildBurjKhalifa(vx, vy, vz) {
    fillBox(vx - 12, vy, vz - 12, vx + 12, vy, vz + 12, BLOCKS.DARK_STONE);
    // Y-shaped footprint tapering tower
    const totalH = 90;
    for (let h = 1; h <= totalH; h++) {
      const frac = 1 - (h / totalH) * 0.85;
      const baseR = Math.max(1, Math.round(8 * frac));
      // Main core
      fillBox(vx - baseR, vy + h, vz - baseR, vx + baseR, vy + h, vz + baseR, BLOCKS.GLASS);
      // Setbacks every 12 floors
      if (h % 12 === 0 && h < 70) {
        const setR = Math.max(2, baseR - 1);
        fillBox(vx - setR - 2, vy + h, vz - setR - 2, vx + setR + 2, vy + h, vz + setR + 2, BLOCKS.IRON);
      }
    }
    // Antenna
    for (let h = totalH + 1; h <= totalH + 20; h++) setB(vx, vy + h, vz, BLOCKS.IRON);
    setB(vx, vy + totalH + 21, vz, BLOCKS.LANTERN);
  }

  function buildGreatWall(vy) {
    // Great Wall snaking across the map
    const points = [
      [-60, -40], [-45, -35], [-30, -20], [-15, -8], [0, 0],
      [15, 8], [30, 20], [45, 30], [60, 40]
    ];
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, z1] = points[i], [x2, z2] = points[i + 1];
      const steps = Math.max(Math.abs(x2 - x1), Math.abs(z2 - z1));
      for (let s = 0; s <= steps; s++) {
        const x = Math.round(x1 + (x2 - x1) * s / steps);
        const z = Math.round(z1 + (z2 - z1) * s / steps);
        // Wall height 8 blocks
        for (let y = 1; y <= 8; y++) {
          setB(x, vy + y, z, BLOCKS.STONE);
          setB(x + 1, vy + y, z, BLOCKS.STONE);
          setB(x + 2, vy + y, z, BLOCKS.STONE);
        }
        // Battlements
        for (let bx = 0; bx <= 2; bx += 2) {
          setB(x + bx, vy + 9, z, BLOCKS.STONE);
          setB(x + bx, vy + 10, z, BLOCKS.STONE);
        }
        // Watchtower every 15 steps
        if (s % 15 === 0) {
          fillBox(x - 2, vy + 1, z - 2, x + 4, vy + 14, z + 4, BLOCKS.STONE);
          fillBox(x - 1, vy + 2, z - 1, x + 3, vy + 13, z + 3, BLOCKS.AIR);
        }
      }
    }
  }

  function buildTajMahal(vx, vy, vz) {
    // Reflecting pool
    fillBox(vx - 4, vy, vz + 10, vx + 4, vy, vz + 28, BLOCKS.WATER);
    // Grand platform
    fillBox(vx - 18, vy + 1, vz - 18, vx + 18, vy + 3, vz + 12, BLOCKS.WHITE_MARBLE);
    // Main mausoleum
    hollowBox(vx - 10, vy + 3, vz - 10, vx + 10, vy + 18, vz + 10, BLOCKS.WHITE_MARBLE, BLOCKS.AIR);
    // Octagonal base
    for (let dx = -10; dx <= 10; dx++) for (let dz = -10; dz <= 10; dz++) {
      if (Math.abs(dx) + Math.abs(dz) <= 14) setB(vx + dx, vy + 3, vz + dz, BLOCKS.WHITE_MARBLE);
    }
    // Central dome - the iconic one
    dome(vx, vy + 18, vz, 9, 12, 9, BLOCKS.WHITE_MARBLE);
    // 4 corner minarets
    for (const [mx, mz] of [[-16, -16], [16, -16], [-16, 16], [16, 16]]) {
      buildMinaret(vx + mx, vy + 1, vz + mz, 30);
    }
    // 4 smaller domes on corners of main platform
    for (const [dx, dz] of [[-9, -9], [9, -9], [-9, 9], [9, 9]]) {
      dome(vx + dx, vy + 18, vz + dz, 3, 4, 3, BLOCKS.WHITE_MARBLE);
    }
    // Archways
    for (const [dx, dz] of [[0, -10], [0, 10], [-10, 0], [10, 0]]) {
      for (let y = vy + 4; y <= vy + 12; y++) {
        if (dz !== 0) setB(vx, y, vz + dz, BLOCKS.AIR);
        else setB(vx + dx, y, vz, BLOCKS.AIR);
      }
    }
  }

  function buildQuestIsland(vx, vy, vz) {
    // Ancient Golden Quest Shrine & Beacon Tower
    fillBox(vx - 12, vy + 1, vz - 12, vx + 12, vy + 2, vz + 12, BLOCKS.WHITE_MARBLE);
    fillBox(vx - 8, vy + 3, vz - 8, vx + 8, vy + 4, vz + 8, BLOCKS.BLUE_TILE);
    
    // Central Quest Tower
    hollowBox(vx - 4, vy + 4, vz - 4, vx + 4, vy + 24, vz + 4, BLOCKS.GOLD, BLOCKS.AIR);
    dome(vx, vy + 24, vz, 5, 6, 5, BLOCKS.GLOWSTONE);
    
    // 4 Floating Energy Pillars
    for (const [px, pz] of [[-16, -16], [16, -16], [-16, 16], [16, 16]]) {
      fillBox(vx + px - 1, vy + 1, vz + pz - 1, vx + px + 1, vy + 12, vz + pz + 1, BLOCKS.DARK_STONE);
      setB(vx + px, vy + 13, vz + pz, BLOCKS.GLOWSTONE);
      setB(vx + px, vy + 14, vz + pz, BLOCKS.BLUE_TILE);
    }
    
    // Quest chests & lanterns
    setB(vx - 2, vy + 5, vz, BLOCKS.CHEST);
    setB(vx + 2, vy + 5, vz, BLOCKS.CRAFTING_TABLE);
    setB(vx, vy + 5, vz - 2, BLOCKS.LANTERN);
    setB(vx, vy + 5, vz + 2, BLOCKS.LANTERN);
  }

  function buildOnlineShooter(vx, vy, vz) {
    // Tactical Shooter Arena with walls, barricades, and sniper towers
    // 1. Perimeter Arena Floor & Borders
    fillBox(vx - 35, vy + 1, vz - 35, vx + 35, vy + 1, vz + 35, BLOCKS.DARK_STONE);
    
    // 2. High Cover Walls (Bullets cannot pass through!)
    // Center cross barricades
    fillBox(vx - 10, vy + 2, vz, vx + 10, vy + 6, vz, BLOCKS.RED_BRICK);
    fillBox(vx, vy + 2, vz - 10, vx, vy + 6, vz + 10, BLOCKS.RED_BRICK);
    
    // Corner Bunkers & Sandbag barriers
    for (const [bx, bz] of [[-18, -18], [18, -18], [-18, 18], [18, 18]]) {
      hollowBox(vx + bx - 4, vy + 2, vz + bz - 4, vx + bx + 4, vy + 8, vz + bz + 4, BLOCKS.STONE, BLOCKS.AIR);
      // Windows / Firing Slits
      setB(vx + bx, vy + 4, vz + bz - 4, BLOCKS.AIR);
      setB(vx + bx, vy + 4, vz + bz + 4, BLOCKS.AIR);
      setB(vx + bx - 4, vy + 4, vz + bz, BLOCKS.AIR);
      setB(vx + bx + 4, vy + 4, vz + bz, BLOCKS.AIR);
    }
    
    // Sandbag barricades spread across map
    for (const [sx, sz] of [[-8, 12], [12, -8], [-12, -8], [8, 12], [0, -22], [0, 22], [-22, 0], [22, 0]]) {
      fillBox(vx + sx - 2, vy + 2, vz + sz, vx + sx + 2, vy + 3, vz + sz, BLOCKS.SAND);
      fillBox(vx + sx, vy + 2, vz + sz - 2, vx + sx, vy + 3, vz + sz + 2, BLOCKS.SAND);
    }
    
    // Wooden Tree Cover Walls (Bulletproof trees)
    for (const [tx, tz] of [[-14, 5], [14, -5], [-5, -14], [5, 14], [-24, 15], [24, -15]]) {
      fillBox(vx + tx - 1, vy + 2, vz + tz - 1, vx + tx + 1, vy + 8, vz + tz + 1, BLOCKS.WOOD);
      fillBox(vx + tx - 2, vy + 9, vz + tz - 2, vx + tx + 2, vy + 12, vz + tz + 2, BLOCKS.LEAVES);
    }
  }

  function buildCoopBuilding(vx, vy, vz) {
    // Co-op House Building Foundation Plot
    // Shared Building Plot Floor
    fillBox(vx - 20, vy + 1, vz - 20, vx + 20, vy + 1, vz + 20, BLOCKS.PLANKS);
    
    // House frame guide pillars
    for (const [hx, hz] of [[-12, -12], [12, -12], [-12, 12], [12, 12]]) {
      fillBox(vx + hx, vy + 2, vz + hz, vx + hx, vy + 7, vz + hz, BLOCKS.WOOD);
    }
    fillBox(vx - 12, vy + 7, vz - 12, vx + 12, vy + 7, vz - 12, BLOCKS.WOOD);
    fillBox(vx - 12, vy + 7, vz + 12, vx + 12, vy + 7, vz + 12, BLOCKS.WOOD);
    fillBox(vx - 12, vy + 7, vz - 12, vx - 12, vy + 7, vz + 12, BLOCKS.WOOD);
    fillBox(vx + 12, vy + 7, vz - 12, vx + 12, vy + 7, vz + 12, BLOCKS.WOOD);
    
    // Shared Crafting & Building Supplies
    setB(vx - 5, vy + 2, vz - 5, BLOCKS.CRAFTING_TABLE);
    setB(vx - 3, vy + 2, vz - 5, BLOCKS.FURNACE);
    setB(vx - 1, vy + 2, vz - 5, BLOCKS.CHEST);
    setB(vx + 1, vy + 2, vz - 5, BLOCKS.SOFA);
    setB(vx + 4, vy + 2, vz - 5, BLOCKS.WINDOW);
    setB(vx + 6, vy + 2, vz - 5, BLOCKS.DOOR);
    
    // Lanterns on corners
    for (const [lx, lz] of [[-12, -12], [12, -12], [-12, 12], [12, 12]]) {
      setB(vx + lx, vy + 8, vz + lz, BLOCKS.LANTERN);
    }
  }

  // ==========================================================================
  // NATURE - Trees & Animals
  // ==========================================================================

  function getGroundHeight(x, z, defaultY) {
    for (let y = CHUNK_HEIGHT_MAX; y >= 0; y--) {
      const b = worldData[`${x},${y},${z}`];
      if (b && b !== BLOCKS.AIR && b !== BLOCKS.WATER && b !== BLOCKS.LEAVES && b !== BLOCKS.WOOD) {
        return y + 1;
      }
    }
    return defaultY;
  }

  function spawnTrees(R, baseY, mapType) {
    const isClassic = mapType === 'minecraft_classic';
    const isNature = mapType === 'nature_valley';
    const numTrees = isNature ? 350 : (isClassic ? 75 : 30);
    const numFlowers = isNature ? 600 : (isClassic ? 150 : 50);

    for (let i = 0; i < numTrees; i++) {
      const tx = Math.round((Math.random() - 0.5) * R * 1.5);
      const tz = Math.round((Math.random() - 0.5) * R * 1.5);
      const groundY = getGroundHeight(tx, tz, baseY) - 1;
      const treeH = 4 + Math.floor(Math.random() * 4);
      for (let h = 1; h <= treeH; h++) setB(tx, groundY + h, tz, BLOCKS.WOOD);
      for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) for (let dy = -1; dy <= 2; dy++) {
        if (Math.abs(dx) + Math.abs(dz) <= 3) setB(tx + dx, groundY + treeH + dy, tz + dz, BLOCKS.LEAVES);
      }
    }

    for (let i = 0; i < numFlowers; i++) {
      const tx = Math.round((Math.random() - 0.5) * R * 1.5);
      const tz = Math.round((Math.random() - 0.5) * R * 1.5);
      const groundY = getGroundHeight(tx, tz, baseY) - 1;
      
      const groundBlock = worldData[`${tx},${groundY},${tz}`];
      if (groundBlock === BLOCKS.GRASS || groundBlock === BLOCKS.DIRT) {
        setB(tx, groundY + 1, tz, BLOCKS.FLOWER);
      }
    }
  }

  function spawnAnimals(R, baseY) {
    const animalTypes = [
      { name: "Qo'y", color: 0xf5f5f5, bodyColor: 0xeeeeee, quote: "Qo'y: Baa! Men O'zbek dashtlarida yayrab yuraman!" },
      { name: "Sigir", color: 0x4e342e, bodyColor: 0x795548, quote: "Sigir: Moo! Sog'lom hayot - mazali sut demakdir!" },
      { name: "Tulki", color: 0xe64a19, bodyColor: 0xff7043, quote: "Tulki: Chul va yaylovlarda ehtiyotkorlik bilan kezaman." },
      { name: "Bo'ri", color: 0x607d8b, bodyColor: 0x90a4ae, quote: "Bo'ri: Hovvv! O'zbekiston chul va tog'larining erkin o'g'liman!" },
      { name: "Burgut", color: 0x795548, bodyColor: 0x4e342e, quote: "Burgut: Ozod osmonlarda baland parvoz etaman!" },
      { name: "Tuya", color: 0xd7ccc8, bodyColor: 0xffe0b2, quote: "Tuya: Qizilqum sahrolarida suvsiz kunlab yura olaman!" },
      { name: "Ot", color: 0x5d4037, bodyColor: 0x8d6e63, quote: "Ot: Qorabayir tulporiman, milliy merosimiz faxriman!" },
      { name: "Eshak", color: 0x9e9e9e, bodyColor: 0xbdbdbd, quote: "Eshak: Ih-oh! Mehnatkashlikda menga teng keladigani yo'q!" },
      { name: "Tovuq", color: 0xffffff, bodyColor: 0xffffff, quote: "Tovuq: Qoq-qoq! Tong otganda hammadan avval uyg'onaman!" },
      { name: "Qoplon", color: 0xc0ca33, bodyColor: 0xe8f5e9, quote: "Ilbirs: Chimgon tog'larining qor qoploniman, meni asrang!" }
    ];
    // Spawn more animals spread out properly
    for (let i = 0; i < 40; i++) {
      const aType = animalTypes[i % animalTypes.length];
      const ax = Math.round((Math.random() - 0.5) * R * 1.7);
      const az = Math.round((Math.random() - 0.5) * R * 1.7);
      const actualY = getGroundHeight(ax, az, baseY);
      spawnAnimal(ax, actualY, az, aType);
    }
  }

  function buildAnimalMesh(aType) {
    const group = new THREE.Group();
    group.legs = [];
    const matHead = new THREE.MeshLambertMaterial({ color: aType.color });
    const matBody = new THREE.MeshLambertMaterial({ color: aType.bodyColor });
    const matBlack = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const matWhite = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const matPink = new THREE.MeshLambertMaterial({ color: 0xff80ab });
    const matYellow = new THREE.MeshLambertMaterial({ color: 0xffeb3b });
    const matOrange = new THREE.MeshLambertMaterial({ color: 0xff9800 });

    if (aType.name === "Tuya") {
      // Camel Model - Rich details
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.65, 0.55), matBody);
      body.position.set(0, 0.65, 0);
      const hump1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.4), matBody);
      hump1.position.set(-0.22, 1.0, 0);
      const hump2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.4), matBody);
      hump2.position.set(0.22, 1.0, 0);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.75, 0.25), matBody);
      neck.position.set(0.48, 1.0, 0);
      neck.rotation.z = -0.3;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.28, 0.25), matHead);
      head.position.set(0.68, 1.4, 0);
      
      // Eyes
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), matBlack);
      eyeL.position.set(0.78, 1.45, 0.13);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), matBlack);
      eyeR.position.set(0.78, 1.45, -0.13);

      // Snout
      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.18), matBody);
      snout.position.set(0.9, 1.35, 0);

      // Tail
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.08), matBody);
      tail.position.set(-0.54, 0.5, 0);
      tail.rotation.z = 0.25;

      group.add(body, hump1, hump2, neck, head, eyeL, eyeR, snout, tail);
      
      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.35, -0.18], [0.35, -0.18], [-0.35, 0.18], [0.35, 0.18]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, 0.16), legMat);
        leg.position.set(lx, 0.325, lz);
        group.add(leg);
        group.legs.push(leg);
      }
    } 
    else if (aType.name === "Ot") {
      // Horse Model - Premium details
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.65, 0.48), matBody);
      body.position.set(0, 0.65, 0);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.65, 0.26), matBody);
      neck.position.set(0.46, 1.1, 0);
      neck.rotation.z = -0.45;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.3, 0.26), matHead);
      head.position.set(0.58, 1.4, 0);
      
      // Eyes
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), matBlack);
      eyeL.position.set(0.68, 1.45, 0.135);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), matBlack);
      eyeR.position.set(0.68, 1.45, -0.135);

      // Ears
      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.08), matHead);
      earL.position.set(0.45, 1.6, 0.08);
      const earR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.08), matHead);
      earR.position.set(0.45, 1.6, -0.08);

      // Mane & Tail
      const mane = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.22), matBlack);
      mane.position.set(0.3, 1.15, 0);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 0.12), matBlack);
      tail.position.set(-0.6, 0.6, 0);
      tail.rotation.z = 0.2;

      group.add(body, neck, head, eyeL, eyeR, earL, earR, mane, tail);

      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.4, -0.16], [0.4, -0.16], [-0.4, 0.16], [0.4, 0.16]]) {
        const legGroup = new THREE.Group();
        legGroup.position.set(lx, 0.325, lz);
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, 0.16), legMat);
        // Hoof
        const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.18), matBlack);
        hoof.position.y = -0.275;
        legGroup.add(leg, hoof);
        group.add(legGroup);
        group.legs.push(legGroup);
      }
    } 
    else if (aType.name === "Eshak") {
      // Donkey Model - Premium details
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.45), matBody);
      body.position.set(0, 0.55, 0);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.55, 0.22), matBody);
      neck.position.set(0.36, 0.9, 0);
      neck.rotation.z = -0.35;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.24), matHead);
      head.position.set(0.46, 1.15, 0);
      
      // Long Ears
      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.08), new THREE.MeshLambertMaterial({ color: 0x555555 }));
      earL.position.set(0.4, 1.35, -0.06);
      earL.rotation.z = -0.2;
      const earR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.08), new THREE.MeshLambertMaterial({ color: 0x555555 }));
      earR.position.set(0.4, 1.35, 0.06);
      earR.rotation.z = -0.2;

      // Eyes
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.04), matBlack);
      eyeL.position.set(0.54, 1.2, 0.125);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.04), matBlack);
      eyeR.position.set(0.54, 1.2, -0.125);

      // Tail
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.08), new THREE.MeshLambertMaterial({ color: 0x444444 }));
      tail.position.set(-0.48, 0.5, 0);

      group.add(body, neck, head, earL, earR, eyeL, eyeR, tail);

      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.3, -0.14], [0.3, -0.14], [-0.3, 0.14], [0.3, 0.14]]) {
        const legGroup = new THREE.Group();
        legGroup.position.set(lx, 0.275, lz);
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.55, 0.15), legMat);
        const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.08, 0.17), matBlack);
        hoof.position.y = -0.235;
        legGroup.add(leg, hoof);
        group.add(legGroup);
        group.legs.push(legGroup);
      }
    }
    else if (aType.name === "Tovuq") {
      // Chicken Model - Highly detailed
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.35, 0.32), matBody);
      body.position.set(0, 0.35, 0);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.22), matHead);
      head.position.set(0.18, 0.6, 0);
      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.08), matOrange);
      beak.position.set(0.33, 0.6, 0);
      const comb = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.08), new THREE.MeshLambertMaterial({ color: 0xe53935 }));
      comb.position.set(0.18, 0.76, 0);
      
      // Wattles
      const wattle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.08), new THREE.MeshLambertMaterial({ color: 0xe53935 }));
      wattle.position.set(0.25, 0.48, 0);

      // Wings
      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.26), matBody);
      wingL.position.set(-0.02, 0.35, 0.17);
      const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.26), matBody);
      wingR.position.set(-0.02, 0.35, -0.17);

      // Eyes
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.04), matBlack);
      eyeL.position.set(0.24, 0.65, 0.115);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.04), matBlack);
      eyeR.position.set(0.24, 0.65, -0.115);

      group.add(body, head, beak, comb, wattle, wingL, wingR, eyeL, eyeR);

      const legMat = matOrange;
      const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.06), legMat);
      legL.position.set(-0.08, 0.1, -0.06);
      const legR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.06), legMat);
      legR.position.set(-0.08, 0.1, 0.06);
      group.add(legL, legR);
      group.legs.push(legL, legR);
    }
    else if (aType.name === "Qoplon") {
      // Leopard (Qoplon / Ilbirs) Model
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.45), matBody);
      body.position.set(0, 0.45, 0);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.4), matHead);
      head.position.set(0.55, 0.7, 0);

      // Spots on leopard body
      for (const [sx, sy, sz] of [[-0.2, 0.55, 0.23], [0.1, 0.5, -0.23], [-0.3, 0.4, -0.23], [0.3, 0.5, 0.23], [-0.1, 0.68, 0.15], [0.2, 0.68, -0.15]]) {
        const spot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.02), matBlack);
        spot.position.set(sx, sy, sz);
        group.add(spot);
      }

      // Glowing yellow/green eyes
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.05), new THREE.MeshLambertMaterial({ color: 0xccff00 }));
      eyeL.position.set(0.72, 0.76, 0.15);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.05), new THREE.MeshLambertMaterial({ color: 0xccff00 }));
      eyeR.position.set(0.72, 0.76, -0.15);

      // Snout & Ears
      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.2), matWhite);
      snout.position.set(0.78, 0.62, 0);
      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), matHead);
      earL.position.set(0.45, 0.92, 0.15);
      const earR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), matHead);
      earR.position.set(0.45, 0.92, -0.15);

      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.7), matBody);
      tail.position.set(-0.55, 0.5, 0.4);
      tail.rotation.y = 0.5;
      
      group.add(body, head, eyeL, eyeR, snout, earL, earR, tail);

      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.3, -0.15], [0.3, -0.15], [-0.3, 0.15], [0.3, 0.15]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.45, 0.16), legMat);
        leg.position.set(lx, 0.225, lz);
        group.add(leg);
        group.legs.push(leg);
      }
    }
    else if (aType.name === "Qo'y") {
      // Sheep - fluffy woolly model
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.72, 0.68), matBody); // White fluffy body
      body.position.set(0, 0.62, 0);
      
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.32), new THREE.MeshLambertMaterial({ color: 0xe0d7cd })); // Beige head
      head.position.set(0.52, 0.78, 0);
      
      // Fluffy wool cap on head
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.32), matBody);
      cap.position.set(0.52, 0.96, 0);
      
      // Black eyes
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.04), matBlack);
      eyeL.position.set(0.64, 0.8, 0.165);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.04), matBlack);
      eyeR.position.set(0.64, 0.8, -0.165);

      // Ears
      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.06), new THREE.MeshLambertMaterial({ color: 0xe0d7cd }));
      earL.position.set(0.42, 0.82, 0.18);
      earL.rotation.z = -0.3;
      const earR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.06), new THREE.MeshLambertMaterial({ color: 0xe0d7cd }));
      earR.position.set(0.42, 0.82, -0.18);
      earR.rotation.z = -0.3;

      group.add(body, head, cap, eyeL, eyeR, earL, earR);

      const legMat = new THREE.MeshLambertMaterial({ color: 0xd7ccc8 });
      for (const [lx, lz] of [[-0.28, -0.16], [0.28, -0.16], [-0.28, 0.16], [0.28, 0.16]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.45, 0.14), legMat);
        leg.position.set(lx, 0.225, lz);
        group.add(leg);
        group.legs.push(leg);
      }
    }
    else if (aType.name === "Sigir") {
      // Cow - large blocky black/brown spots
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.78, 0.7), matBody);
      body.position.set(0, 0.65, 0);

      // Black spots (decorative boxes)
      const spot1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.72), matBlack);
      spot1.position.set(0.2, 0.65, 0.01);
      const spot2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 0.72), matBlack);
      spot2.position.set(-0.25, 0.6, -0.02);
      
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.4), matHead);
      head.position.set(0.55, 0.92, 0);

      // White Horns
      const hornL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.08), matWhite);
      hornL.position.set(0.45, 1.2, 0.16);
      hornL.rotation.z = -0.25;
      const hornR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.08), matWhite);
      hornR.position.set(0.45, 1.2, -0.16);
      hornR.rotation.z = -0.25;

      // Snout (pinkish-orange)
      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.3), new THREE.MeshLambertMaterial({ color: 0xffcc80 }));
      snout.position.set(0.72, 0.82, 0);

      // Eyes
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), matBlack);
      eyeL.position.set(0.68, 0.98, 0.205);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), matBlack);
      eyeR.position.set(0.68, 0.98, -0.205);

      // Udders
      const udder = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.2), matPink);
      udder.position.set(-0.05, 0.23, 0);

      group.add(body, spot1, spot2, head, hornL, hornR, snout, eyeL, eyeR, udder);

      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.3, -0.18], [0.3, -0.18], [-0.3, 0.18], [0.3, 0.18]]) {
        const legGroup = new THREE.Group();
        legGroup.position.set(lx, 0.275, lz);
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 0.18), legMat);
        const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.2), matBlack);
        hoof.position.y = -0.235;
        legGroup.add(leg, hoof);
        group.add(legGroup);
        group.legs.push(legGroup);
      }
    }
    else if (aType.name === "Tulki") {
      // Fox - orange coat, white belly, fluffy tail
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.42, 0.4), matBody);
      body.position.set(0, 0.42, 0);

      // White chest
      const chest = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.32, 0.42), matWhite);
      chest.position.set(0.28, 0.44, 0);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.32), matHead);
      head.position.set(0.5, 0.66, 0);

      // Snout with black nose tip
      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.16), matHead);
      snout.position.set(0.72, 0.6, 0);
      const noseTip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), matBlack);
      noseTip.position.set(0.82, 0.62, 0);

      // Big pointy ears (orange & white inner)
      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.1), matHead);
      earL.position.set(0.42, 0.86, 0.08);
      const earLInner = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.02), matWhite);
      earLInner.position.set(0.42, 0.86, 0.135);
      const earR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.1), matHead);
      earR.position.set(0.42, 0.86, -0.08);
      const earRInner = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.02), matWhite);
      earRInner.position.set(0.42, 0.86, -0.135);

      // Eyes
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.04), matBlack);
      eyeL.position.set(0.6, 0.72, 0.165);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.04), matBlack);
      eyeR.position.set(0.6, 0.72, -0.165);

      // Long tail with white tip
      const tailGroup = new THREE.Group();
      tailGroup.position.set(-0.46, 0.48, 0);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.18), matBody);
      tail.position.x = -0.2;
      const tailTip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.18), matWhite);
      tailTip.position.x = -0.42;
      tailGroup.add(tail, tailTip);
      tailGroup.rotation.z = -0.4;

      group.add(body, chest, head, snout, noseTip, earL, earLInner, earR, earRInner, eyeL, eyeR, tailGroup);

      const legMat = new THREE.MeshLambertMaterial({ color: 0x222222 }); // Dark legs
      for (const [lx, lz] of [[-0.28, -0.14], [0.28, -0.14], [-0.28, 0.14], [0.28, 0.14]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.42, 0.14), legMat);
        leg.position.set(lx, 0.21, lz);
        group.add(leg);
        group.legs.push(leg);
      }
    }
    else if (aType.name === "Bo'ri") {
      // Wolf - grey coat, wild eyes
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.48, 0.45), matBody);
      body.position.set(0, 0.48, 0);
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.08, 0.22), new THREE.MeshLambertMaterial({ color: 0x455a64 })); // Darker spine
      spine.position.set(0, 0.74, 0);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.36, 0.36), matHead);
      head.position.set(0.5, 0.72, 0);

      // Snout
      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.16), matHead);
      snout.position.set(0.72, 0.66, 0);
      const noseTip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), matBlack);
      noseTip.position.set(0.82, 0.72, 0);

      // Pointy ears
      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.08), matHead);
      earL.position.set(0.42, 0.92, 0.1);
      const earR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.08), matHead);
      earR.position.set(0.42, 0.92, -0.1);

      // Angry yellow-red eyes
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.04), new THREE.MeshLambertMaterial({ color: 0xff5722 }));
      eyeL.position.set(0.6, 0.78, 0.185);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.04), new THREE.MeshLambertMaterial({ color: 0xff5722 }));
      eyeR.position.set(0.6, 0.78, -0.185);

      // Tail
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.45), matBody);
      tail.position.set(-0.55, 0.55, 0);
      tail.rotation.z = -0.3;

      group.add(body, spine, head, snout, noseTip, earL, earR, eyeL, eyeR, tail);

      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.3, -0.16], [0.3, -0.16], [-0.3, 0.16], [0.3, 0.16]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.48, 0.16), legMat);
        leg.position.set(lx, 0.24, lz);
        group.add(leg);
        group.legs.push(leg);
      }
    }
    else if (aType.name === "Burgut") {
      // Eagle Model - Bald Eagle style, brown/white
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.36, 0.36), matBody);
      body.position.set(0, 0.45, 0);
      
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), matWhite); // White head
      head.position.set(0.18, 0.7, 0);

      // Curved yellow beak
      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.12), matYellow);
      beak.position.set(0.34, 0.68, 0);

      // Eyes
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.04), matBlack);
      eyeL.position.set(0.24, 0.74, 0.135);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.04), matBlack);
      eyeR.position.set(0.24, 0.74, -0.135);

      // Side wings (tilted slightly)
      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.42), matBody);
      wingL.position.set(-0.02, 0.45, 0.19);
      wingL.rotation.x = 0.1;
      const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.42), matBody);
      wingR.position.set(-0.02, 0.45, -0.19);
      wingR.rotation.x = -0.1;

      group.add(body, head, beak, eyeL, eyeR, wingL, wingR);

      const legMat = matYellow;
      const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.06), legMat);
      legL.position.set(-0.08, 0.125, -0.06);
      const legR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.06), legMat);
      legR.position.set(-0.08, 0.125, 0.06);
      group.add(legL, legR);
      group.legs.push(legL, legR);
    }
    else {
      // Default / generic animal fallback with detailed features
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.5), matBody);
      body.position.set(0, 0.5, 0);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.45), matHead);
      head.position.set(0.5, 0.85, 0);
      
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), matBlack);
      eyeL.position.set(0.68, 0.92, 0.23);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), matBlack);
      eyeR.position.set(0.68, 0.92, -0.23);

      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.24), matBody);
      snout.position.set(0.72, 0.76, 0);

      group.add(body, head, eyeL, eyeR, snout);

      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.25, -0.15], [0.25, -0.15], [-0.25, 0.15], [0.25, 0.15]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.18), legMat);
        leg.position.set(lx, 0.2, lz);
        group.add(leg);
        group.legs.push(leg);
      }
    }
    return group;
  }

  function spawnAnimal(x, y, z, aType) {
    const group = buildAnimalMesh(aType);
    group.isAnimal = true;
    group.animalName = aType.name;
    group.quote = aType.quote;
    group.health = 3;
    group.wanderTimer = Math.random() * 5;
    group.wanderDir = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    
    if (aType.name === "Burgut") {
      const flyY = y + 25 + Math.random() * 15;
      group.isEagle = true;
      group.baseFlyY = flyY;
      group.flyAngle = Math.random() * Math.PI * 2;
      group.flyRadius = 18 + Math.random() * 15;
      group.flyCenter = new THREE.Vector3(x, flyY, z);
      group.position.set(x, flyY, z);
    } else {
      group.position.set(x, y, z);
    }
    
    scene.add(group);
    npcs.push(group);
    animals.push(group);
  }

  // ==========================================================================
  // FAMOUS FIGURES (NPCs)
  // ==========================================================================

  function buildHistoricNpcMesh(f, matSkin, matBody, matHat) {
    const group = new THREE.Group();
    
    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), matSkin);
    head.position.y = 1.55;
    group.add(head);

    // Beard/Mustache (for male figures)
    if (f.name !== "Bibi-Xonim") {
      const beardColor = (f.name === "Ibn Sino") ? 0xeeeeee : 0x3e2723;
      const beardMat = new THREE.MeshLambertMaterial({ color: beardColor });
      const beard = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.15), beardMat);
      beard.position.set(0, 1.38, 0.22);
      group.add(beard);
    } else {
      // Bibi-Xonim hair
      const hairMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
      const hairL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.25), hairMat);
      hairL.position.set(-0.3, 1.3, 0.05);
      const hairR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.25), hairMat);
      hairR.position.set(0.3, 1.3, 0.05);
      group.add(hairL, hairR);
    }

    // Hat / Turban
    if (f.name === "Amir Temur") {
      // Golden Crown
      const crownBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.15, 0.65), matHat);
      crownBase.position.y = 1.88;
      const crownPeak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 4), matHat);
      crownPeak.position.y = 2.1;
      crownPeak.rotation.y = Math.PI / 4;
      group.add(crownBase, crownPeak);
    } else {
      // Turban/Salla
      const turban = new THREE.Mesh(new THREE.SphereGeometry(0.36, 8, 8), matHat);
      turban.position.set(0, 1.9, 0);
      turban.scale.set(1.1, 0.8, 1.1);
      group.add(turban);
    }

    // Body (traditional robe)
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), matBody);
    body.position.y = 0.9;
    group.add(body);

    // Chapan shoulders (extra blocks for 3D robe look)
    const shoulderMat = new THREE.MeshLambertMaterial({ color: f.hat }); // trim color
    const shL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 0.45), shoulderMat);
    shL.position.set(-0.32, 1.2, 0);
    const shR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 0.45), shoulderMat);
    shR.position.set(0.32, 1.2, 0);
    group.add(shL, shR);

    // Arms
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.65, 0.22), matBody);
    armL.position.set(-0.38, 0.9, 0);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.65, 0.22), matBody);
    armR.position.set(0.38, 0.9, 0);
    group.add(armL, armR);
    group.userData.armL = armL;
    group.userData.armR = armR;

    // Legs
    const legMat = new THREE.MeshLambertMaterial({ color: 0x1a237e });
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6, 0.24), legMat);
    legL.position.set(-0.14, 0.3, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6, 0.24), legMat);
    legR.position.set(0.14, 0.3, 0);
    group.add(legL, legR);

    // Accessories
    const accessoryMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    if (f.name === "Amir Temur") {
      // Golden Sword
      const sword = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 0.1), new THREE.MeshLambertMaterial({ color: 0xffd600 }));
      sword.position.set(0.32, 0.7, 0.25);
      sword.rotation.set(0.2, 0, -0.4);
      group.add(sword);
    } else if (f.name === "Alisher Navoiy") {
      // Scroll
      const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 6), accessoryMat);
      scroll.position.set(-0.38, 0.6, 0.15);
      scroll.rotation.x = Math.PI / 2;
      group.add(scroll);
    } else if (f.name === "Ulug'bek") {
      // Astrolabe
      const astrolabe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), new THREE.MeshLambertMaterial({ color: 0xffd600 }));
      astrolabe.position.set(0.38, 0.6, 0.15);
      group.add(astrolabe);
    } else if (f.name === "Ibn Sino") {
      // Healing Book
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.25), new THREE.MeshLambertMaterial({ color: 0xbf360c }));
      book.position.set(-0.38, 0.6, 0.15);
      group.add(book);
    } else if (f.name === "Al-Xorazmiy") {
      // Slate
      const slate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.25), new THREE.MeshLambertMaterial({ color: 0x3e2723 }));
      slate.position.set(0.38, 0.6, 0.15);
      slate.rotation.y = 0.3;
      group.add(slate);
    }

    return group;
  }

  function spawnFamousFigures(vy) {
    const figures = [
      { x: 22,  z: 24,  name: "Amir Temur",      color: 0x0d47a1, hat: 0xffd600, quote: "Sohibqiron Amir Temur: Kuch - adolatdadir! Samarqandim - dunyoning markazi!" },
      { x: -26, z: 28,  name: "Alisher Navoiy",   color: 0x2e7d32, hat: 0xffffff, quote: "Navoiy: Tilga e'tiborsiz — elga e'tiborsiz! O'zbek tili qudratlidir!" },
      { x: 30,  z: -32, name: "Ulug'bek",         color: 0x311b92, hat: 0x00e5ff, quote: "Mirzo Ulug'bek: Men 1018 yulduzni o'lchadim! Ilm - eng buyuk kuch!" },
      { x: -34, z: -25, name: "Ibn Sino",          color: 0x00796b, hat: 0xffffff, quote: "Ibn Sino (Avitsenna): Sog'liq — eng katta boylik! Kitob - do'stim!" },
      { x: 0,   z: -38, name: "Bibi-Xonim",       color: 0xf48fb1, hat: 0xe91e63, quote: "Bibi-Xonim: Men Samarqandning bebaho masjidiman! Temurning sevgilisi!" },
      { x: 36,  z: 18,  name: "Al-Xorazmiy",      color: 0xe65100, hat: 0xffffff, quote: "Al-Xorazmiy: Algebra mening ixtiroyim! Algoritm ham mening nomimdan!" },
      { x: -38, z: -15, name: "Sherdor Yo'lbars", color: 0xff7043, hat: 0xe64a19, quote: "Registon Sherdor - Men Samarqand qalqoniman!" }
    ];
    figures.forEach(f => {
      const matSkin = new THREE.MeshLambertMaterial({ color: 0xffdbac });
      const matBody = new THREE.MeshLambertMaterial({ color: f.color });
      const matHat = new THREE.MeshLambertMaterial({ color: f.hat });

      const group = buildHistoricNpcMesh(f, matSkin, matBody, matHat);
      group.isNpc = true;
      group.npcName = f.name;
      group.quote = f.quote;
      const actualY = getGroundHeight(f.x, f.z, vy);
      group.baseY = actualY;
      group.bobOffset = Math.random() * Math.PI * 2;

      // Name tag using CSS2D sprite (simulated as a lantern above)
      const lanternGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const lanternMat = new THREE.MeshBasicMaterial({ color: f.hat });
      const lantern = new THREE.Mesh(lanternGeo, lanternMat); lantern.position.y = 2.4;
      group.add(lantern);

      group.position.set(f.x, actualY, f.z);
      scene.add(group);
      npcs.push(group);
    });
  }

  // ==========================================================================
  // FURNITURE DETAILED 3D MODELS
  // ==========================================================================

  function createSofaMesh() {
    const group = new THREE.Group();
    const sofaColor = 0xab47bc; // purple
    const woodColor = 0x5d4037; // dark brown
    
    const matSofa = new THREE.MeshStandardMaterial({ color: sofaColor, roughness: 0.65 });
    const matWood = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.8 });

    // Seat base
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.35, 0.72), matSofa);
    seat.position.y = -0.15;
    seat.castShadow = true; seat.receiveShadow = true;
    group.add(seat);

    // Backrest
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.68, 0.16), matSofa);
    back.position.set(0, 0.2, -0.28);
    back.castShadow = true; back.receiveShadow = true;
    group.add(back);

    // Armrests
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.52, 0.72), matSofa);
    armL.position.set(-0.4, 0.05, 0);
    armL.castShadow = true; armL.receiveShadow = true;
    group.add(armL);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.52, 0.72), matSofa);
    armR.position.set(0.4, 0.05, 0);
    armR.castShadow = true; armR.receiveShadow = true;
    group.add(armR);

    // 4 legs
    const legW = 0.06, legH = 0.15;
    const legOffsets = [
      [-0.42, -0.35, -0.3], [0.42, -0.35, -0.3],
      [-0.42, -0.35, 0.3], [0.42, -0.35, 0.3]
    ];
    legOffsets.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(legW, legH, legW), matWood);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      group.add(leg);
    });

    return group;
  }

  function createChairMesh() {
    const group = new THREE.Group();
    const cushionColor = 0xa1887f; // light brown
    const woodColor = 0x5d4037; // dark brown
    
    const matCushion = new THREE.MeshStandardMaterial({ color: cushionColor, roughness: 0.7 });
    const matWood = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.85 });

    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.65), matCushion);
    seat.position.y = -0.12;
    seat.castShadow = true; seat.receiveShadow = true;
    group.add(seat);

    // Backrest
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.08), matWood);
    back.position.set(0, 0.28, -0.28);
    back.castShadow = true; back.receiveShadow = true;
    group.add(back);

    // 4 legs
    const legW = 0.06, legH = 0.45;
    const legOffsets = [
      [-0.26, -0.32, -0.26], [0.26, -0.32, -0.26],
      [-0.26, -0.32, 0.26], [0.26, -0.32, 0.26]
    ];
    legOffsets.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(legW, legH, legW), matWood);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      group.add(leg);
    });

    return group;
  }

  function createTableMesh() {
    const group = new THREE.Group();
    const woodColor = 0x8d6e63; // table top
    const legColor = 0x5d4037; // dark legs
    
    const matTop = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.8 });
    const matLeg = new THREE.MeshStandardMaterial({ color: legColor, roughness: 0.85 });

    // Table top
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.08, 0.96), matTop);
    top.position.y = 0.44;
    top.castShadow = true; top.receiveShadow = true;
    group.add(top);

    // 4 long legs
    const legW = 0.08, legH = 0.9;
    const legOffsets = [
      [-0.42, -0.05, -0.42], [0.42, -0.05, -0.42],
      [-0.42, -0.05, 0.42], [0.42, -0.05, 0.42]
    ];
    legOffsets.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(legW, legH, legW), matLeg);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      group.add(leg);
    });

    return group;
  }

  function createFlowerMesh() {
    const group = new THREE.Group();
    
    const matPot = new THREE.MeshStandardMaterial({ color: 0xbf360c, roughness: 0.9 }); // terracotta
    const matStem = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.6 }); // green
    const matPetals = new THREE.MeshBasicMaterial({ color: 0xe91e63 }); // hot pink/red

    // Clay pot
    const pot = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), matPot);
    pot.position.y = -0.325;
    pot.castShadow = true;
    group.add(pot);

    // Stem
    const stem = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.04), matStem);
    stem.position.y = 0.06;
    stem.castShadow = true;
    group.add(stem);

    // Petals (Rose buds shape)
    const petalsOffsets = [
      [0, 0.28, 0], [0.08, 0.28, 0.08], [-0.08, 0.28, -0.08],
      [-0.08, 0.28, 0.08], [0.08, 0.28, -0.08], [0, 0.36, 0]
    ];
    petalsOffsets.forEach(([px, py, pz]) => {
      const petal = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), matPetals);
      petal.position.set(px, py, pz);
      group.add(petal);
    });

    return group;
  }

  // ==========================================================================
  // RENDER WORLD
  // ==========================================================================

  function renderInstancedWorld() {
    scene.children.filter(c => c.isVoxelMesh).forEach(c => scene.remove(c));
    spawnedFurniture.forEach(m => scene.remove(m));
    spawnedFurniture = [];

    const grouped = {};
    Object.keys(worldData).forEach(key => {
      const bType = worldData[key];
      if (bType === BLOCKS.AIR) return;
      const [x, y, z] = key.split(',').map(Number);
      
      // Filter out furniture blocks to render as custom 3D composite meshes
      if (bType === BLOCKS.SOFA || bType === BLOCKS.TABLE || bType === BLOCKS.CHAIR || bType === BLOCKS.FLOWER) {
        let fMesh;
        if (bType === BLOCKS.SOFA) fMesh = createSofaMesh();
        else if (bType === BLOCKS.TABLE) fMesh = createTableMesh();
        else if (bType === BLOCKS.CHAIR) fMesh = createChairMesh();
        else if (bType === BLOCKS.FLOWER) fMesh = createFlowerMesh();
        
        fMesh.position.set(x, y, z);
        fMesh.isFurnitureMesh = true;
        fMesh.blockCoord = `${x},${y},${z}`;
        scene.add(fMesh);
        spawnedFurniture.push(fMesh);
        return; // skip instanced cube grouping
      }

      const top = worldData[x + ',' + (y+1) + ',' + z];
      const bot = worldData[x + ',' + (y-1) + ',' + z];
      const px = worldData[(x+1) + ',' + y + ',' + z];
      const nx = worldData[(x-1) + ',' + y + ',' + z];
      const pz = worldData[x + ',' + y + ',' + (z+1)];
      const nz = worldData[x + ',' + y + ',' + (z-1)];
      const fullyOccluded = top && bot && px && nx && pz && nz &&
        top !== BLOCKS.AIR && bot !== BLOCKS.AIR && px !== BLOCKS.AIR &&
        nx !== BLOCKS.AIR && pz !== BLOCKS.AIR && nz !== BLOCKS.AIR &&
        top !== BLOCKS.WATER && top !== BLOCKS.GLASS;
      if (fullyOccluded) return;
      if (!grouped[bType]) grouped[bType] = [];
      grouped[bType].push(new THREE.Vector3(x, y, z));
    });

    const boxGeo = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    const torchGeo = new THREE.BoxGeometry(0.16, 0.65, 0.16);
    const dummy = new THREE.Object3D();
    Object.keys(grouped).forEach(bTypeStr => {
      const bType = Number(bTypeStr);
      const coords = grouped[bType];
      const mat = getBlockMaterials(bType);
      const geom = (bType === BLOCKS.TORCH) ? torchGeo : boxGeo;
      const mesh = new THREE.InstancedMesh(geom, mat, coords.length);
      mesh.isVoxelMesh = true;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      coords.forEach((pos, idx) => {
        dummy.position.copy(pos);
        if (bType === BLOCKS.TORCH) {
          dummy.position.y -= 0.18; // offset down so it sits on the floor below
        }
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      scene.add(mesh);
    });
  }

  // ==========================================================================
  // DAY / NIGHT CYCLE
  // ==========================================================================

  function updateDayNightCycle(delta) {
    dayTime += delta * 0.002;
    if (dayTime > 1) dayTime = 0;
    const angle = dayTime * Math.PI * 2;
    const R = 180;
    sunLight.position.set(Math.cos(angle) * R + playerPos.x, Math.sin(angle) * R + playerPos.y, playerPos.z);
    sunLight.target.position.copy(playerPos);
    sunMesh.position.copy(sunLight.position);
    moonMesh.position.set(-Math.cos(angle) * R + playerPos.x, -Math.sin(angle) * R + playerPos.y, playerPos.z);

    const isDay = sunLight.position.y > 0;
    let skyR, skyG, skyB;
    const t = dayTime;
    if (t < 0.22) {
      // Dawn
      const f = t / 0.22;
      skyR = 0x87 + f * (0xff - 0x87); skyG = 0x70 + f * (0xce - 0x70); skyB = 0x50 + f * (0xeb - 0x50);
    } else if (t < 0.5) {
      skyR = 0x87; skyG = 0xce; skyB = 0xeb;
    } else if (t < 0.6) {
      const f = (t - 0.5) / 0.1;
      skyR = 0x87 + f * (0xf0 - 0x87); skyG = 0xce - f * 0x50; skyB = 0xeb - f * 0x80;
    } else {
      const f = Math.min(1, (t - 0.6) / 0.15);
      skyR = Math.round(0x0b + (1 - f) * (0xf0 - 0x0b));
      skyG = Math.round(0x0e + (1 - f) * (0x80 - 0x0e));
      skyB = Math.round(0x14 + (1 - f) * (0x14));
    }
    const skyColor = new THREE.Color(`rgb(${Math.round(skyR)},${Math.round(skyG)},${Math.round(skyB)})`);
    scene.background = skyColor;
    scene.fog.color = skyColor;
    sunLight.intensity = isDay ? Math.max(0.1, Math.sin(angle)) * 2.0 : 0.05;
    ambientLight.intensity = isDay ? 0.8 : 0.2;
    if (starsParticles) {
      starsParticles.material.opacity = isDay ? 0 : Math.min(1, (t - 0.65) * 6);
    }
    const hours = Math.floor(dayTime * 24);
    const el_time = document.getElementById('hud-time-text');
    const el_icon = document.getElementById('hud-time-icon');
    if (el_time) el_time.textContent = `${isDay ? 'Kun' : 'Tun'} ${hours.toString().padStart(2,'0')}:00`;
    if (el_icon) el_icon.textContent = '';
  }

  // ==========================================================================
  // PLAYER CONTROLLER
  // ==========================================================================

  function checkCollision(pos) {
    const r = 0.3; // player radius
    const h = 1.8; // player height
    const minX = Math.floor(pos.x - r);
    const maxX = Math.floor(pos.x + r);
    const minY = Math.floor(pos.y);
    const maxY = Math.floor(pos.y + h);
    const minZ = Math.floor(pos.z - r);
    const maxZ = Math.floor(pos.z + r);
    
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const block = worldData[`${x},${y},${z}`];
          if (block && block !== BLOCKS.AIR && block !== BLOCKS.WATER) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function updatePlayer(delta) {
    // --- HUNGER DEPLETION & STARVATION ---
    hungerTimer += delta;
    if (hungerTimer >= 5.0) {
      hungerTimer = 0;
      if (playerHunger > 0) {
        playerHunger = Math.max(0, playerHunger - 1);
        updateHungerUI();
      }
    }

    if (playerHunger === 0) {
      starvationTimer += delta;
      if (starvationTimer >= 3.5) {
        starvationTimer = 0;
        damageLocalPlayer(2);
        showToast("Siz ochlikdan ziyon ko'ryapsiz!");
      }
    } else {
      starvationTimer = 0;
    }

    if (playerHunger >= 80 && health < MAX_HEALTH) {
      healthRegenTimer += delta;
      if (healthRegenTimer >= 4.0) {
        healthRegenTimer = 0;
        health = Math.min(MAX_HEALTH, health + 1);
        playerHunger = Math.max(0, playerHunger - 1);
        updateHealthUI();
        updateHungerUI();
      }
    } else {
      healthRegenTimer = 0;
    }

    if (isSitting && sittingOnCoords) {
      playerPos.copy(sittingOnCoords);
      playerVel.set(0, 0, 0);
      isGrounded = true;
      if (keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD'] || keys['Space'] || keys['JumpTouch'] || touchJoystick.active) {
        isSitting = false;
        sittingOnCoords = null;
        playerPos.y += 0.6; // Stand up
        showToast("Turdingiz");
      }
      return;
    }

    if (isRidingHorse && mountedHorse) {
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      
      const moveDir = new THREE.Vector3();
      if (keys['KeyW']) moveDir.z -= 1;
      if (keys['KeyS']) moveDir.z += 1;
      if (keys['KeyA']) moveDir.x -= 1;
      if (keys['KeyD']) moveDir.x += 1;
      if (touchJoystick.active) { moveDir.x += touchJoystick.moveX; moveDir.z += touchJoystick.moveY; }
      moveDir.normalize();

      const horseSpeed = 11.5;
      const moveVecX = (forward.x * (-moveDir.z) + right.x * moveDir.x) * horseSpeed;
      const moveVecZ = (forward.z * (-moveDir.z) + right.z * moveDir.x) * horseSpeed;
      
      mountedHorse.position.x += moveVecX * delta;
      mountedHorse.position.z += moveVecZ * delta;

      // Keep mounted animal within map boundaries to prevent floating in the void
      const bound = currentMapRadius - 2;
      mountedHorse.position.x = Math.max(-bound, Math.min(bound, mountedHorse.position.x));
      mountedHorse.position.z = Math.max(-bound, Math.min(bound, mountedHorse.position.z));
      
      // Directly align animal heading with player's look direction (Minecraft style)
      mountedHorse.rotation.y = yaw + Math.PI / 2;

      if (moveDir.lengthSq() > 0) {
        // Walk leg swing animation
        const t = performance.now() * 0.015;
        if (mountedHorse.legs && mountedHorse.legs.length >= 4) {
          mountedHorse.legs[0].rotation.x = Math.sin(t) * 0.6;
          mountedHorse.legs[1].rotation.x = -Math.sin(t) * 0.6;
          mountedHorse.legs[2].rotation.x = -Math.sin(t) * 0.6;
          mountedHorse.legs[3].rotation.x = Math.sin(t) * 0.6;
        }
      } else {
        // Reset legs to neutral position
        if (mountedHorse.legs) {
          mountedHorse.legs.forEach(leg => leg.rotation.x = 0);
        }
      }
      
      const groundY = getGroundHeight(Math.round(mountedHorse.position.x), Math.round(mountedHorse.position.z), mountedHorse.position.y);
      mountedHorse.position.y += (groundY - mountedHorse.position.y) * 0.2;
      
      // Sit lower directly on the animal's back
      playerPos.set(mountedHorse.position.x, mountedHorse.position.y + 0.8, mountedHorse.position.z);
      playerVel.set(0, 0, 0);
      isGrounded = true;

      // Sync camera and playerMesh position while riding
      const isCtrlHeld = keys['ControlLeft'] || keys['ControlRight'] || keys['Control'];
      let activeThirdPerson = isThirdPerson;
      if (isCtrlHeld) {
        activeThirdPerson = true;
      } else {
        orbitYaw = yaw;
        orbitPitch = pitch;
      }

      if (activeThirdPerson && playerMesh) {
        playerMesh.visible = true;
        playerMesh.position.copy(playerPos);
        playerMesh.rotation.y = yaw + Math.PI;

        const targetX = playerPos.x - Math.sin(orbitYaw) * Math.cos(orbitPitch) * thirdPersonDistance;
        const targetY = playerPos.y + 1.35 - Math.sin(orbitPitch) * thirdPersonDistance;
        const targetZ = playerPos.z - Math.cos(orbitYaw) * Math.cos(orbitPitch) * thirdPersonDistance;
        
        camera.position.set(targetX, targetY, targetZ);
        camera.lookAt(playerPos.x, playerPos.y + 1.15, playerPos.z);
      } else {
        if (playerMesh) playerMesh.visible = false;
        camera.position.copy(playerPos);
        camera.position.y += 1.65;
        camera.rotation.set(pitch, yaw, 0, 'YXZ');
      }

      // Dismount with Shift key
      if (keys['ShiftLeft'] || keys['ShiftRight'] || keys['KeyShift']) {
        const animalName = mountedHorse.animalName;
        isRidingHorse = false;
        mountedHorse = null;
        playerPos.y += 1.0;
        showToast(animalName === 'Ot' ? "Otdan tushdingiz" : "Tuyadan tushdingiz");
      }
      return;
    }

    const speed = 8.0;
    const moveDir = new THREE.Vector3();
    if (keys['KeyW']) moveDir.z -= 1;
    if (keys['KeyS']) moveDir.z += 1;
    if (keys['KeyA']) moveDir.x -= 1;
    if (keys['KeyD']) moveDir.x += 1;
    if (touchJoystick.active) { moveDir.x += touchJoystick.moveX; moveDir.z += touchJoystick.moveY; }
    moveDir.normalize();

    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

    playerVel.x = (forward.x * (-moveDir.z) + right.x * moveDir.x) * speed;
    playerVel.z = (forward.z * (-moveDir.z) + right.z * moveDir.x) * speed;
    playerVel.y -= 24.0 * delta;

    if ((keys['Space'] || keys['JumpTouch']) && isGrounded) {
      playerVel.y = 9.0;
      isGrounded = false;
      soundEngine.playSFX('jump');
    }

    // Y collision and movement
    let nextPosY = playerPos.y + playerVel.y * delta;
    const tempPos = playerPos.clone();
    tempPos.y = nextPosY;
    if (checkCollision(tempPos)) {
      if (playerVel.y < 0) {
        playerPos.y = Math.floor(nextPosY) + 1.0;
        playerVel.y = 0;
        isGrounded = true;
      } else {
        playerVel.y = 0; // Ceiling hit
      }
    } else {
      playerPos.y = nextPosY;
      isGrounded = false;
      // Safety net: if fell out of world
      if (playerPos.y < 20) {
        playerPos.set(5, 110, 30);
        playerVel.set(0, 0, 0);
      }
    }

    // X collision and movement
    const r = 0.3;
    let nextPosX = playerPos.x + playerVel.x * delta;
    tempPos.copy(playerPos);
    tempPos.x = nextPosX;
    if (!checkCollision(tempPos)) {
      playerPos.x = nextPosX;
    } else {
      if (playerVel.x > 0) {
        playerPos.x = Math.floor(nextPosX + r) - r - 0.001;
      } else if (playerVel.x < 0) {
        playerPos.x = Math.floor(nextPosX - r) + 1.0 + r + 0.001;
      }
      playerVel.x = 0;
    }

    // Z collision and movement
    let nextPosZ = playerPos.z + playerVel.z * delta;
    tempPos.copy(playerPos);
    tempPos.z = nextPosZ;
    if (!checkCollision(tempPos)) {
      playerPos.z = nextPosZ;
    } else {
      if (playerVel.z > 0) {
        playerPos.z = Math.floor(nextPosZ + r) - r - 0.001;
      } else if (playerVel.z < 0) {
        playerPos.z = Math.floor(nextPosZ - r) + 1.0 + r + 0.001;
      }
      playerVel.z = 0;
    }

    // Sync orbit angles to player angles if Ctrl is not held
    const isCtrlHeld = keys['ControlLeft'] || keys['ControlRight'] || keys['Control'];
    let activeThirdPerson = isThirdPerson;
    if (isCtrlHeld) {
      activeThirdPerson = true;
    } else {
      orbitYaw = yaw;
      orbitPitch = pitch;
    }

    if (activeThirdPerson && playerMesh) {
      playerMesh.visible = true;
      playerMesh.position.copy(playerPos);
      playerMesh.rotation.y = yaw + Math.PI;

      // Centered third-person camera directly behind the player's back
      const targetX = playerPos.x - Math.sin(orbitYaw) * Math.cos(orbitPitch) * thirdPersonDistance;
      const targetY = playerPos.y + 1.35 - Math.sin(orbitPitch) * thirdPersonDistance;
      const targetZ = playerPos.z - Math.cos(orbitYaw) * Math.cos(orbitPitch) * thirdPersonDistance;
      
      camera.position.set(targetX, targetY, targetZ);
      camera.lookAt(playerPos.x, playerPos.y + 1.15, playerPos.z);
    } else {
      if (playerMesh) playerMesh.visible = false;
      camera.position.copy(playerPos);
      camera.position.y += 1.65;
      camera.rotation.set(pitch, yaw, 0, 'YXZ');
    }

    // Animate local player walking
    const isMoving = keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD'] || touchJoystick.active;
    const currentSpeed = Math.hypot(playerVel.x, playerVel.z);
    animateCharacterWalk(playerMesh, currentSpeed, isMoving, isGrounded, isMiningHeld);

    updateTargetRaycast();
    updateMiningProgress(delta);

    const deg = Math.round(((yaw * 180 / Math.PI) % 360 + 360) % 360);
    const dirs = ['K', 'KSh', 'Sh', 'JnSh', 'J', 'JG', 'G', 'KG'];
    const el_compass = document.getElementById('compass-badge');
    const el_pos = document.getElementById('hud-pos');
    if (el_compass) el_compass.textContent = `${dirs[Math.floor((deg + 22.5) / 45) % 8]}`;
    checkInteractions();

    const distFromSpawn = Math.hypot(playerPos.x, playerPos.z);
    if (distFromSpawn >= 150) {
      updateMissionProgress('explore_dist', Math.floor(distFromSpawn));
    }

    // --- MULTIPLAYER REALTIME UPDATE ---
    if (supabase && multiplayerChannel) {
      broadcastCounter++;
      if (broadcastCounter % 4 === 0) {
        multiplayerChannel.send({
          type: 'broadcast',
          event: 'player_move',
          payload: {
            id: myPlayerId,
            x: playerPos.x,
            y: playerPos.y,
            z: playerPos.z,
            yaw: yaw,
            pitch: pitch,
            skin: playerSkin,
            isMining: isMiningHeld,
            activeBlockId: hotbarBlocks[activeSlotIndex]
          }
        });
      }
    }

    // Remove idle/disconnected other players and animate movement
    const nowMulti = Date.now();
    Object.keys(otherPlayers).forEach(id => {
      const op = otherPlayers[id];
      if (nowMulti - op.lastUpdate > 4000) {
        if (op.mesh) {
          scene.remove(op.mesh);
        }
        delete otherPlayers[id];
      } else {
        const prevPos = op.prevPos || op.mesh.position.clone();
        const dist = prevPos.distanceTo(op.mesh.position);
        const moving = dist > 0.005;
        animateCharacterWalk(op.mesh, dist / delta, moving, true, op.isMining);
        op.prevPos = op.mesh.position.clone();
      }
    });

    // Continuous automatic rifle shooting
    if (isMouseDown && hotbarBlocks[activeSlotIndex] === BLOCKS.AVTOMAT) {
      avtomatFireTimer += delta;
      if (avtomatFireTimer >= 0.1) { // 10 bullets per second
        performAvtomatShoot();
        avtomatFireTimer = 0;
      }
    } else {
      avtomatFireTimer = 0.1; // reset so next click shoots instantly
    }

    // Update active arrows
    for (let i = activeArrows.length - 1; i >= 0; i--) {
      const arrow = activeArrows[i];
      arrow.time += delta;

      const steps = 5;
      const stepVelocity = arrow.velocity.clone().multiplyScalar(delta / steps);
      let hitSomething = false;
      
      for (let s = 0; s < steps; s++) {
        arrow.mesh.position.add(stepVelocity);
        
        const bx = Math.round(arrow.mesh.position.x);
        const by = Math.round(arrow.mesh.position.y);
        const bz = Math.round(arrow.mesh.position.z);
        const targetBlock = worldData[`${bx},${by},${bz}`];
        if (targetBlock && targetBlock !== BLOCKS.AIR && targetBlock !== BLOCKS.WATER) {
          hitSomething = true;
          break;
        }
      }

      for (let j = animals.length - 1; j >= 0; j--) {
        const animal = animals[j];
        const dist = arrow.mesh.position.distanceTo(animal.position);
        if (dist < 1.3) {
          hitSomething = true;
          damageAnimal(animal, 1.5);
          break;
        }
      }

      if (hitSomething || arrow.time > 2.0) {
        scene.remove(arrow.mesh);
        activeArrows.splice(i, 1);
      }
    }

    // Update active bullets
    for (let i = activeBullets.length - 1; i >= 0; i--) {
      const bullet = activeBullets[i];
      bullet.time += delta;

      const steps = 5;
      const stepVelocity = bullet.velocity.clone().multiplyScalar(delta / steps);
      let hitSomething = false;
      
      for (let s = 0; s < steps; s++) {
        bullet.mesh.position.add(stepVelocity);
        
        const bx = Math.round(bullet.mesh.position.x);
        const by = Math.round(bullet.mesh.position.y);
        const bz = Math.round(bullet.mesh.position.z);
        const targetBlock = worldData[`${bx},${by},${bz}`];
        if (targetBlock && targetBlock !== BLOCKS.AIR && targetBlock !== BLOCKS.WATER) {
          hitSomething = true;
          break;
        }
      }

      for (let j = animals.length - 1; j >= 0; j--) {
        const animal = animals[j];
        const dist = bullet.mesh.position.distanceTo(animal.position);
        if (dist < 1.3) {
          hitSomething = true;
          damageAnimal(animal, 1.0); // 1.0 dmg per bullet
          break;
        }
      }

      if (hitSomething || bullet.time > 1.5) {
        scene.remove(bullet.mesh);
        activeBullets.splice(i, 1);
      }
    }

    // Update active torches
    for (let i = activeTorches.length - 1; i >= 0; i--) {
      const torch = activeTorches[i];
      torch.velocity.y -= delta * 12.0; // gravity
      torch.time += delta;

      const steps = 5;
      const stepVelocity = torch.velocity.clone().multiplyScalar(delta / steps);
      let hitSomething = false;
      let hitX = 0, hitY = 0, hitZ = 0;
      
      for (let s = 0; s < steps; s++) {
        torch.mesh.position.add(stepVelocity);
        
        const bx = Math.round(torch.mesh.position.x);
        const by = Math.round(torch.mesh.position.y);
        const bz = Math.round(torch.mesh.position.z);
        const key = `${bx},${by},${bz}`;
        const targetBlock = worldData[key];
        
        if (targetBlock && targetBlock !== BLOCKS.AIR && targetBlock !== BLOCKS.WATER) {
          hitSomething = true;
          hitX = bx; hitY = by; hitZ = bz;
          break;
        }
      }
      
      if (hitSomething) {
        const targetBlock = worldData[`${hitX},${hitY},${hitZ}`];
        if (targetBlock === BLOCKS.BOMB) {
          triggerBombFuse(hitX, hitY, hitZ);
        } else {
          // Place a placed Torch block in the air space adjacent to impact
          const px = Math.round(torch.mesh.position.x - torch.velocity.x * delta * 0.4);
          const py = Math.round(torch.mesh.position.y - torch.velocity.y * delta * 0.4);
          const pz = Math.round(torch.mesh.position.z - torch.velocity.z * delta * 0.4);
          const prevKey = `${px},${py},${pz}`;
          if (!worldData[prevKey] || worldData[prevKey] === BLOCKS.AIR) {
            worldData[prevKey] = BLOCKS.TORCH;
            modifiedBlocks[prevKey] = BLOCKS.TORCH;
            addPointLightAt(px, py, pz);
            rebuildWorldMesh();
            soundEngine.playSFX('place');
          }
        }
      }

      for (let j = animals.length - 1; j >= 0; j--) {
        const animal = animals[j];
        const dist = torch.mesh.position.distanceTo(animal.position);
        if (dist < 1.3) {
          hitSomething = true;
          damageAnimal(animal, 0.5);
          break;
        }
      }

      if (hitSomething || torch.time > 3.0) {
        scene.remove(torch.mesh);
        activeTorches.splice(i, 1);
      }
    }
  }

  function animateNPCs(delta) {
    frameCount++;
    npcs.forEach(npc => {
      if (npc.isAnimal) {
        if (isRidingHorse && npc === mountedHorse) {
          return; // Skip automated update for currently ridden animal
        }
        let isLooking = false;
        
        if (npc.isEagle) {
          // Eagle flies high in the sky in smooth circles!
          npc.flyAngle += delta * 0.5;
          const fx = npc.flyCenter.x + Math.cos(npc.flyAngle) * npc.flyRadius;
          const fz = npc.flyCenter.z + Math.sin(npc.flyAngle) * npc.flyRadius;
          const fy = npc.baseFlyY + Math.sin(npc.flyAngle * 2) * 2;
          
          npc.position.set(fx, fy, fz);
          npc.rotation.y = Math.atan2(-Math.sin(npc.flyAngle), Math.cos(npc.flyAngle));
          
          // Wing flap animation
          if (npc.children && npc.children.length >= 7) {
            const flap = Math.sin(performance.now() * 0.01) * 0.45;
            npc.children[5].rotation.z = flap; // Left wing
            npc.children[6].rotation.z = -flap; // Right wing
          }
          return; // Eagle flying update complete
        }

        if (npc.isFleeing || npc.fleeingTimer > 0) {
          if (npc.fleeingTimer > 0) {
            npc.fleeingTimer -= delta;
          }
          npc.position.x += npc.fleeingDir.x * delta * 6.0; // Run away faster!
          npc.position.z += npc.fleeingDir.z * delta * 6.0;
          npc.rotation.y = Math.atan2(npc.fleeingDir.x, npc.fleeingDir.z) - Math.PI / 2;
        } else {
          // Predator AI (Wolf / Bo'ri, Leopard / Qoplon attack herbivores) - DISABLED so animals do not eat each other
          const isPredator = false;
          let isHunting = false;

          if (!isHunting) {
            // Slow look at player if nearby
            const dx = playerPos.x - npc.position.x;
            const dz = playerPos.z - npc.position.z;
            const dist = Math.hypot(dx, dz);

            if (dist < 10) {
              isLooking = true;
              const targetYaw = Math.atan2(dx, dz) - Math.PI / 2;
              npc.rotation.y += (targetYaw - npc.rotation.y) * 0.08;
            }

            if (!isLooking) {
              // Animal wandering
              npc.wanderTimer -= delta;
              if (npc.wanderTimer <= 0) {
                npc.wanderDir = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
                npc.wanderTimer = 3 + Math.random() * 4;
              }
              npc.position.x += npc.wanderDir.x * delta * 1.5;
              npc.position.z += npc.wanderDir.z * delta * 1.5;
              npc.rotation.y = Math.atan2(npc.wanderDir.x, npc.wanderDir.z) - Math.PI / 2;
            }
          }
        }

        // Keep within map boundaries to prevent floating in the void
        const bound = currentMapRadius - 8;
        if (Math.abs(npc.position.x) > bound || Math.abs(npc.position.z) > bound) {
          if (npc.isFleeing || npc.fleeingTimer > 0) {
            npc.fleeingDir.multiplyScalar(-1);
          } else if (npc.wanderDir) {
            npc.wanderDir.multiplyScalar(-1);
          }
          npc.position.x = Math.max(-bound, Math.min(bound, npc.position.x));
          npc.position.z = Math.max(-bound, Math.min(bound, npc.position.z));
        }
        
        // Follow terrain height dynamically
        const bx = Math.round(npc.position.x);
        const bz = Math.round(npc.position.z);
        const targetY = getGroundHeight(bx, bz, npc.position.y);
        npc.position.y += (targetY - npc.position.y) * 0.15; // Smooth interpolation to walk over hills

        // Swing legs when wandering or fleeing
        if (npc.legs && npc.legs.length >= 2) {
          const isWalking = (npc.isFleeing || npc.fleeingTimer > 0) || (!isLooking && npc.wanderDir && npc.wanderDir.lengthSq() > 0);
          if (isWalking) {
            const swingSpeed = (npc.isFleeing || npc.fleeingTimer > 0) ? 24.0 : 12.0; // Swing faster when running away!
            const angle = Math.sin(performance.now() * 0.001 * swingSpeed) * 0.5;
            npc.legs.forEach((leg, index) => {
              leg.rotation.z = (index % 2 === 0) ? angle : -angle;
            });
          } else {
            npc.legs.forEach(leg => { leg.rotation.z = 0; });
          }
        }
      } else {
        // Famous person bobbing animation
        if (npc.baseY !== undefined) {
          npc.bobOffset = (npc.bobOffset || 0) + delta * 1.5;
          npc.position.y = npc.baseY + Math.sin(npc.bobOffset) * 0.12;
        }
        // Slow look at player
        const dx = playerPos.x - npc.position.x;
        const dz = playerPos.z - npc.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 15) {
          const targetYaw = Math.atan2(dx, dz);
          npc.rotation.y += (targetYaw - npc.rotation.y) * 0.05;
        }
        // Arm wave when nearby
        if (dist < 5 && npc.userData.armL) {
          npc.userData.armL.rotation.x = Math.sin(frameCount * 0.08) * 0.5;
          npc.userData.armR.rotation.x = -Math.sin(frameCount * 0.08) * 0.5;
        }
      }
    });
  }

  const ULUGBEK_QUEST_DATA = {
    location_name: "Samarqand - Registon",
    npc_name: "Mirzo Ulug'bek",
    dialogues: [
      "Assalomu alaykum, sayyoh! Yulduzlar sirlariga to'la Samarqand zaminiga xush kelibsiz. Men hukmdor va astronom Mirzo Ulug'bekman.",
      "Men 1420-yilda qurdirgan ushbu madrasa O'rta Osiyodagi eng yirik ilm-fan maskanlaridan biri bo'lib, bu yerda astronomiya va matematika o'qitilgan.",
      "Biz Samarqand rasadxonasida 1018 ta yulduzning joylashuvini aniqlab, yulduz yili davomiyligini atigi 25 soniyalik xato bilan aniq hisoblab chiqqanmiz!",
      "Menga rasadxona asboblari uchun zarur bo'lgan Moviy Koshin (BLUE_TILE) blokini olib kela olasizmi?"
    ],
    quest_title: "Yo'qolgan Sekstant",
    task_description: "Registon minorasining eng tepasiga chiqib, rasadxona asboblari uchun zarur bo'lgan Moviy Koshin (BLUE_TILE) blokini topib keling.",
    reward_item: "Olmos va Astrolyabiya"
  };

  function updateDialogueUI() {
    const titleEl = document.getElementById('dialogue-title');
    const textEl = document.getElementById('dialogue-text');
    const nextBtn = document.getElementById('btn-dialogue-next');
    const questBtn = document.getElementById('btn-dialogue-quest');
    const closeBtn = document.getElementById('btn-dialogue-close');

    if (!activeNpc) return;

    titleEl.textContent = activeNpc.npcName;
    nextBtn.classList.add('hidden');
    questBtn.classList.add('hidden');
    closeBtn.classList.remove('hidden');

    if (activeNpc.npcName === "Ulug'bek") {
      if (currentQuestState === 'completed') {
        textEl.textContent = "Sizga katta rahmat, yosh olim! Yulduzlar yo'lingizni yoritsin.";
      } else if (currentQuestState === 'active') {
        const hasTile = hotbarBlocks.includes(BLOCKS.BLUE_TILE);
        if (hasTile) {
          textEl.textContent = "Rahmat! Moviy koshin yetib keldi. Mana sizga va'da qilingan mukofot!";
          nextBtn.textContent = "Mukofotni Olish";
          nextBtn.classList.remove('hidden');
          closeBtn.classList.add('hidden');
        } else {
          textEl.textContent = "Hali ham koshinni topmadingizmi? Uni minoradan qidirib ko'ring!";
        }
      } else {
        // 'not_started' - sequential dialogue
        const dialogues = ULUGBEK_QUEST_DATA.dialogues;
        textEl.textContent = dialogues[dialogueIndex];
        
        if (dialogueIndex < dialogues.length - 1) {
          nextBtn.textContent = "Keyingi";
          nextBtn.classList.remove('hidden');
        } else {
          // Last page: show quest accept button
          questBtn.classList.remove('hidden');
        }
      }
    } else {
      // Fallback for other NPCs
      textEl.textContent = activeNpc.quote || "Salom, do'stim!";
    }
  }

  function checkInteractions() {
    npcs.forEach(npc => {
      if (npc.isAnimal) return;

      const dist = playerPos.distanceTo(npc.position);
      if (dist < 3.0 && !npc.saidHello) {
        npc.saidHello = true;
        soundEngine.playSFX('famous');
        
        if (!activeNpc) {
          // Open Dialogue Modal for famous figures
          activeNpc = npc;
          dialogueIndex = 0;
          document.exitPointerLock();
          document.getElementById('dialogue-modal').classList.remove('hidden');
          updateDialogueUI();
        }
        setTimeout(() => { npc.saidHello = false; }, 15000);
      }
    });
  }

  // ==========================================================================
  // MINING / PLACING
  // ==========================================================================

  function updateTargetRaycast() {
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const promptEl = document.getElementById('hud-interaction-container');
    const actionBtn = document.getElementById('btn-hud-action');

    // Show dismount button when riding an animal
    if (isRidingHorse && mountedHorse && promptEl && actionBtn) {
      actionBtn.textContent = "Tushish" + (isTouch ? "" : " [Shift]");
      actionBtn.style.background = "#ef4444";
      promptEl.classList.remove('hidden');
      highlightBox.visible = false;
      return;
    }

    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
    // Fast, zero-allocation target resolution
    const allTargets = [];
    const voxelTargets = [];
    for (let i = 0; i < scene.children.length; i++) {
      const child = scene.children[i];
      if (child.isVoxelMesh || child.isFurnitureMesh) {
        voxelTargets.push(child);
        allTargets.push(child);
      } else if (child.isAnimal) {
        allTargets.push(child);
      }
    }

    const hits = raycaster.intersectObjects(allTargets, true);
    
    // Check animal hits (Horse, Camel or Donkey riding)
    let hitHorse = null;
    if (hits.length > 0 && hits[0].distance < 5.0) {
      let obj = hits[0].object;
      while (obj && obj !== scene) {
        if (obj.isAnimal && (obj.animalName === "Ot" || obj.animalName === "Tuya" || obj.animalName === "Eshak")) {
          hitHorse = obj;
          break;
        }
        obj = obj.parent;
      }
    }

    if (hitHorse && promptEl && actionBtn) {
      targetedHorse = hitHorse;
      let label = "Otga minish";
      if (hitHorse.animalName === "Tuya") label = "Tuyaga minish";
      else if (hitHorse.animalName === "Eshak") label = "Eshakka minish";
      actionBtn.textContent = label + (isTouch ? "" : " [R]");
      actionBtn.style.background = "#8d6e63";
      promptEl.classList.remove('hidden');
      highlightBox.visible = false;
      return;
    } else {
      targetedHorse = null;
    }

    const voxelHits = raycaster.intersectObjects(voxelTargets, true);
    if (voxelHits.length > 0 && voxelHits[0].distance < 7.0) {
      const hit = voxelHits[0];
      let bx, by, bz;
      
      let obj = hit.object;
      let coord = null;
      while (obj && obj !== scene) {
        if (obj.isFurnitureMesh && obj.blockCoord) {
          coord = obj.blockCoord;
          break;
        }
        obj = obj.parent;
      }
      
      let isFurniture = false;
      let bType = null;
      if (coord) {
        const [cx, cy, cz] = coord.split(',').map(Number);
        bx = cx; by = cy; bz = cz;
        bType = worldData[coord];
        isFurniture = true;
      } else {
        const p = hit.point.clone().sub(hit.face.normal.clone().multiplyScalar(0.01));
        bx = Math.round(p.x); by = Math.round(p.y); bz = Math.round(p.z);
        bType = worldData[`${bx},${by},${bz}`];
        if (bType === BLOCKS.SOFA || bType === BLOCKS.CHAIR || bType === BLOCKS.TABLE || bType === BLOCKS.DOOR || bType === BLOCKS.WINDOW) {
          isFurniture = true;
        }
      }
      
      highlightBox.position.set(bx, by, bz);
      highlightBox.visible = true;

      if (isFurniture && voxelHits[0].distance < 4.0 && promptEl && actionBtn) {
        targetedFurniture = { type: bType, x: bx, y: by, z: bz };
        if (bType === BLOCKS.SOFA) {
          actionBtn.textContent = "Uxlash" + (isTouch ? "" : " [R]");
          actionBtn.style.background = "#10b981";
        } else if (bType === BLOCKS.CHAIR || bType === BLOCKS.TABLE) {
          actionBtn.textContent = "O'tirish" + (isTouch ? "" : " [R]");
          actionBtn.style.background = "#3b82f6";
        } else if (bType === BLOCKS.DOOR) {
          actionBtn.textContent = "Eshikni ochish/yopish" + (isTouch ? "" : " [R]");
          actionBtn.style.background = "#f59e0b";
        } else if (bType === BLOCKS.WINDOW) {
          actionBtn.textContent = "Derazadan qarash" + (isTouch ? "" : " [R]");
          actionBtn.style.background = "#06b6d4";
        }
        promptEl.classList.remove('hidden');
      } else {
        targetedFurniture = null;
        if (promptEl) promptEl.classList.add('hidden');
      }
    } else {
      highlightBox.visible = false;
      cancelMining();
      if (promptEl) promptEl.classList.add('hidden');
      targetedFurniture = null;
    }
  }

  function startMining() {
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = raycaster.intersectObjects(scene.children.filter(c => c.isVoxelMesh || c.isFurnitureMesh), true);
    if (hits.length > 0 && hits[0].distance < 7.0) {
      const hit = hits[0];
      let bx, by, bz;
      
      let obj = hit.object;
      let coord = null;
      while (obj && obj !== scene) {
        if (obj.isFurnitureMesh && obj.blockCoord) {
          coord = obj.blockCoord;
          break;
        }
        obj = obj.parent;
      }
      
      if (coord) {
        const [cx, cy, cz] = coord.split(',').map(Number);
        bx = cx; by = cy; bz = cz;
      } else {
        const p = hit.point.clone().sub(hit.face.normal.clone().multiplyScalar(0.01));
        bx = Math.round(p.x); by = Math.round(p.y); bz = Math.round(p.z);
      }
      
      const key = `${bx},${by},${bz}`;
      if (worldData[key] && worldData[key] !== BLOCKS.BEDROCK) {
        isMiningHeld = true; miningStartTime = performance.now(); miningTargetKey = key;
        isMiningProgress = 0;
        document.getElementById('mining-progress-container').classList.remove('hidden');
      } else if (worldData[key] === BLOCKS.BEDROCK) {
        showToast("Bedrock qatlamini buzib bo'lmaydi!");
      }
    }
  }

  function updateMiningProgress(delta) {
    if (!isMiningHeld || !miningTargetKey) return;
    
    // Progressive surface crack visual overlay effect
    if (miningOverlayMesh && miningTargetKey) {
      const coords = miningTargetKey.split(',').map(Number);
      miningOverlayMesh.position.set(coords[0], coords[1], coords[2]);
      miningOverlayMesh.visible = true;
      const progressRatio = Math.min(1.0, isMiningProgress / MINING_DURATION);
      const scl = 1.01 + progressRatio * 0.05;
      miningOverlayMesh.scale.set(scl, scl, scl);
      miningOverlayMesh.material.opacity = 0.4 + progressRatio * 0.6;
    }
    
    const activeBlockId = hotbarBlocks[activeSlotIndex];
    const targetedBlockType = worldData[miningTargetKey];
    let miningSpeedMultiplier = 1.0;
    
    if (activeBlockId === BLOCKS.AXE) {
      if (targetedBlockType === BLOCKS.WOOD || targetedBlockType === BLOCKS.LEAVES || targetedBlockType === BLOCKS.PLANKS || targetedBlockType === BLOCKS.CRAFTING_TABLE || targetedBlockType === BLOCKS.CHEST) {
        miningSpeedMultiplier = 4.0;
      }
    } else if (activeBlockId === BLOCKS.PICKAXE) {
      if (targetedBlockType === BLOCKS.STONE || targetedBlockType === BLOCKS.COAL || targetedBlockType === BLOCKS.GOLD || targetedBlockType === BLOCKS.DIAMOND || targetedBlockType === BLOCKS.IRON || targetedBlockType === BLOCKS.COPPER || targetedBlockType === BLOCKS.DARK_STONE || targetedBlockType === BLOCKS.BLUE_TILE || targetedBlockType === BLOCKS.RED_BRICK || targetedBlockType === BLOCKS.WHITE_MARBLE || targetedBlockType === BLOCKS.GLAZED_BLUE || targetedBlockType === BLOCKS.TERRACOTTA || targetedBlockType === BLOCKS.FURNACE || targetedBlockType === BLOCKS.OBSIDIAN || targetedBlockType === BLOCKS.GLOWSTONE || targetedBlockType === BLOCKS.MOSSY_STONE) {
        miningSpeedMultiplier = 4.0;
      }
    } else if (activeBlockId === BLOCKS.SHOVEL) {
      if (targetedBlockType === BLOCKS.DIRT || targetedBlockType === BLOCKS.GRASS || targetedBlockType === BLOCKS.SAND || targetedBlockType === BLOCKS.SNOW || targetedBlockType === BLOCKS.HAY_BALE) {
        miningSpeedMultiplier = 4.0;
      }
    }
    
    isMiningProgress += delta * miningSpeedMultiplier;
    const pct = Math.min(100, Math.floor((isMiningProgress / MINING_DURATION) * 100));
    
    if (Math.random() < 0.2) soundEngine.playSFX('dig_loop');
    const label = document.getElementById('mining-progress-label');
    const fill = document.getElementById('mining-progress-fill');
    if (label) label.textContent = `Buzilmoqda: ${pct}%`;
    if (fill) fill.style.width = `${pct}%`;
    
    if (isMiningProgress >= MINING_DURATION) {
      const brokenBlockType = worldData[miningTargetKey];
      removePointLightAtKey(miningTargetKey);
      worldData[miningTargetKey] = BLOCKS.AIR;
      modifiedBlocks[miningTargetKey] = BLOCKS.AIR;
      soundEngine.playSFX('break');

      if (brokenBlockType === BLOCKS.WOOD) {
        updateMissionProgress('chop_wood', 1);
      }
      if (brokenBlockType === BLOCKS.COAL || brokenBlockType === BLOCKS.IRON || brokenBlockType === BLOCKS.GOLD || brokenBlockType === BLOCKS.DIAMOND) {
        updateMissionProgress('mine_ores', 1);
      }

      // Drop resource collectible for broken blocks
      let dropType = null;
      let dropName = null;
      let dropColor = '#ffffff';

      if (typeof RESOURCE_INFO !== 'undefined' && RESOURCE_INFO[brokenBlockType]) {
        const info = RESOURCE_INFO[brokenBlockType];
        dropType = info.type;
        dropName = info.name;
        dropColor = info.color;
      } else if (BLOCK_INFO[brokenBlockType]) {
        const info = BLOCK_INFO[brokenBlockType];
        if (!info.isWeapon && brokenBlockType !== BLOCKS.AIR && brokenBlockType !== BLOCKS.BEDROCK) {
          // Map to standard block name in meatInventory
          dropType = info.name;
          dropName = info.name;
          dropColor = info.color || '#cccccc';
        }
      }

      if (dropType) {
        const coords = miningTargetKey.split(',').map(Number);
        spawnResourceCollectible(coords[0], coords[1] + 0.35, coords[2], dropType, dropName, dropColor);
      }

      if (supabase && multiplayerChannel) {
        const coords = miningTargetKey.split(',');
        multiplayerChannel.send({
          type: 'broadcast',
          event: 'block_change',
          payload: { x: parseInt(coords[0]), y: parseInt(coords[1]), z: parseInt(coords[2]), blockId: BLOCKS.AIR }
        });
      }

      rebuildWorldMesh();
      cancelMining();
    }
  }

  function cancelMining() {
    isMiningHeld = false; miningTargetKey = null; isMiningProgress = 0;
    if (miningOverlayMesh) miningOverlayMesh.visible = false;
    const bar = document.getElementById('mining-progress-container');
    if (bar) bar.classList.add('hidden');
  }

  function placeBlock() {
    let blockId = hotbarBlocks[activeSlotIndex];
    let bInfo = BLOCK_INFO[blockId];
    
    if (bInfo && bInfo.isFood) {
      eatFood(blockId);
      return;
    }
    
    if (bInfo && bInfo.isWeapon && blockId !== BLOCKS.BOMB) {
      const firstBlock = hotbarBlocks.find(b => {
        if (b === undefined || b === BLOCKS.AIR) return false;
        const info = BLOCK_INFO[b];
        if (!info || info.isWeapon) return false;
        const count = meatInventory[info.name] || 0;
        return count > 0;
      });
      if (firstBlock !== undefined) {
        blockId = firstBlock;
        bInfo = BLOCK_INFO[blockId];
      } else {
        showToast("Qo'yish uchun bloklar yetarli emas!");
        return;
      }
    }

    if (bInfo && !bInfo.isWeapon) {
      const count = meatInventory[bInfo.name] || 0;
      if (count <= 0) {
        showToast(`"${bInfo.name}" bloki tugagan!`);
        return;
      }
    }

    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = raycaster.intersectObjects(scene.children.filter(c => c.isVoxelMesh || c.isFurnitureMesh), true);
    if (hits.length > 0 && hits[0].distance < 7.0) {
      const hit = hits[0];
      let bx, by, bz;
      
      let obj = hit.object;
      let coord = null;
      while (obj && obj !== scene) {
        if (obj.isFurnitureMesh && obj.blockCoord) {
          coord = obj.blockCoord;
          break;
        }
        obj = obj.parent;
      }
      
      if (coord) {
        const p = hit.point.clone().add(hit.face.normal.clone().multiplyScalar(0.5));
        bx = Math.round(p.x); by = Math.round(p.y); bz = Math.round(p.z);
      } else {
        const p = hit.point.clone().add(hit.face.normal.clone().multiplyScalar(0.5));
        bx = Math.round(p.x); by = Math.round(p.y); bz = Math.round(p.z);
      }
      
      if (by > CHUNK_HEIGHT_MAX) { showToast(`Maksimal balandlik ${CHUNK_HEIGHT_MAX} blok!`); return; }
      const key = `${bx},${by},${bz}`;
      worldData[key] = blockId;
      modifiedBlocks[key] = blockId;
      soundEngine.playSFX('place');
      updateMissionProgress('place_blocks', 1);

      // Consume the block count
      if (bInfo && !bInfo.isWeapon) {
        meatInventory[bInfo.name] = (meatInventory[bInfo.name] || 0) - 1;
        renderHotbar();
      }

      if (BLOCK_INFO[blockId]?.isLuminous) {
        addPointLightAt(bx, by, bz);
      }

      if (supabase && multiplayerChannel) {
        multiplayerChannel.send({
          type: 'broadcast',
          event: 'block_change',
          payload: { x: bx, y: by, z: bz, blockId: blockId }
        });
      }

      rebuildWorldMesh();

      const directions = [
        [1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1]
      ];
      if (blockId === BLOCKS.BOMB) {
        let hasTorchNear = false;
        for (const [dx, dy, dz] of directions) {
          if (worldData[`${bx+dx},${by+dy},${bz+dz}`] === BLOCKS.TORCH) {
            hasTorchNear = true;
            break;
          }
        }
        if (hasTorchNear) {
          triggerBombFuse(bx, by, bz);
        }
      } else if (blockId === BLOCKS.TORCH) {
        for (const [dx, dy, dz] of directions) {
          const nx = bx + dx, ny = by + dy, nz = bz + dz;
          if (worldData[`${nx},${ny},${nz}`] === BLOCKS.BOMB) {
            triggerBombFuse(nx, ny, nz);
          }
        }
      }
    }
  }

  let rebuildRequested = false;
  function rebuildWorldMesh() {
    if (rebuildRequested) return;
    rebuildRequested = true;
    requestAnimationFrame(() => {
      renderInstancedWorld();
      
      // Clean old lights
      Object.keys(placedLights).forEach(k => {
        scene.remove(placedLights[k]);
        delete placedLights[k];
      });

      // Spawn point lights for all lanterns in worldData
      Object.keys(worldData).forEach(key => {
        if (worldData[key] && BLOCK_INFO[worldData[key]]?.isLuminous) {
          const coords = key.split(',');
          const bx = parseInt(coords[0]), by = parseInt(coords[1]), bz = parseInt(coords[2]);
          addPointLightAt(bx, by, bz);
        }
      });
      rebuildRequested = false;
    });
  }

  // ==========================================================================
  // SAVE / LOAD
  // ==========================================================================

  function saveGame() {
    const data = {
      id: currentWorldMeta.id || 'world_' + Date.now(),
      name: currentWorldMeta.name, map: currentWorldMeta.map,
      timestamp: Date.now(),
      playerPos: { x: playerPos.x, y: playerPos.y, z: playerPos.z },
      yaw, pitch, dayTime, hotbarBlocks, skin: playerSkin, modifiedBlocks,
      questState: currentQuestState,
      meatInventory, playerHunger
    };
    let saves = JSON.parse(localStorage.getItem('uzbekcraft_saves') || '[]');
    const idx = saves.findIndex(s => s.id === data.id);
    if (idx >= 0) saves[idx] = data; else saves.push(data);
    localStorage.setItem('uzbekcraft_saves', JSON.stringify(saves));
    
    if (supabase) {
      showToast("Bulutga saqlanmoqda...");
      const dbData = {
        id: data.id,
        name: data.name,
        map: data.map,
        timestamp: data.timestamp,
        player_pos: data.playerPos,
        yaw: data.yaw,
        pitch: data.pitch,
        day_time: data.dayTime,
        hotbar_blocks: data.hotbarBlocks,
        skin: data.skin,
        modified_blocks: data.modifiedBlocks,
        quest_state: data.questState + "|" + JSON.stringify(data.meatInventory || {})
      };
      supabase.from('uzbekcraft_saves').upsert([dbData]).then(({ error }) => {
        if (error) {
          console.error("Supabase cloud save failed:", error);
          showToast("Mahalliy saqlandi. Bulut xatoligi!");
        } else {
          showToast("O'yin bulutga muvaffaqiyatli saqlandi!");
        }
      });
    } else {
      showToast("O'yin mahalliy saqlandi!");
    }
  }

  function loadSavedWorldsList() {
    const list = document.getElementById('saved-worlds-list');
    if (!list) return;
    list.innerHTML = '<p class="modal-text">Dunyolar ro\'yxati yuklanmoqda...</p>';
    
    const localSaves = JSON.parse(localStorage.getItem('uzbekcraft_saves') || '[]');
    
    const renderList = (saves) => {
      list.innerHTML = '';
      if (saves.length === 0) {
        list.innerHTML = '<p class="modal-text">Hozircha saqlangan dunyolar mavjud emas.</p>'; return;
      }
      saves.sort((a, b) => b.timestamp - a.timestamp);
      saves.forEach(save => {
        const item = document.createElement('div');
        item.className = 'world-item';
        const ts = new Date(save.timestamp).toLocaleDateString('uz-UZ');
        item.innerHTML = `
          <div class="world-info-box">
            <h3>${save.name}</h3>
            <p>Xarita: ${save.map || 'Registon'} &bull; ${ts}</p>
          </div>
          <div class="world-item-actions">
            <button class="btn btn-emerald btn-play-save" data-id="${save.id}">O'ynash</button>
            <button class="btn btn-red btn-del-save" data-id="${save.id}">O'chirish</button>
          </div>`;
        list.appendChild(item);
      });
      
      document.querySelectorAll('.btn-play-save').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.target.closest('button').dataset.id;
          const target = saves.find(s => s.id === id);
          if (target) resumeWorld(target);
        });
      });
      
      document.querySelectorAll('.btn-del-save').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.target.closest('button').dataset.id;
          const updated = saves.filter(s => s.id !== id);
          localStorage.setItem('uzbekcraft_saves', JSON.stringify(updated));
          
          if (supabase) {
            showToast("Bulutdan o'chirilmoqda...");
            supabase.from('uzbekcraft_saves').delete().eq('id', id).then(({ error }) => {
              if (error) {
                console.error("Supabase delete failed:", error);
                showToast("Bulutdan o'chirishda xatolik!");
              } else {
                showToast("Dunyolar o'chirildi!");
              }
              loadSavedWorldsList();
            });
          } else {
            showToast("Dunyo o'chirildi!");
            loadSavedWorldsList();
          }
        });
      });
    };

    if (supabase) {
      supabase.from('uzbekcraft_saves').select('*').then(({ data, error }) => {
        if (error) {
          console.error("Failed to fetch cloud saves:", error);
          showToast("Bulutdan yuklashda xatolik!");
          renderList(localSaves);
        } else {
          const cloudSaves = data.map(db => ({
            id: db.id,
            name: db.name,
            map: db.map,
            timestamp: Number(db.timestamp),
            playerPos: db.player_pos,
            yaw: db.yaw,
            pitch: db.pitch,
            dayTime: db.day_time,
            hotbarBlocks: db.hotbar_blocks,
            skin: db.skin,
            modifiedBlocks: db.modified_blocks,
            questState: db.quest_state
          }));

          const merged = [...localSaves];
          cloudSaves.forEach(cloud => {
            const idx = merged.findIndex(s => s.id === cloud.id);
            if (idx >= 0) {
              if (cloud.timestamp > merged[idx].timestamp) {
                merged[idx] = cloud;
              }
            } else {
              merged.push(cloud);
            }
          });
          localStorage.setItem('uzbekcraft_saves', JSON.stringify(merged));
          renderList(merged);
        }
      });
    } else {
      renderList(localSaves);
    }
  }

  function resumeWorld(saveData) {
    currentWorldMeta = saveData;
    modifiedBlocks = saveData.modifiedBlocks || {};
    dayTime = saveData.dayTime || 0.25;
    playerSkin = saveData.skin || 'temur';
    playerHunger = saveData.playerHunger !== undefined ? saveData.playerHunger : 100;
    updateHungerUI();
    
    // Parse questState and meatInventory
    if (saveData.questState && saveData.questState.includes('|')) {
      const parts = saveData.questState.split('|');
      currentQuestState = parts[0];
      try {
        meatInventory = Object.assign(createDefaultInventory(false), JSON.parse(parts[1]));
      } catch(e) {
        meatInventory = Object.assign(createDefaultInventory(false), saveData.meatInventory || {});
      }
    } else {
      currentQuestState = saveData.questState || 'not_started';
      meatInventory = Object.assign(createDefaultInventory(false), saveData.meatInventory || {});
    }

    generateWorld(saveData.seed || 'Uzbekistan2026', saveData.map || 'minecraft_classic');
    playerPos.set(saveData.playerPos.x, saveData.playerPos.y, saveData.playerPos.z);
    yaw = saveData.yaw || 0; pitch = saveData.pitch || 0;
    startPlayingSession();
  }

  function startPlayingSession() {
    hideAllModals();
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) { mainMenu.classList.remove('active'); mainMenu.style.display = 'none'; }
    const hud = document.getElementById('hud');
    if (hud) hud.classList.remove('hidden');
    soundEngine.init();
    soundEngine.startAmbientMusic();
    joinMultiplayerRoom();

    const container = document.getElementById('canvas-container');
    if (container) {
      setTimeout(() => {
        container.requestPointerLock();
      }, 100);
    }
  }

  function returnToMainMenu() {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    hideAllModals();
    const hud = document.getElementById('hud');
    if (hud) hud.classList.add('hidden');
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) { mainMenu.style.display = 'flex'; mainMenu.classList.add('active'); }
    
    // Cleanup multiplayer
    if (multiplayerChannel) {
      multiplayerChannel.unsubscribe();
      multiplayerChannel = null;
    }
    Object.keys(otherPlayers).forEach(id => {
      if (otherPlayers[id] && otherPlayers[id].mesh) {
        scene.remove(otherPlayers[id].mesh);
      }
      delete otherPlayers[id];
    });
  }

  function hideAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  }

  // ==========================================================================
  // UI SETUP
  // ==========================================================================

  function setupUI() {
    renderHotbar();
    renderInventoryGrid();
    updateHealthUI();
    updateHungerUI();
    renderHUDMissionTracker();

    const btnMissionsHUD = document.getElementById('btn-hud-missions');
    const btnCloseMissions = document.getElementById('btn-close-missions');
    const btnClaimHUD = document.getElementById('btn-hud-claim-mission');

    if (btnMissionsHUD) {
      btnMissionsHUD.addEventListener('click', () => {
        currentWorldMeta = { id: 'world_' + Date.now(), name: 'Topshiriqlar', seed: "Uzbekistan2026", map: 'quest_island' };
        modifiedBlocks = {};
        generateWorld("Uzbekistan2026", 'quest_island');
        const hudBiome = document.getElementById('hud-biome');
        if (hudBiome) hudBiome.textContent = getMapDisplayName('quest_island');
        showToast("Topshiriqlar kartasi yuklandi!");
      });
    }

    if (btnCloseMissions) {
      btnCloseMissions.addEventListener('click', () => {
        document.getElementById('modal-missions').classList.add('hidden');
        const container = document.getElementById('canvas-container');
        if (container) setTimeout(() => container.requestPointerLock(), 50);
      });
    }

    if (btnClaimHUD) {
      btnClaimHUD.addEventListener('click', () => {
        const cur = ROBLOX_MISSIONS[currentMissionIndex];
        if (cur) claimMissionReward(cur.id);
      });
    }

    const tabWeapons = document.getElementById('tab-weapons');
    const tabFurniture = document.getElementById('tab-furniture');
    const tabBlocks = document.getElementById('tab-blocks');
    const tabFood = document.getElementById('tab-food');
    const tabCrafting = document.getElementById('tab-crafting');

    const switchTab = (tab) => {
      currentInventoryTab = tab;
      [tabWeapons, tabFurniture, tabBlocks, tabFood, tabCrafting].forEach(t => t?.classList.remove('active'));
      if (tab === 'weapons') tabWeapons?.classList.add('active');
      else if (tab === 'furniture') tabFurniture?.classList.add('active');
      else if (tab === 'blocks') tabBlocks?.classList.add('active');
      else if (tab === 'food') tabFood?.classList.add('active');
      else if (tab === 'crafting') tabCrafting?.classList.add('active');
      
      const grid = document.getElementById('inventory-grid');
      const crafting = document.getElementById('crafting-container');
      
      if (tab === 'crafting') {
        if (grid) grid.classList.add('hidden');
        if (crafting) {
          crafting.classList.remove('hidden');
          updateCraftingUI();
        }
      } else {
        if (grid) grid.classList.remove('hidden');
        if (crafting) crafting.classList.add('hidden');
        renderInventoryGrid();
      }
    };

    if (tabWeapons) tabWeapons.addEventListener('click', () => switchTab('weapons'));
    if (tabFurniture) tabFurniture.addEventListener('click', () => switchTab('furniture'));
    if (tabBlocks) tabBlocks.addEventListener('click', () => switchTab('blocks'));
    if (tabFood) tabFood.addEventListener('click', () => switchTab('food'));
    if (tabCrafting) tabCrafting.addEventListener('click', () => switchTab('crafting'));

    document.getElementById('btn-new-world').addEventListener('click', () => {
      document.getElementById('create-world-modal').classList.remove('hidden');
    });
    document.getElementById('btn-saved-worlds').addEventListener('click', () => {
      loadSavedWorldsList();
      document.getElementById('saved-worlds-modal').classList.remove('hidden');
    });
    document.getElementById('btn-skins').addEventListener('click', () => {
      document.getElementById('skins-modal').classList.remove('hidden');
    });
    document.getElementById('btn-settings').addEventListener('click', () => {
      document.getElementById('settings-modal').classList.remove('hidden');
    });
    document.getElementById('btn-exit').addEventListener('click', () => {
      document.getElementById('save-prompt-modal').classList.remove('hidden');
    });

    // --- MULTIPLAYER UI LISTENERS ---
    document.getElementById('btn-multiplayer').addEventListener('click', () => {
      document.getElementById('multiplayer-modal').classList.remove('hidden');
    });
    document.getElementById('btn-multiplayer-close').addEventListener('click', () => {
      document.getElementById('multiplayer-modal').classList.add('hidden');
    });
    document.getElementById('btn-multiplayer-join').addEventListener('click', () => {
      const storedName = localStorage.getItem('uzbekcraft_nickname');
      if (!storedName) {
        document.getElementById('player-name-modal').classList.remove('hidden');
        return;
      }
      startJoinMultiplayer();
    });

    document.getElementById('btn-save-nickname').addEventListener('click', () => {
      const input = document.getElementById('player-nickname-input').value.trim();
      if (input) {
        localPlayerName = input;
        localStorage.setItem('uzbekcraft_nickname', input);
      }
      document.getElementById('player-name-modal').classList.add('hidden');
      startJoinMultiplayer();
    });

    function startJoinMultiplayer() {
      const roomName = document.getElementById('multiplayer-room-input').value.trim() || "dostlar";
      const map = document.getElementById('multiplayer-map-select').value || "minecraft_classic";
      currentWorldMeta = { id: 'world_' + Date.now(), name: roomName, seed: "Uzbekistan2026", map: map };
      modifiedBlocks = {};
      currentQuestState = 'not_started';
      generateWorld("Uzbekistan2026", map);
      const hudBiome = document.getElementById('hud-biome');
      if (hudBiome) hudBiome.textContent = getMapDisplayName(map) + " (Onlayn)";
      startPlayingSession();
      document.getElementById('multiplayer-modal').classList.add('hidden');
      showToast(`"${roomName}" xonasiga ulanildi! (${localPlayerName})`);
    }

    document.getElementById('btn-online-respawn').addEventListener('click', () => {
      health = MAX_HEALTH;
      playerHunger = MAX_HUNGER;
      updateHealthUI();
      updateHungerUI();
      playerPos.set(0, 95, 0);
      document.getElementById('online-death-modal').classList.add('hidden');
      const container = document.getElementById('canvas-container');
      if (container) container.requestPointerLock();
      showToast("Qaytadan jangdasiz!");
    });

    document.getElementById('btn-online-exit').addEventListener('click', () => {
      if (multiplayerChannel) {
        multiplayerChannel.unsubscribe();
        multiplayerChannel = null;
      }
      document.getElementById('online-death-modal').classList.add('hidden');
      document.getElementById('hud').classList.add('hidden');
      document.getElementById('main-menu').classList.add('active');
    });

    // --- SUPABASE UI LISTENERS ---
    document.getElementById('btn-supabase').addEventListener('click', () => {
      document.getElementById('supabase-url').value = localStorage.getItem('uzbekcraft_supabase_url') || 'https://dtpyfzzdfyxeklyrtuew.supabase.co';
      document.getElementById('supabase-key').value = localStorage.getItem('uzbekcraft_supabase_key') || 'sb_publishable_ioYdiKVpVMddnYFH3bABDg_-J9EImd1';
      const statusEl = document.getElementById('supabase-status');
      if (supabase) {
        statusEl.textContent = "Supabase bilan ulanish faol (sinxronizatsiya yoqilgan).";
        statusEl.style.display = 'block';
        statusEl.style.background = 'rgba(16, 185, 129, 0.2)';
        statusEl.style.color = '#34d399';
      } else {
        statusEl.style.display = 'none';
      }
      document.getElementById('supabase-modal').classList.remove('hidden');
    });

    document.getElementById('btn-supabase-test').addEventListener('click', () => {
      const url = document.getElementById('supabase-url').value.trim();
      const key = document.getElementById('supabase-key').value.trim();
      const statusEl = document.getElementById('supabase-status');
      statusEl.style.display = 'block';
      statusEl.style.background = 'rgba(255,255,255,0.05)';
      statusEl.style.color = '#fff';
      statusEl.textContent = "Ulanish tekshirilmoqda...";

      if (!url || !key) {
        statusEl.textContent = "Xatolik: Barcha maydonlarni to'ldiring!";
        statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
        statusEl.style.color = '#f87171';
        return;
      }

      if (!window.supabase) {
        statusEl.textContent = "Xatolik: Supabase kutubxonasi yuklanmagan!";
        statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
        statusEl.style.color = '#f87171';
        return;
      }

      try {
        const tempClient = window.supabase.createClient(url, key);
        tempClient.from('uzbekcraft_saves').select('id').limit(1).then(({ error }) => {
          if (error) {
            console.error(error);
            statusEl.textContent = `Xatolik: ${error.message || 'Ulanishda xatolik yuz berdi'}`;
            statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
            statusEl.style.color = '#f87171';
          } else {
            statusEl.textContent = "Muvaffaqiyatli: Supabase ulanishi tekshirildi!";
            statusEl.style.background = 'rgba(16, 185, 129, 0.2)';
            statusEl.style.color = '#34d399';
          }
        });
      } catch (e) {
        statusEl.textContent = `Xatolik: ${e.message}`;
        statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
        statusEl.style.color = '#f87171';
      }
    });

    document.getElementById('btn-supabase-save').addEventListener('click', () => {
      const url = document.getElementById('supabase-url').value.trim();
      const key = document.getElementById('supabase-key').value.trim();
      if (!url || !key) {
        showToast("Xatolik: Barcha maydonlarni to'ldiring!");
        return;
      }
      localStorage.setItem('uzbekcraft_supabase_url', url);
      localStorage.setItem('uzbekcraft_supabase_key', key);
      initSupabase();
      showToast("Supabase sozlamalari saqlandi!");
      document.getElementById('supabase-modal').classList.add('hidden');
    });

    document.getElementById('btn-supabase-disconnect').addEventListener('click', () => {
      localStorage.removeItem('uzbekcraft_supabase_url');
      localStorage.removeItem('uzbekcraft_supabase_key');
      supabase = null;
      document.getElementById('supabase-url').value = '';
      document.getElementById('supabase-key').value = '';
      showToast("Supabase ulanishi uzildi (Mahalliy saqlash faol).");
      document.getElementById('supabase-modal').classList.add('hidden');
    });

    document.getElementById('btn-supabase-close').addEventListener('click', () => {
      document.getElementById('supabase-modal').classList.add('hidden');
    });

    document.getElementById('btn-start-game').addEventListener('click', () => {
      const name = document.getElementById('world-name-input').value || "Mening Dunyoim";
      const seed = document.getElementById('world-seed-input').value || "Uzbekistan2026";
      const map = document.getElementById('world-map-select').value || "minecraft_classic";
      currentWorldMeta = { id: 'world_' + Date.now(), name, seed, map };
      modifiedBlocks = {};
      currentQuestState = 'not_started';
      meatInventory = createDefaultInventory(true);
      generateWorld(seed, map);
      document.getElementById('hud-biome').textContent = getMapDisplayName(map);
      startPlayingSession();
      showToast(`${name} dunyosi yaratildi!`);
    });

    document.getElementById('btn-cancel-create').addEventListener('click', () => document.getElementById('create-world-modal').classList.add('hidden'));
    document.getElementById('btn-close-saved').addEventListener('click', () => document.getElementById('saved-worlds-modal').classList.add('hidden'));
    document.getElementById('btn-close-skins').addEventListener('click', () => document.getElementById('skins-modal').classList.add('hidden'));

    document.querySelectorAll('.skin-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.skin-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        playerSkin = card.dataset.skin;
      });
    });
    document.getElementById('btn-select-skin').addEventListener('click', () => {
      showToast(`Qahramon tanlandi: ${playerSkin}`);
      document.getElementById('skins-modal').classList.add('hidden');
    });

    document.getElementById('btn-hud-pause').addEventListener('click', () => document.getElementById('pause-modal').classList.remove('hidden'));
    document.getElementById('btn-resume-game').addEventListener('click', () => document.getElementById('pause-modal').classList.add('hidden'));
    document.getElementById('btn-save-game').addEventListener('click', saveGame);
    document.getElementById('btn-pause-settings').addEventListener('click', () => document.getElementById('settings-modal').classList.remove('hidden'));
    document.getElementById('btn-main-menu').addEventListener('click', () => {
      document.getElementById('pause-modal').classList.add('hidden');
      document.getElementById('save-prompt-modal').classList.remove('hidden');
    });
    document.getElementById('btn-prompt-save').addEventListener('click', () => { saveGame(); returnToMainMenu(); });
    document.getElementById('btn-prompt-nosave').addEventListener('click', returnToMainMenu);
    document.getElementById('btn-prompt-cancel').addEventListener('click', () => document.getElementById('save-prompt-modal').classList.add('hidden'));
    document.getElementById('btn-close-inventory').addEventListener('click', () => {
      document.getElementById('inventory-modal').classList.add('hidden');
      const container = document.getElementById('canvas-container');
      if (container) {
        setTimeout(() => { container.requestPointerLock(); }, 50);
      }
    });

    const craftActionBtn = document.getElementById('btn-craft-action');
    if (craftActionBtn) {
      craftActionBtn.addEventListener('click', performCraft);
    }

    document.getElementById('btn-pause-meats').addEventListener('click', () => {
      document.getElementById('pause-modal').classList.add('hidden');
      const meatsModal = document.getElementById('meats-modal');
      if (meatsModal) {
        meatsModal.classList.remove('hidden');
        updateMeatMenuUI();
      }
    });

    document.getElementById('btn-close-meats').addEventListener('click', () => {
      document.getElementById('meats-modal').classList.add('hidden');
      const container = document.getElementById('canvas-container');
      if (container) {
        setTimeout(() => { container.requestPointerLock(); }, 50);
      }
    });

    document.getElementById('btn-dialogue-next').addEventListener('click', () => {
      if (activeNpc && activeNpc.npcName === "Ulug'bek") {
        if (currentQuestState === 'active' && hotbarBlocks.includes(BLOCKS.BLUE_TILE)) {
          const idx = hotbarBlocks.indexOf(BLOCKS.BLUE_TILE);
          if (idx !== -1) {
            hotbarBlocks[idx] = BLOCKS.DIAMOND;
          } else {
            hotbarBlocks[activeSlotIndex] = BLOCKS.DIAMOND;
          }
          renderHotbar();
          currentQuestState = 'completed';
          showToast("Sizga Olmos mukofoti berildi!");
          updateDialogueUI();
        } else {
          dialogueIndex++;
          updateDialogueUI();
        }
      }
    });

    document.getElementById('btn-dialogue-quest').addEventListener('click', () => {
      currentQuestState = 'active';
      showToast("Vazifa qabul qilindi: 'Yo'qolgan Sekstant'");
      updateDialogueUI();
    });

    document.getElementById('btn-dialogue-close').addEventListener('click', () => {
      document.getElementById('dialogue-modal').classList.add('hidden');
      activeNpc = null;
    });

    // --- GAME SETTINGS EVENT LISTENERS ---
    const sfxSlider = document.getElementById('slider-sfx');
    const musicSlider = document.getElementById('slider-music');
    const renderSlider = document.getElementById('slider-render-dist');
    const toggleMobile = document.getElementById('toggle-mobile');

    if (sfxSlider) {
      sfxSlider.addEventListener('input', () => {
        const val = sfxSlider.value;
        document.getElementById('sfx-vol-val').textContent = `${val}%`;
        soundEngine.sfxVolume = val / 100;
      });
    }

    if (musicSlider) {
      musicSlider.addEventListener('input', () => {
        const val = musicSlider.value;
        document.getElementById('music-vol-val').textContent = `${val}%`;
        soundEngine.musicVolume = val / 100;
      });
    }

    if (renderSlider) {
      renderSlider.addEventListener('input', () => {
        const val = renderSlider.value;
        document.getElementById('render-dist-val').textContent = `${val} Chunk`;
        if (camera) {
          camera.far = val * 64 + 100;
          camera.updateProjectionMatrix();
        }
        if (scene && scene.fog) {
          scene.fog.density = 0.08 / val;
        }
      });
    }

    if (toggleMobile) {
      toggleMobile.addEventListener('change', () => {
        const mobileCtrls = document.getElementById('mobile-controls');
        if (mobileCtrls) {
          mobileCtrls.style.display = toggleMobile.checked ? 'block' : 'none';
        }
      });
    }

    const closeSettingsBtn = document.getElementById('btn-close-settings');
    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', () => {
        document.getElementById('settings-modal').classList.add('hidden');
      });
    }
  }

  function getMapDisplayName(map) {
    const names = {
      registan: 'Samarqand - Registon', ichan_qala: 'Xiva - Ichan Qal\'a',
      minorai_kalon: 'Buxoro - Minorai Kalon', tashkent_tower: 'Toshkent Teleminorasi',
      chimgon: 'Chimgon Tog\'lari', pyramids: 'Misr Piramidalar',
      eiffel: 'Parij - Eyfel Minorasi', colosseum: 'Rim - Kolizey',
      big_ben: 'London - Big Ben', burj_khalifa: 'Dubay - Burj Xalifa',
      great_wall: 'Xitoy Buyuk Devori', taj_mahal: 'Hindiston - Taj Mahal',
      earth_globe: 'Yer Globusi',
      quest_island: 'Topshiriqlar Kartasi',
      online_shooter: 'Otishma Kartasi (CS Shooter)',
      coop_building: 'Do\'stlar Bilan Uy Qurish'
    };
    return names[map] || map;
  }

  let handSwingTime = 0;
  let activeArrows = [];
  let activeBullets = [];
  let activeTorches = [];
  let activeParticles = [];
  const sharedParticleGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  let isMouseDown = false;
  let avtomatFireTimer = 0.12;

  function triggerBombFuse(bx, by, bz, instant = false) {
    const key = `${bx},${by},${bz}`;
    // If it's already triggered/removed, return
    if (worldData[key] !== BLOCKS.BOMB) return;

    delete worldData[key];
    delete modifiedBlocks[key];
    rebuildWorldMesh();

    if (supabase && multiplayerChannel) {
      multiplayerChannel.send({
        type: 'broadcast',
        event: 'block_change',
        payload: { x: bx, y: by, z: bz, blockId: BLOCKS.AIR }
      });
    }

    if (instant) {
      // Tiny randomized delay for nice sequential chain reaction effect
      setTimeout(() => {
        explodeBombAt(bx, by, bz);
      }, 50 + Math.random() * 150);
      return;
    }

    const tntGeo = new THREE.BoxGeometry(0.98, 0.98, 0.98);
    const tntMat = new THREE.MeshStandardMaterial({ color: 0xef5350, roughness: 0.5 });
    const tntMesh = new THREE.Mesh(tntGeo, tntMat);
    tntMesh.position.set(bx, by, bz);
    scene.add(tntMesh);

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 0.2;
      if (elapsed >= 3.0) {
        clearInterval(interval);
        scene.remove(tntMesh);
        explodeBombAt(bx, by, bz);
      } else {
        const flash = Math.floor(elapsed * 5) % 2 === 0;
        tntMat.emissive.setHex(flash ? 0xffffff : 0x000000);
        tntMat.emissiveIntensity = flash ? 1.5 : 0.0;
        soundEngine.playSFX('swing');
      }
    }, 200);
  }

  function explodeBombAt(bx, by, bz) {
    soundEngine.playSFX('explode');

    let tntCount = 1;
    const scanRadius = 6;
    for (let x = bx - scanRadius; x <= bx + scanRadius; x++) {
      for (let y = by - scanRadius; y <= by + scanRadius; y++) {
        for (let z = bz - scanRadius; z <= bz + scanRadius; z++) {
          const key = `${x},${y},${z}`;
          if (worldData[key] === BLOCKS.BOMB) {
            tntCount++;
          }
        }
      }
    }

    const radius = Math.min(15, 3 + Math.floor(Math.sqrt(tntCount - 1) * 1.5));
    const destroyedList = [];
    const chainList = [];

    for (let x = bx - radius; x <= bx + radius; x++) {
      for (let y = by - radius; y <= by + radius; y++) {
        for (let z = bz - radius; z <= bz + radius; z++) {
          const dx = x - bx, dy = y - by, dz = z - bz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const threshold = radius + 0.2 + (Math.random() - 0.5) * 1.5;
          if (dist <= threshold) {
            const key = `${x},${y},${z}`;
            const targetBlock = worldData[key];
            if (targetBlock && targetBlock !== BLOCKS.BEDROCK) {
              if (targetBlock === BLOCKS.BOMB) {
                worldData[key] = BLOCKS.AIR;
                modifiedBlocks[key] = BLOCKS.AIR;
                chainList.push({ x, y, z });
              } else {
                removePointLightAtKey(key);
                worldData[key] = BLOCKS.AIR;
                modifiedBlocks[key] = BLOCKS.AIR;
                destroyedList.push({ x, y, z });
              }
            }
          }
        }
      }
    }

    rebuildWorldMesh();

    if (supabase && multiplayerChannel) {
      destroyedList.forEach(coords => {
        multiplayerChannel.send({
          type: 'broadcast',
          event: 'block_change',
          payload: { x: coords.x, y: coords.y, z: coords.z, blockId: BLOCKS.AIR }
        });
      });
    }

    // Trigger chain reactions
    chainList.forEach(coords => {
      triggerBombFuse(coords.x, coords.y, coords.z, true); // true = instant/cascade
    });

    const distToPlayer = playerPos.distanceTo(new THREE.Vector3(bx, by, bz));
    if (distToPlayer <= 5.0) {
      const dmg = Math.round((5.0 - distToPlayer) * 2.5);
      if (dmg > 0) {
        damageLocalPlayer(dmg);
      }
    }

    // Spawn realistic fire/smoke explosion particles
    const maxParticles = 120;
    if (activeParticles.length < maxParticles) {
      const spawnCount = Math.min(45, maxParticles - activeParticles.length);
      for (let i = 0; i < spawnCount; i++) {
        // Mix of fire orange/yellow and smoke grey
        const fireColor = Math.random() < 0.45 ? 0xff7043 : (Math.random() < 0.3 ? 0xffeb3b : 0x757575);
        const pMat = new THREE.MeshBasicMaterial({ color: fireColor, transparent: true, opacity: 0.95 });
        const pMesh = new THREE.Mesh(sharedParticleGeo, pMat);
        
        // Random scale instead of random geometry creation
        const scl = 0.75 + Math.random() * 1.0;
        pMesh.scale.set(scl, scl, scl);

        pMesh.position.set(
          bx + (Math.random() - 0.5) * 0.8,
          by + (Math.random() - 0.5) * 0.8,
          bz + (Math.random() - 0.5) * 0.8
        );
        
        scene.add(pMesh);
        activeParticles.push({
          mesh: pMesh,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 7.5,
            Math.random() * 5.0 + 2.0,
            (Math.random() - 0.5) * 7.5
          ),
          life: 1.2 + Math.random() * 0.6
        });
      }
    }
  }

  function updateFirstPersonHandMesh() {
    if (!fpHandGroup) return;

    // Clear previous children
    while (fpHandGroup.children.length > 0) {
      fpHandGroup.remove(fpHandGroup.children[0]);
    }

    const blockId = hotbarBlocks[activeSlotIndex];
    if (blockId === undefined || blockId === BLOCKS.AIR) return;

    // 1. Blocky human arm/hand
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xe0a96d }); // skin color
    const handGeom = new THREE.BoxGeometry(0.12, 0.12, 0.45);
    const handMesh = new THREE.Mesh(handGeom, skinMat);
    handMesh.position.set(0.26, -0.22, -0.4);
    handMesh.rotation.x = -0.15;
    handMesh.rotation.y = -0.25;
    fpHandGroup.add(handMesh);

    // 2. Held Weapon/Block Model
    if (blockId === BLOCKS.SWORD) {
      const swordGroup = new THREE.Group();
      swordGroup.position.set(0.18, -0.15, -0.45);
      swordGroup.rotation.x = -Math.PI / 3;
      swordGroup.rotation.y = 0.2;

      const handleMat = new THREE.MeshLambertMaterial({ color: 0x795548 }); // Wood handle
      const bladeMat = new THREE.MeshLambertMaterial({ color: 0x00bcd4 });  // Diamond cyan blade
      const guardMat = new THREE.MeshLambertMaterial({ color: 0x37474f });  // Dark guard

      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), handleMat);
      handle.position.y = -0.06;
      swordGroup.add(handle);

      const guard = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.04), guardMat);
      guard.position.y = 0.01;
      swordGroup.add(guard);

      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.02), bladeMat);
      blade.position.y = 0.19;
      swordGroup.add(blade);

      fpHandGroup.add(swordGroup);
    } else if (blockId === BLOCKS.AXE) {
      const axeGroup = new THREE.Group();
      axeGroup.position.set(0.18, -0.15, -0.42);
      axeGroup.rotation.x = -Math.PI / 3;

      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.3, 0.03), new THREE.MeshLambertMaterial({ color: 0x795548 }));
      handle.position.y = 0.05;
      axeGroup.add(handle);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.04), new THREE.MeshLambertMaterial({ color: 0x90a4ae }));
      head.position.set(0.03, 0.15, 0);
      axeGroup.add(head);

      fpHandGroup.add(axeGroup);
    } else if (blockId === BLOCKS.BOW) {
      const bowGroup = new THREE.Group();
      bowGroup.position.set(0.18, -0.15, -0.42);
      bowGroup.rotation.y = -0.3;

      const bowMat = new THREE.MeshLambertMaterial({ color: 0x8d6e63 }); // brown wood
      const stringMat = new THREE.MeshBasicMaterial({ color: 0xdddddd }); // white string

      const center = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.15, 0.03), bowMat);
      
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), bowMat);
      upper.position.set(-0.02, 0.11, 0.03);
      upper.rotation.z = 0.2;
      center.add(upper);

      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), bowMat);
      lower.position.set(-0.02, -0.11, 0.03);
      lower.rotation.z = -0.2;
      center.add(lower);

      const string = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.36, 0.005), stringMat);
      string.position.set(-0.05, 0, 0);
      center.add(string);

      bowGroup.add(center);
      fpHandGroup.add(bowGroup);
    } else if (blockId === BLOCKS.AVTOMAT) {
      const avtomatGroup = new THREE.Group();
      avtomatGroup.position.set(0.16, -0.18, -0.4);
      avtomatGroup.rotation.y = -0.15;
      
      const metalMat = new THREE.MeshLambertMaterial({ color: 0x37474f, roughness: 0.5, metalness: 0.8 });
      const woodMat = new THREE.MeshLambertMaterial({ color: 0x8d6e63, roughness: 0.7 });
      
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.15), woodMat);
      stock.position.set(-0.02, -0.02, 0.08);
      avtomatGroup.add(stock);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.25), metalMat);
      body.position.set(0, 0, -0.05);
      avtomatGroup.add(body);
      
      const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.18), metalMat);
      barrel.position.set(0, 0.01, -0.2);
      avtomatGroup.add(barrel);

      const mag = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.05), metalMat);
      mag.position.set(0, -0.08, -0.08);
      mag.rotation.x = -0.2;
      avtomatGroup.add(mag);

      fpHandGroup.add(avtomatGroup);
    } else if (blockId === BLOCKS.TORCH) {
      const torchGroup = new THREE.Group();
      torchGroup.position.set(0.18, -0.15, -0.42);
      torchGroup.rotation.x = -0.3;

      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.04), new THREE.MeshLambertMaterial({ color: 0x795548 }));
      const flame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.05), new THREE.MeshBasicMaterial({ color: 0xff5722 }));
      flame.position.y = 0.12;
      torchGroup.add(handle, flame);
      
      const torchLight = new THREE.PointLight(0xff5722, 1.2, 5);
      torchLight.position.set(0, 0.12, 0);
      torchGroup.add(torchLight);

      fpHandGroup.add(torchGroup);
    } else if (blockId === BLOCKS.BUCKET || blockId === BLOCKS.WATER_BUCKET) {
      const bucketGroup = new THREE.Group();
      bucketGroup.position.set(0.18, -0.16, -0.42);
      bucketGroup.rotation.set(0.1, -0.1, 0);

      const metalMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.3, metalness: 0.8 });
      
      const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.12), metalMat);
      bottom.position.y = -0.07;
      
      const w1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.02), metalMat);
      w1.position.set(0, 0.02, 0.07);
      const w2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.02), metalMat);
      w2.position.set(0, 0.02, -0.07);
      const w3 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.12), metalMat);
      w3.position.set(0.07, 0.02, 0);
      const w4 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.12), metalMat);
      w4.position.set(-0.07, 0.02, 0);
      
      const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.02), metalMat);
      h1.position.set(0.07, 0.15, 0);
      const h2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.02), metalMat);
      h2.position.set(-0.07, 0.15, 0);
      const h3 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.02), metalMat);
      h3.position.set(0, 0.20, 0);
      
      bucketGroup.add(bottom, w1, w2, w3, w4, h1, h2, h3);

      if (blockId === BLOCKS.WATER_BUCKET) {
        const waterMat = new THREE.MeshStandardMaterial({ color: 0x1e88e5, roughness: 0.1, transparent: true, opacity: 0.8 });
        const water = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), waterMat);
        water.position.y = 0.02;
        bucketGroup.add(water);
      }
      fpHandGroup.add(bucketGroup);
    } else {
      // Regular block
      const color = BLOCK_INFO[blockId]?.color || '#ffffff';
      const blockMat = new THREE.MeshLambertMaterial({ color: color });
      const blockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), blockMat);
      blockMesh.position.set(0.20, -0.16, -0.45);
      blockMesh.rotation.set(0.2, 0.3, 0.1);
      fpHandGroup.add(blockMesh);
    }
  }

  function updateThirdPersonHeldItem(mesh, blockId) {
    if (!mesh || !mesh.armR) return;
    
    // Find and remove existing held item (keep only the arm mesh itself)
    while (mesh.armR.children.length > 1) {
      mesh.armR.remove(mesh.armR.children[1]);
    }

    if (blockId === undefined || blockId === BLOCKS.AIR) return;

    // Create the 3D model of the held item in third person
    const matSwordHandle = new THREE.MeshLambertMaterial({ color: 0x795548 });
    const matSwordBlade = new THREE.MeshLambertMaterial({ color: 0x00bcd4 }); // Diamond cyan
    const matGuard = new THREE.MeshLambertMaterial({ color: 0x37474f });

    if (blockId === BLOCKS.SWORD) {
      const swordGroup = new THREE.Group();
      swordGroup.position.set(0, -0.4, 0.1);
      swordGroup.rotation.x = -Math.PI / 3;

      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 0.05), matSwordHandle);
      handle.position.y = -0.05;
      swordGroup.add(handle);

      const guard = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.05), matGuard);
      guard.position.y = 0.03;
      swordGroup.add(guard);

      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.03), matSwordBlade);
      blade.position.y = 0.25;
      swordGroup.add(blade);

      mesh.armR.add(swordGroup);
    } else if (blockId === BLOCKS.AXE) {
      const axeGroup = new THREE.Group();
      axeGroup.position.set(0, -0.4, 0.1);
      axeGroup.rotation.x = -Math.PI / 3;

      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.04), new THREE.MeshLambertMaterial({ color: 0x795548 }));
      handle.position.y = 0.05;
      axeGroup.add(handle);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.06), new THREE.MeshLambertMaterial({ color: 0x90a4ae }));
      head.position.set(0.04, 0.2, 0);
      axeGroup.add(head);

      mesh.armR.add(axeGroup);
    } else if (blockId === BLOCKS.BOW) {
      const bowGroup = new THREE.Group();
      bowGroup.position.set(0, -0.35, 0.08);
      bowGroup.rotation.x = -Math.PI / 3;
      bowGroup.rotation.y = 0.2;

      const bowMat = new THREE.MeshLambertMaterial({ color: 0x8d6e63 });
      const stringMat = new THREE.MeshBasicMaterial({ color: 0xdddddd });

      const center = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.04), bowMat);
      
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.04), bowMat);
      upper.position.set(-0.03, 0.15, 0.04);
      upper.rotation.z = 0.2;
      center.add(upper);

      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.04), bowMat);
      lower.position.set(-0.03, -0.15, 0.04);
      lower.rotation.z = -0.2;
      center.add(lower);

      const string = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.48, 0.006), stringMat);
      string.position.set(-0.07, 0, 0);
      center.add(string);

      bowGroup.add(center);
      mesh.armR.add(bowGroup);
    } else if (blockId === BLOCKS.AVTOMAT) {
      const avtomatGroup = new THREE.Group();
      avtomatGroup.position.set(0, -0.4, 0.12);
      avtomatGroup.rotation.x = -Math.PI / 3;

      const metalMat = new THREE.MeshLambertMaterial({ color: 0x37474f, roughness: 0.5, metalness: 0.8 });
      const woodMat = new THREE.MeshLambertMaterial({ color: 0x8d6e63, roughness: 0.7 });

      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.18), woodMat);
      stock.position.set(-0.02, -0.02, 0.08);
      avtomatGroup.add(stock);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.32), metalMat);
      body.position.set(0, 0, -0.08);
      avtomatGroup.add(body);

      const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.22), metalMat);
      barrel.position.set(0, 0.01, -0.28);
      avtomatGroup.add(barrel);

      const mag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.06), metalMat);
      mag.position.set(0, -0.1, -0.1);
      mag.rotation.x = -0.2;
      avtomatGroup.add(mag);

      mesh.armR.add(avtomatGroup);
    } else if (blockId === BLOCKS.TORCH) {
      const torchGroup = new THREE.Group();
      torchGroup.position.set(0, -0.38, 0.1);
      torchGroup.rotation.x = -Math.PI / 3;

      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.25, 0.05), new THREE.MeshLambertMaterial({ color: 0x795548 }));
      const flame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.06), new THREE.MeshBasicMaterial({ color: 0xff5722 }));
      flame.position.y = 0.15;
      torchGroup.add(handle, flame);

      mesh.armR.add(torchGroup);
    } else if (blockId === BLOCKS.BUCKET || blockId === BLOCKS.WATER_BUCKET) {
      const bucketGroup = new THREE.Group();
      bucketGroup.position.set(0, -0.4, 0.1);
      bucketGroup.rotation.x = -Math.PI / 3;
      bucketGroup.scale.set(1.2, 1.2, 1.2); // scale it up slightly

      const metalMat = new THREE.MeshLambertMaterial({ color: 0xb0bec5, roughness: 0.3, metalness: 0.8 });
      
      const bottom = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.12), metalMat);
      bottom.position.y = -0.07;
      
      const w1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.02), metalMat);
      w1.position.set(0, 0.02, 0.07);
      const w2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.02), metalMat);
      w2.position.set(0, 0.02, -0.07);
      const w3 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.12), metalMat);
      w3.position.set(0.07, 0.02, 0);
      const w4 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.12), metalMat);
      w4.position.set(-0.07, 0.02, 0);
      
      const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.02), metalMat);
      h1.position.set(0.07, 0.15, 0);
      const h2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.02), metalMat);
      h2.position.set(-0.07, 0.15, 0);
      const h3 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.02), metalMat);
      h3.position.set(0, 0.20, 0);
      
      bucketGroup.add(bottom, w1, w2, w3, w4, h1, h2, h3);

      if (blockId === BLOCKS.WATER_BUCKET) {
        const waterMat = new THREE.MeshLambertMaterial({ color: 0x1e88e5, roughness: 0.1, transparent: true, opacity: 0.8 });
        const water = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), waterMat);
        water.position.y = 0.02;
        bucketGroup.add(water);
      }
      mesh.armR.add(bucketGroup);
    } else {
      // Regular block
      const color = BLOCK_INFO[blockId]?.color || '#ffffff';
      const blockMat = new THREE.MeshLambertMaterial({ color: color });
      const blockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), blockMat);
      blockMesh.position.set(0, -0.45, 0.12);
      mesh.armR.add(blockMesh);
    }
  }

  function animateFirstPersonHand(delta) {
    if (!fpHandGroup) return;

    const isMoving = keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD'] || touchJoystick.active;
    const blockId = hotbarBlocks[activeSlotIndex];

    // Reset base pose
    fpHandGroup.position.set(0, 0, 0);
    fpHandGroup.rotation.set(0, 0, 0);

    // 1. Walk bobbing
    if (isMoving) {
      const bobTime = performance.now() * 0.008;
      fpHandGroup.position.y += Math.sin(bobTime * 2) * 0.012;
      fpHandGroup.position.x += Math.cos(bobTime) * 0.008;
      fpHandGroup.rotation.z += Math.cos(bobTime) * 0.02;
    }

    // 2. Active swing animation
    if (handSwingTime > 0) {
      handSwingTime -= delta;
      const pct = Math.max(0, handSwingTime / (blockId === BLOCKS.BOW ? 0.15 : 0.2));
      const swingAngle = Math.sin(pct * Math.PI) * 0.6;
      
      fpHandGroup.rotation.x = swingAngle;
      fpHandGroup.rotation.y = -swingAngle * 0.4;
      fpHandGroup.position.z += swingAngle * 0.08;
    } 
    // 3. Mining continuous oscillation
    else if (isMiningHeld) {
      const chipTime = performance.now() * 0.028;
      const chipAngle = Math.sin(chipTime) * 0.35 + 0.15;
      fpHandGroup.rotation.x = chipAngle;
      fpHandGroup.rotation.y = -chipAngle * 0.3;
    }
  }

  function damageAnimal(animal, amount) {
    if (!animal.health) animal.health = 3.0;
    animal.health -= 1.0;
    soundEngine.playSFX('hit');

    // Make animal flee away from player
    const fleeDir = animal.position.clone().sub(playerPos).normalize();
    fleeDir.y = 0;
    if (fleeDir.lengthSq() === 0) {
      fleeDir.set(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    }
    animal.fleeingDir = fleeDir;
    animal.isFleeing = true; // Constantly flee!
    animal.fleeingTimer = 0; // Disable standard timer

    // Red flash effect
    const originalColors = [];
    animal.traverse(child => {
      if (child.isMesh && child.material) {
        originalColors.push({ mesh: child, mat: child.material });
        child.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      }
    });

    setTimeout(() => {
      originalColors.forEach(item => {
        if (item.mesh && item.mesh.parent) {
          item.mesh.material = item.mat;
        }
      });
    }, 120);

    if (animal.health <= 0) {
      soundEngine.playSFX('kill');
      updateMissionProgress('hunt_or_eat', 1);
      // Spin and scale down death animation
      let deathTimer = 0;
      function deathAnimate() {
        if (deathTimer < 0.25) {
          deathTimer += 0.016;
          animal.rotation.y += 0.5;
          animal.scale.multiplyScalar(0.85);
          requestAnimationFrame(deathAnimate);
        } else {
          // Spawn meat collectible!
          spawnMeatCollectible(animal.position.x, animal.position.y + 0.3, animal.position.z, animal.animalName);

          // Sheep ALSO drops wool!
          if (animal.animalName === "Qo'y") {
            spawnWoolCollectible(animal.position.x + (Math.random() - 0.5) * 0.4, animal.position.y + 0.3, animal.position.z + (Math.random() - 0.5) * 0.4);
          }

          scene.remove(animal);
          const aIdx = animals.indexOf(animal);
          if (aIdx >= 0) animals.splice(aIdx, 1);
          const nIdx = npcs.indexOf(animal);
          if (nIdx >= 0) npcs.splice(nIdx, 1);
        }
      }
      deathAnimate();
    }
  }

  function performSwordAttack() {
    handSwingTime = 0.2;
    soundEngine.playSFX('swing');

    const playerDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const attackRange = 3.5;

    for (let i = animals.length - 1; i >= 0; i--) {
      const animal = animals[i];
      const dist = playerPos.distanceTo(animal.position);
      if (dist <= attackRange) {
        const dirToAnimal = animal.position.clone().sub(playerPos).normalize();
        const dot = dirToAnimal.dot(playerDir);
        if (dot > 0.45) {
          damageAnimal(animal, 1.5);
          break;
        }
      }
    }
  }

  function performBowShoot() {
    handSwingTime = 0.15;
    soundEngine.playSFX('shoot');

    const arrowGeom = new THREE.BoxGeometry(0.04, 0.04, 0.35);
    const arrowMat = new THREE.MeshLambertMaterial({ color: 0x8d6e63 });
    const arrowMesh = new THREE.Mesh(arrowGeom, arrowMat);

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

    arrowMesh.position.copy(playerPos);
    arrowMesh.position.y += 1.45; // Camera height
    arrowMesh.position.addScaledVector(dir, 0.5);

    arrowMesh.lookAt(arrowMesh.position.clone().add(dir));
    scene.add(arrowMesh);

    activeArrows.push({
      mesh: arrowMesh,
      velocity: dir.clone().multiplyScalar(40.0),
      time: 0
    });
  }

  function reloadAvtomat() {
    if (isReloading) return;
    isReloading = true;
    renderHotbar();
    showToast("Avtomat o'qlanmoqda...");
    
    soundEngine.playSFX('swing');
    setTimeout(() => { soundEngine.playSFX('place'); }, 500);
    setTimeout(() => { soundEngine.playSFX('famous'); }, 1000);

    setTimeout(() => {
      avtomatAmmo = 30;
      isReloading = false;
      showToast("O'qlandi!");
      renderHotbar();
    }, 1500);
  }

  function performAvtomatShoot() {
    if (isReloading) return;
    if (avtomatAmmo <= 0) {
      reloadAvtomat();
      return;
    }

    avtomatAmmo--;
    renderHotbar();

    handSwingTime = 0.08;
    soundEngine.playSFX('shoot');

    const bulletGeom = new THREE.BoxGeometry(0.03, 0.03, 0.15);
    const bulletMat = new THREE.MeshBasicMaterial({ color: 0xffeb3b });
    const bulletMesh = new THREE.Mesh(bulletGeom, bulletMat);

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    
    dir.x += (Math.random() - 0.5) * 0.015;
    dir.y += (Math.random() - 0.5) * 0.015;
    dir.z += (Math.random() - 0.5) * 0.015;
    dir.normalize();

    bulletMesh.position.copy(playerPos);
    bulletMesh.position.y += 1.45;
    bulletMesh.position.addScaledVector(dir, 0.5);

    bulletMesh.lookAt(bulletMesh.position.clone().add(dir));
    scene.add(bulletMesh);

    activeBullets.push({
      mesh: bulletMesh,
      velocity: dir.clone().multiplyScalar(75.0),
      time: 0
    });

    if (avtomatAmmo === 0) {
      reloadAvtomat();
    }
  }

  function throwTorch() {
    handSwingTime = 0.2;
    soundEngine.playSFX('shoot');

    const torchGroup = new THREE.Group();
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), new THREE.MeshLambertMaterial({ color: 0x795548 }));
    handle.position.y = -0.15;
    const flame = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.1), new THREE.MeshBasicMaterial({ color: 0xff3d00 }));
    flame.position.y = 0.08;
    torchGroup.add(handle, flame);

    const torchLight = new THREE.PointLight(0xff5722, 1.5, 8);
    torchLight.position.set(0, 0.08, 0);
    torchGroup.add(torchLight);

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

    torchGroup.position.copy(playerPos);
    torchGroup.position.y += 1.45;
    torchGroup.position.addScaledVector(dir, 0.5);

    scene.add(torchGroup);

    activeTorches.push({
      mesh: torchGroup,
      velocity: dir.clone().multiplyScalar(22.0),
      time: 0
    });
  }

  function performBucketAction() {
    const blockId = hotbarBlocks[activeSlotIndex];
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = raycaster.intersectObjects(scene.children.filter(c => c.isVoxelMesh || c.isFurnitureMesh), true);
    
    if (hits.length > 0 && hits[0].distance < 6.0) {
      const hit = hits[0];
      
      let hitCoord = null;
      let obj = hit.object;
      while (obj && obj !== scene) {
        if (obj.isFurnitureMesh && obj.blockCoord) {
          hitCoord = obj.blockCoord;
          break;
        }
        obj = obj.parent;
      }
      
      if (!hitCoord) {
        const p = hit.point.clone().sub(hit.face.normal.clone().multiplyScalar(0.01));
        hitCoord = `${Math.round(p.x)},${Math.round(p.y)},${Math.round(p.z)}`;
      }
      
      const [hx, hy, hz] = hitCoord.split(',').map(Number);
      const clickedBlock = worldData[hitCoord];

      if (blockId === BLOCKS.BUCKET) {
        if (clickedBlock === BLOCKS.WATER) {
          removePointLightAtKey(hitCoord);
          worldData[hitCoord] = BLOCKS.AIR;
          modifiedBlocks[hitCoord] = BLOCKS.AIR;
          rebuildWorldMesh();
          
          hotbarBlocks[activeSlotIndex] = BLOCKS.WATER_BUCKET;
          renderHotbar();
          soundEngine.playSFX('swing');
          showToast("Suv yig'ildi!");
        } else {
          showToast("Faqat suv yig'ish mumkin!");
        }
      } else if (blockId === BLOCKS.WATER_BUCKET) {
        if (clickedBlock === BLOCKS.GRASS || clickedBlock === BLOCKS.DIRT || clickedBlock === BLOCKS.SAND) {
          const bx = hx, by = hy + 1, bz = hz;
          
          const treeH = 4 + Math.floor(Math.random() * 2);
          for (let h = 0; h < treeH; h++) {
            const wKey = `${bx},${by + h},${bz}`;
            worldData[wKey] = BLOCKS.WOOD;
            modifiedBlocks[wKey] = BLOCKS.WOOD;
          }
          for (let dx = -2; dx <= 2; dx++) {
            for (let dz = -2; dz <= 2; dz++) {
              for (let dy = -1; dy <= 2; dy++) {
                if (Math.abs(dx) + Math.abs(dz) <= 3) {
                  const lKey = `${bx + dx},${by + treeH + dy},${bz + dz}`;
                  if (!worldData[lKey] || worldData[lKey] === BLOCKS.AIR) {
                    worldData[lKey] = BLOCKS.LEAVES;
                    modifiedBlocks[lKey] = BLOCKS.LEAVES;
                  }
                }
              }
            }
          }
          rebuildWorldMesh();
          soundEngine.playSFX('place');
          
          hotbarBlocks[activeSlotIndex] = BLOCKS.BUCKET;
          renderHotbar();
          showToast("Daraxt ekildi!");
        } else {
          showToast("Daraxt ekish uchun o't yoki tuproqni bosing!");
        }
      }
    }
  }

  // --- UI HOVER TOOLTIPS & ACTION BAR POPUPS ---
  let hotbarPopupTimeout = null;
  let lastActiveSlot = -1;

  function showHotbarItemNamePopup(nameStr) {
    const el = document.getElementById('hotbar-item-popup');
    const textEl = document.getElementById('hotbar-item-popup-text');
    if (!el || !textEl || !nameStr) return;
    
    textEl.textContent = nameStr;
    el.classList.remove('hidden');
    
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
    
    if (hotbarPopupTimeout) clearTimeout(hotbarPopupTimeout);
    hotbarPopupTimeout = setTimeout(() => {
      el.classList.add('hidden');
    }, 1800);
  }

  function showMinecraftTooltip(e, title, subText) {
    const tt = document.getElementById('minecraft-tooltip');
    const titleEl = document.getElementById('mc-tooltip-title');
    const subEl = document.getElementById('mc-tooltip-sub');
    if (!tt || !titleEl) return;

    titleEl.textContent = title;
    if (subEl) subEl.textContent = subText || '';
    
    tt.style.left = `${e.clientX}px`;
    tt.style.top = `${e.clientY}px`;
    tt.classList.remove('hidden');
  }

  function moveMinecraftTooltip(e) {
    const tt = document.getElementById('minecraft-tooltip');
    if (!tt || tt.classList.contains('hidden')) return;
    tt.style.left = `${e.clientX}px`;
    tt.style.top = `${e.clientY}px`;
  }

  function hideMinecraftTooltip() {
    const tt = document.getElementById('minecraft-tooltip');
    if (tt) tt.classList.add('hidden');
  }

  function renderHotbar() {
    const el = document.getElementById('hotbar');
    if (el) {
      el.innerHTML = '';
      hotbarBlocks.forEach((bId, idx) => {
        const slot = document.createElement('div');
        slot.className = `hotbar-slot ${idx === activeSlotIndex ? 'active' : ''}`;
        
        let ammoHtml = '';
        if (bId === BLOCKS.AVTOMAT) {
          ammoHtml = `<div class="ammo-indicator" style="position: absolute; bottom: 2px; right: 4px; font-size: 10px; font-family: monospace; font-weight: bold; color: #ffeb3b; background: rgba(0,0,0,0.6); padding: 1px 3px; border-radius: 3px; z-index: 10;">${isReloading ? 'RELOAD' : avtomatAmmo}</div>`;
        }
        
        let countHtml = '';
        const bInfo = BLOCK_INFO[bId];
        if (bInfo && !bInfo.isWeapon) {
          const count = meatInventory[bInfo.name] || 0;
          countHtml = `<div class="block-count-indicator">${count}</div>`;
        }
        
        slot.innerHTML = `<span class="hotbar-slot-num">${idx + 1}</span><div class="hotbar-icon" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; padding:4px;">${getItemIconHTML(bId)}</div>${ammoHtml}${countHtml}`;
        
        slot.addEventListener('click', () => { activeSlotIndex = idx; renderHotbar(); });
        
        slot.addEventListener('mouseenter', (e) => {
          if (bInfo) {
            const typeStr = bInfo.isWeapon ? 'Qurol / Asbob' : (bInfo.isFurniture ? 'Anjom' : 'Blok');
            const countStr = bInfo.isWeapon ? '' : ` • Soni: ${meatInventory[bInfo.name] || 0}`;
            showMinecraftTooltip(e, bInfo.name, `${typeStr}${countStr}`);
          }
        });
        slot.addEventListener('mousemove', moveMinecraftTooltip);
        slot.addEventListener('mouseleave', hideMinecraftTooltip);

        el.appendChild(slot);
      });
    }

    const invEl = document.getElementById('inventory-hotbar');
    if (invEl) {
      invEl.innerHTML = '';
      hotbarBlocks.forEach((bId, idx) => {
        const slot = document.createElement('div');
        slot.className = `hotbar-slot ${idx === activeSlotIndex ? 'active' : ''}`;
        slot.style.width = '48px';
        slot.style.height = '48px';
        slot.style.cursor = 'pointer';
        
        let ammoHtml = '';
        if (bId === BLOCKS.AVTOMAT) {
          ammoHtml = `<div class="ammo-indicator" style="position: absolute; bottom: 2px; right: 4px; font-size: 9px; font-family: monospace; font-weight: bold; color: #ffeb3b; background: rgba(0,0,0,0.6); padding: 1px 2px; border-radius: 2px; z-index: 10;">${isReloading ? 'RELOAD' : avtomatAmmo}</div>`;
        }
        
        let countHtml = '';
        const bInfo = BLOCK_INFO[bId];
        if (bInfo && !bInfo.isWeapon) {
          const count = meatInventory[bInfo.name] || 0;
          countHtml = `<div class="block-count-indicator" style="font-size: 8px;">${count}</div>`;
        }
        
        slot.innerHTML = `<span class="hotbar-slot-num">${idx + 1}</span><div class="hotbar-icon" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; padding:4px;">${getItemIconHTML(bId)}</div>${ammoHtml}${countHtml}`;
        
        slot.addEventListener('click', () => { 
          activeSlotIndex = idx; 
          renderHotbar(); 
        });

        slot.addEventListener('mouseenter', (e) => {
          if (bInfo) {
            const typeStr = bInfo.isWeapon ? 'Qurol / Asbob' : (bInfo.isFurniture ? 'Anjom' : 'Blok');
            const countStr = bInfo.isWeapon ? '' : ` • Soni: ${meatInventory[bInfo.name] || 0}`;
            showMinecraftTooltip(e, bInfo.name, `${typeStr}${countStr}`);
          }
        });
        slot.addEventListener('mousemove', moveMinecraftTooltip);
        slot.addEventListener('mouseleave', hideMinecraftTooltip);

        invEl.appendChild(slot);
      });
    }

    if (lastActiveSlot !== activeSlotIndex) {
      lastActiveSlot = activeSlotIndex;
      const activeBlockId = hotbarBlocks[activeSlotIndex];
      const activeInfo = BLOCK_INFO[activeBlockId];
      if (activeInfo) {
        const countStr = !activeInfo.isWeapon ? ` (x${meatInventory[activeInfo.name] || 0})` : '';
        showHotbarItemNamePopup(`${activeInfo.name}${countStr}`);
      }
    }

    updateFirstPersonHandMesh();
    if (playerMesh) {
      updateThirdPersonHeldItem(playerMesh, hotbarBlocks[activeSlotIndex]);
    }
  }

  function renderInventoryGrid() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (currentInventoryTab === 'food') {
      const foodItemsList = [
        { id: BLOCKS.APPLE, name: "Olma" },
        { id: BLOCKS.BREAD, name: "Non" },
        { id: BLOCKS.COOKED_MEAT, name: "Qovurilgan go'sht" },
        { id: BLOCKS.MEAT_MUTTON, name: "Qo'y go'shti" },
        { name: "Mol go'shti", color: "#d32f2f" },
        { name: "Tulki go'shti", color: "#f57c00" },
        { name: "Bo'ri go'shti", color: "#757575" },
        { name: "Burgut go'shti", color: "#8d6e63" },
        { name: "Tuya go'shti", color: "#fbc02d" },
        { name: "Ot go'shti (Qazi)", color: "#5d4037" },
        { name: "Eshak go'shti", color: "#78909c" },
        { name: "Tovuq go'shti", color: "#fff59d" },
        { name: "Qoplon go'shti", color: "#afb42b" },
        { name: "Jun (Yung)", color: "#ffffff" }
      ];

      foodItemsList.forEach(itemInfo => {
        const bId = itemInfo.id;
        const itemName = itemInfo.name;
        const count = meatInventory[itemName] || 0;
        
        const item = document.createElement('div');
        item.className = 'inv-slot-item';
        item.style.position = 'relative';
        
        if (count === 0) item.style.opacity = '0.5';
        
        const countHtml = `<div class="block-count-indicator">${count}</div>`;
        const iconHtml = bId !== undefined ? getItemIconHTML(bId) : getMeatIconHTML(itemInfo.color || '#e57373', itemName);

        item.innerHTML = `<div class="block-icon-box" style="width:48px; height:48px; display:flex; align-items:center; justify-content:center; padding:4px;">${iconHtml}</div><span class="block-slot-name">${itemName}</span>${countHtml}`;

        item.addEventListener('click', () => {
          const targetId = bId !== undefined ? bId : BLOCKS.MEAT_MUTTON;
          const existingIdx = hotbarBlocks.indexOf(targetId);
          if (existingIdx !== -1) {
            const temp = hotbarBlocks[activeSlotIndex];
            hotbarBlocks[activeSlotIndex] = targetId;
            hotbarBlocks[existingIdx] = temp;
            showToast(`Slot ${activeSlotIndex + 1} va Slot ${existingIdx + 1} o'rni almashdi!`);
          } else {
            hotbarBlocks[activeSlotIndex] = targetId;
            showToast(`Slot ${activeSlotIndex + 1}: "${itemName}"`);
          }
          renderHotbar();
        });

        item.addEventListener('mouseenter', (e) => {
          showMinecraftTooltip(e, itemName, `Oziq-ovqat • Soni: ${count}`);
        });
        item.addEventListener('mousemove', moveMinecraftTooltip);
        item.addEventListener('mouseleave', hideMinecraftTooltip);

        grid.appendChild(item);
      });
      return;
    }

    let items = [];
    if (currentInventoryTab === 'weapons') {
      items = [BLOCKS.SWORD, BLOCKS.BOW, BLOCKS.AXE, BLOCKS.PICKAXE, BLOCKS.SHOVEL, BLOCKS.HOE, BLOCKS.BOMB, BLOCKS.AVTOMAT];
    } else if (currentInventoryTab === 'furniture') {
      items = [BLOCKS.CRAFTING_TABLE, BLOCKS.FURNACE, BLOCKS.CHEST, BLOCKS.PUMPKIN, BLOCKS.LANTERN, BLOCKS.TORCH, BLOCKS.SOFA, BLOCKS.TABLE, BLOCKS.CHAIR, BLOCKS.FLOWER, BLOCKS.BUCKET];
    } else {
      items = [
        BLOCKS.DIAMOND, BLOCKS.GOLD, BLOCKS.IRON, BLOCKS.COPPER, BLOCKS.OBSIDIAN, BLOCKS.GLOWSTONE, BLOCKS.HAY_BALE, BLOCKS.MOSSY_STONE,
        BLOCKS.BLUE_TILE, BLOCKS.WHITE_MARBLE, BLOCKS.GLAZED_BLUE, BLOCKS.RED_BRICK, BLOCKS.DARK_STONE, BLOCKS.TERRACOTTA,
        BLOCKS.GLASS, BLOCKS.WATER, BLOCKS.GRASS, BLOCKS.DIRT, BLOCKS.STONE, BLOCKS.SAND, BLOCKS.SNOW, BLOCKS.WOOD,
        BLOCKS.LEAVES, BLOCKS.PLANKS, BLOCKS.CACTUS, BLOCKS.COAL
      ];
    }

    items.forEach(bId => {
      const bInfo = BLOCK_INFO[bId];
      if (bInfo === undefined) return;
      
      const count = bInfo.isWeapon ? 1 : (meatInventory[bInfo.name] || 0);
      
      const item = document.createElement('div');
      item.className = 'inv-slot-item';
      item.style.position = 'relative';
      
      if (!bInfo.isWeapon && count === 0) {
        item.style.opacity = '0.5';
      }
      
      let countHtml = '';
      if (!bInfo.isWeapon) {
        countHtml = `<div class="block-count-indicator">${count}</div>`;
      }
      
      item.innerHTML = `<div class="block-icon-box" style="width:48px; height:48px; display:flex; align-items:center; justify-content:center; padding:4px;">${getItemIconHTML(bId)}</div><span class="block-slot-name">${bInfo.name}</span>${countHtml}`;
      
      item.addEventListener('click', () => {
        const existingIdx = hotbarBlocks.indexOf(bId);
        if (existingIdx !== -1) {
          const temp = hotbarBlocks[activeSlotIndex];
          hotbarBlocks[activeSlotIndex] = bId;
          hotbarBlocks[existingIdx] = temp;
          showToast(`Slot ${activeSlotIndex + 1} va Slot ${existingIdx + 1} o'rni almashdi!`);
        } else {
          hotbarBlocks[activeSlotIndex] = bId;
          showToast(`Slot ${activeSlotIndex + 1}: "${bInfo.name}"`);
        }
        renderHotbar();
      });

      item.addEventListener('mouseenter', (e) => {
        const typeStr = bInfo.isWeapon ? 'Qurol / Asbob' : (bInfo.isFurniture ? 'Anjom' : 'Blok');
        const countStr = bInfo.isWeapon ? '' : ` • Soni: ${count}`;
        showMinecraftTooltip(e, bInfo.name, `${typeStr}${countStr}`);
      });
      item.addEventListener('mousemove', moveMinecraftTooltip);
      item.addEventListener('mouseleave', hideMinecraftTooltip);

      grid.appendChild(item);
    });
  }

  function performFurnitureInteraction(f) {
    if (!f) return;
    if (f.type === BLOCKS.SOFA) {
      health = MAX_HEALTH;
      updateHealthUI();
      const isNight = dayTime > 0.55 || dayTime < 0.20;
      if (isNight) {
        showToast("Uxlashga yotdingiz...");
        
        const fade = document.createElement('div');
        fade.style.position = 'fixed';
        fade.style.top = '0'; fade.style.left = '0';
        fade.style.width = '100vw'; fade.style.height = '100vh';
        fade.style.background = '#000';
        fade.style.zIndex = '9999';
        fade.style.opacity = '0';
        fade.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(fade);
        
        setTimeout(() => { fade.style.opacity = '1'; }, 10);
        
        setTimeout(() => {
          dayTime = 0.23; // morning time
          playerPos.set(f.x, f.y + 0.6, f.z);
          soundEngine.playSFX('famous');
          showToast("Xayrli tong! Salomatligingiz to'liq tiklandi!");
          setTimeout(() => {
            fade.style.opacity = '0';
            setTimeout(() => { document.body.removeChild(fade); }, 300);
          }, 300);
        }, 500);
      } else {
        showToast("Divanda dam oldingiz va salomatligingiz tiklandi!");
      }
    } else if (f.type === BLOCKS.DOOR) {
      const key = `${f.x},${f.y},${f.z}`;
      const currentBlock = worldData[key];
      if (currentBlock === BLOCKS.DOOR) {
        worldData[key] = BLOCKS.AIR;
        modifiedBlocks[key] = BLOCKS.AIR;
        soundEngine.playSFX('place');
        showToast("Eshik ochildi!");
      } else {
        worldData[key] = BLOCKS.DOOR;
        modifiedBlocks[key] = BLOCKS.DOOR;
        soundEngine.playSFX('place');
        showToast("Eshik yopildi!");
      }
      rebuildWorldMesh();
    } else if (f.type === BLOCKS.WINDOW) {
      showToast("Derazadan manzaraga qaradingiz!");
    } else if (f.type === BLOCKS.CHAIR || f.type === BLOCKS.TABLE) {
      isSitting = true;
      let seatOffset = 0.38;
      if (f.type === BLOCKS.TABLE) seatOffset = 0.95;
      sittingOnCoords = new THREE.Vector3(f.x, f.y + seatOffset, f.z);
      showToast("O'tirdingiz. Turish uchun harakatlaning.");
    }
  }

  // ==========================================================================
  // EVENTS
  // ==========================================================================

  function setupEvents() {
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    window.addEventListener('keydown', e => {
      keys[e.code] = true;
      if (e.code.startsWith('Digit')) {
        const n = parseInt(e.code.replace('Digit', '')) - 1;
        if (n >= 0 && n < 9) { activeSlotIndex = n; renderHotbar(); }
      }
      if (e.code === 'KeyV') { isThirdPerson = !isThirdPerson; showToast(isThirdPerson ? "3-shaxs" : "1-shaxs"); }
      if (e.code === 'KeyE') {
        const invModal = document.getElementById('inventory-modal');
        if (invModal) {
          invModal.classList.toggle('hidden');
          if (!invModal.classList.contains('hidden')) {
            renderInventoryGrid();
            renderHotbar();
            if (document.pointerLockElement) document.exitPointerLock();
          } else {
            const container = document.getElementById('canvas-container');
            if (container) setTimeout(() => { container.requestPointerLock(); }, 50);
          }
        }
      }
      if (e.code === 'KeyM') {
        const hud = document.getElementById('hud');
        if (hud && !hud.classList.contains('hidden')) {
          currentWorldMeta = { id: 'world_' + Date.now(), name: 'Topshiriqlar', seed: "Uzbekistan2026", map: 'quest_island' };
          modifiedBlocks = {};
          generateWorld("Uzbekistan2026", 'quest_island');
          const hudBiome = document.getElementById('hud-biome');
          if (hudBiome) hudBiome.textContent = getMapDisplayName('quest_island');
          showToast("Topshiriqlar kartasi yuklandi!");
        }
      }
      if (e.code === 'Escape') document.getElementById('pause-modal').classList.toggle('hidden');
      if (e.code === 'KeyF') { dayTime = (dayTime + 0.25) % 1; showToast("Vaqt o'tkazildi"); }
      if (e.code === 'KeyR') {
        if (targetedHorse) {
          isRidingHorse = true;
          mountedHorse = targetedHorse;
          showToast(`${mountedHorse.animalName === 'Ot' ? 'Ot' : 'Tuya'}ga mindingiz! (Tushish uchun Shift tugmasini bosing)`);
        } else if (targetedFurniture) {
          performFurnitureInteraction(targetedFurniture);
        }
      }
    });
    window.addEventListener('keyup', e => keys[e.code] = false);
    window.addEventListener('mousedown', e => {
      if (e.target.closest('#ui-layer') && !e.target.closest('#canvas-container')) return;
      if (document.getElementById('hud').classList.contains('hidden')) return;
      if (e.button === 0) {
        isMouseDown = true;
        const blockId = hotbarBlocks[activeSlotIndex];
        if (blockId === BLOCKS.SWORD) {
          performSwordAttack();
        } else if (blockId === BLOCKS.BOW) {
          performBowShoot();
        } else if (blockId === BLOCKS.AVTOMAT) {
          performAvtomatShoot();
        } else if (blockId === BLOCKS.TORCH) {
          throwTorch();
        } else if (blockId === BLOCKS.BUCKET || blockId === BLOCKS.WATER_BUCKET) {
          performBucketAction();
        } else {
          startMining();
        }
      }
      else if (e.button === 2) {
        // Check Sofa sleep or sitting interaction
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const interactTargets = scene.children.filter(c => c.isVoxelMesh || c.isFurnitureMesh);
        const hits = raycaster.intersectObjects(interactTargets, true);
        
        let hitFurniture = null;
        if (hits.length > 0 && hits[0].distance < 4.0) {
          let obj = hits[0].object;
          while (obj && obj !== scene) {
            if (obj.isFurnitureMesh && obj.blockCoord) {
              const coord = obj.blockCoord;
              const [fx, fy, fz] = coord.split(',').map(Number);
              const bType = worldData[coord];
              if (bType === BLOCKS.SOFA || bType === BLOCKS.CHAIR || bType === BLOCKS.TABLE) {
                hitFurniture = { type: bType, x: fx, y: fy, z: fz };
              }
              break;
            }
            obj = obj.parent;
          }
        }
        
        if (hitFurniture) {
          if (hitFurniture.type === BLOCKS.SOFA && (dayTime > 0.55 || dayTime < 0.20)) {
            // Sleep on Sofa
            showToast("Uxlashga yotdingiz...");
            
            // Visual fade-to-black transition overlay
            const fade = document.createElement('div');
            fade.style.position = 'fixed';
            fade.style.top = '0'; fade.style.left = '0';
            fade.style.width = '100vw'; fade.style.height = '100vh';
            fade.style.background = '#000';
            fade.style.zIndex = '9999';
            fade.style.opacity = '0';
            fade.style.transition = 'opacity 0.3s ease';
            document.body.appendChild(fade);
            
            setTimeout(() => { fade.style.opacity = '1'; }, 10);
            
            setTimeout(() => {
              dayTime = 0.23; // morning time
              playerPos.set(hitFurniture.x, hitFurniture.y + 0.6, hitFurniture.z);
              soundEngine.playSFX('famous');
              showToast("Xayrli tong!");
              setTimeout(() => {
                fade.style.opacity = '0';
                setTimeout(() => { document.body.removeChild(fade); }, 300);
              }, 300);
            }, 500);
          } else {
            // Sit on Sofa, Chair, or Table
            isSitting = true;
            let seatOffset = 0.25;
            if (hitFurniture.type === BLOCKS.CHAIR) seatOffset = 0.38;
            else if (hitFurniture.type === BLOCKS.TABLE) seatOffset = 0.95;
            
            sittingOnCoords = new THREE.Vector3(hitFurniture.x, hitFurniture.y + seatOffset, hitFurniture.z);
            showToast(hitFurniture.type === BLOCKS.TABLE ? "Stol ustiga chiqdingiz" : "O'tirdingiz. Turish uchun harakatlaning.");
          }
        } else {
          placeBlock();
        }
      }
    });
    window.addEventListener('mouseup', e => { 
      if (e.button === 0) {
        isMouseDown = false;
        cancelMining(); 
      }
    });
    window.addEventListener('contextmenu', e => e.preventDefault());

    const container = document.getElementById('canvas-container');
    container.addEventListener('click', () => {
      if (!document.getElementById('hud').classList.contains('hidden') &&
          document.getElementById('pause-modal').classList.contains('hidden')) {
        container.requestPointerLock();
      }
    });
    document.addEventListener('pointerlockchange', () => isPointerLocked = (document.pointerLockElement === container));
    document.addEventListener('mousemove', e => {
      if (isPointerLocked) {
        const isCtrlHeld = keys['ControlLeft'] || keys['ControlRight'] || keys['Control'] || e.ctrlKey;
        if (isCtrlHeld) {
          orbitYaw -= e.movementX * 0.002;
          orbitPitch -= e.movementY * 0.002;
          orbitPitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, orbitPitch));
        } else {
          yaw -= e.movementX * 0.002;
          pitch -= e.movementY * 0.002;
          pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitch));
          orbitYaw = yaw;
          orbitPitch = pitch;
        }
      }
    });
    // Scroll wheel for hotbar and camera zoom
    window.addEventListener('wheel', e => {
      const isCtrlHeld = keys['ControlLeft'] || keys['ControlRight'] || keys['Control'] || e.ctrlKey;
      if (isCtrlHeld) {
        thirdPersonDistance = Math.max(2.0, Math.min(15.0, thirdPersonDistance + Math.sign(e.deltaY) * 0.5));
        e.preventDefault();
      } else {
        activeSlotIndex = (activeSlotIndex + Math.sign(e.deltaY) + 9) % 9;
        renderHotbar();
      }
    }, { passive: false });

    const actionBtn = document.getElementById('btn-hud-action');
    if (actionBtn) {
      const triggerAction = () => {
        if (isRidingHorse && mountedHorse) {
          const animalName = mountedHorse.animalName;
          isRidingHorse = false;
          mountedHorse = null;
          playerPos.y += 1.0;
          showToast(animalName === 'Ot' ? "Otdan tushdingiz" : (animalName === 'Tuya' ? "Tuyadan tushdingiz" : "Eshakdan tushdingiz"));
        } else if (targetedHorse) {
          isRidingHorse = true;
          mountedHorse = targetedHorse;
          let aLabel = mountedHorse.animalName === 'Ot' ? 'Ot' : (mountedHorse.animalName === 'Tuya' ? 'Tuya' : 'Eshak');
          showToast(`${aLabel}ga mindingiz!`);
        } else if (targetedFurniture) {
          performFurnitureInteraction(targetedFurniture);
        }
      };
      actionBtn.addEventListener('click', triggerAction);
      actionBtn.addEventListener('touchstart', e => {
        e.preventDefault();
        triggerAction();
      });
    }
  }

  function setupMobileControls() {
    const jZone = document.getElementById('joystick-zone');
    const jStick = document.getElementById('joystick-stick');
    if (!jZone) return;

    jZone.addEventListener('touchstart', e => {
      const t = e.touches[0], rect = jZone.getBoundingClientRect();
      touchJoystick.active = true;
      touchJoystick.startX = rect.left + rect.width / 2;
      touchJoystick.startY = rect.top + rect.height / 2;
    }, { passive: true });
    jZone.addEventListener('touchmove', e => {
      if (!touchJoystick.active) return;
      const t = e.touches[0];
      const dx = t.clientX - touchJoystick.startX, dy = t.clientY - touchJoystick.startY;
      const dist = Math.min(45, Math.hypot(dx, dy)), angle = Math.atan2(dy, dx);
      jStick.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
      touchJoystick.moveX = (Math.cos(angle) * dist) / 45;
      touchJoystick.moveY = (Math.sin(angle) * dist) / 45;
    }, { passive: true });
    jZone.addEventListener('touchend', () => {
      touchJoystick.active = false; touchJoystick.moveX = 0; touchJoystick.moveY = 0;
      jStick.style.transform = 'translate(0px, 0px)';
    });

    const lookZone = document.getElementById('touch-look-zone');
    lookZone.addEventListener('touchstart', e => {
      const t = e.touches[0]; touchLook.active = true;
      touchLook.lastX = t.clientX; touchLook.lastY = t.clientY;
    }, { passive: true });
    lookZone.addEventListener('touchmove', e => {
      if (!touchLook.active) return;
      const t = e.touches[0];
      yaw -= (t.clientX - touchLook.lastX) * 0.005;
      pitch -= (t.clientY - touchLook.lastY) * 0.005;
      pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitch));
      camera.rotation.set(pitch, yaw, 0, 'YXZ');
      touchLook.lastX = t.clientX; touchLook.lastY = t.clientY;
    }, { passive: true });
    lookZone.addEventListener('touchend', () => touchLook.active = false);

    document.getElementById('btn-touch-jump').addEventListener('touchstart', () => keys['JumpTouch'] = true);
    document.getElementById('btn-touch-jump').addEventListener('touchend', () => keys['JumpTouch'] = false);
    const btnBreak = document.getElementById('btn-touch-break');
    btnBreak.addEventListener('touchstart', e => {
      e.preventDefault();
      const blockId = hotbarBlocks[activeSlotIndex];
      if (blockId === BLOCKS.SWORD) {
        performSwordAttack();
      } else if (blockId === BLOCKS.BOW) {
        performBowShoot();
      } else {
        startMining();
      }
    });
    btnBreak.addEventListener('touchend', e => { e.preventDefault(); cancelMining(); });
    document.getElementById('btn-touch-place').addEventListener('click', placeBlock);
    document.getElementById('btn-touch-cam').addEventListener('click', () => {
      isThirdPerson = !isThirdPerson; showToast(isThirdPerson ? "3-shaxs" : "1-shaxs");
    });
    document.getElementById('btn-touch-inv').addEventListener('click', () => {
      const invModal = document.getElementById('inventory-modal');
      if (invModal) {
        invModal.classList.toggle('hidden');
        if (!invModal.classList.contains('hidden')) {
          renderInventoryGrid();
          renderHotbar();
          if (document.pointerLockElement) document.exitPointerLock();
        }
      }
    });
  }

  function showToast(text) {
    const el = document.getElementById('toast-single-box');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('hidden');
    if (singleToastTimer) clearTimeout(singleToastTimer);
    singleToastTimer = setTimeout(() => {
      el.classList.add('hidden');
    }, 2600);
  }

  function showKillFeed(killer, victim) {
    const container = document.getElementById('kill-feed-container');
    if (!container) return;
    const item = document.createElement('div');
    item.className = 'kill-feed-item';
    item.innerHTML = `<span style="color:#ef4444; font-weight:bold;">${killer}</span> <svg viewBox="0 0 24 24" width="12" height="12" stroke="#ef4444" stroke-width="2.5" fill="none" style="display:inline-block; vertical-align:middle; margin:0 4px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg> <span style="color:#38bdf8; font-weight:bold;">${victim}</span>`;
    container.appendChild(item);
    setTimeout(() => item.remove(), 4000);
  }

  // ==========================================================================
  // MAIN LOOP
  // ==========================================================================

  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(0.08, clock.getDelta());
    const hud = document.getElementById('hud');
    const pause = document.getElementById('pause-modal');
    const dialogue = document.getElementById('dialogue-modal');

    // Position floating bubble if activeNpc is set
    if (activeNpc) {
      const tempV = new THREE.Vector3();
      activeNpc.getWorldPosition(tempV);
      tempV.y += 2.0; // height offset above NPC
      tempV.project(camera);
      if (tempV.z > 1) {
        dialogue.style.display = 'none';
      } else {
        dialogue.style.display = 'block';
        const x = (tempV.x * 0.5 + 0.5) * window.innerWidth;
        const y = (tempV.y * -0.5 + 0.5) * window.innerHeight;
        dialogue.style.left = `${x}px`;
        dialogue.style.top = `${y}px`;
      }
    } else {
      dialogue.style.display = '';
    }

    if (hud && !hud.classList.contains('hidden') && 
        pause && pause.classList.contains('hidden') && 
        dialogue && dialogue.classList.contains('hidden')) {
      updatePlayer(delta);
      animateNPCs(delta);
      updateDayNightCycle(delta);
      animateFirstPersonHand(delta);
      updateMeatCollectibles(delta);
    }

    // Update active particles
    for (let i = activeParticles.length - 1; i >= 0; i--) {
      const p = activeParticles[i];
      p.mesh.position.addScaledVector(p.velocity, delta);
      p.velocity.y -= delta * 1.5;
      p.life -= delta;
      p.mesh.scale.multiplyScalar(0.96);
      p.mesh.material.opacity = Math.max(0, p.life / 1.5);
      if (p.life <= 0) {
        scene.remove(p.mesh);
        p.mesh.material.dispose();
        activeParticles.splice(i, 1);
      }
    }

    if (fpHandGroup) {
      const isCtrlHeld = keys['ControlLeft'] || keys['ControlRight'] || keys['Control'];
      const showingThirdPerson = isThirdPerson || isCtrlHeld;
      const isHudVisible = hud && !hud.classList.contains('hidden');
      fpHandGroup.visible = !showingThirdPerson && isHudVisible;
    }

    renderer.render(scene, camera);
    const fpsEl = document.getElementById('hud-fps');
    if (fpsEl && frameCount % 30 === 0) fpsEl.textContent = Math.round(1 / Math.max(0.001, delta));
    frameCount++;
  }

  // ==========================================================================
  // MEATS INVENTORY AND COLLECTIBLES HELPERS
  // ==========================================================================

  function spawnMeatCollectible(x, y, z, animalName) {
    const info = MEAT_TYPES[animalName] || { name: "Yovvoyi go'sht", color: '#e0e0e0', hexColor: 0xe0e0e0 };
    
    const group = new THREE.Group();
    group.isMeatCollectible = true;
    
    // Minecraft style steak body
    const meatGeom = new THREE.BoxGeometry(0.24, 0.14, 0.2);
    const meatMat = new THREE.MeshLambertMaterial({ color: info.hexColor });
    const meatMesh = new THREE.Mesh(meatGeom, meatMat);
    group.add(meatMesh);

    // Bone protrusion
    const boneGeom = new THREE.BoxGeometry(0.08, 0.08, 0.12);
    const boneMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const boneMesh = new THREE.Mesh(boneGeom, boneMat);
    boneMesh.position.set(0.12, 0, 0);
    group.add(boneMesh);
    
    group.position.set(x, y, z);
    scene.add(group);
    
    group.meatType = animalName;
    group.meatName = info.name;
    group.baseY = y;
    group.bobOffset = Math.random() * 10;
    
    meatCollectibles.push(group);
  }

  function updateMeatCollectibles(delta) {
    const pickupRange = 1.6;
    for (let i = meatCollectibles.length - 1; i >= 0; i--) {
      const c = meatCollectibles[i];
      c.rotation.y += 1.5 * delta;
      c.bobOffset += delta * 2.0;
      c.position.y = c.baseY + Math.sin(c.bobOffset) * 0.08;
      
      const dist = playerPos.distanceTo(c.position);
      if (dist <= pickupRange) {
        const mType = c.meatType;
        meatInventory[mType] = (meatInventory[mType] || 0) + 1;
        soundEngine.playSFX('pickup');
        showToast(`+1 ${c.meatName} olindi!`);
        
        scene.remove(c);
        meatCollectibles.splice(i, 1);
        
        updateMeatMenuUI();
        renderHotbar();
      }
    }
  }

  function getMeatIconHTML(colorStr, name) {
    if (name && name.includes("Jun")) {
      // Soft wool ball SVG
      return `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <!-- Wool fluffy outline -->
        <path d="M16 4 C11 4, 8 7, 8 11 C5 11, 3 14, 3 17 C3 21, 6 24, 10 24 C11 27, 14 28, 17 28 C22 28, 25 25, 25 21 C28 21, 29 18, 29 15 C29 10, 25 6, 20 6 C19 4, 17 4, 16 4 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <!-- Soft texture shadow lines -->
        <path d="M9 13 C11 11, 14 12, 14 14" fill="none" stroke="#e2e8f0" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M18 20 C19 18, 22 19, 22 21" fill="none" stroke="#e2e8f0" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12 22 C14 24, 16 23, 17 21" fill="none" stroke="#e2e8f0" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
    }
    return `<svg viewBox="0 0 32 32" width="100%" height="100%">
      <!-- Bone -->
      <path d="M6 26 L12 20 M5 25 C3 25, 3 22, 5 21 C6 21, 8 23, 7 25 M6 26 C6 28, 9 28, 10 27 C10 25, 8 24, 6 26" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
      <!-- Main Meat body -->
      <path d="M10 22 C14 18, 10 14, 18 10 C24 6, 28 8, 29 12 C30 16, 28 24, 22 27 C16 30, 8 26, 10 22 Z" fill="${colorStr}" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
      <!-- Fat/Texture details -->
      <path d="M18 13 C20 11, 22 12, 23 15 M15 18 C17 17, 19 19, 20 21" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    </svg>`;
  }

  function updateMeatMenuUI() {
    const grid = document.getElementById('meats-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    Object.keys(MEAT_TYPES).forEach(animal => {
      const info = MEAT_TYPES[animal];
      const count = meatInventory[animal] || 0;
      
      const card = document.createElement('div');
      card.className = 'meat-card';
      
      const iconBox = document.createElement('div');
      iconBox.className = 'meat-icon-box';
      iconBox.innerHTML = getMeatIconHTML(info.color, info.name);
      
      const name = document.createElement('div');
      name.className = 'meat-name';
      name.textContent = info.name;
      
      const countBadge = document.createElement('span');
      countBadge.className = 'meat-count' + (count === 0 ? ' empty' : '');
      countBadge.textContent = `${count} dona`;
      
      card.appendChild(iconBox);
      card.appendChild(name);
      card.appendChild(countBadge);
      
      grid.appendChild(card);
    });
  }

  // ==========================================================================
  // CRAFTING RECIPES AND LOGIC
  // ==========================================================================

  const CRAFTING_RECIPES = [
    // Weapons & Tools
    {
      result: BLOCKS.SWORD,
      name: "Olmos Qilich",
      ingredients: { "Olmos": 2, "Yog'och": 1 },
      yield: 1,
      description: "Hayvonlarni tezroq ovlash uchun o'tkir qurol."
    },
    {
      result: BLOCKS.AXE,
      name: "Temir Bolta",
      ingredients: { "Temir": 3, "Yog'och": 2 },
      yield: 1,
      description: "Daraxtlarni kesishni 3.5 barobar tezlashtiradigan anjom."
    },
    {
      result: BLOCKS.BOW,
      name: "Kamon",
      ingredients: { "Yog'och": 3, "Jun": 1 },
      yield: 1,
      description: "Uzoqdagi nishonlarni urish uchun yoy va o'q otish quroli."
    },
    {
      result: BLOCKS.BOMB,
      name: "Bomba",
      ingredients: { "Ko'mir": 2, "Temir": 1 },
      yield: 2,
      description: "Bloklarni portlatish uchun dinamit."
    },
    {
      result: BLOCKS.AVTOMAT,
      name: "Avtomat",
      ingredients: { "Temir": 5, "Ko'mir": 3 },
      yield: 1,
      description: "Olovli qurol (M klavishi orqali go'shtlarni ko'rish mumkin)."
    },
    {
      result: BLOCKS.BUCKET,
      name: "Chelak",
      ingredients: { "Temir": 3 },
      yield: 1,
      description: "Suv yoki boshqa narsalarni tashish uchun temir idish."
    },
    {
      result: BLOCKS.WATER_BUCKET,
      name: "Suvli chelak",
      ingredients: { "Chelak": 1, "Suv": 1 },
      yield: 1,
      description: "Dunyoda suv oqimini yaratish uchun ishlatiladi."
    },
    // Furniture & Decorative
    {
      result: BLOCKS.WINDOW,
      name: "Deraza (Oyna)",
      ingredients: { "Shisha": 2, "Yog'och": 1 },
      yield: 2,
      description: "Uylarga o'rnatiladigan chiroyli deraza oynasi."
    },
    {
      result: BLOCKS.DOOR,
      name: "Yog'och Eshik",
      ingredients: { "Taxta": 4 },
      yield: 1,
      description: "Uylarga kirib-chiqish uchun ochilib-yopiladigan yog'och eshik."
    },
    {
      result: BLOCKS.SOFA,
      name: "Divan (Sofa)",
      ingredients: { "Jun": 2, "Yog'och": 2 },
      yield: 1,
      description: "Qulay dam olish uchun jun va yog'ochdan yasalgan chiroyli divan."
    },
    {
      result: BLOCKS.CHAIR,
      name: "Stul",
      ingredients: { "Yog'och": 2 },
      yield: 1,
      description: "O'tirish uchun oddiy va qulay yog'och stul."
    },
    {
      result: BLOCKS.TABLE,
      name: "Stol",
      ingredients: { "Yog'och": 3 },
      yield: 1,
      description: "Ustiga chiqish yoki jihozlar qo'yish uchun stol."
    },
    {
      result: BLOCKS.TORCH,
      name: "Mashala (Torch)",
      ingredients: { "Yog'och": 1, "Ko'mir": 1 },
      yield: 4,
      description: "Atrofni yoritib turadigan yorug'lik manbai."
    },
    {
      result: BLOCKS.LANTERN,
      name: "Chiroq (Lantern)",
      ingredients: { "Temir": 2, "Ko'mir": 1 },
      yield: 1,
      description: "Uylar va yo'llarni bezab turuvchi neonli chiroq."
    },
    {
      result: BLOCKS.FLOWER,
      name: "Gul",
      ingredients: { "O't": 2 },
      yield: 1,
      description: "Chiroyli bezak guli."
    },
    // Blocks
    {
      result: BLOCKS.PLANKS,
      name: "Taxta (Planks)",
      ingredients: { "Yog'och": 1 },
      yield: 4,
      description: "Qurilish materiallari uchun ishlov berilgan taxta bloki."
    },
    {
      result: BLOCKS.GLASS,
      name: "Shisha (Glass)",
      ingredients: { "Qum": 1 },
      yield: 2,
      description: "Shaffof oyna bloki."
    },
    {
      result: BLOCKS.RED_BRICK,
      name: "G'isht (Brick)",
      ingredients: { "Tuproq": 2 },
      yield: 4,
      description: "Mustahkam qizil g'isht bloki."
    },
    {
      result: BLOCKS.WHITE_MARBLE,
      name: "Oq Mramor",
      ingredients: { "Tosh": 2 },
      yield: 4,
      description: "Chiroyli oq rangli mramor toshi."
    },
    {
      result: BLOCKS.BLUE_TILE,
      name: "Moviy Koshin",
      ingredients: { "Tosh": 2, "Olmos": 1 },
      yield: 8,
      description: "Samarqand obidalari uslubidagi moviy koshin."
    },
    {
      result: BLOCKS.GLAZED_BLUE,
      name: "Zangori Koshin",
      ingredients: { "Tosh": 2, "Mis": 1 },
      yield: 8,
      description: "Tarixiy obidalardagi zangori sirlangan koshin."
    },
    {
      result: BLOCKS.TERRACOTTA,
      name: "Terrakota",
      ingredients: { "Tuproq": 2 },
      yield: 4,
      description: "Pishirilgan loydan qilingan terrakota bloki."
    },
    {
      result: BLOCKS.GRASS,
      name: "O't",
      ingredients: { "Tuproq": 1, "Barg": 1 },
      yield: 2,
      description: "Yashil o't bloki."
    },
    {
      result: BLOCKS.SAND,
      name: "Qum",
      ingredients: { "Tosh": 1 },
      yield: 2,
      description: "Sariq sahro qumi bloki."
    },
    {
      result: BLOCKS.SNOW,
      name: "Qor",
      ingredients: { "Suv": 1 },
      yield: 4,
      description: "Yumshoq oq qor bloki."
    }
  ];

  let selectedRecipe = null;

  function updateCraftingUI() {
    const list = document.getElementById('crafting-guide-list');
    const selectInfo = document.getElementById('crafting-recipe-select-info');
    const craftBtn = document.getElementById('btn-craft-action');
    if (!list) return;
    
    list.innerHTML = '';
    
    CRAFTING_RECIPES.forEach((recipe) => {
      const li = document.createElement('li');
      li.style.background = 'rgba(255, 255, 255, 0.05)';
      li.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      li.style.borderRadius = '8px';
      li.style.padding = '8px';
      li.style.cursor = 'pointer';
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.transition = 'background 0.2s';
      
      if (selectedRecipe && selectedRecipe.result === recipe.result) {
        li.style.borderColor = '#fbbf24';
        li.style.background = 'rgba(251, 191, 36, 0.1)';
      }
      
      // Check if we can craft this recipe
      let canCraft = true;
      Object.keys(recipe.ingredients).forEach(ing => {
        if ((meatInventory[ing] || 0) < recipe.ingredients[ing]) {
          canCraft = false;
        }
      });
      
      const statusIndicator = canCraft ? '<span style="color:#10b981;">●</span>' : '<span style="color:#ef4444;">●</span>';
      
      li.innerHTML = `<span style="font-weight: 700; color: #fff;">${recipe.name}</span> <span style="font-size: 0.8rem; vertical-align:middle; margin-left:4px;">${statusIndicator}</span>`;
      
      li.addEventListener('click', () => {
        selectedRecipe = recipe;
        updateCraftingUI();
      });
      
      list.appendChild(li);
    });

    if (selectedRecipe) {
      let ingredientsHTML = '';
      let canCraft = true;
      
      Object.keys(selectedRecipe.ingredients).forEach(ing => {
        const required = selectedRecipe.ingredients[ing];
        const owned = meatInventory[ing] || 0;
        const color = owned >= required ? '#10b981' : '#ef4444';
        ingredientsHTML += `<div style="font-size: 0.85rem; color: ${color}; display: flex; justify-content: space-between; width: 100%; padding: 2px 0;">
          <span>${ing}:</span>
          <span><strong>${owned}/${required}</strong></span>
        </div>`;
        if (owned < required) canCraft = false;
      });
      
      selectInfo.innerHTML = `
        <div style="width: 42px; height: 42px; display:flex; align-items:center; justify-content:center; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 6px;">
          ${getItemIconHTML(selectedRecipe.result)}
        </div>
        <h4 style="margin: 0; font-size: 1rem; color: #fff; font-family: 'Outfit', sans-serif;">${selectedRecipe.name}</h4>
        <p style="font-size: 0.78rem; color: #94a3b8; margin: 4px 0 8px 0; text-align: center;">${selectedRecipe.description}</p>
        <div style="width: 100%; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 8px; display:flex; flex-direction:column; gap:2px; align-items:flex-start;">
          <span style="font-size: 0.8rem; color: #fbbf24; font-weight: bold; margin-bottom: 4px;">Zarur resurslar:</span>
          ${ingredientsHTML}
        </div>
      `;
      
      if (canCraft) {
        craftBtn.disabled = false;
        craftBtn.classList.remove('disabled');
        craftBtn.style.opacity = '1';
        craftBtn.style.pointerEvents = 'auto';
      } else {
        craftBtn.disabled = true;
        craftBtn.classList.add('disabled');
        craftBtn.style.opacity = '0.5';
        craftBtn.style.pointerEvents = 'none';
      }
    } else {
      selectInfo.innerHTML = `<p style="color: #94a3b8; font-size: 0.85rem; text-align:center;">Retseptlar kitobidan biror narsani tanlang.</p>`;
      craftBtn.disabled = true;
      craftBtn.classList.add('disabled');
      craftBtn.style.opacity = '0.5';
      craftBtn.style.pointerEvents = 'none';
    }
  }

  function performCraft() {
    if (!selectedRecipe) return;
    
    let canCraft = true;
    Object.keys(selectedRecipe.ingredients).forEach(ing => {
      if ((meatInventory[ing] || 0) < selectedRecipe.ingredients[ing]) {
        canCraft = false;
      }
    });
    
    if (!canCraft) {
      showToast("Xatolik: Resurslar yetarli emas!");
      return;
    }
    
    Object.keys(selectedRecipe.ingredients).forEach(ing => {
      meatInventory[ing] -= selectedRecipe.ingredients[ing];
    });
    
    const blockId = selectedRecipe.result;
    const countYield = selectedRecipe.yield || 1;
    const itemName = BLOCK_INFO[blockId].name;
    
    meatInventory[itemName] = (meatInventory[itemName] || 0) + countYield;
    
    const existingIdx = hotbarBlocks.indexOf(blockId);
    if (existingIdx === -1) {
      hotbarBlocks[activeSlotIndex] = blockId;
      showToast(`Muvaffaqiyatli yaratildi: +${countYield} "${itemName}" slotga joylandi!`);
    } else {
      showToast(`Muvaffaqiyatli yaratildi: +${countYield} "${itemName}"!`);
    }
    
    soundEngine.playSFX('place');
    renderHotbar();
    updateCraftingUI();
    saveGame();
  }

  // ==========================================================================
  // WOOL & GENERAL RESOURCE COLLECTIBLES SPAWNER
  // ==========================================================================

  function spawnWoolCollectible(x, y, z) {
    const group = new THREE.Group();
    group.isMeatCollectible = true; // Use meat collectible flag to inherit updates
    
    // Wool block model: fluffy and soft cube
    const woolGeom = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const woolMat = new THREE.MeshLambertMaterial({ color: 0xfafafa });
    const woolMesh = new THREE.Mesh(woolGeom, woolMat);
    group.add(woolMesh);
    
    group.position.set(x, y, z);
    scene.add(group);
    
    group.meatType = "Jun";
    group.meatName = "Jun (Yung)";
    group.baseY = y;
    group.bobOffset = Math.random() * 10;
    
    meatCollectibles.push(group);
  }

  function spawnResourceCollectible(x, y, z, type, name, colorHex) {
    const group = new THREE.Group();
    group.isMeatCollectible = true; // Use meat collectible flag to inherit updates
    
    // Cube block drop
    const geom = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const mat = new THREE.MeshLambertMaterial({ color: colorHex });
    const mesh = new THREE.Mesh(geom, mat);
    group.add(mesh);
    
    group.position.set(x, y, z);
    scene.add(group);
    
    group.meatType = type;
    group.meatName = name;
    group.baseY = y;
    group.bobOffset = Math.random() * 10;
    
    meatCollectibles.push(group);
  }

  // Mobile screen lock hook
  document.addEventListener('click', () => {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
  });

  window.addEventListener('DOMContentLoaded', init);

})();
