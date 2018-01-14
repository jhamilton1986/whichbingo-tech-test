'use strict';
(function() {
  // Create references to elements to prevent repeated DOM lookups
  const mobileNavButton = document.querySelector('.c-mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mega-menu');
  const header = document.querySelector('.c-header');
  const nav = document.querySelector('.main-nav');
  const page = document.querySelector('.o-page');
  
  // It's common for these elements to have their classes toggled at the same time,
  // so by using an array they can be handled in a loop
  const toggleElements = [
    { element: mobileNavButton, displayClass: 'is-active' },
    { element: header, displayClass: 'is-open' },
    { element: page, displayClass: 'is-open' },
  ];
  
  // Closes all open menu items
  // - Useful for resetting the menu when it's closed
  function collapseMenuItems(clickedElement) {
    mobileNavLinks.forEach(link => {
      // Don't close the menu item that's just been clicked
      if (!link.parentElement.isEqualNode(clickedElement)) {
        link.parentElement.classList.remove('is-open'); 
      }
    });
  }
  
  // Toggles the navigation menu
  function toggleMenu(event) {
    if (page.classList.contains('is-open')) {
      collapseMenuItems(); // Reset the menu accordion when closing the menu
    }
    
    toggleElements.forEach(el => el.element.classList.toggle(el.displayClass));
  }
  
  // Close the navigation menu when tapping/clicking the page
  function togglePageClick(event) {
    if (page.classList.contains('is-open')) {
      event.preventDefault(); // In case the user taps on a link!
      toggleElements.forEach(el => el.element.classList.remove(el.displayClass));
      collapseMenuItems(); // Reset the menu accordion when closing the menu
    }
  }
  
  // Toggles individual menu items
  function toggleMenuItem(event) {
    const element = event.target.tagName === "SPAN" ? event.target.parentElement.parentElement : event.target.parentElement;
    element.classList.toggle('is-open')
    collapseMenuItems(element);
  }
  
  mobileNavButton.addEventListener('click', toggleMenu, false);
  mobileNavLinks.forEach(link => { link.addEventListener('click', toggleMenuItem, false) });

  // We only need to add the click handler to the page when on a mobile viewport
  if (window.innerWidth < 768) {
    page.addEventListener('click', togglePageClick, false);    
  }
  
  // Prevent the nav menu animating on page load
  setTimeout(() => {
    nav.classList.remove('no-transition');      
  }, 100);
  
  /*
  * Navigation Menu Swipe
  *-------------------------------------------*/
  let touchStart = 0,
      touchDistance = 0,
      touchEnd = 0,
      touchOffset = -20, // Number of pixels to swipe before the menu slides
      elementPosition;
  
  // Define constants to prevent 'magic numbers' in code
  const NAV_BAR_WIDTH = 300;
  const LINK_TEXT_WIDTH = 120;
  
  function handleTouchStart(e) {
    touchStart = e.changedTouches[0].screenX;

    // Disables CSS animation when swiping the nav    
    nav.classList.add('no-transition');
    header.classList.add('no-transition');
    page.classList.add('no-transition');
  }
  
  function handleTouchMove(e) {
    touchDistance = e.changedTouches[0].screenX - touchStart;
    elementPosition = NAV_BAR_WIDTH + touchDistance - touchOffset;
    if (touchDistance < touchOffset 
      && elementPosition <= NAV_BAR_WIDTH
      && elementPosition > LINK_TEXT_WIDTH
    ) {
      nav.style.width = elementPosition + 'px';
      header.style.left = elementPosition + 'px';
      page.style.transform =  'translateX(' + elementPosition + 'px)';
    }
  }
  
  function handleTouchEnd(e) {
    touchEnd = e.changedTouches[0].screenX;
    nav.style.width = '';
    header.style.left = '';
    page.style.transform =  '';
    
    // Re-enable CSS animation when finished swiping the nav    
    nav.classList.remove('no-transition');
    header.classList.remove('no-transition');
    page.classList.remove('no-transition');
    
    if (touchEnd - touchOffset - touchStart < -50) {
      toggleMenu(e);
      collapseMenuItems();
    }
  }
  
  nav.addEventListener('touchstart', handleTouchStart, false);
  nav.addEventListener('touchmove', handleTouchMove, false);
  nav.addEventListener('touchend', handleTouchEnd, false);
})();
