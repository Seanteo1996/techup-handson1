function validateForm() {
    const emailInput = document.getElementById('email');
    const emailErrorMessage = document.getElementById('email-error-message');
    const checkboxErrorMessage = document.getElementById('checkbox-error-message');
    const emailValue = emailInput.value;

    // Regex to check if email ends with .gov.sg
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(gov\.sg)$/;

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
    let isChecked = false;
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            isChecked = true; // At least one checkbox is checked
        }
    });

    // Show checkbox error if no checkboxes are checked
    if (!isChecked) {
        checkboxErrorMessage.style.display = 'block'; // Show checkbox error
        return false; // Prevent form submission
    }

    return true; // Allow form submission
}

function filterAgencies() {
    const input = document.getElementById('agency-input');
    const filter = input.value.toLowerCase();
    const dropdownList = document.getElementById('agency-list');
    const items = dropdownList.getElementsByClassName('dropdown-item');

    // Show the dropdown list when typing
    dropdownList.style.display = 'block';

    // Loop through the items and hide those that don't match the input
    for (let i = 0; i < items.length; i++) {
        const txtValue = items[i].textContent || items[i].innerText;
        items[i].style.display = txtValue.toLowerCase().includes(filter) ? "" : "none"; 
    }

    // Hide the dropdown if input is empty
    if (filter === "") {
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

    if (agencyInput.trim().toLowerCase() === 'others') {
        otherAgencyQuestion.style.display = 'block'; // Show if "Others" is selected
    } else {
        otherAgencyQuestion.style.display = 'none'; // Hide if not
        document.getElementById('other-agency').value = ''; // Clear input if hidden
    }
}



