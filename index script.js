// JavaScript to handle the CTA button click event
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.getElementById('cta-button');

    // Add event listener to the CTA button
    ctaButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default anchor behavior
        
        // Redirect to mentee form page
        window.location.href = 'mentee form.html'; // Adjust the path if needed
    });
});
