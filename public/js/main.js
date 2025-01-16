/**
* Template Name: Yummy
* Updated: Sep 18 2023 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/yummy-bootstrap-restaurant-website-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Sticky header on scroll
   */
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    document.addEventListener('scroll', () => {
      window.scrollY > 100 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
    });
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = document.querySelectorAll('#navbar a');

  function navbarlinksActive() {
    navbarlinks.forEach(navbarlink => {

      if (!navbarlink.hash) return;

      let section = document.querySelector(navbarlink.hash);
      if (!section) return;

      let position = window.scrollY + 200;

      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navbarlinksActive);
  document.addEventListener('scroll', navbarlinksActive);

  /**
   * Mobile nav toggle
   */
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      mobileNavToogle();
    })
  });

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navbar a').forEach(navbarlink => {

    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function(event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }));
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate pURE cOUNTER
   */
  new PureCounter();

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Init swiper slider with 3 slides at once in desktop view
   */
  new Swiper('.slides-3', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40
      },

      1200: {
        slidesPerView: 3,
      }
    }
  });

  /**
   * Gallery Slider
   */
  new Swiper('.gallery-slider', {
    speed: 400,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      992: {
        slidesPerView: 5,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
    

  });
  
});

let heads = ["Radial Drilling Machine", "Child Safety Monitoring System", "Vehical and Smart Home Management Integration", "Machine Support and Packaging Solution",
"Personal Protection Compliance System", "Sustainable Bottle Packaging Solution", "Smart Kitchen System", "Piston Ring Deformation Due to Heat Treatment",
"Secure Valet Parking System", "Automated Baggage Tracking and Delivery System", "Instant Food Delivery and Donation Platform", "Piston Outer Bore Diameter Consistency", "Creating a Tailored AI Model for Education and Practical Applications", 
"Integrated Smart Factory System for Predictive Maintenance and Quality Control", "Advanced Safety Monitoring System for Construction Sites", "Advanced Noise Anomaly Detection System for Manufacturing Equipment Health Monitoring", 
"Customized Virtual Assistance System for Industry-Specific Knowledge Access", "Comprehensive Work at Height Safety Monitoring System for Vertical Infrastructure Construction",
"Advanced Dropped Objects Detection System for Public Spaces and Hazardous Environments", "Real-time Intelligent Alert System for Hazardous Work Environments",
"Design a PCB to Replace the Fin Card in Solar Inverters"]

let problems = [
  "Problem: In radial drilling machines, accurately determining and controlling drilling depth is challenging, requiring an automated solution.",
  "Problem: Need for a comprehensive monitoring system to ensure child safety in various environments through real-time tracking and alerts.",
  "Problem: Integration gap between vehicle systems and smart home automation, requiring seamless connectivity and control.",
  "Problem: Manufacturing industry needs efficient machine support and packaging solutions to reduce downtime and improve productivity.",
  "Problem: Ensuring consistent use of personal protective equipment in industrial settings through automated monitoring.",
  "Problem: Current bottle packaging methods are unsustainable, requiring eco-friendly alternatives that maintain product integrity.",
  "Problem: Traditional kitchen systems lack smart integration for efficient cooking, inventory management, and waste reduction.",
  "Problem: Heat treatment processes cause piston ring deformation, affecting engine performance and reliability.",
  "Problem: Current valet parking systems lack security and real-time tracking capabilities for vehicle protection.",
  "Problem: Airport baggage handling systems need automation for efficient tracking and delivery of luggage.",
  "Problem: Food waste and distribution inefficiencies in restaurants and catering services need addressing.",
  "Problem: Inconsistent piston outer bore diameter affects engine performance and manufacturing quality.",
  "Problem: Need for customized AI models that bridge theoretical education with practical industry applications.",
  "Problem: Manufacturing facilities require integrated systems for predictive maintenance and quality control.",
  "Problem: Construction sites need advanced safety monitoring systems to prevent accidents and ensure compliance.",
  "Problem: Manufacturing equipment health monitoring requires sophisticated noise analysis for early problem detection.",
  "Problem: Industries need specialized virtual assistance systems for accessing domain-specific knowledge.",
  "Problem: Vertical infrastructure construction requires comprehensive safety monitoring for work at height.",
  "Problem: Public spaces and hazardous environments need systems to detect and respond to dropped objects.",
  "Problem: Hazardous work environments require real-time alert systems for worker safety.",
  "Problem: Solar inverters need an efficient PCB replacement for the traditional fin card to improve performance."
];

// Map each problem to its ID in explore.ejs
let problemIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"]

var container = document.querySelector(".events-wrapper");
for(let i=0; i<problems.length; i++){
  container.innerHTML+=`
    <div class="swiper-slide event-item d-flex flex-column justify-content-center">
      <div class="card">
        <div class="content">
          <p class="heading">${heads[i]}</p>
          <p class="para parent-para">${problems[i]}</p>
          <a href="/explore#problem-${i+1}" class="btn btn-primary">View Challenge</a>
        </div>
      </div>
    </div>`;
}

// testimonial slider
 new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });