
/////     javascipt to add functionality that .... flash ,essages automatically disappear after some time

    document.addEventListener("DOMContentLoaded", () => {
        const alerts = document.querySelectorAll('.flash-message');

        alerts.forEach(alert => {
            // Add pop-in animation
            alert.classList.add('flash-pop-in');

            // Auto dismiss after 4.5 seconds
            setTimeout(() => {
                alert.classList.remove('flash-pop-in');
                alert.classList.add('flash-pop-out');

                // Remove from DOM after pop-out animation
                setTimeout(() => {
                    alert.remove();
                }, 400); // match with animation duration
            }, 3000);
        });
    });

