$(document).ready(function(){
  $(".owl-carousel").owlCarousel({
    loop: true,
    autoplay:true,
    autoplayTImeout: 3000,
    autoplayHoverPause: true,
    responsive:{
      0: {
        items:1,
        nav:true,
        dots:true,
        loop: false,
      },
      576: {
        items:2,
      },
      768: {
        items:4,
      },
      1200: {
        items:5,
        nav:true,
        dots:true,
      },
    }
  });
});