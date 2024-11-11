// Function to get query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(param);
    console.log(`Captured ${param}:`, value); // Log the captured value
    return value;
}

// On page load, populate the confirmation details
document.addEventListener('DOMContentLoaded', function() {
    const mentorName = getQueryParam('mentorName');
    const timeSlot = getQueryParam('timeSlot');
    const mentorImage = getQueryParam('image'); // Get profile image URL

    if (mentorName) {
        document.getElementById('mentorName').textContent = mentorName;
    }

    if (timeSlot) {
        document.getElementById('timeSlot').textContent = timeSlot;
    }

    if (mentorImage) {
        document.getElementById('mentorImage').src = mentorImage; // Set the profile image in the confirmation page
    }
});
