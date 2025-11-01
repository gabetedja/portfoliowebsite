import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const container = document.querySelector('.projects');
const title = document.querySelector('.projects-title');
if (title) {
    title.textContent = `${projects.length} Projects`;
}
console.log('projects loaded?', Array.isArray(projects), 'length:', projects?.length, projects?.[0]);

projects.forEach(p => renderProjects(p, container, 'h2'));

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let arc = arcGenerator({
  startAngle: 0,
  endAngle: 2 * Math.PI,
});
d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);


let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});
let sliceGenerator = d3.pie().value((d) => d.value);


let arcData = sliceGenerator(data);


let arcs = arcData.map((d) => arcGenerator(d));
let colors = d3.scaleOrdinal(d3.schemeTableau10);

arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
})

let legend = d3.select('.legend');
data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('class', 'legend-item')
.html(`<span class="swatch" style="--color:${colors(idx)}"></span> ${d.label} <em>(${d.value})</em>`);
});

let query = '';
let searchInput = document.querySelector('.searchBar');

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {


  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year }; // TODO
  });
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));
  // TODO: clear up paths and legends

    d3.select('#projects-pie-plot').selectAll('path').remove();   
  d3.select('.legend').selectAll('*').remove();

  newArcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
})
  // update paths and legends, refer to steps 1.4 and 2.2
  let newLegend = d3.select('.legend');
  newLegend.selectAll('*').remove();
newData.forEach((d, idx) => {
  newLegend
    .append('li')
    .attr('class', 'legend-item')
.html(`<span class="swatch" style="--color:${colors(idx)}"></span> ${d.label} <em>(${d.value})</em>`);
});


}

renderPieChart(projects);

searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  let filteredProjects = projects.filter((project) => {
  let values = Object.values(project).join('\n').toLowerCase();
  return values.includes(query.toLowerCase());
});

  // TODO: render updated projects!
  container.innerHTML = '';
  filteredProjects.forEach(p => renderProjects(p, container, 'h2'));
  renderPieChart(filteredProjects);    
});


let selectedIndex = -1;
let svg = d3.select('svg');
svg.selectAll('path').remove();
arcs.forEach((arc, i) => {
  svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;
      svg.selectAll('path')
     .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : null));

     d3.select('.legend')
    .selectAll('li')
    .attr('class', (_, idx) => (idx === selectedIndex ? 'legend-item selected' : 'legend-item'));

    });

     if (selectedIndex === -1) {
    renderProjects(projects, container, 'h2');
    renderPieChart(projects);
  } else {
    let targetYear = data[selectedIndex].label;  
    let filtered = projects.filter(p => p.year === targetYear);
    renderProjects(filtered, container, 'h2');
    renderPieChart(filtered);
  }
});