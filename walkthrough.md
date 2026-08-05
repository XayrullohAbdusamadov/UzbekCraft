# Walkthrough: UzbekCraft Enhancements

We have successfully completed two major updates to the UzbekCraft game:
1. **Removed all emojis (stickers)** from the website UI and javascript strings.
2. **Integrated a Dialogue and Quest System** featuring a custom storyline for **Mirzo Ulug'bek**.

---

## Part 1: Emoji & Sticker Removal

### 1. HTML Interface Changes
- **File modified:** [index.html](file:///c:/Users/Web/Desktop/HayrullohAbdusamadov%20ning%20Shaxsiy%20saytlari/UzbekCraft/index.html)
- Removed all decorative emojis from the main menu buttons, modal titles, select dropdowns, and button labels.
- Replaced the skin select emojis (`👑`, `📜`, `🔭`, `🌿`, `🛡️`, `👕`) with clean text initials for historical figures:
  - Amir Temur -> **AT**
  - Alisher Navoiy -> **AN**
  - Mirzo Ulug'bek -> **MU**
  - Ibn Sino -> **IS**
  - Alpomish -> **A**
  - Steve -> **ST**
- Cleaned the HUD and mobile controls:
  - Replaced `⏸️` pause emoji with a standard media-style double line `||` text.
  - Removed direction emoji from compass (`🧭`) and time indicator (`☀️`).
  - Removed touch button emojis (`⬆️`, `➕`, `🔨`, `🎥`, `🎒`).

### 2. JavaScript Engine Updates
- **File modified:** [main.js](file:///c:/Users/Web/Desktop/HayrullohAbdusamadov%20ning%20Shaxsiy%20saytlari/UzbekCraft/main.js)
- Removed all emojis inside toast notifications (welcome messages, warnings, limits, save confirmation).
- Removed all emojis from the chat quotes spoken by spawnable animals and historical characters.
- Removed dynamic HUD emoji updates (compass badge and time/sun icon changes).
- Replaced emojis inside dynamic DOM builders (saved world globe, play button symbol, and delete/trash can emoji which was replaced with **O'chirish**).

### 3. Avatar Styling Improvements
- **File modified:** [style.css](file:///c:/Users/Web/Desktop/HayrullohAbdusamadov%20ning%20Shaxsiy%20saytlari/UzbekCraft/style.css)
- Custom styled `.skin-avatar` to cleanly center-align character initials (`AT`, `AN`, etc.), using a modern bold weight (`900`), balanced font size (`1.35rem`), and high-end background gradient with subtle text shadow.

---

## Part 2: Dialogue & Quest System (Mirzo Ulug'bek)

### 1. Dialogue Modal UI
- **File modified:** [index.html](file:///c:/Users/Web/Desktop/HayrullohAbdusamadov%20ning%20Shaxsiy%20saytlari/UzbekCraft/index.html)
- Inserted a `#dialogue-modal` overlay container with an NPC title, text body, and action buttons: **Keyingi** (Next), **Vazifani Qabul Qilish** (Accept Quest), and **Yopish** (Close).

### 2. Dialogue & Quest State Logic
- **File modified:** [main.js](file:///c:/Users/Web/Desktop/HayrullohAbdusamadov%20ning%20Shaxsiy%20saytlari/UzbekCraft/main.js)
- Added global state variables: `currentQuestState` (not_started, active, completed), `activeNpc`, and `dialogueIndex`.
- Added the **Mirzo Ulug'bek Quest Data** containing:
  - Greeting dialogue.
  - Two educational facts (about Madrasah and the Observatory star catalog).
  - Quest offering to retrieve a `BLUE_TILE`.
- Integrated proximity checks inside `checkInteractions()`:
  - Animals still display quick toasts as before.
  - Human NPCs release the pointer lock and open the Dialogue Modal overlay when approached.
- Pause player updates, physics, and day/night cycles while the dialogue modal is open to ensure safe and focused interaction.
- Handled quest progression:
  - **Start**: Dialogue leads to the quest acceptance screen.
  - **Active State**: Checks if the player has `BLUE_TILE` in their hotbar. If yes, it exchanges it for a `DIAMOND` block reward, displays a success message, and sets state to `completed`. Otherwise, it displays a helpful hint.
  - **Completed State**: Ulug'bek thanks the player and bids them farewell.
- Integrated `questState` into the existing LocalStorage save/load mechanics (`saveGame` / `resumeWorld`) so players do not lose their quest progress.

---

## Verification Results

### Static Code Validation
- Compiled `main.js` using Node.js to ensure zero syntax errors:
  ```powershell
  node -c main.js
  ```
  **Result:** Success, 0 syntax/compilation errors.

- Scanned files for remaining targeted emojis:
  ```powershell
  Select-String -Path 'index.html', 'main.js' -Pattern '[✨📂👤⚙️🚪🌍🏛️🏰🕌🏔️🗼🏜️🏟️🧱🧭☀️⏸️▶️💾🎒➕🔨🎥⬆️👑📜🔭🌿🛡️👕🗑️🌸📐🐅]'
  ```
  **Result:** 0 occurrences found (Fully Clean).

---

## Part 3: Flickering (Pirpirash) Fixes

We identified and resolved three different types of flickering/jitter (pirpirash) artifacts:

1. **Shadow Map Acne/Flickering:**
   - **Fix:** Added `sunLight.shadow.bias = -0.0005;` in `setupThree()` (`main.js`). This offset prevents the directional light shadow map from Z-fighting with the flat voxel faces, removing black flickering lines.
2. **Camera Movement Jitter:**
   - **Fix:** Moved `camera.rotation.set(pitch, yaw, 0, 'YXZ');` from the mousemove listener directly into the frame update loop (`updatePlayer` in `main.js`). This aligns rotation calculations perfectly with rendering frames, eliminating micro-stutters.
3. **Mobile Joystick Jitter:**
   - **Fix:** Removed `transition: transform 0.05s ease-out;` on `#joystick-stick` in `style.css`. This prevents the browser CSS transition engine from conflicting with instantaneous touch event updates, rendering smooth drags.

---

## Gameplay Concept Render

Below is a generated visual concept showcasing the high-definition realism rendering of the UzbekCraft sandbox world:

![UzbekCraft HD Realism Gameplay Render](./uzbekcraft_gameplay_render_1785560770493.png)

![UzbekCraft Realism Concept Render](./uzbekcraft_realism_concept_1785562497097.png)

![UzbekCraft Valley Concept Render](./uzbekcraft_valley_concept_1785562834186.png)

### Concept Details & Scene Composition:
- **Style:** A photorealistic, ultra-high-definition first-person view screenshot inside a heavily modded sandbox game world. The art style is sophisticated Minecraft realism, utilizing an advanced ray-tracing shader pack with dramatic dynamic volumetric lighting, soft realistic shadows, and reflections on water and detailed block textures.
- **Foreground:** On the bottom-right, the player's textured arm is visible, positioned next to newly placed detailed blocks (cobblestone, oak wood, iron ore, and copper). At the very bottom center, a transparent Hotbar UI shows selected block icons (e.g., cobblestone, wood, raw copper).
- **Mid-ground:** An NPC character, modeled in high-detail block style but wearing an intricate oriental turquoise robe and turban (Mirzo Ulug'bek), stands on a cobbled path. In the background, nestled among dense, varied realistic blocky forests and hills, stands the grand Registon Square (Samarqand, Uzbekistan) with its turquoise domes and mosaic patterns, perfectly detailed but made of blocks. To its right, an open-frame Eiffel Tower made of iron lattices rises above the trees.
- **Background:** Dynamic, fluffy blocky clouds drift in a detailed blue sky.
- **Lighting:** The sun is prominent and bright, casting a warm golden glow across the entire landscape, creating realistic atmospheric haze and sun rays filtering through the environment. The water of a nearby river reflects the sky and the sun accurately.
- **Alternative Realism Prompt:** A photorealistic first-person view screenshot from a heavily modded Minecraft game. A warm, golden hour sun casts volumetric "god rays" and soft shadows across a lush, detailed landscape with dense, textured birch and oak forests and a winding river. In the middle distance stands a grand, intricate block-built Registan Madrasah from Samarkand, Uzbekistan, complete with its blue-tiled domes. To its right, a prominent, open-frame Eiffel Tower built of blocks rises against the partly cloudy sky. On a cobblestone path in the midground stands a detailed player model dressed in a richly embroidered, ornate royal blue and gold Uzbek-style historical tunic. Nearby, a small group of two or three simpler block figures converse. To the right, high-resolution texture pack blocks, including dark wood planks and embossed copper blocks with detailed Arabic calligraphy scripts, are placed next to the path. The bottom of the screen displays a realistic transparent Minecraft Hotbar UI with selected item icons. The entire scene uses advanced ray-tracing shaders for ultra-realistic lighting, reflections on the water, and hyper-detailed textures.

---

## Part 4: Supabase Cloud Save Integration

We fully integrated **Supabase** to support real-time cloud saving alongside LocalStorage backups:

1. **Supabase CDN and Client Setup:** Loaded the official Supabase JS SDK client dynamically and initialized it on start-up.
2. **Cloud Save Settings Modal:** Added a dedicated settings dashboard accessed from the Main Menu where players can enter their database credentials, run diagnostics ("Tekshirish"), save connection profiles, or disconnect.
3. **Database Schema & SQL Table (`uzbekcraft_saves`):** Defined a table to hold metadata, player positioning, yaw/pitch camera alignment, current quest milestones, and modified block positions.
4. **Cloud Write, Sync-Merge, and Cloud Delete Functions:**
   - **Upsert on Save:** `saveGame()` automatically replicates saves to the cloud if Supabase credentials exist.
   - **Conflict-Resistant Syncing:** `loadSavedWorldsList()` fetches cloud saves, merges them with local LocalStorage entries (newest timestamp wins), caches them locally, and builds the UI.
   - **Cascading Deletion:** Deleting a save deletes it from both the client storage and Supabase table simultaneously.

---

## Part 5: Multiplayer Map Selection & Real-Time Syncing

We added complete map selection and automatic world-syncing capabilities to the online multiplayer mode:

1. **Multiplayer Map Selection Dropdown:** Added `#multiplayer-map-select` inside the `#multiplayer-modal` (in [index.html](file:///c:/Users/Web/Desktop/HayrullohAbdusamadov%20ning%20Shaxsiy%20saytlari/UzbekCraft/index.html)), allowing players to choose their starting map when joining/hosting an online session.
2. **Map Choice Initialization:** Updated the "Xonaga Ulanild" handler in [main.js](file:///c:/Users/Web/Desktop/HayrullohAbdusamadov%20ning%20Shaxsiy%20saytlari/UzbekCraft/main.js) to initialize the player's world using their selected map instead of a hardcoded map.
3. **Real-time Map & Block Synchronization:**
   - When a player joins a room, they send a broadcast request (`query_room_map`).
   - Active players in the room respond with `sync_room_map`, sending the current room map name and their accumulated block edits (`modifiedBlocks`).
   - The joining player's client receives this data, automatically updates their own map, triggers `generateWorld()` for the synced map, merges the modified blocks, and rebuilds the instanced mesh. This keeps all players in sync on the same map with the same block states.

---

## Part 6: Character Movement Directions (WASD) Correction

We resolved a major movement vector bug where keyboard controls for walking (W, A, S, D) were inverted/incorrect:

1. **Directional Sign Fix:** Updated the player velocity equations inside `updatePlayer()` in [main.js](file:///c:/Users/Web/Desktop/HayrullohAbdusamadov%20ning%20Shaxsiy%20saytlari/UzbekCraft/main.js) to properly compute forward and right movement vectors:
   - Changed `forward.x * moveDir.z` to `forward.x * (-moveDir.z)`. Since `moveDir.z` is `-1` when pressing **W** (forward), negating it aligns velocity perfectly with the camera's negative Z viewing axis.
   - Changed `- right.x * moveDir.x` to `+ right.x * moveDir.x` to match standard positive rightward displacement when pressing **D** (right).
2. **Correct Alignment:** This alignment correctly matches movement inputs (W/A/S/D) to their intuitive directions:
   - **W** -> Move Forward
   - **S** -> Move Backward
   - **A** -> Move Left
   - **D** -> Move Right

---

## Part 7: First-Person Hand, Weapons (Sword & Bow) & Animal Hunting Tizimi

We implemented blocky first-person arms, fully functional weapons, audio synthesizers, and animal combat mechanics:

1. **Minecraft-style First-Person Hand:** Added a 3D blocky human arm/hand (`fpHandGroup`) attached to the camera, rendering only in first-person mode.
   - The hand dynamically holds a scaled mini-block of the selected material, or custom-built 3D models for the **Sword** (cyan blade, guard, handle) and **Bow** (stave, bow string).
   - Added hand animation loops including walk bobbing, combat/mining swings, and continuous mining/chipping oscillations.
2. **Weapons in Hotbar & Inventory:** Defined `BLOCKS.SWORD` (25) and `BLOCKS.BOW` (26) with `isWeapon: true`.
   - Initialized they directly on Slots 1 & 2 of the active hotbar.
   - Added block placement validation inside `placeBlock()` to prevent placing weapons as blocks.
3. **SoundEngine Synthesized Effects:** Added synthetic audio profiles for `swing` (sine pitch sweep), `shoot` (quick release sweep), `hit` (noise hit burst), and `kill` (deep sawtooth fall).
4. **Hunting Mechanics & Arrow Physics:**
   - **Sword Attack:** Left clicking or using the mobile break button with the Sword triggers a short-range cone search (3.5 units, ~60 degrees yaw angle) targeting nearby animals.
   - **Bow Arrow Physics:** Left clicking or using the mobile break button with the Bow spawns a physical cylinder arrow mesh traveling at 40m/s in the camera's direction. Includes voxel block collisions and animal collision/damage triggers.
   - **Animal Damage & Death:** When hit, animals flash bright red for 120ms. When health drops below 0, a custom death loop triggers (spinning and scaling down) before removal from the scene.
5. **Quiet Animals & Behaviors:** Disabled all emoji quotes/toasts and greeting sounds for animals in `checkInteractions()`. Animals now move with a realistic leg-swing walk animation, and halt to look at the player when approached within 10 units.

---

## Part 8: Menyudagi Tugmalar va Qahramon Yuzi (Face Orientation) Tuzatishlari

Biz o'yindagi ikkita muhim muammoni bartaraf etdik:

1. **Menyu Tugmalarining Ishlamasligi (JavaScript Crash Fix):**
   - Muammo: O'yin yuklanish vaqtida konsolda `Uncaught ReferenceError: fpHandMesh is not defined` xatosi yuz berayotgan edi. Bu eski `createFirstPersonHand()` funksiyasida e'lon qilinmagan o'zgaruvchidan foydalanilgani sababli yuzaga kelgan.
   - Ushbu xatolik dastur ishini to'xtatganligi sababli, menyu tugmalariga event listener-lar birikmay qolgan edi.
   - Yechim: Eski `createFirstPersonHand()` o'rniga yangi va dinamik `updateFirstPersonHandMesh()` funksiyasidan foydalanildi hamda eskirgan kodlar butunlay o'chirildi. Natijada o'yin xatosiz yuklanib, menyu tugmalari to'liq ishlay boshladi.
   - Shuningdek, bosh menyuga qaytishda pointer lock (sichqoncha qulflanishi) holati faol bo'lsa, uni avtomatik tarzda ochib yuboradigan kod yozildi.

2. **Qahramon Yuzining Orqaga Qarab Qolishi (Face Orientation Alignment):**
   - Muammo: Qahramon modeli (Steve/Alpomish) yuzi uning local o'qida `+Z` tomonga (kamera tomonga) qaratib chizilgan edi. Ammo o'yinchi harakat yo'nalishi `-Z` bo'lgani sababli, 3-shaxs rejimida u yurganda yuzi kameraga qarab (orqaga qarab) harakatlanardi.
   - Yechim: `updatePlayer()` va `updateOtherPlayer()` funksiyalarida o'yinchi va boshqa onlayn o'yinchilar modellarining aylanish burchagiga `Math.PI` (180 daraja) qo'shildi (`rotation.y = yaw + Math.PI`). Endi qahramon to'g'ri oldinga qarab harakatlanadi.

---

## Part 9: Ctrl (Uchinchi Shaxs) Vizual, Qurol bilan Blok Qo'yish, Hayvonlar Qochishi va Yangi Ovozlar

Ushbu bosqichda quyidagi yangiliklar va yaxshilanishlar amalga oshirildi:

1. **Ctrl Bosilganda Qo'l va Qilichning Yashirinishi:**
   - **Muammo:** Ctrl bosib 3-shaxs kamerasiga o'tilganda (`isCtrlHeld`), qahramon modeli paydo bo'lishiga qaramay, birinchi shaxs qo'li va qilichi ekranning o'ng chetida ko'rinib qolayotgan edi.
   - **Yechim:** Birinchi shaxs qo'lining ko'rinish sharti yangilandi. Endi qo'l faqat `isThirdPerson` yoki `isCtrlHeld` faol bo'lmagandagina (haqiqiy birinchi shaxs rejimida) ko'rinasi.

2. **Qilich yoki Kamon ushlab turganda ham Blok qo'yish (Weapon Placement Context):**
   - **Imkoniyat:** Foydalanuvchilar slotlar orasida tez-tez almashib yurmasliklari uchun, qurol ushlab turilganda ham o'ng tugma (yoki telefondagi Qo'yish tugmasi) bosilganda blok qo'ya olish tizimi joriy etildi.
   - **Ishlash tartibi:** Qurol ushlab turilgan paytda blok qo'yilmoqchi bo'lsa, o'yin hotbardagi birinchi blok ob'ektini (masalan, O't, Loy, Yog'och) qidirib topadi va o'sha blokni joylashtiradi. Agar hotbarda umuman blok bo'lmasa, standart O't (Grass) bloki qo'yiladi.

3. **Zarba Yegan Hayvonlarning Qochishi:**
   - **Imkoniyat:** Hayvonlar realligini oshirish maqsadida, ularga biror marta qilich urilganda yoki kamon tekkan paytda darhol o'yinchidan qarama-qarshi tomonga qarab qochish tizimi qo'shildi.
   - **Ishlash tartibi:** Hayvon zarba yeganda uning `fleeingTimer` ko'rsatkichi 2.5 soniyaga o'rnatiladi. Ular 2.5 soniya davomida o'yinchidan teskari tomonga qarab 5.0 tezlik bilan qochishadi (odatiy tezligi 1.5 edi). Bu vaqtda ularning oyoq tashlashi ham (swingSpeed) tezlashadi hamda o'yinchiga qarab to'xtab qolishmaydi.

4. **Yangi Metall Qilich Slash Ovozi:**
   - **O'zgarish:** Avvalgi zarba ovozi oddiy shovqin (noise burst) ko'rinishida edi. U endi ikkita chastota-slaydli osillyatorlardan (sawtooth va triangle) foydalanilgan holda haqiqiy qilich metallining shig'illashi/kesishi (metallic slash/slice) ovoziga almashtirildi.

---

## Part 10: Uchinchi Shaxs Dinamik Qo'lidagi Qurol/Blok va Tartiblangan Inventar Ro'yxati

Biz quyidagi yaxshilanishlarni amalga oshirdik:

1. **Uchinchi Shaxs Rejimida Dinamik Held Item (Qo'ldagi Narsa):**
   - **Muammo:** Avval uchinchi shaxs kamerasiga o'tganimizda (yoki Ctrl ni bosib o'zimizni ko'rganimizda) qahramonning o'ng qo'lida har doim temir qilich modeli doimiy yopishtirilgan (hardcoded) holda turardi. Slotlarni almashtirsak ham qilich qo'ldan tushmasdi.
   - **Yechim:** Qahramon modelidan temir qilich olib tashlandi. Buning o'rniga dinamik `updateThirdPersonHeldItem(mesh, blockId)` funksiyasi yozildi.
   - Endi o'zingizda yoki boshqa onlayn o'yinchilarda hotbardagi slot o'zgarganda, uchinchi shaxs rejimida qo'lidagi qurol/blok ham real vaqtda o'zgaradi:
     - Qilich tanlansa -> Olmos qilich modeli.
     - Kamon tanlansa -> 3D Kamon yoyi modeli.
     - Blok tanlansa -> Tegishli rangdagi kichik blok.
     - Havo/Bo'sh slot tanlansa -> Qo'lida hech narsa bo'lmaydi.
   - Multiplayer rejimida boshqa o'yinchilarning harakati vaqtida ularning qo'lidagi faol qurol yoki blok ham tarmoq orqali sinxronlashib ko'rinadigan bo'ldi.

2. **Inventar Ro'yxatini Tartiblash (Guruhlash va Saralash):**
   - **Imkoniyat:** O'yindagi barcha narsalar (qurollar, bloklar, chiroq) inventarda tartibsiz edi va qurollar ro'yxatning eng oxirida turgani sababli topish qiyin edi.
   - **Yechim:** Inventarni (`renderInventoryGrid()`) foydalanish uchun qulay ketma-ketlikda guruhladik:
     - Qurollar va Asboblar: Qilich, Kamon, Chiroq, Shisha, Suv.
     - Foydali qazilmalar: Olmos, Oltin, Temir, Mis.
     - Qurilish bloklari: Moviy koshin, Oq mramor, Zangori koshin, G'isht, Qora tosh, Terrakota.
     - Tabiat bloklari: O't, Loy, Tosh, Qum, Qor, Yog'och, Barg, Taxta, Kaktus, Ko'mir.

---

## Part 11: Telefon uchun Tartiblangan Boshqaruv Tugmalari va Albomniy (Landscape) Rejim Enforcer

Biz telefon foydalanuvchilarining o'yin tajribasini yaxshilash uchun quyidagi o'zgarishlarni kiritdik:

1. **Telefon uchun Boshqaruv Tugmalarining Tartibli va Qulay Joylashuvi:**
   - **Muammo:** Telefonda o'ng tomondagi "Qo'yish", "Buzish", "Sakrash", "Kamera" va "Inventar" tugmalari bir ustun shaklida ketma-ket joylashib, o'ynash uchun noqulay holatda edi.
   - **Yechim:** Tugmalar shakli dumaloq (circular console controller-style) qilinib, barmoqlar harakatiga mos qulay geometrik klaster (tartib) ko'rinishida joylashtirildi:
     - **Buzish / Attack** (Eng katta dumaloq tugma, qizil rangda, pastki chaproqda): Jang qilish va qazish uchun asosiy harakat.
     - **Qo'yish / Place** (Dumaloq yashil tugma, yuqori chapda).
     - **Sakrash / Jump** (Dumaloq ko'k tugma, pastki o'ngda).
     - **Kamera** (Kichik kulrang dumaloq, yuqori o'ngda): 1-shaxs va 3-shaxs rejimlari orasida tez almashish.
     - **Inventar** (Kichik to'q sariq dumaloq, o'rtada): Sumkani ochish.
   - Bu boshqaruv elementlari shaffof, chiroyli gradient fonli va neon shisha effekti borderlariga ega bo'lib, o'yin ekranini to'sib qo'ymaydi.

2. **Albomniy (Landscape) Rejim Enforcer (Yo'nalish ogohlantirishi):**
   - **Tizim:** O'yin faqat telefonni yonbosh qilib (landscape) o'ynashga mo'ljallanganligi sababli, foydalanuvchi telefonni tikka (portrait) holatda ushlaganda maxsus ogohlantirish ekrani (`#landscape-warning`) paydo bo'ladi.
   - **Ogohlantirish mazmuni:** "O'yin to'liq va boshqaruvlar tartibli ko'rinishi uchun iltimos telefoningizni yonboshga (landscape rejimiga) buring!".
   - Telefon yonboshga burilishi bilanoq ogohlantirish avtomatik yo'qolib, o'yin to'liq ekranli keng holatda davom etadi.

---

## Part 12: Hayvon O'lim Ovozi, Go'sht Tushishi, Yig'ish va Alohida Go'shtlar Menyusi

Biz hayvonlarni ovlash tizimini yanada realistik va qiziqarli qilish uchun quyidagi imkoniyatlarni qo'shdik:

1. **Yangi va Premium Hayvon O'lim Ovozi:**
   - **O'zgarish:** Eski `kill` ovozi o'rniga triangle + sawtooth osillyatorlari va lowpass filtrli shovqin (noise buffer) sweeps aralashmasidan tashkil topgan batafsil nolayotgan/so'nayotgan premium o'lim ovozi sintez qilindi.
   - **Yig'ish Ovoz Effekti (`pickup`):** Go'sht yig'ib olinganida chiroyli retro arpeggio (D5 -> A5) tovush effekti chaladigan qilindi.

2. **Hayvonga Mos Alohida Go'sht Tushish Tizimi:**
   - Har bir hayvon o'lganida uning turiga xos bo'lgan go'sht turi yerdan 3D formatda paydo bo'ladi.
   - **Go'sht turlari va ranglari:**
     - Qo'y -> Qo'y go'shti (Och qizil)
     - Sigir -> Mol go'shti (To'q qizil)
     - Tulki -> Tulki go'shti (To'q sariq)
     - Bo'ri -> Bo'ri go'shti (Kulrang)
     - Burgut -> Burgut go'shti (Jigarrang)
     - Tuya -> Tuya go'shti (Sarg'ish)
     - Ot -> Ot go'shti (Qazi) (To'q jigarrang)
     - Eshak -> Eshak go'shti (Moviy-kulrang)
     - Tovuq -> Tovuq go'shti (Och sariq)
     - Qoplon -> Qoplon go'shti (Yashil-sariq)
   - **3D Vizual Model:** Tushgan go'sht Minecraft uslubida 3D ko'rinishda (qizil/jigarrang go'sht qismi va unga birikkan oq suyak bo'lagi) yer ustida aylanib, yuqoriga va pastga mayin tebranib (bobbing) turadi.

3. **Go'shtlarni Avtomatik Yig'ish (Pickup):**
   - O'yinchi 1.6 metr masofagacha yaqinlashganda go'sht avtomatik yig'ib olinadi, pickup tovushi eshitiladi va ekranda toast xabar chiqadi (masalan, `+1 Qo'y go'shti olindi!`).

4. **Alohida Go'shtlar Menyusi (`meats-modal`):**
   - **Pauza menyusiga** maxsus **Ovlangan Go'shtlar** tugmasi qo'shildi.
   - O'yinchilar shuningdek o'yin davomida istalgan payt **M** klavishini bosib ushbu menyuni ochishlari/yopishlari mumkin.
   - Menyuda barcha hayvonlardan to'plangan go'shtlar soni chiroyli glassmorphism uslubidagi kartochkalar va unga mos keladigan go'sht SVG piktogrammalari yordamida ko'rsatiladi.

5. **Saqlash va Yuklash (Save/Load):**
   - O'yin saqlanganda yig'ilgan barcha go'shtlar mahalliy `localStorage` ga va Supabase bulutli ma'lumotlar bazasidagi `quest_state` ustuniga xavfsiz tarzda sinxronizatsiya qilinadi va yuklanganda avtomatik tiklanadi.


