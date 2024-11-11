function validateForm() {
    const emailInput = document.getElementById('email');
    const emailErrorMessage = document.getElementById('email-error-message');
    const checkboxErrorMessage = document.getElementById('checkbox-error-message');
    const emailValue = emailInput.value;

    // Get the email value
    const email = document.getElementById('email').value;

    // Store email in local storage or pass it to the next page via URL
    localStorage.setItem('userEmail', email);

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

    // Show the loading message and spinner
    const loadingMessage = document.getElementById('loadingMessage');
    console.log("Showing loading message...");
    loadingMessage.style.display = 'block'; // This shows the loading spinner

    // Simulate a 2-second delay before redirecting
    setTimeout(function() {
        // Hide the loading spinner before redirecting
        loadingMessage.style.display = 'none';

        // Redirect to the result page with selected interests as a query parameter
        window.location.href = `result page.html?interests=${encodeURIComponent(selectedInterests)}&email=${encodeURIComponent(email)}`;
        }, 2000); // 2-second delay

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

// On page load, filter profiles based on interests
document.addEventListener('DOMContentLoaded', function() {
    // Your code here
    console.log('Page has loaded');
    // You can call your function here
   checkAgency();
});

