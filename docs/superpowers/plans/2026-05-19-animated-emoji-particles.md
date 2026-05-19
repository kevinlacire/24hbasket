# Animated Emoji Particles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Afficher des émojis animés qui flottent vers le haut depuis le chiffre du score quand on clique +2 ou +3.

**Architecture:** Un tableau `emojiParticles` en state React stocke les particules actives. Chaque clic +2/+3 qui incrémente réellement pousse 3 particules (position calculée via `getBoundingClientRect()` sur le span du score, émoji aléatoire, délai échelonné). Un overlay `position: fixed` (z-index 49, sous les feux d'artifice) rend les `<AnimatedEmoji>`. Les particules sont nettoyées via `setTimeout` après 1 500 ms.

**Tech Stack:** `@remotion/animated-emoji`, React state/refs, CSS `@keyframes`

---

### Task 1: Installer @remotion/animated-emoji

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Installer le package**

```bash
pnpm add @remotion/animated-emoji
```

- [ ] **Step 2: Vérifier l'installation**

```bash
node -e "const m = require('@remotion/animated-emoji'); console.log('OK', typeof m.AnimatedEmoji)"
```

Résultat attendu : `OK function`

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @remotion/animated-emoji"
```

---

### Task 2: Ajouter l'animation CSS et la couche overlay

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Ajouter les styles à la fin de globals.css, avant le bloc `@media (prefers-reduced-motion)`**

```css
/* ─── Emoji particles ──────────────────────────────────── */
.emoji-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 49;
  overflow: hidden;
}

.emoji-particle {
  position: absolute;
  transform: translate(-50%, -50%);
  animation: emojiFloat 1.4s var(--ease-out-expo) forwards;
}

@keyframes emojiFloat {
  0%   { opacity: 1;   transform: translate(-50%, -50%) translateY(0)      scale(1);   }
  60%  { opacity: 0.9;                                                                  }
  100% { opacity: 0;   transform: translate(-50%, -50%) translateY(-130px) scale(0.5); }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: add emoji particle float animation"
```

---

### Task 3: Ajouter type, constante, state et refs dans page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Ajouter le type et la constante après `const KONAMI` (ligne ~26)**

```ts
const CELEBRATION_EMOJIS = ['🏀','🔥','⭐','✨','🎉','🤩','😍','🤯','🥳','😱'];

type EmojiParticle = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  delay: number;
};
```

- [ ] **Step 2: Ajouter refs et state dans le composant, après `const konamiSeq = useRef<string[]>([])` (ligne ~41)**

```ts
const scoreBlueRef = useRef<HTMLSpanElement>(null);
const scoreRedRef  = useRef<HTMLSpanElement>(null);
const [emojiParticles, setEmojiParticles] = useState<EmojiParticle[]>([]);
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add emoji particle state, refs and pool"
```

---

### Task 4: Ajouter spawnEmojis et mettre à jour inc()

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Ajouter la fonction spawnEmojis après toggleMute()**

```ts
function spawnEmojis(ref: React.RefObject<HTMLSpanElement | null>) {
  const el = ref.current;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const newParticles: EmojiParticle[] = Array.from({ length: 3 }, (_, i) => ({
    id: Date.now() + i,
    emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
    x: cx + (Math.random() - 0.5) * rect.width * 0.6,
    y: cy,
    delay: i * 100,
  }));
  setEmojiParticles(prev => [...prev, ...newParticles]);
  setTimeout(() => {
    setEmojiParticles(prev => prev.filter(p => !newParticles.some(n => n.id === p.id)));
  }, 1500);
}
```

- [ ] **Step 2: Remplacer la fonction inc() existante par la version avec ref optionnel**

```ts
function inc(
  delta: number,
  score: number,
  set: (n: number) => void,
  setShake: (b: boolean) => void,
  scoreRef?: React.RefObject<HTMLSpanElement | null>,
) {
  if (score + delta < 0) {
    setShake(true);
    setTimeout(() => setShake(false), 500);
    return;
  }
  set(score + delta);
  if (scoreRef) spawnEmojis(scoreRef);
}
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add spawnEmojis and update inc signature"
```

---

### Task 5: Brancher les refs sur les spans et passer les refs aux boutons +

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Ajouter `ref={scoreBlueRef}` sur le span de score bleu**

Localiser :
```tsx
<span key={scoreBlue} className={`team__score${shakeBlue ? ' team__score--shake' : ''}`}>
```
Remplacer par :
```tsx
<span key={scoreBlue} ref={scoreBlueRef} className={`team__score${shakeBlue ? ' team__score--shake' : ''}`}>
```

- [ ] **Step 2: Ajouter `ref={scoreRedRef}` sur le span de score rouge**

Localiser :
```tsx
<span key={scoreRed} className={`team__score${shakeRed ? ' team__score--shake' : ''}`}>
```
Remplacer par :
```tsx
<span key={scoreRed} ref={scoreRedRef} className={`team__score${shakeRed ? ' team__score--shake' : ''}`}>
```

- [ ] **Step 3: Passer scoreBlueRef aux boutons +2 et +3 de l'équipe bleue**

Localiser :
```tsx
<button className="btn-score btn-score--add" onClick={() => inc(+2, scoreBlue, setScoreBlue, setShakeBlue)}>+2</button>
<button className="btn-score btn-score--add" onClick={() => inc(+3, scoreBlue, setScoreBlue, setShakeBlue)}>+3</button>
```
Remplacer par :
```tsx
<button className="btn-score btn-score--add" onClick={() => inc(+2, scoreBlue, setScoreBlue, setShakeBlue, scoreBlueRef)}>+2</button>
<button className="btn-score btn-score--add" onClick={() => inc(+3, scoreBlue, setScoreBlue, setShakeBlue, scoreBlueRef)}>+3</button>
```

- [ ] **Step 4: Passer scoreRedRef aux boutons +2 et +3 de l'équipe rouge**

Localiser :
```tsx
<button className="btn-score btn-score--add" onClick={() => inc(+2, scoreRed, setScoreRed, setShakeRed)}>+2</button>
<button className="btn-score btn-score--add" onClick={() => inc(+3, scoreRed, setScoreRed, setShakeRed)}>+3</button>
```
Remplacer par :
```tsx
<button className="btn-score btn-score--add" onClick={() => inc(+2, scoreRed, setScoreRed, setShakeRed, scoreRedRef)}>+2</button>
<button className="btn-score btn-score--add" onClick={() => inc(+3, scoreRed, setScoreRed, setShakeRed, scoreRedRef)}>+3</button>
```

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire score refs to emoji spawn on increment"
```

---

### Task 6: Importer AnimatedEmoji et rendre l'overlay

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Ajouter l'import**

En haut du fichier, après les imports existants :

```ts
import { AnimatedEmoji } from '@remotion/animated-emoji';
```

- [ ] **Step 2: Ajouter l'overlay dans le JSX, juste après le composant `<Fireworks>`**

```tsx
{/* ── Emoji particles ── */}
<div className="emoji-overlay">
  {emojiParticles.map(p => (
    <div
      key={p.id}
      className="emoji-particle"
      style={{ left: p.x, top: p.y, animationDelay: `${p.delay}ms` }}
    >
      <AnimatedEmoji emoji={p.emoji} size={52} />
    </div>
  ))}
</div>
```

- [ ] **Step 3: Vérifier que TypeScript compile**

```bash
pnpm build
```

Résultat attendu : build sans erreur.

- [ ] **Step 4: Tester manuellement**

```bash
pnpm dev
```

Ouvrir http://localhost:3000.
- Cliquer +2 ou +3 → 3 émojis animés flottent vers le haut depuis le score et disparaissent en ~1,4 s.
- Cliquer −2 ou −3 → aucun émoji.
- Cliquer rapidement plusieurs fois → les bursts se cumulent sans erreur.

- [ ] **Step 5: Commit final**

```bash
git add app/page.tsx
git commit -m "feat: render animated emoji particles on score increment"
```
