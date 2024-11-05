"use strict";

(function ($) {
  $.fn.yprmHeight = function () {
    return this.length ? this.height() : 0
  };
  $.fn.yprmOuterHeight = function () {
    return this.length ? this.outerHeight() : 0
  };
  $.fn.yprmWidth = function () {
    return this.length ? this.width() : 0
  };
  $.fn.yprmOuterWidth = function () {
    return this.length ? this.outerWidth() : 0
  };
})(jQuery);

function yprmHeaderScroll(scrollTop) {
	if (scrollTop > 50) {
		jQuery('.header-sticky .site-header').addClass('colored');
	} else {
		jQuery('.header-sticky .site-header').removeClass('colored');
	}
}

jQuery(window).on('load scroll', function() {
  yprmHeaderScroll(jQuery(window).scrollTop());
});

jQuery(window).on('load', function () {
  jQuery('body').addClass('loaded');
});

jQuery(window).on('load resize elementor/frontend/init', function() {
  jQuery('.header-space').css('height', jQuery('.site-header:visible').yprmOuterHeight());

  jQuery('.site-menu .has-mega-menu').each(function(e) {
    var leftOffset = jQuery(this).offset().left;
    jQuery(this).find('.pt-mega-menu-wrapper').css('left', -1 * leftOffset);
  });

  var containers = [
    '.site-footer',
    '#wpadminbar'
  ];
  addCssElement('.site-main', containers);
});

jQuery('.right-click-disable-true').on('contextmenu', function () {
  jQuery('.right-click-disable-message').addClass('active');
  return false;
});

jQuery('.right-click-disable-message:not(.lic)').on('click', function () {
  jQuery(this).removeClass('active');
  return false;
});

jQuery('.site-menu .sub-menu li a').on('mouseenter', function() {
  jQuery(this).parent().parent().addClass('is-hovered');
});

jQuery('.site-menu .sub-menu li a').on('mouseleave', function() {
  jQuery('.sub-menu').removeClass('is-hovered');
});

jQuery('.menu-toggle, .mobile-menu-toggle').on('click', function() {
  jQuery('body').toggleClass('menu-toggled');
});

jQuery('.search-toggle').on('click', function() {
  jQuery('body').toggleClass('search-toggled');
});

jQuery('.mobile-menu ul li.menu-item-has-children > a, .mobile-menu ul li.menu-item-has-children > .submenu-toggle, .widget_nav_menu ul li.menu-item-has-children > a, .widget_nav_menu ul li.menu-item-has-children > .submenu-toggle').on('click', function(e) {
  e.preventDefault();

  jQuery(this).parent().children('ul').slideToggle();
  jQuery(this).parent().siblings().find('ul').slideUp();

  if (!jQuery(this).parent().hasClass('submenu-open')) {
    jQuery(this).parent().addClass('submenu-open');
  } else {
    jQuery(this).parent().removeClass('submenu-open');
  }

  jQuery(this).parent().siblings().removeClass('submenu-open');

  return false;
});

jQuery('.site-menu .menu-item-has-children, .pt-cart').on('mouseenter', function() {
  let $li = jQuery(this),
  $menu = $li.children('.pt-cart-minicart, .sub-menu');

  if($menu.length && $menu.offset().left+$menu.outerWidth() >= jQuery(window).width() && !$li.hasClass('on-left')) {
    $li.addClass('on-left');
  }
});

function addCssElement( selector, selectors, type = 'min-height' ) {
	var height = jQuery(window).outerHeight();

	for (var i = 0; i < selectors.length; i++) {
		var containerHeight = jQuery(selectors[i]).outerHeight();
		if ( containerHeight ) {
			height -= containerHeight;
		}
	}

	jQuery(selector).css(type, height);
}

jQuery( function( $ ) {

  if ( ! String.prototype.getDecimals ) {
    String.prototype.getDecimals = function() {
      var num = this,
        match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if ( ! match ) {
        return 0;
      }
      return Math.max( 0, ( match[1] ? match[1].length : 0 ) - ( match[2] ? +match[2] : 0 ) );
    }
  }

  function wcqi_refresh_quantity_increments(){
    $( 'div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)' ).addClass( 'buttons_added' ).append( '<span class="plus"></span>' ).prepend( '<span class="minus"></span>' );
  }

  $( document ).on( 'updated_wc_div', function() {
    wcqi_refresh_quantity_increments();
  } );

  $( document ).on( 'click', '.plus, .minus', function() {
    // Get values
    var $qty = $( this ).closest( '.quantity' ).find( '.qty'),
      currentVal = parseFloat( $qty.val() ),
      max = parseFloat( $qty.attr( 'max' ) ),
      min = parseFloat( $qty.attr( 'min' ) ),
      step = $qty.attr( 'step' );

    // Format values
    if ( ! currentVal || currentVal === '' || currentVal === 'NaN' ) currentVal = 0;
    if ( max === '' || max === 'NaN' ) max = '';
    if ( min === '' || min === 'NaN' ) min = 0;
    if ( step === 'any' || step === '' || step === undefined || parseFloat( step ) === 'NaN' ) step = 1;

    // Change the value
    if ( $( this ).is( '.plus' ) ) {
      if ( max && ( currentVal >= max ) ) {
        $qty.val( max );
      } else {
        $qty.val( ( currentVal + parseFloat( step )).toFixed( step.getDecimals() ) );
      }
    } else {
      if ( min && ( currentVal <= min ) ) {
        $qty.val( min );
      } else if ( currentVal > 0 ) {
        $qty.val( ( currentVal - parseFloat( step )).toFixed( step.getDecimals() ) );
      }
    }

    // Trigger change event
    $qty.trigger( 'change' );
  });

  wcqi_refresh_quantity_increments();
});
