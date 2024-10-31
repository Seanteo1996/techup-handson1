function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        interests: params.get('interests') ? params.get('interests').split(',') : []
    };
}

function setSelectedInterests() {
    const { interests } = getQueryParams();
    const checkboxes = document.querySelectorAll('.mentoring-area-checkbox-label input');

    checkboxes.forEach(checkbox => {
        if (interests.includes(checkbox.parentElement.textContent.trim())) {
            checkbox.checked = true; // Check the box if the interest matches
        }
    });
}

// Call the function to set the selected interests on page load
window.onload = setSelectedInterests;

function filterProfiles() {
    const agencyCheckboxes = document.querySelectorAll('.agency-checkbox-label input[type="checkbox"]');
    const selectedAgencies = Array.from(agencyCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.parentElement.textContent.trim());

    const interestCheckboxes = document.querySelectorAll('.mentoring-area-checkbox-label input[type="checkbox"]');
    const selectedInterests = Array.from(interestCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.parentElement.textContent.trim());

    const profileElements = document.querySelectorAll('.profile');

    profileElements.forEach(profile => {
        const profileAgencies = profile.getAttribute('data-agencies').split(', ');
        const profileInterests = profile.getAttribute('data-mentoring-areas').split(', ');

        const agencyMatch = selectedAgencies.length === 0 || selectedAgencies.some(agency => profileAgencies.includes(agency));
        const interestMatch = selectedInterests.length === 0 || selectedInterests.some(interest => profileInterests.includes(interest));

        if (agencyMatch && interestMatch) {
            profile.style.display = ''; // Show if both match
        } else {
            profile.style.display = 'none'; // Hide if not both match
        }
    });
}

function resetFilters() {
    // Select all checkboxes within the filters and uncheck them
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Uncheck each checkbox
    });

    // Call filterProfiles to update displayed profiles based on the reset state
    filterProfiles();
}
