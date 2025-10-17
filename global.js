console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let navLinks = $$("nav a");

let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname,
);

if (currentLink) {
  // or if (currentLink !== undefined)
  currentLink.classList.add('current');
}

let pages = [
  { url: '/portfoliowebsite/', title: 'Home Page' },
  { url: '/portfoliowebsite/projects', title: 'Projects' },
  { url: '/portfoliowebsite/contact/', title: 'Contact' },
  { url: 'https://github.com/gabetedja/', title: 'Github' },
  { url: '/portfoliowebsite/resume/', title: 'Resume' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
}

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfoliowebsite/";         // GitHub Pages repo name

  if (!url.startsWith('http')) {
  url = BASE_PATH + url;
}