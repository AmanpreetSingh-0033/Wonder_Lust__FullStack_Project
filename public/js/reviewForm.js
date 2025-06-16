
const stars = document.querySelectorAll('.star-rating i');
const ratingInput = document.getElementById('rating');

stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const index = parseInt(star.dataset.index);
        highlightStars(index);
    });

    star.addEventListener('click', () => {
        const selectedRating = parseInt(star.dataset.index);
        ratingInput.value = selectedRating;
        selectStars(selectedRating);
    });

    star.addEventListener('mouseleave', () => {
        const currentRating = parseInt(ratingInput.value);
        selectStars(currentRating);
    });
});

function highlightStars(index) {
    stars.forEach(star => {
        star.classList.remove('hovered');
        if (parseInt(star.dataset.index) <= index) {
            star.classList.add('hovered');
        }
    });
}

function selectStars(index) {
    stars.forEach(star => {
        star.classList.remove('selected');
        if (parseInt(star.dataset.index) <= index) {
            star.classList.add('selected');
        }
    });
}

