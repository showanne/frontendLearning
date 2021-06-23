/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* To load a config file (particles.json) you need to host this demo (MAMP/WAMP/local)... */
/*
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});
*/

/* Otherwise just put the config content (json): */

particlesJS(
  'particles-js',

  {
    particles: {
      number: {
        value: 71,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: '#c3dc4f'
      },
      shape: {
        type: 'image',
        stroke: {
          width: 0,
          color: '#000000'
        },
        polygon: {
          nb_sides: 6
        },
        image: {
          src: 'https://stickershop.line-scdn.net/sticonshop/v1/product/5bfce650040ab139c41b2fc5/iPhone/main.png',
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 0.28030272694510067,
        random: false,
        anim: {
          enable: false,
          speed: 1.4600790064973521,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 32.03459736515436,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 224.24218155608057,
        color: '#ccaaee',
        opacity: 0.176190285508349,
        width: 1
      },
      move: {
        enable: true,
        speed: 3.2034597365154363,
        direction: 'left',
        random: true,
        straight: true,
        out_mode: 'bounce',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 320.34597365154366,
          rotateY: 1041.124414367517
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse'
        },
        onclick: {
          enable: true,
          mode: 'repulse'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  }
)
