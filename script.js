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
  // "https://formspree.io/f/myzpgggg",
  "https://formspree.io/f/xzzvrvwj",
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

  function validateDate(date) {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }

  function validatePhone(phone) {
    if (!phone || phone.trim() === "") return true; // Optional field

    // Remove all spaces for validation
    const cleanPhone = phone.replace(/\s/g, "");

    // Check if it starts with +
    if (cleanPhone.startsWith("+")) {
      // For international format: +2349159739013 (14 characters total including +)
      return cleanPhone.length === 14;
    } else {
      // For local format: 09159739013 (11 characters max)
      return cleanPhone.length <= 11 && cleanPhone.length >= 10;
    }
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

  // Helper functions for error handling
  function showError(element, message) {
    const container = element.parentElement;
    const errorElement = container.querySelector(".error-message");

    element.classList.add("error");
    element.classList.remove("success");
    container.classList.add("has-error");
    container.classList.remove("has-success");

    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function clearError(element) {
    const container = element.parentElement;
    const errorElement = container.querySelector(".error-message");

    element.classList.remove("error");
    element.classList.add("success");
    container.classList.remove("has-error");
    container.classList.add("has-success");

    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  function clearSuccess(element) {
    const container = element.parentElement;

    element.classList.remove("success");
    container.classList.remove("has-success");
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

  // Real-time validation improvements
  if (nameInput) {
    nameInput.addEventListener("blur", function () {
      const name = this.value.trim();

      if (name && !validateName(name)) {
        showError(this, "Name must be at least 2 characters long");
      } else if (name) {
        clearError(this);
      } else {
        clearSuccess(this);
      }
    });

    nameInput.addEventListener("input", function () {
      if (this.classList.contains("error") && validateName(this.value.trim())) {
        clearError(this);
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const email = this.value.trim();

      if (email && !validateEmail(email)) {
        showError(this, "Please enter a valid email address");
      } else if (email) {
        clearError(this);
      } else {
        clearSuccess(this);
      }
    });

    emailInput.addEventListener("input", function () {
      if (
        this.classList.contains("error") &&
        validateEmail(this.value.trim())
      ) {
        clearError(this);
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("blur", function () {
      const phone = this.value.trim();

      if (phone && !validatePhone(phone)) {
        showError(
          this,
          "Invalid format. Use +2349159739013 (14 chars) or 09159739013 (max 11 chars)"
        );
      } else if (phone) {
        clearError(this);
      } else {
        clearSuccess(this);
      }
    });

    phoneInput.addEventListener("input", function () {
      if (
        this.classList.contains("error") &&
        validatePhone(this.value.trim())
      ) {
        clearError(this);
      }
    });
  }

  if (serviceSelect) {
    serviceSelect.addEventListener("change", function () {
      if (this.value) {
        clearError(this);
      }
    });
  }

  if (destinationSelect) {
    destinationSelect.addEventListener("change", function () {
      if (this.value) {
        clearError(this);
      }
    });
  }

  if (messageTextarea) {
    messageTextarea.addEventListener("blur", function () {
      const message = this.value.trim();

      if (message && message.length < 10) {
        showError(this, "Message must be at least 10 characters long");
      } else if (message) {
        clearError(this);
      } else {
        clearSuccess(this);
      }
    });

    messageTextarea.addEventListener("input", function () {
      const message = this.value.trim();
      if (this.classList.contains("error") && message.length >= 10) {
        clearError(this);
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
      showError(nameInput, "Name must be at least 2 characters long");
      isValid = false;
    } else {
      clearError(nameInput);
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
      showError(emailInput, "Please enter a valid email address");
      isValid = false;
    } else {
      clearError(emailInput);
    }

    if (phoneInput.value.trim() && !validatePhone(phoneInput.value)) {
      showError(
        phoneInput,
        "Invalid format. Use +2349159739013 (14 chars) or 09159739013 (max 11 chars)"
      );
      isValid = false;
    } else if (phoneInput.value.trim()) {
      clearError(phoneInput);
    }

    if (
      !messageTextarea.value.trim() ||
      messageTextarea.value.trim().length < 10
    ) {
      showError(messageTextarea, "Message must be at least 10 characters long");
      isValid = false;
    } else {
      clearError(messageTextarea);
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
