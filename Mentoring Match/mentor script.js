// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        interests: params.get('interests') ? params.get('interests').split(',') : []
    };
}

// Function to set selected interests based on URL parameters
function setSelectedInterests() {
    const { interests } = getQueryParams();
    const checkboxes = document.querySelectorAll('.mentoring-area-checkbox-label input');

    checkboxes.forEach(checkbox => {
        if (interests.includes(checkbox.parentElement.textContent.trim())) {
            checkbox.checked = true; // Check the box if the interest matches
        }
    });
}

// Function to filter profiles based on selected agencies and interests
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
        const profileAgencies = profile.getAttribute('data-agencies')?.split(', ') || [];
        const profileInterests = profile.getAttribute('data-mentoring-areas')?.split(', ') || [];

        const agencyMatch = selectedAgencies.length === 0 || selectedAgencies.some(agency => profileAgencies.includes(agency));
        const interestMatch = selectedInterests.length === 0 || selectedInterests.some(interest => profileInterests.includes(interest));

        // Show the profile if both agency and interest match
        if (agencyMatch && interestMatch) {
            profile.style.display = ''; // Show profile
        } else {
            profile.style.display = 'none'; // Hide profile
        }
    });
}

// Function to reset filters
function resetFilters() {
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Uncheck each checkbox
    });

    filterProfiles(); // Update displayed profiles based on the reset state
}

// Add event listeners to mentoring buttons
function addMentoringButtonListeners() {
    const mentoringButtons = document.querySelectorAll('.mentoring-btn');

    mentoringButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedInterest = button.value; // Get the value of the button (interest)
            const interestCheckbox = document.querySelector(`.mentoring-area-checkbox-label input[type="checkbox"][value="${selectedInterest}"]`);
            if (interestCheckbox) {
                interestCheckbox.checked = !interestCheckbox.checked; // Toggle the checkbox
            }
            filterProfiles(); // Re-filter profiles based on the current selections
        });
    });
}

// Call the function to add event listeners when the page loads
window.onload = function() {
    setSelectedInterests();
    addMentoringButtonListeners(); // Initialize button listeners
    filterProfiles(); // Initial filter based on any preset selections
};
