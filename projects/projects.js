import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const container = document.querySelector('.projects');
const title = document.querySelector('.projects-title');
if (title) {
    title.textContent = `${projects.length} Projects`;
}
console.log('projects loaded?', Array.isArray(projects), 'length:', projects?.length, projects?.[0]);

projects.forEach(p => renderProjects(p, container, 'h2'));