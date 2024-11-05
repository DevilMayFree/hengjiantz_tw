jQuery(window).on('load', function() {
  if(jQuery('.project-image').length) {
    let tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {
        jQuery('.main-smooth-scroll').css('pointer-events', 'all'),
        $placeholder.remove()
        localStorage.removeItem('projectImage')
      }
    }),
    $placeholder = jQuery('.project-image'),
    $projectImg = jQuery('.project-top-block .image'),
    endPoints = {
      top: jQuery('.header-space').yprmHeight(),
      left: 0,
      width: jQuery(window).width(),
      height: 400,
    }

    if($placeholder.length && $projectImg.length) {
      endPoints = {
        top: $projectImg.offset().top,
        left: $projectImg.offset().left,
        width: $projectImg.width(),
        height: $projectImg.height()
      }
    }

    tl.to($placeholder, 1, {
      top: endPoints.top,
      left: endPoints.left,
      width: endPoints.width,
      height: endPoints.height,
    }).fromTo($projectImg, .2, {
      opacity: 0
    }, {
      opacity: 1
    }).fromTo($placeholder, 1, {
      opacity: 1
    }, {
      opacity: 0
    })
  }
});

/* Functions */

function yprmLeadZero(n) {
  return (n < 10 ? '0' : '') + n;
}

function yprmToggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function yprmGetBase64Image(img, imgArray) {
  // Create an empty canvas element
  var canvas = document.createElement("canvas")

  canvas.width = imgArray[1];
    canvas.height = imgArray[2];

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");
    

    return dataURL
}

function yprmRandomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

function yprmGetCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function yprmSetCookie(name, value, options = {}) {

  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function yprmUniqID(pr, en) {
  var pr = pr || '',
    en = en || false,
    result, us;

  var seed = function (s, w) {
    s = parseInt(s, 10).toString(16);
    return w < s.length ? s.slice(s.length - w) :
      (w > s.length) ? new Array(1 + (w - s.length)).join('0') + s : s;
  };

  result = pr + seed(parseInt(new Date().getTime() / 1000, 10), 8) +
    seed(Math.floor(Math.random() * 0x75bcd15) + 1, 5);

  if (en) result += (Math.random() * 10).toFixed(8).toString();

  return result;
};

function yprmSetMouseSpeed() {
  let timestamp = null,
    lastMouseX = null,
    lastMouseY = null;

  jQuery(document).on('mousemove', function (e) {
    if (timestamp === null) {
      timestamp = Date.now();
      lastMouseX = e.screenX;
      lastMouseY = e.screenY;
      return;
    }

    let now = Date.now(),
      dt = now - timestamp,
      dx = e.screenX - lastMouseX,
      dy = e.screenY - lastMouseY,
      speedX = Math.round(dx / dt * 100),
      speedY = Math.round(dy / dt * 100);

    if (speedX < 0) speedX = -speedX
    if (speedY < 0) speedY = -speedY

    window.cursorSpeed = (((speedX + speedY) / 2) * 100 / 1000 / 10) + 1

    timestamp = now;
    lastMouseX = e.screenX;
    lastMouseY = e.screenY;
  })
}

function yprmControlVideo($video_block, event) {
  $video_block.each(function () {
    let $item = jQuery(this),
      video = $item.find('video'),
      type = $item.attr('data-type');

    if (type == 'youtube') {
      if (typeof $item.attr('data-uniqid') === 'undefined') {
        video = yprm_load_youtube_video($item, event, {
          quality: $item.attr('data-quality'),
          muted: $item.attr('data-muted')
        });
      } else {
        video = window.youtube_players[$item.attr('data-uniqid')];

        if (event == 'play') {
          video.play();
        } else if (event == 'pause') {
          video.pause();
        } else if (event == 'mute') {
          video.muted = true;
        } else if (event == 'unmute') {
          video.muted = false;
        }
      }

    } else {
      video.each(function (index, item) {
        if (event == 'play') {
          item.play();
        } else if (event == 'pause') {
          item.pause();
        }
      })
    }
  });
}

function yprmLoadYoutubeVideo($this, event, atts = []) {
  if (typeof event === 'undefined') {
    let event = '';
  }
  let video_id = $this.attr('data-id'),
    uniqid = $this.attr('data-uniqid');

  let quality = atts.quality;

  if (quality == '1440p') {
    quality = 'hd1440';
  } else if (quality == '1080p') {
    quality = 'hd1080';
  } else {
    quality = 'hd720';
  }

  let player = youtube({
    el: $this.get(0),
    id: video_id,
    modestbranding: true,
    iv_load_policy: 3,
    controls: false,
    disabledkb: false,
    showInfo: false,
    loop: true,
    rel: false,
    playlist: video_id,
    playsinline: false
  });

  player.addEventListener('ready', function () {
    let uniqid = yprm_uniqid();

    jQuery(player.player.getIframe()).attr('data-uniqid', uniqid);
    window.youtube_players[uniqid] = this;

    if (atts.muted == 'true') {
      this.muted = true;
    } else {
      this.muted = false;
    }
    if (jQuery(player.player.getIframe()).hasClass('disable-on-scroll') || event == 'pause') {
      this.pause();
    } else if (event == 'play') {
      this.play();
    }
    yprm_calc_video_width(player.player.getIframe());
  });

  player.addEventListener('ended', function () {
    player.play();
  });

  return player;
}

function yprmCalcVideoWidth($this) {
  let $video = jQuery($this),
    $container = $video.parent(),
    $width = $container.width(),
    $height = $container.height(),
    ratio = 16 / 9,
    coef = $width / $height;

  if (coef < 16 / 9) {
    $video.css({
      width: $height * ratio
    });
  } else {
    $video.css({
      width: $width
    });
  }
}

function yprmWrapLines($container) {
  let text = new SplitType($container)
  $container.data('splitType', text)
}

function yprBannerCurrentColor(swiper, $area) {
  if (swiper == 'base') {
    $el = $area.find('.banner-slider .swiper-slide:eq(0) .banner-item')
  } else {
    $el = jQuery(swiper.slides[swiper.activeIndex]).find('.banner-item')
  }

  if ($el.hasClass('white')) {
    $area.addClass('current-white')
  } else if ($el.hasClass('black')) {
    $area.addClass('current-black')
  }
}

function yprmLineThroughOnHover(el) {
  let $el = jQuery(el)

  if ($el.find('.line').length) return

  if ($el.find('a').length) {
    $el = $el.find('a');
  }

  $el.addClass('')

  yprmWrapLines($el)
}

function yprmButtonStyle3() {
  jQuery('.button-style3.circle-border').each(function () {
    let $elem = jQuery(this),
      $circle = jQuery(this).find('.circle'),
      x = 0,
      hW = $circle.width() * .7,
      bW = $circle.width()

    jQuery(this).addClass('loaded')

    gsap.set($circle, {
      y: '-50%',
    })

    jQuery(this).on('mousemove', function (e) {
      x = e.pageX - $elem.outerWidth() - $elem.offset().left + ($circle.width() / 2)

      gsap.to($circle, .6, {
        x: x,
        width: hW,
        height: hW,
        ease: Power4.easeOut
      })
    }).on('mouseleave', function (e) {
      gsap.to($circle, .6, {
        x: 0,
        width: bW,
        height: bW,
      })
    })
  });
}

function yprmSetScrollPoint(scrollTop) {
  yprmSetCookie('prevPageURL', document.URL)
  yprmSetCookie('prevScrollTop', scrollTop)
}

function yprmCheckScroll() {
  if(typeof window.SmoothScroll !== 'undefined' && yprmGetCookie('prevPageURL') == document.URL && yprmGetCookie('prevScrollTop')) {
    let scrollTop = parseInt(yprmGetCookie('prevScrollTop'))

    window.SmoothScroll.setPosition(0, scrollTop)
    
    yprmHeaderScroll(scrollTop)
    yprmSetScrollPoint(scrollTop)
  }
}

function yprmInitFullMenu() {
  jQuery('.fullscreen-navigation').each(function() {
    let $navBlock = jQuery(this),
    animated = false

    $navBlock.on('click', '.menu-item-has-children > a', function() {
      let tl = gsap.timeline({
        onStart: () => {
          animated = true
        }, 
        onComplete: () => {
          animated = false
        }
      }),
      $prev = jQuery(this).parent().parent().find(' > .menu-item > a'),
      $children = jQuery(this).next('.sub-menu').find(' > .menu-item > a'),
      $back = jQuery(this).next('.sub-menu').find(' > .back')

      jQuery(this).parent().addClass('opened')

      if($prev.length) {
        tl.fromTo($prev, {
          opacity: 1,
        }, {
          opacity: 0,
          onComplete: () => {
            gsap.set($prev, {
              visibility: 'hidden',
            });
          }
        })
      }

      tl.set(jQuery(this).next('.sub-menu'), {
        zIndex: 2,
      })

      tl.to($navBlock.find('.back-button'), {
        y: $children.eq(0).offset().top-jQuery(window).scrollTop()-$children.eq(0).outerHeight()*1.6,
        onStart: () => {
          $navBlock.find('.back-button').addClass('active');
        }
      })

      tl.fromTo($children, .6, {
        opacity: 0,
        y: 40,
        visibility: 'visible',
        zIndex: 2
      }, {
        opacity: 1,
        y: 0,
        stagger: .2,
        ease: Back.easeOut
      })
    })

    $navBlock.on('click', '.back-button', function() {
      if(animated) return;

      let tl = gsap.timeline({
        onStart: () => {
          animated = true
        }, 
        onComplete: () => {
          animated = false
        }
      }),
      $backButton = jQuery(this),
      $openedMenu = $navBlock.find('.menu-item.opened').last()
      
      if($navBlock.find('.menu-item.opened').length == 1) {
        $backButton.removeClass('active')
      }
      
      $openedMenu.removeClass('opened')

      tl.to($navBlock.find('.back-button'), {
        y: $openedMenu.parent().find('> .menu-item').eq(0).offset().top-jQuery(window).scrollTop()-$openedMenu.parent().find('> .menu-item').eq(0).outerHeight()*1.6,
        onStart: () => {
          if($openedMenu.parent().hasClass('menu')) {
            $navBlock.find('.back-button').removeClass('active');
          }
        }
      })

      tl.to($openedMenu.find('> .sub-menu > li > a'), {
        opacity: 0,
        onComplete: () => {
          gsap.set($openedMenu.find('> .sub-menu > li > a'), {
            visibility: 'hidden',
          });
        }
      }, 0)

      tl.to($openedMenu.find('> .sub-menu'), {
        zIndex: -1
      }, 0)

      tl.fromTo($openedMenu.parent().find('> .menu-item > a'), .6, {
        opacity: 0,
        y: -40,
        visibility: 'visible',
        zIndex: 2,
      }, {
        opacity: 1,
        y: 0,
        stagger: .2,
        ease: Back.easeOut
      })
    })

    $navBlock.on('open', function() {
      gsap.to($navBlock, {
        opacity: 1,
        visibility: 'visible'
      })

      gsap.to($navBlock.find('.close-button'), {
        opacity: 1,
        delay: .2
      })

      gsap.fromTo($navBlock.find('.menu > li > a'), {
        opacity: 0,
        y: 40,
      }, {
        opacity: 1,
        y: 0,
        stagger: .2,
        ease: Back.easeOut
      })
    })

    $navBlock.on('click', '.close-button', function() {
      gsap.to($navBlock, 1, {
        opacity: 0,
        delay: .2,
        onComplete: () => {
          gsap.set($navBlock, {
            visibility: 'hidden'
          })
        }
      })

      gsap.to($navBlock.find('.close-button, .menu > li > a'), {
        opacity: 0,
      })

      jQuery('.nav-butter.full_screen').removeClass('active')
    })
  });
}

function yprmSideNavigation() {
  jQuery('body').on('click', '.side-navigation a', function (e) {
    var $el = jQuery(this),
      $parent = $el.parent();
  
    if ($parent.hasClass('menu-item-has-children') && !$parent.hasClass('active')) {
      e.preventDefault();
  
      $parent.addClass('hide active').siblings().addClass('hide');
      $el.parents('.sub-menu').addClass('opened');
    }
  }).on('click', '.side-navigation .sub-menu > .back', function () {
    var $el = jQuery(this);
  
    $el.parent().parent().removeClass('hide active').siblings().removeClass('hide');
    $el.parent().parent().removeClass('opened').parent().removeClass('opened');
  }).find('.side-navigation .sub-menu').prepend('<li class="back wixo-icon-right-arrow-2"></li>');
}

function yprmParallax() {
  jQuery('[data-bg-parallax]').each(function() {
    let $block = jQuery(this),
    params = $block.data('bg-parallax')

    $block.jarallax(params);
  });
}

function yprmScrollTop() {
  if(typeof window.SmoothScroll !== 'undefined') {
    jQuery({ top: window.SmoothScroll.offset.y }).animate({ top: 0 }, {
      duration: 1000,
      easing: 'swing',
      step(value) {
        window.SmoothScroll.setPosition(0, value);
      }
    });
  } else {
    jQuery('body, html').animate({
			scrollTop: 0
		}, 1100);
		return false;
  }
}

function yprmBannerMouseMove() {
  jQuery('.banner-area, .first-screen-block').each(function() {
    if(!jQuery(this).find('[data-parallax-coef]').length) return

    jQuery(this).on('mousemove', (e) => {
      jQuery(this).find('[data-parallax-coef]').each(function() {
        let coef = jQuery(this).data('parallax-coef')

        gsap.to(jQuery(this), {
          x: e.pageX/jQuery(window).width() * coef,
          y: e.pageY/jQuery(window).height() * coef
        })
      })
    })
  });
}

yprmBannerMouseMove()
yprmInitFullMenu()
//yprmSideNavigation()

if (yprmGetCookie('yprm_gdpr') == 'true') {
  jQuery('.gdpr-modal-block').remove();
}

jQuery(document).on('click', '[href^="#"]:not([href="#"])', function (e) {
  e.preventDefault();

  if (jQuery(e.target).parents('.woocommerce-tabs').length) return false;

  let $elem = jQuery(jQuery(this).attr('href')),
    top = $elem.offset().top - jQuery('.site-header').outerHeight();

  jQuery('body, html').animate({
    scrollTop: top
  }, 1100);
});

jQuery(document).on('click', '.filter-block .filter-buttons .filter-button:not(.current)', function () {
  var $grid = jQuery(this).parents('.filter-block').find('.isotope'),
    $button = jQuery(this).parents('.filter-block').find('.loadmore-button');

  if ($grid.length == 0 || $button.hasClass('loading')) return;

  jQuery(this).addClass('current').siblings().removeClass('current');

  var filterValue = jQuery(this).attr('data-filter');
  if ($button.length > 0) {
    jQuery(this).parents('.filter-block').find('.loadmore-button').trigger('click', [false]);
  } else {
    $grid.isotope({
      filter: filterValue
    });
  }

  jQuery(window).trigger('resize').trigger('scroll');
})

jQuery(document).on('click', '.product-block .filter-buttons .filter-button:not(.current)', function () {
  var $grid = jQuery(this).parents('.product-block').find('.isotope'),
    $button = jQuery(this).parents('.product-block').find('.loadmore-button');

  if ($grid.length == 0 || $button.hasClass('loading')) return;

  jQuery(this).addClass('current').siblings().removeClass('current');

  var filterValue = jQuery(this).attr('data-filter');
  if ($button.length > 0) {
    jQuery(this).parents('.product-block').find('.loadmore-button').trigger('click', [false]);
  } else {
    $grid.isotope({
      filter: filterValue
    });
  }

  jQuery(window).trigger('resize').trigger('scroll');
})

jQuery(document).on('click', '.video-controls .pause, .play-video:not([data-type])', function () {
  var $this = jQuery(this),
    $video_block = $this.parents('.bg-overlay').find('.video');
  if ($video_block.attr('data-type') == 'youtube') {
    let event = 'pause';
    if ($this.hasClass('active')) {
      event = 'play';
    }
    $this.toggleClass('active');

    $video_block.addClass('show');

    control_video($video_block, event);
  } else {
    var mediaVideo = $this.parents('.bg-overlay').find('video').get(0);

    if ($this.hasClass('play-video')) {
      var strings = $this.attr('data-strings').split('||');
      $video_block.addClass('show');
      $this.toggleAttr('data-magic-cursor-text', strings[0], strings[1]);
      $this.parents('.bg-overlay').find('.video-controls').removeClass('hide');
    }

    if (mediaVideo.paused) {
      mediaVideo.play();
      $this.removeClass('active');
      $video_block.addClass('is-playing');
    } else {
      mediaVideo.pause();
      $this.addClass('active');
      $video_block.removeClass('is-playing');
    }
  }
})

jQuery(document).on('click', '.video-controls .mute', function () {
  var $this = jQuery(this),
    $video_block = $this.parents('.bg-overlay').find('.video');
  if ($video_block.attr('data-type') == 'youtube') {
    let event = 'mute';
    $this.toggleClass('active');
    if ($this.hasClass('active')) {
      event = 'unmute';
    }

    control_video($video_block, event);
  } else {
    var mediaVideo = $this.parents('.bg-overlay').find('video').get(0);

    if (mediaVideo.muted) {
      mediaVideo.muted = false;
      $this.addClass('active');
    } else {
      mediaVideo.muted = true;
      $this.removeClass('active');
    }
  }
});

jQuery(document).on('ready', function ($) {
  "use strict";

  let dir = 'ltr';
  if (jQuery('html').attr('dir') === 'rtl') {
    dir = 'rtl';
  }

  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  window.cursorSpeed = 0
  window.youtube_players = []

  yprmSetMouseSpeed()
  yprmButtonStyle3()
  yprmCheckScroll()
  yprmParallax()

  jQuery('.line-through-on-hover').each((index, elem) => {
    yprmLineThroughOnHover(elem)

    jQuery(elem).on('mouseenter', () => {
      yprmLineThroughOnHover(elem)
    })
  });
});

if (typeof window.SmoothScroll !== 'undefined') {
  window.SmoothScroll.addListener(function (status) {
    yprmSetScrollPoint(status.offset.y)

    if(typeof Waypoint !== 'undefined') {
      Waypoint.refreshAll()
    }
  })
}

jQuery(window).on('added_items', () => {
  jQuery('.line-through-on-hover').each((index, elem) => {
    yprmLineThroughOnHover(elem)
  });
});

jQuery(window).on('load resize', () => {
  jQuery('.smooth-scrollbar-enabled .main-smooth-scroll').each(function () {
    jQuery(this).css({
      'height': jQuery(window).height(),
    })
  });
  jQuery('.smooth-scrollbar-disable .main-smooth-scroll').each(function () {
    jQuery(this).css({
      'min-height': jQuery(window).height(),
    })
  });

  jQuery('.empty-screen-space').each(function() {
    jQuery(this).css({
      'height': jQuery(window).height() - jQuery('.site-footer').yprmOuterHeight()
    })
  });

  jQuery('.full-height').each(function() {
    jQuery(this).css({
      height: jQuery(window).height() - jQuery('.header-space:visible').yprmHeight()
    })
  });
})

jQuery('body').on('click', '.portfolio-item[data-project-params], .image-slider-area [data-project-params]', function(e) {

  if(typeof elementor !== 'undefined') return

  e.preventDefault();

  let params = jQuery(this).data('project-params'),
  $wrap = jQuery(this).find('.wrap')

  if(!$wrap.length) {
    $wrap = jQuery(this).parents('.image-slider-area')
  }

  img = new Image();

  img.crossOrigin = "anonymous"
  img.src = params.image[0]
  img.width = params.image[1]
  img.height = params.image[2]

  img.onload = function() {
    let projectImg = jQuery('<div class="project-image"></div>').appendTo(jQuery('body')),
    array = {
      base64: yprmGetBase64Image(img, params.image),
      image: params.image,
      top: (jQuery(window).height() * .5) - ($wrap.height() * .5),
      left: (jQuery(window).width() * .5) - ($wrap.width() * .5),
      width: $wrap.width(),
      height: $wrap.height()
    },
    tl = gsap.timeline({
      onStart: () => {
        jQuery('body').removeClass('loaded')
        localStorage.setItem('projectImage', JSON.stringify(array))
      },
      onComplete: () => {
        window.location.href = params.permalink
      }
    });

    tl.set(projectImg, {
      position: 'fixed',
      background: 'url('+params.image[0]+') 50% center / cover no-repeat',
      backgroundSize: 'cover',
      width: array.width,
      height: array.height,
      zIndex: 1050
    })
    .fromTo(projectImg, .6, {
      top: $wrap.offset().top,
      left: $wrap.offset().left,
      opacity: 0
    }, {
      top: array.top,
      left: array.left,
      opacity: 1
    })
  }
});

jQuery('body').on('click', '.scroll-top-button', function() {
  yprmScrollTop()
})
