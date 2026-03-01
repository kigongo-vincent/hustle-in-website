# HustleIN Website

A fast, responsive, static marketing site built with semantic HTML, modern CSS, and a small amount of vanilla JavaScript. This repository contains the source for the TekJuice HustleIN website.

## Features

- Responsive layout optimized for mobile, tablet, and desktop
- Lightweight, no framework runtime
- Accessible markup and keyboard-friendly interactions
- Organized asset pipeline (icons and images)

## Tech stack

- HTML5, CSS3
- Vanilla JavaScript (ES6+)

## Getting started

You can run this site locally using any static file server. No build step is required.

### Prerequisites

- A modern browser (Chrome, Edge, Firefox, Safari)
- Optional: Python 3 (for a quick local server) or VS Code with the Live Server extension

### Clone the repository

```bash
git clone https://github.com/tekjuice/Hustle-in-website.git
cd HustleIN-website
```

### Run locally

Option 1: Using Python (built-in simple server)

```bash
# Python 3
python3 -m http.server 5500
# then open http://localhost:5500 in your browser
```

Option 2: Using VS Code Live Server

1. Open the folder in VS Code
2. Install the "Live Server" extension
3. Right-click `index.html` and select "Open with Live Server"

## Project structure

```
HustleIN-website/
├─ assets/
│  ├─ icons/
│  │  ├─ check.svg
│  │  ├─ excel.svg
│  │  ├─ logo.svg
│  │  └─ radio.svg
│  └─ images/
│     ├─ chat-bg.svg
│     ├─ excel-diss.svg
│     ├─ hero-img.svg
│     ├─ pricing-bg.svg
│     └─ w4rmhm.svg
├─ index.html   # Main page markup
├─ index.css    # Global styles
├─ index.js     # UI interactions
└─ README.md
```

## Development notes

- Keep CSS modular and organized by sections; prefer utility classes for spacing where helpful
- Favor semantic HTML elements and ARIA attributes where appropriate
- Keep JavaScript minimal and framework-agnostic; defer script loading when possible

## Deployment

This is a static site and can be deployed to any static hosting provider.

- GitHub Pages: serve from the root of the `main` branch
- Netlify / Vercel: drag-and-drop or connect repository; set publish directory to the repo root
- Any static host: upload the contents of the repository

## Contributing

1. Create a feature branch
2. Make your changes with clear, readable code
3. Validate in multiple viewport sizes and browsers
4. Open a pull request with a concise description and screenshots if UI changes

## License

Copyright © TekJuice. All rights reserved.
