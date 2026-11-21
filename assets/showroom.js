const projectHash = "#project/";
const projectList = document.querySelector("#projects");
const cardTemplate = document.querySelector("#project-card");
const caseStudy = document.querySelector("#case-study");
const caseTitle = document.querySelector("#case-title");
const nextCase = document.querySelector("#next-case");
const projectStatus = document.querySelector("#project-status");

let projects = [];
let trigger = null;
let returnHash = "";

function projectUrl(project) {
  return projectHash + project.id;
}

function setImage(element, image) {
  element.src = image.src;
  element.alt = image.alt;
}

function renderProjects(featuredProjectId) {
  const cards = document.createDocumentFragment();

  for (const project of projects) {
    const card = cardTemplate.content.cloneNode(true);
    const link = card.querySelector("[data-project-link]");
    const title = card.querySelector("[data-title]");

    title.id = "project-title-" + project.id;
    title.textContent = project.title;
    link.href = projectUrl(project);
    link.setAttribute("aria-labelledby", title.id);
    card.querySelector("[data-category]").textContent = project.category;
    card.querySelector("[data-summary]").textContent = project.summary;
    setImage(card.querySelector("img"), project.image);
    cards.append(card);
  }

  projectList.replaceChildren(cards);

  const featured = projects.find((project) => project.id === featuredProjectId);
  if (!featured) return;

  const feature = document.querySelector("#featured");
  const featureImage = feature.querySelector("[data-feature-image]");
  const featureTitle = feature.querySelector("[data-feature-title]");
  const featureLink = feature.querySelector(".feature-link");

  setImage(featureImage, featured.image);
  featureTitle.textContent = featured.title;
  featureLink.setAttribute("aria-label", "Read the " + featured.title + " case study");
  for (const link of feature.querySelectorAll("[data-feature-link]")) {
    link.href = projectUrl(featured);
  }
  feature.hidden = false;
}

function showCaseStudy(projectIndex) {
  const project = projects[projectIndex];

  caseTitle.textContent = project.title;
  document.querySelector("#case-category").textContent = project.category;
  document.querySelector("#case-summary").textContent = project.summary;
  document.querySelector("#case-brief").textContent = project.brief;
  document.querySelector("#case-approach").textContent = project.approach;
  setImage(document.querySelector("#case-image"), project.image);

  const deliverables = project.deliverables.map((deliverable) => {
    const item = document.createElement("li");
    item.textContent = deliverable;
    return item;
  });
  document.querySelector("#case-deliverables").replaceChildren(...deliverables);

  const next = projects[(projectIndex + 1) % projects.length];
  nextCase.hidden = next === project;
  nextCase.textContent = "Next project · " + next.title;
  nextCase.href = projectUrl(next);

  if (!caseStudy.open) caseStudy.showModal();
  caseStudy.scrollTop = 0;
  caseTitle.focus({ preventScroll: true });
}

function syncProjectLocation() {
  const index = projects.findIndex((project) => projectUrl(project) === location.hash);
  if (index >= 0) {
    showCaseStudy(index);
    return;
  }

  if (caseStudy.open) caseStudy.close();
  if (location.hash.startsWith(projectHash)) {
    history.replaceState(null, "", "#work");
    document.querySelector("#work").scrollIntoView();
  }
}

function renderListingLink(value) {
  if (typeof value !== "string" || !value.trim()) return;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return;
    const link = document.querySelector("#listing-link");
    link.href = url.href;
    link.hidden = false;
    document.querySelector("#listing-fallback").hidden = true;
  } catch {
    // Leave the plain-text HireLDS instructions visible until a URL is set.
  }
}

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
      event.ctrlKey || event.shiftKey || event.altKey || caseStudy.open) return;

  const link = event.target.closest('a[href^="#project/"]');
  if (!link) return;
  trigger = link;
  returnHash = location.hash;
});

window.addEventListener("hashchange", syncProjectLocation);
document.querySelector("#close-case").addEventListener("click", () => caseStudy.close());

caseStudy.addEventListener("click", (event) => {
  if (event.target === caseStudy) caseStudy.close();
});

caseStudy.addEventListener("close", () => {
  if (location.hash.startsWith(projectHash)) {
    const restoredHash = trigger ? returnHash : "#work";
    history.replaceState(null, "", restoredHash || location.pathname + location.search);
    if (!trigger) {
      document.querySelector("#work").scrollIntoView();
      document.querySelector("#work-title").focus({ preventScroll: true });
    }
  }

  if (trigger) trigger.focus({ preventScroll: true });
  trigger = null;
  returnHash = "";
});

async function loadPortfolio() {
  try {
    const response = await fetch("./data/portfolio.json");
    if (!response.ok) throw new Error("Portfolio data could not be loaded.");
    const data = await response.json();
    projects = data.projects;
    renderProjects(data.featuredProject);
    renderListingLink(data.hireLdsListingUrl);
    syncProjectLocation();

    if (!projects.length) {
      projectStatus.textContent = "Check back for selected projects.";
      projectStatus.hidden = false;
    }
  } catch (error) {
    console.error(error);
    projectStatus.textContent = location.protocol === "file:"
      ? "Serve the site from a local web server to load the projects. See the README for the preview command."
      : "The sample projects could not load. Refresh to try again.";
    projectStatus.hidden = false;
  }
}

loadPortfolio();
