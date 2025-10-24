console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '/portfoliowebsite/', title: 'Home Page' },
  { url: '/portfoliowebsite/projects/', title: 'Projects' },
  { url: '/portfoliowebsite/contact/', title: 'Contact' },
  { url: 'https://github.com/gabetedja/', title: 'Github' },
  { url: '/portfoliowebsite/resume/', title: 'Resume' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    

    if (a.host !== location.host) a.target = "_blank";

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    nav.append(a);
}

let navLinks = $$("nav a");


let currentLink = navLinks.find(
 (a) => a.host === location.host && a.pathname === location.pathname,
);


if (currentLink) {
 // or if (currentLink !== undefined)
 currentLink.classList.add('current');
}




document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="auto" selected>Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
		</select>
	</label>`,
);

let select = document.querySelector(".color-scheme select");

if ("colorScheme" in localStorage) {
    select.value = localStorage.colorScheme
    document.documentElement.style.setProperty("color-scheme", select.value);
}

select.addEventListener("input", (e) => {
  const choice = e.target.value;            
  if (choice === "auto") {
    document.documentElement.style.removeProperty("color-scheme");
  } else {
    document.documentElement.style.setProperty("color-scheme", choice);
  }     
  localStorage.colorScheme = choice;        
});

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
       
    }
     const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  const article = document.createElement('article');
  article.innerHTML = `
    <h3>${project.title}</h3>
    <img src="${project.image}" alt="${project.title}">
    <p>${project.description}</p>
`;
containerElement.appendChild(article);



}