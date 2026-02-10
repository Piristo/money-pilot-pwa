# MoneyPilot Design System V2 🎨

## Концепция

**Стиль:** Modern Fintech Glassmorphism  
**Настроение:** Premium, Trustworthy, Innovative  
**Целевая аудитория:** Молодые профессионалы 25-40 лет

---

## Цветовая палитра

### Основные цвета

**Primary (Success/Money)**
- `#22c55e` - Emerald 500 (основной зелёный)
- `#10b981` - Emerald 600 (тёмный зелёный)
- `rgba(34, 197, 94, 0.3)` - Glow эффект

**Accent (Premium)**
- `#8b5cf6` - Violet 500 (акцент)
- `#a78bfa` - Violet 400 (светлый акцент)
- `rgba(139, 92, 246, 0.3)` - Glow эффект

**Semantic Colors**
- Success: `#10b981` (Emerald 600)
- Warning: `#f59e0b` (Amber 500)
- Danger: `#ef4444` (Rose 500)
- Info: `#06b6d4` (Cyan 500)

### Нейтральные

**Backgrounds**
- Background: `#09090b` (почти чёрный)
- Card: `#18181b` (Zinc 900)
- Secondary: `#27272a` (Zinc 800)

**Text**
- Primary: `#ffffff` (белый)
- Secondary: `#a1a1aa` (Zinc 400)
- Muted: `#71717a` (Zinc 500)

---

## Glassmorphism

### Glass Panel (базовый)
```css
background: rgba(24, 24, 27, 0.7);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
```

**Использование:**
- Модальные окна
- Всплывающие меню
- Overlay элементы

### Glass Rich (премиум)
```css
background: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.05) 0%,
  rgba(255, 255, 255, 0.02) 100%
);
backdrop-filter: blur(30px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 
  0 8px 32px 0 rgba(0, 0, 0, 0.37),
  inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
```

**Использование:**
- Главные карточки
- Важные элементы
- Hero секции

---

## Градиенты

### Text Gradients

**Green (Money)**
```css
background: linear-gradient(to right, #22c55e, #10b981);
```

**Purple (Premium)**
```css
background: linear-gradient(to right, #8b5cf6, #a78bfa);
```

**Blue (Info)**
```css
background: linear-gradient(to right, #06b6d4, #0891b2);
```

### Background Gradients

**Animated Gradient**
```css
background: linear-gradient(
  -45deg,
  #22c55e, #10b981, #8b5cf6, #a78bfa
);
background-size: 400% 400%;
animation: gradient-shift 15s ease infinite;
```

**Subtle Background**
```css
background-image: 
  radial-gradient(at 0% 0%, rgba(34, 197, 94, 0.05) 0px, transparent 50%),
  radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.05) 0px, transparent 50%);
```

---

## Эффекты

### Glow (свечение)

**Green Glow**
```css
box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
```

**Purple Glow**
```css
box-shadow: 0 0 40px rgba(139, 92, 246, 0.3);
```

**Pulse Glow (анимация)**
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
  50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
}
```

### Shimmer (мерцание)

```css
background: linear-gradient(
  90deg,
  transparent 0%,
  rgba(255, 255, 255, 0.1) 50%,
  transparent 100%
);
background-size: 1000px 100%;
animation: shimmer 2s infinite;
```

**Использование:**
- Loading states
- Skeleton loaders
- Hover эффекты

### Float (плавание)

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

**Использование:**
- Иконки
- Badges
- Floating buttons

---

## Типографика

### Размеры

**Display (заголовки)**
- Hero: `text-6xl` (60px) - `font-bold`
- H1: `text-5xl` (48px) - `font-bold`
- H2: `text-4xl` (36px) - `font-semibold`
- H3: `text-3xl` (30px) - `font-semibold`

**Body**
- Large: `text-xl` (20px) - `font-medium`
- Base: `text-base` (16px) - `font-normal`
- Small: `text-sm` (14px) - `font-normal`
- XSmall: `text-xs` (12px) - `font-medium`

**Numbers (суммы)**
- Hero: `text-5xl` (48px) - `font-bold` - `tracking-tighter`
- Large: `text-3xl` (30px) - `font-bold` - `tracking-tight`
- Medium: `text-2xl` (24px) - `font-bold`
- Small: `text-xl` (20px) - `font-semibold`

### Веса

- Bold: `font-bold` (700) - заголовки, суммы
- Semibold: `font-semibold` (600) - подзаголовки
- Medium: `font-medium` (500) - метки, кнопки
- Normal: `font-normal` (400) - основной текст

### Tracking (межбуквенное расстояние)

- Tighter: `tracking-tighter` - большие суммы
- Tight: `tracking-tight` - заголовки
- Normal: `tracking-normal` - основной текст
- Wide: `tracking-wide` - uppercase метки

---

## Spacing

### Padding

**Cards**
- Small: `p-4` (16px)
- Medium: `p-6` (24px)
- Large: `p-8` (32px)

**Sections**
- Small: `py-4` (16px)
- Medium: `py-6` (24px)
- Large: `py-12` (48px)

### Gap

**Flex/Grid**
- Tight: `gap-2` (8px)
- Normal: `gap-4` (16px)
- Loose: `gap-6` (24px)

---

## Border Radius

**Rounded**
- Small: `rounded-lg` (8px) - badges, tags
- Medium: `rounded-xl` (12px) - buttons, inputs
- Large: `rounded-2xl` (16px) - cards
- XLarge: `rounded-3xl` (24px) - hero cards
- Full: `rounded-full` - avatars, pills

---

## Shadows

### Elevation

**Level 1 (subtle)**
```css
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
```

**Level 2 (medium)**
```css
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
```

**Level 3 (high)**
```css
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

**Level 4 (dramatic)**
```css
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Colored Shadows

**Green**
```css
box-shadow: 0 10px 30px rgba(34, 197, 94, 0.2);
```

**Purple**
```css
box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
```

---

## Анимации

### Timing Functions

- **Ease Out**: `ease-out` - входящие элементы
- **Ease In**: `ease-in` - исчезающие элементы
- **Ease In Out**: `ease-in-out` - hover эффекты
- **Spring**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - bounce эффект

### Durations

- **Fast**: `150ms` - hover, focus
- **Normal**: `300ms` - transitions
- **Slow**: `500ms` - page transitions
- **Very Slow**: `1000ms` - loading animations

### Common Animations

**Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Slide Up**
```css
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

**Scale In**
```css
@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

---

## Компоненты

### Button

**Primary**
```css
background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
color: #000000;
padding: 12px 24px;
border-radius: 12px;
font-weight: 600;
box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
transition: all 0.3s ease;

&:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}
```

**Secondary**
```css
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
```

**Ghost**
```css
background: transparent;
color: #a1a1aa;

&:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}
```

### Card

**Standard**
```css
background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
border: 1px solid #27272a;
border-radius: 24px;
padding: 24px;
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
```

**Glass**
```css
background: rgba(24, 24, 27, 0.7);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 24px;
padding: 24px;
```

**Premium**
```css
background: linear-gradient(
  135deg,
  rgba(34, 197, 94, 0.1) 0%,
  rgba(139, 92, 246, 0.1) 100%
);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 
  0 20px 40px rgba(0, 0, 0, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

### Input

```css
background: rgba(0, 0, 0, 0.3);
border: 1px solid #27272a;
border-radius: 12px;
padding: 12px 16px;
color: #ffffff;
transition: all 0.3s ease;

&:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  background: rgba(0, 0, 0, 0.5);
}
```

---

## Иконки

### Размеры
- Small: `16px`
- Medium: `20px`
- Large: `24px`
- XLarge: `32px`

### Стили
- Outline: основной стиль
- Filled: для активных состояний
- Duotone: для акцентов

### Цвета
- Default: `#a1a1aa` (Zinc 400)
- Active: `#ffffff`
- Success: `#22c55e`
- Warning: `#f59e0b`
- Danger: `#ef4444`

---

## Accessibility

### Контрастность
- Текст на тёмном: минимум 4.5:1
- Крупный текст: минимум 3:1
- Иконки: минимум 3:1

### Focus States
```css
&:focus-visible {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive

### Breakpoints
- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`

### Mobile First
Всегда начинаем с мобильного дизайна и добавляем стили для больших экранов.

---

## Статус: ✅ Готово

Design System V2 создан и готов к применению!

**Следующие шаги:**
1. Применить glassmorphism к карточкам
2. Добавить glow эффекты
3. Улучшить анимации
4. Добавить градиенты

**Дата:** 10.02.2026
