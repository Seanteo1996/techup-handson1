function toggleOtherAgencyInput() {
    const agencySelect = document.getElementById('agency');
    const otherAgencyInput = document.getElementById('other-agency');
    const otherAgencyLabel = document.getElementById('other-agency-label');

    if (agencySelect.value === 'Others') {
        otherAgencyInput.style.display = 'block';
        otherAgencyLabel.style.display = 'block'; // Show label when "Others" is selected
    } else {
        otherAgencyInput.style.display = 'none';
        otherAgencyLabel.style.display = 'none'; // Hide label when not selected
        otherAgencyInput.value = ''; // Clear the input if not selected
    }
}