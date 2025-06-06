function applyRandomSkew(selector, minSkew, maxSkew) {
    const elements = document.querySelectorAll(selector);
  
    // Use `forEach` to iterate over the NodeList
    elements.forEach(element => {
      const randomSkew = Math.random() * (maxSkew - minSkew) + minSkew;
      element.style.transform = `rotate(${randomSkew}deg)`;
    });
  }
  

  function handleNavInteractions() {
    const buttons = document.querySelectorAll('[data-js-btn]');
    const sidebar = document.querySelector('.unstuck_area');
    const curtainR = document.querySelector('.unstuck_right');
    const curtainL = document.querySelector('.unstuck_left');
    const previewSections = document.querySelectorAll('.unstuck_container_preview');
    
    let removeCurtainTimeout; // Variable to store the timeout ID
    let currentActivePreview = null; // Track the currently active preview
    let isDesktop = window.matchMedia('(min-width: 768px)').matches; // Check if device is desktop
    
    // Function to hide all preview sections
    const hideAllPreviews = () => {
      previewSections.forEach(section => {
        section.classList.remove("active");
        section.style.opacity = '0';
        section.style.zIndex = '-1';
        
        // Find the button that controls this section
        const sectionClass = section.className.split(' ')[1]; // Get the second class
        if (sectionClass) {
          const buttonKey = sectionClass.replace('unstuck_', '').replace('-preview', '');
          const button = document.querySelector(`[data-js-btn="${buttonKey}"]`);
          
          if (button) {
            button.setAttribute('aria-expanded', 'false');
          }
        }
      });
    };
    
// Function to show a specific preview section (full visibility) - consistent for all pages
const showPreview = (previewSection) => {
  if (previewSection) {
    previewSection.classList.remove("peek");
    previewSection.classList.add("active");
    previewSection.style.opacity = '1';
    
    // Use the same z-index for all pages
    previewSection.style.zIndex = '20';
    
    currentActivePreview = previewSection;
    
    // Find the button that controls this section
    const sectionClass = previewSection.className.split(' ')[1]; // Get the second class
    if (sectionClass) {
      const buttonKey = sectionClass.replace('unstuck_', '').replace('-preview', '');
      const button = document.querySelector(`[data-js-btn="${buttonKey}"]`);
      
      if (button) {
        button.setAttribute('aria-expanded', 'true');
      }
    }
    
    // Fade out the full page content
    const fullPageContent = document.querySelector('.full_page-content');
    if (fullPageContent) {
      fullPageContent.classList.add('preview-active');
    }
  }
};
    
// Function to peek at a preview section (partial visibility)
const peekPreview = (previewSection) => {
  if (previewSection) {
    previewSection.classList.add("peek");
    previewSection.style.opacity = '1';
    previewSection.style.zIndex = '20'; // Higher z-index to ensure visibility on all pages
    currentActivePreview = previewSection;
    
    // Find the button that controls this section
    const sectionClass = previewSection.className.split(' ')[1]; // Get the second class
    if (sectionClass) {
      const buttonKey = sectionClass.replace('unstuck_', '').replace('-preview', '');
      const button = document.querySelector(`[data-js-btn="${buttonKey}"]`);
      
      if (button) {
        button.setAttribute('aria-expanded', 'false');
      }
    }
    
    // Fade out the full page content on hover
    const fullPageContent = document.querySelector('.full_page-content');
    if (fullPageContent) {
      fullPageContent.classList.add('preview-active');
    }
  }
};
    
// Function to peek UI elements (for hover) - using homepage behavior for all pages
const peekUI = (targetElement) => {
  // Use homepage behavior for all pages - remove all peek/active classes first
  document.querySelectorAll('[data-js]').forEach(el => {
    el.classList.remove("peek");
    el.classList.remove("active");
  });
  
  // Then peek the target
  targetElement.classList.add("peek");
  sidebar.classList.add("peek");
  curtainR.classList.add("peek");
  curtainL.classList.add("peek");
  
  // Fade out the full page content on hover
  const fullPageContent = document.querySelector('.full_page-content');
  if (fullPageContent) {
    fullPageContent.classList.add('preview-active');
  }
};
    
    // Function to activate UI elements (for click)
    const activateUI = (targetElement) => {
      // First, deactivate all elements
      document.querySelectorAll('[data-js]').forEach(el => {
        el.classList.remove("peek");
        el.classList.remove("active");
      });
      
      // Then activate the target
      targetElement.classList.add("active");
      sidebar.classList.add("active");
      curtainR.classList.add("active");
      curtainL.classList.add("active");
    };
    
// Function to deactivate UI elements - using homepage behavior for all pages
const deactivateUI = () => {
  // Remove preview-active class from full page content
  const fullPageContent = document.querySelector('.full_page-content');
  if (fullPageContent) {
    fullPageContent.classList.remove('preview-active');
  }
  
  // Use homepage behavior for all pages - remove all peek/active classes
  document.querySelectorAll('[data-js]').forEach(el => {
    el.classList.remove("peek");
    el.classList.remove("active");
  });
  sidebar.classList.remove("peek");
  sidebar.classList.remove("active");
  
  // Add a delay before removing the classes from curtainL and curtainR
  removeCurtainTimeout = setTimeout(() => {
    curtainR.classList.remove("peek");
    curtainR.classList.remove("active");
    curtainL.classList.remove("peek");
    curtainL.classList.remove("active");
    
    // Fade out the preview section with a delay
    if (currentActivePreview) {
      setTimeout(() => {
        currentActivePreview.classList.remove("peek");
        currentActivePreview.classList.remove("active");
        currentActivePreview.style.opacity = '0';
        currentActivePreview.style.zIndex = '-1';
      }, 100);
    }
  }, 200);
};
    
    // Initialize preview sections with transitions
    previewSections.forEach(section => {
      section.style.transition = 'opacity 0.3s ease-in-out';
      section.style.opacity = '0';
      
      // Add an ID to the preview section if it doesn't have one
      if (!section.id) {
        const sectionClass = section.className.split(' ')[1]; // Get the second class
        if (sectionClass) {
          const buttonKey = sectionClass.replace('unstuck_', '').replace('-preview', '');
          section.id = `preview-${buttonKey}`;
        }
      }
      
      // Add mouse enter/leave events for preview sections (desktop only)
      if (isDesktop) {
        section.addEventListener("mouseenter", () => {
          // Clear any existing timeout to prevent hiding
          clearTimeout(removeCurtainTimeout);
          
          // Keep the preview visible
          if (currentActivePreview === section) {
            // If we're in click mode, show full preview
            if (document.querySelector('.click-activated')) {
              section.classList.remove("peek");
              section.classList.add("active");
              section.style.opacity = '1';
              section.style.zIndex = '20';
            } else {
              // Otherwise maintain peek state
              section.classList.add("peek");
              section.style.opacity = '0.3';
              section.style.zIndex = '2';
            }
          }
        });
        
        section.addEventListener("mouseleave", () => {
          // When mouse leaves the preview, check if we're in hover mode
          // If we're in click mode (something was clicked), don't deactivate
          if (!document.querySelector('.click-activated')) {
            deactivateUI();
          }
        });
      }
    });
    
    // Listen for window resize to update isDesktop
    window.addEventListener('resize', () => {
      isDesktop = window.matchMedia('(min-width: 768px)').matches;
    });

    buttons.forEach((button) => {
      // Get the value of the button's data-js-btn attribute
      const targetKey = button.getAttribute("data-js-btn");
      // Find the corresponding element with the matching data-js attribute
      const targetElement = document.querySelector(`[data-js="${targetKey}"]`);
      // Find the corresponding preview section (if it exists)
      const previewSection = document.querySelector(`.unstuck_${targetKey}-preview`);

      // Set initial ARIA attributes
      button.setAttribute('aria-expanded', 'false');
      if (previewSection) {
        button.setAttribute('aria-controls', previewSection.id || `preview-${targetKey}`);
        
        // Add an ID to the preview section if it doesn't have one
        if (!previewSection.id) {
          previewSection.id = `preview-${targetKey}`;
        }
      }

      if (targetElement) {
        // CLICK EVENT - Primary interaction method
        button.addEventListener("click", (e) => {
          // Prevent default if it's a link
          e.preventDefault();
          
          // Check if this button is already active
          const isActive = targetElement.classList.contains("active");
          
          // Clear any hover timeouts
          clearTimeout(removeCurtainTimeout);
          
          // First, remove all active states
          document.querySelectorAll('.click-activated').forEach(el => {
            el.classList.remove('click-activated');
          });
          
          if (!isActive) {
            // If not active, activate everything
            hideAllPreviews();
            activateUI(targetElement);
            showPreview(previewSection);
            
            // Mark as click-activated to prevent hover events from deactivating
            document.body.classList.add('click-activated');
            button.classList.add('click-activated');
          } else {
            // If already active, deactivate everything
            deactivateUI();
            hideAllPreviews();
            document.body.classList.remove('click-activated');
          }
        });
        
        // HOVER EVENTS - Secondary enhancement for desktop
        if (isDesktop) {
          // Add hover preview effect regardless of page
          button.addEventListener("mouseenter", () => {
            // If we're not in click mode, show hover preview
            if (!document.querySelector('.click-activated')) {
              // Clear any existing timeout to prevent premature removal
              clearTimeout(removeCurtainTimeout);
              
              // Add hover-preview class for subtle effect
              button.classList.add('hover-preview');
              
              // Hide all previews first
              hideAllPreviews();
              
              // Show the corresponding sidebar element with peek effect
              peekUI(targetElement);
              
              // Show the corresponding preview section with peek effect
              peekPreview(previewSection);
            }
          });

button.addEventListener("mouseleave", () => {
  // Remove hover-preview class
  button.classList.remove('hover-preview');
  
  // If we're not in click mode, deactivate on mouse leave
  if (!document.querySelector('.click-activated')) {
    // Only deactivate if not moving to the preview
    setTimeout(() => {
      // If the mouse is not over the preview, deactivate
      if (currentActivePreview && 
          !currentActivePreview.matches(':hover') &&
          !sidebar.matches(':hover')) {
        deactivateUI();
      }
    }, 50);
  }
});
        }
        
        // KEYBOARD SUPPORT - For accessibility
        button.addEventListener("focus", () => {
          // Add focus-visible class
          button.classList.add('focus-visible');
          
          // If we're not in click mode, show on focus
          if (!document.querySelector('.click-activated')) {
            clearTimeout(removeCurtainTimeout);
            
            hideAllPreviews();
            
            // Show the corresponding sidebar element with peek effect
            peekUI(targetElement);
            
            // Show the corresponding preview section with peek effect
            peekPreview(previewSection);
          }
        });
        
        button.addEventListener("blur", () => {
          // Remove focus-visible class
          button.classList.remove('focus-visible');
          
          // If we're not in click mode, deactivate on blur
          if (!document.querySelector('.click-activated')) {
            deactivateUI();
          }
        });
        
        // TOUCH SUPPORT - For mobile devices
        button.addEventListener("touchstart", (e) => {
          // Prevent default touch behavior
          e.preventDefault();
          
          // Toggle active state on touch
          const isActive = targetElement.classList.contains("active");
          
          // First, remove active class from all elements
          document.querySelectorAll('[data-js]').forEach(el => {
            el.classList.remove("active");
          });
          hideAllPreviews();
          sidebar.classList.remove("active");
          curtainR.classList.remove("active");
          curtainL.classList.remove("active");
          
          // Remove click-activated from all elements
          document.querySelectorAll('.click-activated').forEach(el => {
            el.classList.remove('click-activated');
          });
          
          // If the element wasn't active before, activate it
          if (!isActive) {
            activateUI(targetElement);
            showPreview(previewSection);
            
            // Mark as click-activated
            document.body.classList.add('click-activated');
            button.classList.add('click-activated');
          } else {
            document.body.classList.remove('click-activated');
          }
        });
      }
    });
    
    // Add a document click handler to close when clicking outside
    document.addEventListener('click', (e) => {
      // If we're in click mode and click is outside navigation
      if (document.querySelector('.click-activated')) {
        // Check if the click was outside the navigation and preview areas
        const isOutsideNav = !e.target.closest('.unstuck_nav');
        const isOutsidePreview = !e.target.closest('.unstuck_container_preview');
        const isOutsideSidebar = !e.target.closest('.unstuck_area');
        
        if (isOutsideNav && isOutsidePreview && isOutsideSidebar) {
          // Deactivate everything
          deactivateUI();
          hideAllPreviews();
          
          // Remove click-activated from all elements
          document.querySelectorAll('.click-activated').forEach(el => {
            el.classList.remove('click-activated');
          });
          document.body.classList.remove('click-activated');
        }
      }
    });
  }

// Modified to use consistent behavior across all pages
function detectPath(){
  // Get the current path
  const currentPath = window.location.pathname;
  
  // Define navigation items
  const navItems = [
    { path: '/a11y', key: 'us_a11y' },
    { path: '/ethical-digital-strategy', key: 'us_strat' },
    { path: '/digital-sovereignty', key: 'us_fedi' },
    { path: '/fediverse', key: 'us_indie' },
    { path: '/byod', key: 'us_course' }
  ];
  
  // Find the matching navigation item
  const matchingItem = navItems.find(item => currentPath.includes(item.path));
  
  // If we're on a specific page (not homepage), highlight the corresponding nav item
  if (matchingItem) {
    const targetKey = matchingItem.key;
    
    // Get the elements we need to modify
    const targetButton = document.querySelector(`[data-js-btn="${targetKey}"]`);
    const targetElement = document.querySelector(`[data-js="${targetKey}"]`);
    const previewSection = document.querySelector(`.unstuck_${targetKey}-preview`);
    
    const sidebar = document.querySelector('.unstuck_area');
    const curtainR = document.querySelector('.unstuck_right');
    const curtainL = document.querySelector('.unstuck_left');
    
    // Add active classes
    if (targetElement) targetElement.classList.add("active");
    if (sidebar) sidebar.classList.add("active");
    if (curtainR) curtainR.classList.add("active");
    if (curtainL) curtainL.classList.add("active");
    document.querySelector('body').classList.add(targetKey, 'unstuck_fullpage');
    
    // Show the preview section
    if (previewSection) {
      previewSection.classList.add("active");
      previewSection.style.opacity = '1';
      previewSection.style.zIndex = '20'; // Use consistent z-index (same as showPreview function)
      
      // Fade out the full page content
      const fullPageContent = document.querySelector('.full_page-content');
      if (fullPageContent) {
        fullPageContent.classList.add('preview-active');
      }
    }
    
    // Add ARIA attributes for accessibility
    if (targetButton) targetButton.setAttribute('aria-expanded', 'true');
    if (previewSection) previewSection.setAttribute('aria-hidden', 'false');
  }
}

document.addEventListener('DOMContentLoaded', () => {
    applyRandomSkew('.unstuck_nav li', -10, 10);
    applyRandomSkew('.unstuck_area .unstuck_sidebar', -8, 8);
  
    // Initialize the function when the DOM is fully loaded
    handleNavInteractions();
    detectPath();
  });
