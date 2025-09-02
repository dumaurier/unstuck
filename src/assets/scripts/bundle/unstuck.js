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
    // Check if we're on a sub-page and this is the current page's preview
    const isSubPage = document.body.classList.contains('unstuck_fullpage');
    if (isSubPage) {
      // Get the current page's key from body classes
      const bodyClasses = Array.from(document.body.classList);
      const currentPageKey = bodyClasses.find(cls => cls.startsWith('us_'));
      
      // Get this preview's key - handle format like "unstuck_us_a11y-preview"
      const sectionClass = previewSection.className.split(' ')[1];
      if (sectionClass && currentPageKey) {
        // Extract the key part - it should be between "unstuck_" and "-preview"
        const previewKey = sectionClass.replace('unstuck_', '').replace('-preview', '');
        
        // Don't show the preview if it matches the current page
        if (currentPageKey === previewKey) {
          console.log(`Blocking current page preview: ${currentPageKey} === ${previewKey}`);
          return; // Exit early, don't show this preview
        }
      }
    }
    
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
    // Check if we're on a sub-page and this is the current page's preview
    const isSubPage = document.body.classList.contains('unstuck_fullpage');
    if (isSubPage) {
      // Get the current page's key from body classes
      const bodyClasses = Array.from(document.body.classList);
      const currentPageKey = bodyClasses.find(cls => cls.startsWith('us_'));
      
      // Get this preview's key - handle format like "unstuck_us_a11y-preview"
      const sectionClass = previewSection.className.split(' ')[1];
      if (sectionClass && currentPageKey) {
        // Extract the key part - it should be between "unstuck_" and "-preview"
        const previewKey = sectionClass.replace('unstuck_', '').replace('-preview', '');
        
        // Don't show the preview if it matches the current page
        if (currentPageKey === previewKey) {
          console.log(`Blocking current page preview: ${currentPageKey} === ${previewKey}`);
          return; // Exit early, don't show this preview
        }
      }
    }
    
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
    
// Function to deactivate UI elements - with different behavior for sub-pages
const deactivateUI = () => {
  // Remove preview-active class from full page content
  const fullPageContent = document.querySelector('.full_page-content');
  if (fullPageContent) {
    fullPageContent.classList.remove('preview-active');
  }
  
  // Check if we're on a sub-page (has unstuck_fullpage class)
  const isSubPage = document.body.classList.contains('unstuck_fullpage');
  
  // Remove peek/active classes from sidebar elements
  document.querySelectorAll('[data-js]').forEach(el => {
    el.classList.remove("peek");
    if (!isSubPage) {
      el.classList.remove("active"); // Only remove active on homepage
    }
  });
  
  sidebar.classList.remove("peek");
  if (!isSubPage) {
    sidebar.classList.remove("active"); // Only remove active on homepage
  }
  
  // Add a delay before adjusting curtains
  removeCurtainTimeout = setTimeout(() => {
    curtainR.classList.remove("peek");
    curtainL.classList.remove("peek");
    
    // Only remove active class from curtains on homepage
    if (!isSubPage) {
      curtainR.classList.remove("active");
      curtainL.classList.remove("active");
    }
    
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
              section.style.opacity = '1';
              section.style.zIndex = '20';
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
          
          // Check if this is a navigation link (has href attribute)
          if (button.href && 'startViewTransition' in document) {
            // Use view transition for navigation
            document.startViewTransition(() => {
              window.location.href = button.href;
            });
            return;
          }
          
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
    
    // Add interaction support for sidebar cards
    const sidebarCards = document.querySelectorAll('[data-js]');
    
    sidebarCards.forEach((card) => {
      const cardKey = card.getAttribute("data-js");
      const correspondingButton = document.querySelector(`[data-js-btn="${cardKey}"]`);
      const previewSection = document.querySelector(`.unstuck_${cardKey}-preview`);
      
      if (correspondingButton && previewSection) {
        // HOVER EVENTS for sidebar cards (desktop only)
        if (isDesktop) {
          card.addEventListener("mouseenter", () => {
            // If we're not in click mode, show hover preview
            if (!document.querySelector('.click-activated')) {
              clearTimeout(removeCurtainTimeout);
              
              // Add hover effect to corresponding nav button
              correspondingButton.classList.add('hover-preview');
              
              hideAllPreviews();
              peekUI(card);
              peekPreview(previewSection);
            }
          });
          
          card.addEventListener("mouseleave", () => {
            // Remove hover-preview class from corresponding button
            correspondingButton.classList.remove('hover-preview');
            
            // If we're not in click mode, deactivate on mouse leave
            if (!document.querySelector('.click-activated')) {
              setTimeout(() => {
                // If the mouse is not over the preview or nav button, deactivate
                if (currentActivePreview && 
                    !currentActivePreview.matches(':hover') &&
                    !sidebar.matches(':hover') &&
                    !correspondingButton.matches(':hover')) {
                  deactivateUI();
                }
              }, 50);
            }
          });
        }
        
        // CLICK EVENT for sidebar cards
        card.addEventListener("click", (e) => {
          e.preventDefault();
          
          // Check if the corresponding button is a navigation link
          if (correspondingButton.href && 'startViewTransition' in document) {
            // Use view transition for navigation
            document.startViewTransition(() => {
              window.location.href = correspondingButton.href;
            });
            return;
          }
          
          // Check if this card is already active
          const isActive = card.classList.contains("active");
          
          clearTimeout(removeCurtainTimeout);
          
          // Remove all active states
          document.querySelectorAll('.click-activated').forEach(el => {
            el.classList.remove('click-activated');
          });
          
          if (!isActive) {
            // If not active, activate everything
            hideAllPreviews();
            activateUI(card);
            showPreview(previewSection);
            
            // Mark as click-activated
            document.body.classList.add('click-activated');
            correspondingButton.classList.add('click-activated');
          } else {
            // If already active, deactivate everything
            deactivateUI();
            hideAllPreviews();
            document.body.classList.remove('click-activated');
          }
        });
        
        // KEYBOARD SUPPORT for sidebar cards
        card.addEventListener("focus", () => {
          correspondingButton.classList.add('focus-visible');
          
          if (!document.querySelector('.click-activated')) {
            clearTimeout(removeCurtainTimeout);
            hideAllPreviews();
            peekUI(card);
            peekPreview(previewSection);
          }
        });
        
        card.addEventListener("blur", () => {
          correspondingButton.classList.remove('focus-visible');
          
          if (!document.querySelector('.click-activated')) {
            deactivateUI();
          }
        });
        
        // Make cards focusable
        if (!card.hasAttribute('tabindex')) {
          card.setAttribute('tabindex', '0');
        }
        
        // Add role for accessibility
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View ${cardKey.replace('us_', '').replace('_', ' ')} section`);
      }
    });

    // Add view-transition support for preview buttons
    const previewButtons = document.querySelectorAll('.dt_a11y-btn, .button');
    
    previewButtons.forEach((button) => {
      if (button.href && !button.hasAttribute('data-view-transition-added')) {
        button.setAttribute('data-view-transition-added', 'true');
        
        button.addEventListener('click', (e) => {
          if ('startViewTransition' in document) {
            e.preventDefault();
            document.startViewTransition(() => {
              window.location.href = button.href;
            });
          }
        });
      }
    });

    // Add a document click handler to close when clicking outside
    document.addEventListener('click', (e) => {
      // If we're in click mode and click is outside navigation
      if (document.querySelector('.click-activated')) {
        // Check if the click was outside the navigation, preview, and sidebar areas
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
    { path: '/clean-web-development', key: 'us_clean' },
    { path: '/green-web-hosting', key: 'us_green' },
    { path: '/fediverse-open-source', key: 'us_fedi' }
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
    
    // Don't show the current page's own preview section on sub-pages
    // The user is already viewing that content, so showing the preview would be redundant
    
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
