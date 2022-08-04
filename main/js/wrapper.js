TweenMax.to(".wrapper", 2.2, {
    top: "-130%",
    ease: Expo.easeInOut,
    delay: 1.65
  });

  

  gsap.from('.loader', { opacity: 0, duration: 1.9, y: 900, ease: 'elastic(0.4,0.19)' })
  
  setTimeout(function wait() {
    gsap.to('.loader', { opacity: 100, duration: 1.4, y: -1900, ease: 'Expo.easeInOut' })
  }, 2000);