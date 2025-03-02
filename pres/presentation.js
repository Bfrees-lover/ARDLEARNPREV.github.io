/**
 * ArdLearn Presentation JavaScript
 * Enhanced functionality for the ArdLearn presentation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Variables
    let currentSlide = 1;
    const totalSlides = document.querySelectorAll('.slide').length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideNumber = document.getElementById('slideNumber');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Initialize
    updateSlideNumber();
    checkNavigationButtons();
    
    // Event Listeners
    prevBtn.addEventListener('click', goToPrevSlide);
    nextBtn.addEventListener('click', goToNextSlide);
    document.addEventListener('keydown', handleKeyNavigation);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Touch navigation
    let touchStartX = 0;
    let touchEndX = 0;
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    // Progress bar
    createProgressBar();
    
    // Functions
    function showSlide(slideNumber) {
        // Hide all slides
        document.querySelectorAll('.slide').forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // Show the current slide
        document.getElementById('slide' + slideNumber).classList.add('active');
        
        // Mark previous slides
        if (slideNumber > 1) {
            document.getElementById('slide' + (slideNumber - 1)).classList.add('prev');
        }
        
        // Reset animations for the current slide
        const currentSlideElement = document.getElementById('slide' + slideNumber);
        const listItems = currentSlideElement.querySelectorAll('.animated-list li');
        
        listItems.forEach(item => {
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = null;
        });
        
        // Update progress bar
        updateProgressBar();
        
        // Update slide number
        updateSlideNumber();
        
        // Check navigation buttons
        checkNavigationButtons();
    }
    
    function goToPrevSlide() {
        if (currentSlide > 1) {
            currentSlide--;
            showSlide(currentSlide);
        }
    }
    
    function goToNextSlide() {
        if (currentSlide < totalSlides) {
            currentSlide++;
            showSlide(currentSlide);
        }
    }
    
    function handleKeyNavigation(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            goToNextSlide();
        } else if (e.key === 'ArrowLeft') {
            goToPrevSlide();
        } else if (e.key === 'Home') {
            currentSlide = 1;
            showSlide(currentSlide);
        } else if (e.key === 'End') {
            currentSlide = totalSlides;
            showSlide(currentSlide);
        }
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('ardlearn-theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('ardlearn-theme', 'light');
        }
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            goToNextSlide();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            goToPrevSlide();
        }
    }
    
    function updateSlideNumber() {
        slideNumber.textContent = currentSlide + ' / ' + totalSlides;
    }
    
    function checkNavigationButtons() {
        // Disable prev button on first slide
        if (currentSlide === 1) {
            prevBtn.classList.add('disabled');
            prevBtn.setAttribute('disabled', true);
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.removeAttribute('disabled');
        }
        
        // Disable next button on last slide
        if (currentSlide === totalSlides) {
            nextBtn.classList.add('disabled');
            nextBtn.setAttribute('disabled', true);
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.removeAttribute('disabled');
        }
    }
    
    function createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'progress-indicator';
        progressBar.appendChild(progressIndicator);
        
        document.querySelector('.slide-container').appendChild(progressBar);
        
        // Create slide indicators
        for (let i = 1; i <= totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'slide-indicator';
            indicator.setAttribute('data-slide', i);
            indicator.title = 'Перейти к слайду ' + i;
            
            // Add click event to jump to slide
            indicator.addEventListener('click', function() {
                currentSlide = parseInt(this.getAttribute('data-slide'));
                showSlide(currentSlide);
            });
            
            progressBar.appendChild(indicator);
        }
        
        updateProgressBar();
    }
    
    function updateProgressBar() {
        // Update progress indicator
        const progressPercent = ((currentSlide - 1) / (totalSlides - 1)) * 100;
        document.querySelector('.progress-indicator').style.width = progressPercent + '%';
        
        // Update slide indicators
        document.querySelectorAll('.slide-indicator').forEach((indicator, index) => {
            if (index + 1 < currentSlide) {
                indicator.classList.add('visited');
                indicator.classList.remove('active');
            } else if (index + 1 === currentSlide) {
                indicator.classList.add('active');
                indicator.classList.remove('visited');
            } else {
                indicator.classList.remove('active', 'visited');
            }
        });
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('ardlearn-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Add fullscreen button
    addFullscreenButton();
    
    function addFullscreenButton() {
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-toggle';
        fullscreenBtn.title = 'Полноэкранный режим';
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        
        document.querySelector('.slide-container').appendChild(fullscreenBtn);
    }
    
    function toggleFullscreen() {
        const fullscreenBtn = document.querySelector('.fullscreen-toggle');
        const icon = fullscreenBtn.querySelector('i');
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Ошибка при переходе в полноэкранный режим: ${err.message}`);
            });
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        }
    }
    
    // Show first slide
    showSlide(currentSlide);
}); 