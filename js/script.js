document.addEventListener("DOMContentLoaded", async () => {
    // 1. Set current year in the footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const gridContainer = document.getElementById('projects-grid');
    const filterContainer = document.getElementById('filter-container');

    try {
        // 2. Fetch projects data from external JSON file
        const response = await fetch('data/projects.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const projects = await response.json();

        // 3. Initial render of all projects
        renderProjects(projects, gridContainer);

        // 4. Setup dynamic tags and multi-filtering
        setupMultiFilters(projects, gridContainer, filterContainer);

    } catch (error) {
        console.error("Failed to load projects:", error);
        if (gridContainer) {
            gridContainer.innerHTML = '<p style="color: white; grid-column: 1/-1; text-align: center;">Failed to load projects. Please try again later.</p>';
        }
    }
});

// Render projects function
function renderProjects(projectsToRender, container) {
    container.innerHTML = '';

    if (projectsToRender.length === 0) {
        container.innerHTML = '<p style="color: white; grid-column: 1/-1; text-align: center;">No projects found for the selected tags.</p>';
        return;
    }

    projectsToRender.forEach(project => {
        const card = document.createElement('article');
        card.className = 'card';

        const title = document.createElement('h4');
        title.className = 'card-title';
        title.textContent = project.title;

        const desc = document.createElement('p');
        desc.className = 'card-desc';
        desc.textContent = project.description;

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tags';
        
        if (project.tags && project.tags.length > 0) {
            project.tags.forEach(tagText => {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.textContent = tagText;
                tagsContainer.appendChild(tag);
            });
        }

        const link = document.createElement('a');
        link.className = 'card-link';
        link.href = project.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'View Project';

        card.appendChild(title);
        card.appendChild(tagsContainer);
        card.appendChild(desc);
        card.appendChild(link);

        container.appendChild(card);
    });
}

// Setup dynamic multi-selection filter buttons
function setupMultiFilters(projects, container, filterContainer) {
    // Extract all unique tags from projects
    const allTagsSet = new Set();
    projects.forEach(project => {
        if (project.tags) {
            project.tags.forEach(tag => allTagsSet.add(tag));
        }
    });

    const uniqueTags = ['All', ...Array.from(allTagsSet)];

    // Clear the filter container first
    filterContainer.innerHTML = '';

    // Keep track of currently selected tags (store lowercase or exact strings)
    let selectedTags = new Set();

    // Create buttons for each unique tag
    uniqueTags.forEach((tag) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        if (tag === 'All') btn.classList.add('active'); // 'All' is active by default
        btn.textContent = tag;

        btn.addEventListener('click', () => {
            const allBtn = filterContainer.querySelector('.filter-btn'); // First button is 'All'

            if (tag === 'All') {
                // If 'All' is clicked, clear all selections and activate only 'All'
                selectedTags.clear();
                filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                allBtn.classList.add('active');
                renderProjects(projects, container);
                return;
            }

            // For regular tags, toggle selection
            if (selectedTags.has(tag)) {
                selectedTags.delete(tag);
                btn.classList.remove('active');
            } else {
                selectedTags.add(tag);
                btn.classList.add('active');
            }

            // If no tags are selected anymore, fallback to 'All'
            if (selectedTags.size === 0) {
                allBtn.classList.add('active');
                renderProjects(projects, container);
            } else {
                // Deselect 'All' when specific tags are chosen
                allBtn.classList.remove('active');

                // Filter projects: show project if it includes AT LEAST ONE of the selected tags (OR logic)
                // If you want AND logic (project must contain ALL selected tags), change 'some' to 'every'
                const filtered = projects.filter(project => {
                    if (!project.tags) return false;
                    return Array.from(selectedTags).some(selectedTag => project.tags.includes(selectedTag));
                });

                renderProjects(filtered, container);
            }
        });

        filterContainer.appendChild(btn);
    });
}