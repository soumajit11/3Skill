# BingeBox — Premium Movie Streaming Frontend

A fully responsive, cinematic movie streaming frontend inspired by Netflix and Amazon Prime Video. Built entirely with **HTML5 and CSS3 — zero JavaScript**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![No JS](https://img.shields.io/badge/JavaScript-None-lightgrey?style=flat)
![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%7C%20Tablet%20%7C%20Desktop-4DA8FF?style=flat)

---

## Overview

BingeBox is a front-end only portfolio project that demonstrates how far HTML and CSS can go without a single line of JavaScript. It features a dark glassmorphism aesthetic, a fully functional theme switcher, an interactive hero carousel, animated movie cards, and a completely responsive layout — all powered purely by CSS techniques like the checkbox trick, radio-button state, sibling selectors, and keyframe animations.

---

## Live Preview

> Open `index.html` directly in any modern browser. No build tools, no install, no server required.

---

## Project Structure

```
BingeBox/
│
├── index.html              ← Single page — all sections live here
│
├── css/
│   ├── style.css           ← Core layout, components, glassmorphism
│   ├── themes.css          ← CSS variables for dark & light themes
│   ├── animations.css      ← @keyframes, transitions, motion rules
│   └── responsive.css      ← Media queries for all screen sizes
│
├── pictures/               ← Movie poster & hero backdrop images (33 files)
│   ├── hero-dune2.jpg
│   ├── hero-oppenheimer.jpg
│   ├── hero-shogun.jpg
│   ├── hero-poorthings.jpg
│   ├── hero-thebear.jpg
│   ├── deadpool-wolverine.jpg
│   ├── gladiator2.jpg
│   ├── insideout2.jpg
│   ├── alien-romulus.jpg
│   ├── wicked.jpg
│   ├── longlegs.jpg
│   ├── furiosa.jpg
│   ├── barbie.jpg
│   ├── killers-flower-moon.jpg
│   ├── mission-impossible-dr.jpg
│   ├── the-holdovers.jpg
│   ├── napoleon.jpg
│   ├── godzilla-kong.jpg
│   ├── zone-of-interest.jpg
│   ├── shawshank.jpg
│   ├── godfather.jpg
│   ├── dark-knight.jpg
│   ├── schindlers-list.jpg
│   ├── inception.jpg
│   ├── fight-club.jpg
│   ├── interstellar.jpg
│   ├── breaking-bad.jpg
│   ├── chernobyl.jpg
│   ├── band-of-brothers.jpg
│   ├── the-wire.jpg
│   ├── last-of-us.jpg
│   ├── succession.jpg
│   └── true-detective.jpg
│
└── README.md
```

---

## Features

| Feature                          | How it works                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------- |
| Dark / Light theme toggle        | CSS-only — hidden `<input type="checkbox">` + `:checked ~ *` sibling selector |
| Hero carousel (5 slides)         | CSS-only — hidden `<input type="radio">` + `:checked` state per slide         |
| Carousel dots & prev/next arrows | `<label>` elements pointing to radio inputs — no JS at all                    |
| Glassmorphism navbar             | `backdrop-filter: blur()` + semi-transparent `rgba` background                |
| Hover card overlays              | `opacity: 0` → `opacity: 1` on `:hover` with `transition`                     |
| Horizontal scroll rows           | `overflow-x: auto` + `scroll-snap-type: x mandatory`                          |
| Responsive hamburger menu        | Same hidden checkbox trick as the theme toggle                                |
| Ken Burns background zoom        | `@keyframes` with `scale()` + `translate()` on hero images                    |
| Page load animations             | `@keyframes fadeUp` on hero content and section strips                        |
| Fluid typography                 | `clamp(min, preferred, max)` scales font sizes with screen width              |
| Accessibility                    | Semantic HTML, ARIA labels, focus states, `prefers-reduced-motion`            |
| Custom scrollbar                 | `::-webkit-scrollbar` styled with theme colours                               |

---

## CSS Architecture

The stylesheet is intentionally split into 4 focused files, each with a single clear responsibility. This separation makes the code easier to read, debug, and explain.

### `css/themes.css`

Defines every colour, surface, and glow value in the project as CSS custom properties (variables). Nothing in the other CSS files uses a hardcoded colour — they all reference a variable defined here.

The dark/light toggle works entirely in this file using one hidden checkbox and the CSS sibling combinator `~`. When the checkbox is checked, every variable is overridden with light-mode values and the entire page updates instantly.

```
Variables defined
─────────────────────────────────────────
--bg, --bg-alt          Page and section backgrounds
--surface, --surface-md Semi-transparent glass surfaces
--accent, --glow        Brand blue and glow colour
--text, --text-md       Primary and secondary text colours
--border, --border-hi   Subtle and highlighted border colours
--blur                  backdrop-filter value (reused everywhere)
--navbar-bg             Semi-transparent navbar background
--scrollbar-thumb       Custom scrollbar colour
```

The theme switch mechanism:

```css
/* Default = dark theme on :root */
:root {
  --bg: #08111f;
  --accent: #4da8ff;
}

/* When theme checkbox is checked → override to light */
.theme-checkbox:checked ~ * {
  --bg: #eef4ff;
  --accent: #2563eb;
}
```

### `css/style.css`

The largest file. Contains the global reset, typography settings, and every component from the navbar to the footer. The key CSS techniques used here are:

**Flexbox** — used for the navbar inner layout, card rows, hero action buttons, and footer columns. `margin-left: auto` on the controls group pushes them to the far right of the navbar.

**position: absolute + inset: 0** — used to stack hero slides on top of each other, place the dark gradient overlay over background images, position card hover overlays, and anchor dots and arrows inside the hero.

**backdrop-filter: blur(18px)** — the glassmorphism effect on the navbar, dropdown menu, search bar, and hero arrow buttons. The element must have a semi-transparent background for the blur to show through.

**transition** — every interactive element (cards, buttons, nav links, arrows) uses transition so hover changes animate smoothly rather than snapping.

**scroll-snap-type** — applied to the horizontal card rows so scrolling stops cleanly at each card edge rather than between cards.

**:checked ~ sibling selector** — used to show the correct hero slide and activate the correct dot based on which radio input is currently selected.

**nth-child()** — used to match each dot to its corresponding slide number.

### `css/animations.css`

All motion on the page is defined here and nowhere else. Keeping animations in a separate file means they can be reviewed, adjusted, or disabled without touching component styles.

| Animation name           | What it does                             | Where applied               |
| ------------------------ | ---------------------------------------- | --------------------------- |
| `kenBurns`               | Slow scale + pan on the background image | Hero slide backgrounds      |
| `fadeUp`                 | Slides content up 24px while fading in   | Hero text, content strips   |
| `fadeIn`                 | Simple opacity fade                      | Navbar on page load         |
| `prefers-reduced-motion` | Disables all animation in one block      | Entire page (accessibility) |

The `@media (prefers-reduced-motion: reduce)` rule at the bottom of this file overrides every animation and transition duration to `0.01ms`, effectively stopping all motion for users who have enabled that accessibility setting in their operating system.

### `css/responsive.css`

Makes the layout adapt to every screen size using `@media` queries and `clamp()` for smooth scaling between breakpoints.

| Breakpoint          | Device target               | Key changes applied                                                     |
| ------------------- | --------------------------- | ----------------------------------------------------------------------- |
| No query (default)  | Desktop — wider than 1024px | Full navbar, large cards (200px), full hero height                      |
| `max-width: 1024px` | Tablet                      | Smaller cards (180px), tighter gaps, narrower search bar                |
| `max-width: 767px`  | Mobile                      | Hamburger menu shown, nav links hidden, hero height 85vh, smaller cards |
| `max-width: 420px`  | Small phone                 | Buttons stack vertically, narrowest card size (140px)                   |
| `min-width: 1441px` | Large desktop               | Wider cards (220px), larger hero content area                           |

The hamburger menu on mobile uses the same hidden-checkbox technique as the theme toggle — a second checkbox at the top of the HTML controls whether the nav links are visible. The three hamburger bars animate into an X shape using `rotate()` and `opacity` transitions when the checkbox is checked.

---

## Content Sections

| Section              | Titles featured                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Hero Carousel        | Dune: Part Two, Oppenheimer, Shōgun, Poor Things, The Bear                                                           |
| Trending Now         | Deadpool & Wolverine, Gladiator II, Inside Out 2, Alien: Romulus, Wicked, Longlegs, Furiosa                          |
| Popular on BingeBox  | Barbie, Killers of the Flower Moon, Mission Impossible 7, The Holdovers, Napoleon, Godzilla x Kong, Zone of Interest |
| Top Rated Movies     | The Shawshank Redemption, The Godfather, The Dark Knight, Schindler's List, Inception, Fight Club, Interstellar      |
| Top Rated Web Series | Breaking Bad, Chernobyl, Band of Brothers, The Wire, The Last of Us, Succession, True Detective                      |

---

## Design System

### Colour Palette

| Token          | Dark Mode                | Light Mode               |
| -------------- | ------------------------ | ------------------------ |
| Background     | `#08111F`                | `#EEF4FF`                |
| Surface        | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.65)` |
| Accent         | `#4DA8FF`                | `#2563EB`                |
| Glow           | `#70C4FF`                | `#60A5FA`                |
| Text Primary   | `#F5F7FA`                | `#111827`                |
| Text Secondary | `#A8B5C7`                | `#374151`                |

### Typography

| Role                                | Font  | Weights used |
| ----------------------------------- | ----- | ------------ |
| Headings, Logo, Card titles, Badges | Sora  | 700, 800     |
| Body text, Meta info, UI labels     | Inter | 400, 500     |

Both fonts are loaded via Google Fonts CDN in the `<head>` of `index.html`. No local font files needed.

### Glassmorphism

Every frosted-glass element uses this three-property combination:

```css
background: rgba(255, 255, 255, 0.06); /* semi-transparent fill */
backdrop-filter: blur(18px) saturate(1.4); /* blurs what's behind */
border: 1px solid rgba(255, 255, 255, 0.1); /* subtle edge highlight */
```

Used on: navbar, search bar, genre dropdown, hero overlay, prev/next arrows.

---

## Accessibility

- Semantic HTML throughout — `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- All interactive elements have descriptive `aria-label` attributes
- Carousel slides use `aria-label` on each `<article>` element
- Dots have `role="tab"` and individual `aria-label` values
- All images have descriptive `alt` text
- Keyboard navigable — `:focus-visible` outlines visible on all controls
- `@media (prefers-reduced-motion: reduce)` disables all animations for users who need it
- Colour contrast maintained in both dark and light themes

---

## Browser Support

| Browser                | Support                                     |
| ---------------------- | ------------------------------------------- |
| Chrome / Edge          | Full                                        |
| Firefox                | Full (`backdrop-filter` enabled since v103) |
| Safari                 | Full                                        |
| Mobile Chrome / Safari | Full                                        |

---

## Technologies

- **HTML5** — semantic structure, ARIA attributes, radio and checkbox inputs used as CSS state controllers
- **CSS3** — Custom Properties, Flexbox, `backdrop-filter`, `scroll-snap`, `clamp()`, `@keyframes`, Media Queries, `:checked` pseudo-class, `~` general sibling combinator, `nth-child()`
- **Google Fonts** — Sora and Inter, loaded via CDN link tag
- **TMDB** — Movie poster and backdrop images used for visual content

---

## What This Project Demonstrates

This project was built as a frontend development exercise to explore how much interactive UI can be built without JavaScript by using modern CSS selectors and properties creatively.

**CSS state management** — the `:checked` pseudo-class on hidden radio and checkbox inputs acts as a state store. The sibling combinator `~` then reads that state and applies styles accordingly — mimicking what JavaScript event listeners would normally do.

**Component-driven CSS architecture** — splitting styles across four files (variables, components, animations, breakpoints) mirrors real-world production practices and makes each concern independently maintainable.

**Glassmorphism UI** — `backdrop-filter: blur()` combined with semi-transparent backgrounds and subtle borders creates the frosted-glass look across the navbar, dropdowns, and hero controls.

**Fluid responsive design** — `clamp()` removes the need for multiple breakpoints just to adjust font sizes, while targeted `@media` queries handle the structural layout shifts between mobile, tablet, and desktop.

**Accessible motion** — all animations are opt-out via `prefers-reduced-motion`, ensuring the site works safely for users with vestibular disorders.

---

## Author

Built by **Soumajit** as a frontend portfolio and academic project.

---

_Movie poster images are sourced from The Movie Database (TMDB). All image rights belong to their respective studios and distributors. This project is for educational and portfolio purposes only and is not intended for commercial use._
