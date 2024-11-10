     // Function to get query parameters from the URL
        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }

        // Function to format the date to '6 Nov (Wednesday)'
        function formatDate(date) {
            const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
            const month = date.toLocaleString('en-US', { month: 'short' });
            const day = date.getDate();
            return `${day} ${month} (${dayOfWeek})`;
        }

        // Function to check if the date is a weekend (Saturday or Sunday)
        function isWeekend(date) {
            const day = date.getDay(); // 0 is Sunday, 6 is Saturday
            return day === 0 || day === 6;
        }

        // Function to generate available time slots
        function generateTimeSlots() {
            const timeSlotSelect = document.getElementById('timeSlot');
            const timeSlots = [];
            const currentDate = new Date();
            const twoWeeksLater = new Date();
            twoWeeksLater.setDate(currentDate.getDate() + 14);

            const availableHours = [
                { start: 10, end: 12 },
                { start: 14, end: 17 }
            ];

            let generatedCount = 0;
            while (generatedCount < 15) {
                const randomDate = new Date(currentDate.getTime() + Math.random() * (twoWeeksLater - currentDate));
                if (isWeekend(randomDate)) continue;

                const selectedHourRange = availableHours[Math.floor(Math.random() * availableHours.length)];
                const startHour = selectedHourRange.start + Math.floor(Math.random() * (selectedHourRange.end - selectedHourRange.start));
                const startMinute = Math.random() < 0.5 ? 0 : 30;
                randomDate.setHours(startHour, startMinute, 0, 0);

                const startTime = formatDate(randomDate);
                const endDate = new Date(randomDate.getTime() + 30 * 60000);
                const endTime = formatDate(endDate);

                const timeSlot = {
                    start: randomDate,
                    end: endDate,
                    display: `${startTime}, ${randomDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                };

                if (!timeSlots.some(slot => slot.display === timeSlot.display)) {
                    timeSlots.push(timeSlot);
                    generatedCount++;
                }
            }

            timeSlots.sort((a, b) => a.start - b.start);

            timeSlots.forEach(function(slot) {
                const option = document.createElement('option');
                option.value = slot.display;
                option.textContent = slot.display;
                timeSlotSelect.appendChild(option);
            });
        }

        // On page load, autopopulate the mentor info and email field if the query parameters are available in the URL
        document.addEventListener('DOMContentLoaded', function() {
            const mentorName = getQueryParam('name');
            const mentorImage = getQueryParam('image');
            const userEmail = getQueryParam('userEmail');

            if (mentorName) {
                const mentorNameElement = document.getElementById('mentorName');
                mentorNameElement.textContent = mentorName;
            }

            if (mentorImage) {
                const mentorImageElement = document.getElementById('mentorImage');
                mentorImageElement.src = mentorImage;
            }

            if (userEmail) {
                const emailInput = document.getElementById('email');
                emailInput.value = userEmail;
            }

            generateTimeSlots();
        });

        // Handle form submission
        document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();  // Prevent the default form submission behavior

            // Get the form values and query parameters
            const timeSlot = document.getElementById('timeSlot').value;
            const email = document.getElementById('email').value;
            const mentorName = getQueryParam('name'); 
            const mentorImage = getQueryParam('profileImage');  // Capture the profile image URL

            // Log the captured profile image to the console
            console.log("Captured Profile Image URL:", mentorImage); // Check the value of profileImage

            // Check if required fields are filled
            if (!timeSlot || !email) {
                alert('Please fill all the fields');
                return;
            }

            // Show the loading message and spinner
            document.getElementById('loadingMessage').style.display = 'block';

            setTimeout(function() {
                const confirmationUrl = `confirmation.html?mentorName=${encodeURIComponent(mentorName)}&timeSlot=${encodeURIComponent(timeSlot)}&email=${encodeURIComponent(email)}&profileImage=${encodeURIComponent(mentorImage)}`;
                window.location.href = confirmationUrl;
            }, 4000); // Delay of 4 seconds
        });