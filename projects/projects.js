import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('portfoliowebsite/lib/projects.json');
const container = document.querySelector('.projects');
projects.forEach(p => renderProjects(p, container, 'h2'));