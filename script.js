// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay");

  // Check if elements exist before adding event listeners
  if (menuToggle && mobileMenu && mobileMenuOverlay) {
    function toggleMenu() {
      mobileMenu.classList.toggle("active");
      mobileMenuOverlay.classList.toggle("active");
      menuToggle.classList.toggle("active");

      // Prevent body scroll when menu is open
      document.body.style.overflow = mobileMenu.classList.contains("active")
        ? "hidden"
        : "auto";
    }

    function closeMenu() {
      mobileMenu.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
      menuToggle.classList.remove("active");
      document.body.style.overflow = "auto";
    }

    menuToggle.addEventListener("click", toggleMenu);

    // Close mobile menu when clicking on a mobile nav link
    document.querySelectorAll(".mobile-navlink").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close mobile menu when clicking on mobile CTA button
    const mobileCTA = document.querySelector(".mobile-cta-btn");
    if (mobileCTA) {
      mobileCTA.addEventListener("click", closeMenu);
    }

    // Close menu when clicking on overlay
    mobileMenuOverlay.addEventListener("click", closeMenu);

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".main-nav") && !e.target.closest(".mobile-menu")) {
        closeMenu();
      }
    });

    // Close menu when pressing escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    });
  }

  // Sticky Navigation with Scale-down Effect
  const mainNav = document.querySelector(".main-nav");
  let lastScrollY = window.scrollY;

  if (mainNav) {
    function handleNavScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        // Add sticky and scaled class when scrolled down
        mainNav.classList.add("sticky", "scaled");
      } else {
        // Remove sticky and scaled class when at top
        mainNav.classList.remove("sticky", "scaled");
      }

      lastScrollY = currentScrollY;
    }

    // Add scroll event listener with throttling for better performance
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleNavScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
});

// Hero Image Cycling
const heroImages = [
  "./assets/images/usa-desktop.jpg",
  "./assets/images/canada-desktop.jpg",
  "./assets/images/Germany-desktop.jpg",
];

let currentImageIndex = 0;
const heroImg = document.querySelector(".hero-img");

function changeHeroImage() {
  currentImageIndex = (currentImageIndex + 1) % heroImages.length;
  heroImg.src = heroImages[currentImageIndex];
}

// Change image every 5 seconds (5000ms)
setInterval(changeHeroImage, 5000);

// Contact Form Validation and Handling
const contactForm = document.querySelector("#contact-form");

// Form submission endpoints with fallback
const formEndpoints = [
  "https://formspree.io/f/myzpgggg",
  "https://submit-form.com/8bIc0Q0h8",
];

if (contactForm) {
  const nameInput = contactForm.querySelector('input[name="name"]');
  const emailInput = contactForm.querySelector('input[name="email"]');
  const phoneInput = contactForm.querySelector('input[name="phone"]');
  const serviceSelect = contactForm.querySelector('select[name="service"]');
  const destinationSelect = contactForm.querySelector(
    'select[name="destination"]'
  );
  const messageTextarea = contactForm.querySelector('textarea[name="message"]');

  // Validation functions
  function validateName(name) {
    return name.trim().length >= 2;
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  }

  function validateDate(date) {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }

  // Function to submit form to endpoints with fallback
  async function submitFormWithFallback(formData) {
    for (let i = 0; i < formEndpoints.length; i++) {
      try {
        const response = await fetch(formEndpoints[i], {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          return { success: true, endpoint: formEndpoints[i] };
        } else {
          console.warn(
            `Form submission failed for endpoint ${i + 1}: ${formEndpoints[i]}`
          );
          if (i === formEndpoints.length - 1) {
            throw new Error("All form endpoints failed");
          }
        }
      } catch (error) {
        console.warn(
          `Error with endpoint ${i + 1}: ${formEndpoints[i]}`,
          error
        );
        if (i === formEndpoints.length - 1) {
          throw error;
        }
      }
    }
  }

  function showError(input, message) {
    const errorSpan = input.parentNode.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.display = "block";
    }
    input.classList.add("error");
  }

  function hideError(input) {
    const errorSpan = input.parentNode.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.style.display = "none";
    }
    input.classList.remove("error");
  }

  function clearAllErrors() {
    const inputs = contactForm.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => hideError(input));
  }

  // Real-time validation
  if (nameInput) {
    nameInput.addEventListener("blur", function () {
      if (!validateName(this.value)) {
        showError(this, "Please enter a valid name (at least 2 characters)");
      } else {
        hideError(this);
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      if (!validateEmail(this.value)) {
        showError(this, "Please enter a valid email address");
      } else {
        hideError(this);
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("blur", function () {
      if (this.value.trim() && !validatePhone(this.value)) {
        showError(this, "Please enter a valid phone number");
      } else {
        hideError(this);
      }
    });
  }

  if (serviceSelect) {
    serviceSelect.addEventListener("change", function () {
      if (this.value) {
        hideError(this);
      }
    });
  }

  if (destinationSelect) {
    destinationSelect.addEventListener("change", function () {
      if (this.value) {
        hideError(this);
      }
    });
  }

  // Form submission
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    clearAllErrors();
    let isValid = true;

    // Validate all fields
    if (!nameInput.value.trim() || !validateName(nameInput.value)) {
      showError(nameInput, "Please enter a valid name (at least 2 characters)");
      isValid = false;
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
      showError(emailInput, "Please enter a valid email address");
      isValid = false;
    }

    if (phoneInput.value.trim() && !validatePhone(phoneInput.value)) {
      showError(phoneInput, "Please enter a valid phone number");
      isValid = false;
    }

    if (serviceSelect && !serviceSelect.value) {
      showError(serviceSelect, "Please select a service");
      isValid = false;
    }

    if (!destinationSelect.value) {
      showError(destinationSelect, "Please select a destination");
      isValid = false;
    }

    if (!messageTextarea.value.trim()) {
      showError(messageTextarea, "Please enter your message");
      isValid = false;
    }

    if (isValid) {
      const submitBtn = contactForm.querySelector(".btn-primary");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = "Sending...";
      submitBtn.disabled = true;

      try {
        // Prepare form data
        const formData = new FormData(contactForm);

        // Submit form with fallback
        const result = await submitFormWithFallback(formData);

        if (result.success) {
          submitBtn.innerHTML = "Message Sent!";
          submitBtn.style.backgroundColor = "#10b981";

          // Reset form after 3 seconds
          setTimeout(() => {
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = "";
            clearAllErrors();
          }, 3000);
        }
      } catch (error) {
        console.error("Form submission failed:", error);
        submitBtn.innerHTML = "Failed to Send";
        submitBtn.style.backgroundColor = "#ef4444";

        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = "";
        }, 3000);
      }
    } else {
      // Scroll to first error
      const firstError = contactForm.querySelector(".error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        firstError.focus();
      }
    }
  });

  // Clear form button functionality
  const clearBtn = contactForm.querySelector(".btn-secondary");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      contactForm.reset();
      clearAllErrors();
    });
  }
}

// Destinations Toggle Functionality
const destinationsToggle = document.querySelector("#destinationsToggle");
const moreDestinations = document.querySelectorAll(".more-destinations");

if (destinationsToggle && moreDestinations.length > 0) {
  destinationsToggle.addEventListener("click", function () {
    const isExpanded =
      destinationsToggle.getAttribute("data-expanded") === "true";
    const buttonText = destinationsToggle.querySelector("span");
    const buttonIcon = destinationsToggle.querySelector("svg polyline");

    if (isExpanded) {
      // Hide additional destinations
      moreDestinations.forEach((dest) => {
        dest.style.display = "none";
      });
      buttonText.textContent = "See More";
      buttonIcon.setAttribute("points", "6,9 12,15 18,9");
      destinationsToggle.setAttribute("data-expanded", "false");
    } else {
      // Show additional destinations
      moreDestinations.forEach((dest) => {
        dest.style.display = "block";
      });
      buttonText.textContent = "See Less";
      buttonIcon.setAttribute("points", "18,15 12,9 6,15");
      destinationsToggle.setAttribute("data-expanded", "true");
    }
  });
}

// Services Toggle Functionality
const servicesToggle = document.querySelector("#servicesToggle");
const moreServices = document.querySelectorAll(".more-services");

if (servicesToggle && moreServices.length > 0) {
  servicesToggle.addEventListener("click", function () {
    const isExpanded = servicesToggle.getAttribute("data-expanded") === "true";
    const buttonText = servicesToggle.querySelector("span");
    const buttonIcon = servicesToggle.querySelector("svg polyline");

    if (isExpanded) {
      // Hide additional services
      moreServices.forEach((service) => {
        service.style.display = "none";
      });
      buttonText.textContent = "See More Services";
      buttonIcon.setAttribute("points", "6,9 12,15 18,9");
      servicesToggle.setAttribute("data-expanded", "false");
    } else {
      // Show additional services
      moreServices.forEach((service) => {
        service.style.display = "block";
      });
      buttonText.textContent = "See Less Services";
      buttonIcon.setAttribute("points", "18,15 12,9 6,15");
      servicesToggle.setAttribute("data-expanded", "true");
    }
  });
}

// Scroll to Contact function
function scrollToContact() {
  const contactSection = document.querySelector("#contact");
  if (contactSection) {
    contactSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Add scroll to contact for CTA buttons
document.addEventListener("DOMContentLoaded", function () {
  const ctaButtons = document.querySelectorAll(".cta-btn, .mobile-cta-btn");
  ctaButtons.forEach((button) => {
    button.addEventListener("click", scrollToContact);
  });
});
