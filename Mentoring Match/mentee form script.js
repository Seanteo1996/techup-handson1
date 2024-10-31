function validateForm() {
    const emailInput = document.getElementById('email');
    const emailErrorMessage = document.getElementById('email-error-message');
    const checkboxErrorMessage = document.getElementById('checkbox-error-message');
    const emailValue = emailInput.value;

    // Regex to check if email ends with .gov.sg
    const emailPattern = /.*\.gov\.sg$/;

    // Reset error messages
    emailErrorMessage.style.display = 'none';
    checkboxErrorMessage.style.display = 'none';

    // Validate email
    if (!emailPattern.test(emailValue)) {
        emailErrorMessage.style.display = 'block'; // Show email error
        return false; // Prevent form submission
    }

    // Validate checkboxes
    const checkboxes = document.querySelectorAll('input[name="interests"]');
    let isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

    if (!isChecked) {
        checkboxErrorMessage.style.display = 'block'; // Show checkbox error
        return false; // Prevent form submission
    }

    // Collect checked interests
    const selectedInterests = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value)
        .join(',');

    // Redirect to the results page with selected interests as a query parameter
    window.location.href = `result page.html?interests=${encodeURIComponent(selectedInterests)}`;
    
    // Prevent actual form submission
    return false;
}

function filterAgencies() {
    const input = document.getElementById('agency-input');
    const filter = input.value.toLowerCase();
    const dropdownList = document.getElementById('agency-list');
    const items = dropdownList.getElementsByClassName('dropdown-item');

    // Show the dropdown list when typing
    dropdownList.style.display = 'block';

    let hasVisibleItems = false; // Track if there are visible items

    // Loop through the items and hide those that don't match the input
    for (let i = 0; i < items.length; i++) {
        const txtValue = items[i].textContent || items[i].innerText;
        items[i].style.display = txtValue.toLowerCase().includes(filter) ? "" : "none"; 
        if (txtValue.toLowerCase().includes(filter)) {
            hasVisibleItems = true;
        }
    }

    // Hide the dropdown if there are no matches
    if (!hasVisibleItems || filter === "") {
        dropdownList.style.display = 'none';
    }
}


function selectAgency(value) {
    const input = document.getElementById('agency-input');
    input.value = value; // Set the input value to the selected option
    document.getElementById('agency-list').style.display = 'none'; // Hide the dropdown
    checkAgency(); // Check if we need to show the other agency input
}

function checkAgency() {
    const agencyInput = document.getElementById('agency-input').value;
    const otherAgencyQuestion = document.getElementById('other-agency-question');
    const otherAgencyInput = document.getElementById('other-agency-input');

    if (agencyInput.trim().toLowerCase() === 'others') {
        otherAgencyQuestion.style.display = 'block'; // Show if "Others" is selected
        otherAgencyInput.setAttribute('required', ''); // Make it required
    } else {
        otherAgencyQuestion.style.display = 'none'; // Hide if not
        otherAgencyInput.value = ''; // Clear input if hidden
        otherAgencyInput.removeAttribute('required'); // Remove required attribute
    }
}


function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to filter profiles based on selected interests
function filterProfilesByInterests(selectedInterests) {
    const profiles = document.querySelectorAll('.profile');
    profiles.forEach(profile => {
        const mentoringAreas = profile.getAttribute('data-mentoring-areas').split(', '); // Assuming areas are separated by commas
        if (mentoringAreas.some(area => selectedInterests.includes(area))) {
            profile.style.display = 'block'; // Show profile
        } else {
            profile.style.display = 'none'; // Hide profile
        }
    });
}

// On page load, filter profiles based on interests
document.addEventListener('DOMContentLoaded', () => {
    const interests = getQueryParam('interests');
    if (interests) {
        const selectedInterests = interests.split(','); // Split by comma
        filterProfilesByInterests(selectedInterests);
    }
});
