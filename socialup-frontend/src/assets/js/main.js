(function ($) {
	"use strict";
    jQuery(document).ready(function($){
        /*------------------------------
            counter section activation
        -------------------------------*/
        var counternumber = $('.count-num');
        counternumber.counterUp({
            delay: 20,
            time: 3000
        });
        /*--------------------
            wow js init
        --------------------*/
        new WOW().init();
        /*-------------------------------------
            Recent Work filter activation
        -------------------------------------*/
        var Container = $('.recent-work-masonry');
        if (Container.length > 0) {
            Container.imagesLoaded(function () {
                var festivarMasonry = $('.recent-work-masonry').isotope({
                    itemSelector: '.single-recent-wrok-item',
                    percentPosition: true,
                    masonry: {
                        columnWidth: 0,
                        gutter:0
                    }
                });
                $(document).on('click', '.recent-work-nav-area ul li', function () {
                    var filterValue = $(this).attr('data-filter');
                    festivarMasonry.isotope({
                        filter: filterValue
                    });
                });
            });
        }
        /*----------------------------
            recent work menu active
        ----------------------------*/
        var portfolioMenu = '.recent-work-nav-area ul li';
        $(document).on('click', portfolioMenu, function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });

        /*----------------------------------
            magnific popup activation
        ----------------------------------*/
        $('.image-popup').magnificPopup({
            type: 'image'
        });
        $('.video-play-btn').magnificPopup({
            type: 'video'
        });
        /*-------------------------------
            back to top
        ------------------------------*/
        $(document).on('click', '.back-to-top', function () {
            $("html,body").animate({
                scrollTop: 0
            }, 2000);
        });
        
       
        /*----------------------------------------
            Header Slider 01 carousel
        ----------------------------------------*/
        var $headerCarousel = $('.header-carousel-two');
        if ($headerCarousel.length > 0) {
            $headerCarousel.owlCarousel({
                loop: true,
                autoplay: true, //true if you want enable autoplay
                autoPlayTimeout: 1000,
                margin: 0,
                dots: true,
                nav: false,
                smartSpeed:1000,
                animateIn:'fadeIn',
                animateOut:'fadeOut',
                responsive: {
                    0: {
                        items: 1,
                        nav: false,
                        dots:false
                    },
                    767: {
                        items: 1,
                        nav: false,
                        dots:false
                    },
                    768: {
                        items: 1,
                        nav: false,
                        dots:false
                    },
                    960: {
                        items: 1,
                        nav:false,
                        dots:false
                    },
                    1200: {
                        items: 1
                    },
                    1920: {
                        items: 1
                    }
                }
            });
        }
        /*----------------------------------------
            Brands carousel
        ----------------------------------------*/
        var $brandsCarousel = $('.brand-carousel');
        if ($brandsCarousel.length > 0) {
            $brandsCarousel.owlCarousel({
                loop: true,
                autoplay: false, //true if you want enable autoplay
                autoPlayTimeout: 1000,
                margin: 30,
                dots: true,
                nav: false,
                smartSpeed:1000,
                responsive: {
                    0: {
                        items: 1,
                        nav: false
                    },
                    767: {
                        items: 2,
                        nav: false
                    },
                    768: {
                        items: 3,
                        nav: false
                    },
                    960: {
                        items: 4,
                        nav:false
                    },
                    1200: {
                        items: 5
                    },
                    1920: {
                        items: 5
                    }
                }
            });
        }
        /*----------------------------------------
            testimonial carousel
        ----------------------------------------*/
        var $testimonialCarousel = $('.testimonial-carousel');
        if ($testimonialCarousel.length > 0) {
            $testimonialCarousel.owlCarousel({
                loop: true,
                autoplay: false, //true if you want enable autoplay
                autoPlayTimeout: 1000,
                margin: 0,
                dots: true,
                nav: false,
                smartSpeed:1000,
                center:true,
                responsive: {
                    0: {
                        items: 1,
                        nav: false,
                        dots:false
                    },
                    767: {
                        items: 1,
                        nav: false,
                        dots:false
                    },
                    768: {
                        items: 1,
                        nav: false,
                        dots:false
                    },
                    991: {
                        items: 2,
                        nav:false,
                        dots:false
                    },
                    1200: {
                        items: 3
                    },
                    1920: {
                        items: 3
                    }
                }
            });
        }
        var $teastimonialQuote = $(".single-testimonial-quote");
            $testimonialCarousel.on("changed.owl.carousel", function (e) {
                var o = e.item.index + 1 - e.relatedTarget._clones.length / 2,
                    n = e.item.count;
                (o > n || 0 == o) && (o = n - o % n), o--;
                var t = $(".single-testimonial-quote:nth(" + o + ")");
                owlCaouselrightItem(t)
            }),
            $('document').on("click",$teastimonialQuote, function () {
                var e = $(this).data("owl-item");
                $testimonialCarousel.trigger("to.owl.carousel", e), a($(this))
            });

        function owlCaouselrightItem(e) {
            $teastimonialQuote.removeClass("active"), e.addClass("active")
        }
        
            

     
    });

    
    //define variable for store last scrolltop
    var lastScrollTop = '';
    $(window).on('scroll', function () {
        /*---------------------------
            back to top show / hide
        ---------------------------*/
       var ScrollTop = $('.back-to-top');
       if ($(window).scrollTop() > 1000) {
           ScrollTop.fadeIn(1000);
       } else {
           ScrollTop.fadeOut(1000);
       }
       /*--------------------------
        sticky menu activation
       ---------------------------*/
        var st = $(this).scrollTop();
        var mainMenuTop = $('.navbar-area');
        if ($(window).scrollTop() > 1000) {
            if (st > lastScrollTop) {
                // hide sticky menu on scrolldown 
                mainMenuTop.removeClass('nav-fixed');
                
            } else {
                // active sticky menu on scrollup 
                mainMenuTop.addClass('nav-fixed');
            }

        } else {
            mainMenuTop.removeClass('nav-fixed ');
        }
        lastScrollTop = st;
       
    });
           
    $(window).on('load',function(){
        /*-----------------------------
            preloader
        -----------------------------*/
        var preLoder = $("#preloader");
        preLoder.fadeOut(1000);
        /*-----------------------------
            back to top
        -----------------------------*/
        var backtoTop = $('.back-to-top')
        backtoTop.fadeOut(100);
    });

}(jQuery));	
