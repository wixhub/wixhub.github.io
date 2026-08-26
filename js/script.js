document.addEventListener("DOMContentLoaded", async () => {
    // Set current year in the footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const projectsGrid = document.getElementById('projects-grid');
    const certificatesGrid = document.getElementById('certificates-grid');

    try {
        // Fetch projects and certificates data concurrently
        const [projectsResponse, certificatesResponse] = await Promise.all([
            fetch('data/projects.json'),
            fetch('data/certificates.json')
        ]);

        if (!projectsResponse.ok || !certificatesResponse.ok) {
            throw new Error('Failed to fetch portfolio data files.');
        }

        const projects = await projectsResponse.json();
        const certificates = await certificatesResponse.json();

        // Render projects grid
        renderProjects(projects, projectsGrid);

        // Render certificates grid
        renderCertificates(certificates, certificatesGrid);

    } catch (error) {
        console.error("Error loading portfolio data:", error);
        if (projectsGrid) {
            projectsGrid.innerHTML = '<p class="error-message">Failed to load projects. Please try again later.</p>';
        }
        if (certificatesGrid) {
            certificatesGrid.innerHTML = '<p class="error-message">Failed to load certificates. Please try again later.</p>';
        }
    }
});

// Render projects into the DOM
function renderProjects(projects, container) {
    container.innerHTML = '';

    if (!projects || projects.length === 0) {
        container.innerHTML = '<p class="error-message">No projects available.</p>';
        return;
    }

    projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'card';

        const title = document.createElement('h4');
        title.className = 'card-title';
        title.textContent = project.title;

        const desc = document.createElement('p');
        desc.className = 'card-desc';
        desc.textContent = project.description;

        // Render tags if available
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

        // Actions container for links
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'card-actions';

        if (project.link) {
            const link = document.createElement('a');
            link.className = 'card-link';
            link.href = project.link;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'View Project';
            actionsContainer.appendChild(link);
        }

        if (project.codeUrl) {
            const codeLink = document.createElement('a');
            codeLink.className = 'card-link secondary';
            codeLink.href = project.codeUrl;
            codeLink.target = '_blank';
            codeLink.rel = 'noopener noreferrer';
            codeLink.textContent = 'Source Code';
            actionsContainer.appendChild(codeLink);
        }

        card.appendChild(title);
        if (project.tags && project.tags.length > 0) {
            card.appendChild(tagsContainer);
        }
        card.appendChild(desc);
        if (actionsContainer.children.length > 0) {
            card.appendChild(actionsContainer);
        }

        container.appendChild(card);
    });
}

// Render certificates into the DOM
function renderCertificates(certificates, container) {
    container.innerHTML = '';

    if (!certificates || certificates.length === 0) {
        container.innerHTML = '<p class="error-message">No certificates available.</p>';
        return;
    }

    certificates.forEach(cert => {
        const card = document.createElement('article');
        card.className = 'card cert-card';

        // Optional course/certificate icon
        if (cert.iconUrl) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'cert-icon-wrapper';
            const icon = document.createElement('img');
            icon.src = cert.iconUrl;
            icon.alt = cert.title;
            icon.className = 'cert-icon';
            iconWrapper.appendChild(icon);
            card.appendChild(iconWrapper);
        }

        const title = document.createElement('h4');
        title.className = 'card-title';
        title.textContent = cert.title;

        const instructor = document.createElement('p');
        instructor.className = 'cert-instructor';
        instructor.textContent = `Instructor: ${cert.instructor}`;

        const desc = document.createElement('p');
        desc.className = 'card-desc';
        desc.textContent = cert.description;

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'card-actions';

        if (cert.certificateUrl) {
            const certLink = document.createElement('a');
            certLink.className = 'card-link';
            certLink.href = cert.certificateUrl;
            certLink.target = '_blank';
            certLink.rel = 'noopener noreferrer';
            certLink.textContent = 'View Certificate';
            actionsContainer.appendChild(certLink);
        }

        if (cert.codeUrl) {
            const codeLink = document.createElement('a');
            codeLink.className = 'card-link secondary';
            codeLink.href = cert.codeUrl;
            codeLink.target = '_blank';
            codeLink.rel = 'noopener noreferrer';
            codeLink.textContent = 'Course Code';
            actionsContainer.appendChild(codeLink);
        }

        card.appendChild(title);
        card.appendChild(instructor);
        card.appendChild(desc);
        
        if (actionsContainer.children.length > 0) {
            card.appendChild(actionsContainer);
        }

        container.appendChild(card);
    });
}