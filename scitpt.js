// script.js
document.addEventListener('DOMContentLoaded', function() {
    VanillaTilt.init(document.querySelectorAll('.portfolio-item'), {
        max: 25,
        speed: 400,
        glare: true,
        'max-glare': 0.5,
    });

    const packages = document.querySelectorAll('.package');
    packages.forEach(packageItem => {
        const color = packageItem.dataset.color;
        packageItem.style.border = `3px solid ${color}`;
        packageItem.addEventListener('mouseenter', () => {
            packageItem.style.backgroundColor = color;
            packageItem.querySelectorAll('*').forEach(element => {
                element.style.color = 'white';
            });
        });

        packageItem.addEventListener('mouseleave', () => {
            packageItem.style.backgroundColor = 'white';
            packageItem.querySelectorAll('*').forEach(element => {
                element.style.color = '';
            });
        });
    });

    // Add more interactive features here if desired.
});