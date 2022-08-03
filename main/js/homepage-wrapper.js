
    var textWrapper = document.querySelector('#hero_span');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline()
      .add({
        targets: '#hero_span .letter',
        translateY: [-200, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 2000,
        delay: (el, i) => 4000 + 50 * i
      });
    var textWrapper = document.querySelector('#hero_span2');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline()
      .add({
        targets: '#hero_span2 .letter',
        translateY: [-200, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 2000,
        delay: (el, i) => 4500 + 50 * i
      });

    TweenMax.to(".wrapper", 2, {
      top: "-130%",
      ease: Expo.easeInOut,
      delay: 1.65
    });

    var tl = new TimelineMax();

    gsap.from('.loader', { opacity: 0, duration: 1.9, y: 900, ease: 'elastic(0.4,0.19)' })
    setTimeout(function wait() {
      gsap.to('.loader', { opacity: 100, duration: 1.4, y: -1900, ease: 'Expo.easeInOut' })
    }, 1900);

    window.addEventListener('scroll', () => {

    }, true);


    var tl = new TweenMax.staggerFrom("#navbar > div", 1.5, {
      opacity: 0,
      y: 30,
      ease: Expo.easeInOut,
      delay: 3.2
    }, 0.1);
    var tl = new TweenMax.staggerFrom("#homepage_hero > div", 1.5, {
      opacity: 0,
      y: -20,
      ease: Expo.easeInOut,
      delay: 3.2
    }, 0.1);


