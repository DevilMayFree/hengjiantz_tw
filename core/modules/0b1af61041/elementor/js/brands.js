class PTBrandsHandler extends elementorModules.frontend.handlers.Base {
  getDefaultSettings() {
    return {
      selectors: {
        swiper: '.swiper-container',
        prevEl: '.pt-swiper-button-prev',
        nextEl: '.pt-swiper-button-next',
        paginationEl: '.pt-swiper-pagination',
      }
    };
  }

  getDefaultElements() {
    const selectors = this.getSettings('selectors');

    return {
      $swiperContainer: this.$element.find(selectors.swiper),
      $prevEl: this.$element.find(selectors.prevEl),
      $nextEl: this.$element.find(selectors.nextEl),
      $paginationEl: this.$element.find(selectors.paginationEl),
    }
  }

  initSwiper() {
    const elementSettings = this.getElementSettings();
    const elements = this.getDefaultElements();
    const elementorBreakpoints = elementorFrontend.config.responsive.activeBreakpoints;

    if ('yes' != elementSettings.carousel) {
      return;
    }

    const swiperOptions = {
      slidesPerView: elementSettings.cols,
      loop: 'yes' === elementSettings.loop,
      autoplay: 'yes' === elementSettings.autoplay,
      spaceBetween: 0,
      handleElementorBreakpoints: true
    };

    if ( 'yes' === elementSettings.arrows ) {
      swiperOptions.navigation = {
        nextEl: elements.$nextEl,
        prevEl: elements.$prevEl,
      };
    }

    if ( 'yes' === elementSettings.dots ) {
      swiperOptions.pagination = {
        el: elements.$paginationEl,
        type: 'bullets',
        clickable: true
      };
    }

    swiperOptions.breakpoints = {};

    Object.keys(elementorBreakpoints).reverse().forEach((breakpointName) => {
      swiperOptions.breakpoints[elementorBreakpoints[breakpointName].value] = {
        slidesPerView: elementSettings['cols_' + breakpointName],
        // spaceBetween: elementSettings['gap_' + breakpointName]
      };
    });

    const Swiper = elementorFrontend.utils.swiper;

    this.swiper = new Swiper(elements.$swiperContainer, swiperOptions);
  }

  onInit() {
    this.initSwiper();
  }
}

jQuery(window).on('elementor/frontend/init', () => {
  elementorFrontend.elementsHandler.attachHandler('pt-brands', PTBrandsHandler);
});
