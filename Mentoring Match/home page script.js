// JavaScript for carousel functionality (basic horizontal scroll with auto scroll)

document.addEventListener("DOMContentLoaded", function () {
    const carouselContainer = document.querySelector(".carousel-container");
    let scrollAmount = 0;

    // Scroll carousel every 3 seconds
    setInterval(() => {
        if (scrollAmount >= carouselContainer.scrollWidth - carouselContainer.clientWidth) {
            scrollAmount = 0;
        } else {
            scrollAmount += 200;
        }
        carouselContainer.scrollTo({
            left: scrollAmount,
            behavior: "smooth"
        });
    }, 3000); // Adjust the interval time as needed
});
