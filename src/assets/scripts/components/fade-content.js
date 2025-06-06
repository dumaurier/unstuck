// This script directly manipulates the full_page-content element
// when a preview is active, to ensure it fades out properly

document.addEventListener('DOMContentLoaded', () => {
  console.log('Fade content script loaded');
  
  // Function to handle the fading effect
  function setupFadingEffect() {
    // Get the full page content section
    const fullPageContent = document.querySelector('.full_page-content');
    
    if (!fullPageContent) {
      console.error('Could not find full_page-content element');
      return;
    }
    
    console.log('Found full_page-content element:', fullPageContent);
    
    // Function to fade out content
    const fadeOutContent = () => {
      fullPageContent.style.opacity = '0.2';
      fullPageContent.style.zIndex = '5';
      fullPageContent.classList.add('faded-out');
      console.log('Applied fading to full_page-content');
    };
    
    // Function to restore content
    const restoreContent = () => {
      fullPageContent.style.opacity = '1';
      fullPageContent.style.zIndex = '10';
      fullPageContent.classList.remove('faded-out');
      console.log('Restored full_page-content opacity');
    };
    
    // Direct approach: listen for clicks on navigation items
    const navItems = document.querySelectorAll('.unstuck_nav li a');
    
    navItems.forEach((item) => {
      // Handle click events
      item.addEventListener('click', () => {
        console.log('Navigation item clicked');
        fadeOutContent();
      });
      
      // Also handle hover events for consistent behavior
      item.addEventListener('mouseenter', () => {
        // Only apply hover effect if we're not in click mode
        if (!document.querySelector('.click-activated')) {
          console.log('Navigation item hovered');
          fadeOutContent();
        }
      });
    });
    
    // Listen for preview visibility changes
    const previewSections = document.querySelectorAll('.unstuck_container_preview');
    previewSections.forEach(section => {
      // Use MutationObserver to watch for style changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'style') {
            const opacity = window.getComputedStyle(section).opacity;
            if (parseFloat(opacity) > 0) {
              fadeOutContent();
            } else if (!document.querySelector('.click-activated') && 
                      !document.querySelector('.unstuck_container_preview[style*="opacity: 1"]') &&
                      !document.querySelector('.unstuck_container_preview.active')) {
              restoreContent();
            }
          }
        });
      });
      
      observer.observe(section, { attributes: true });
    });
    
    // Listen for clicks outside the navigation to restore opacity
    document.addEventListener('click', (event) => {
      // Check if the click was outside the navigation and preview areas
      const isOutsideNav = !event.target.closest('.unstuck_nav');
      const isOutsidePreview = !event.target.closest('.unstuck_container_preview');
      const isOutsideSidebar = !event.target.closest('.unstuck_area');
      
      if (isOutsideNav && isOutsidePreview && isOutsideSidebar && fullPageContent.classList.contains('faded-out')) {
        restoreContent();
      }
    });
    
    // Monitor the body class for click-activated
    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (document.body.classList.contains('click-activated')) {
            console.log('Body has click-activated class, fading content');
            fadeOutContent();
          } else if (fullPageContent.classList.contains('faded-out') && 
                    !document.querySelector('.unstuck_container_preview[style*="opacity: 1"]') &&
                    !document.querySelector('.unstuck_container_preview.active')) {
            console.log('Body lost click-activated class, restoring content');
            restoreContent();
          }
        }
      });
    });
    
    bodyObserver.observe(document.body, { attributes: true });
    
    // Initial check - if body already has click-activated class or any preview is active
    if (document.body.classList.contains('click-activated') || 
        document.querySelector('.unstuck_container_preview[style*="opacity: 1"]') ||
        document.querySelector('.unstuck_container_preview.active')) {
      console.log('Initial state requires fading content');
      fadeOutContent();
    }
  }
  
  // Run the setup
  setupFadingEffect();
  
  // Also run it after a short delay to ensure everything is loaded
  setTimeout(setupFadingEffect, 500);
});
