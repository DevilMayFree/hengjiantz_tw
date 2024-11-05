class PTIconBoxHandler extends elementorModules.frontend.handlers.Base {
  getDefaultSettings() {
    return {
      selectors: {
        swiper: '.swiper'
      }
    };
  }

  getDefaultElements() {
    const selectors = this.getSettings('selectors');

    return {
      $swiperContainer: this.$element.find(selectors.swiper)
    }
  }

  initSwiper() {
    const elementSettings = this.getElementSettings();
    const elements = this.getDefaultElements();
    const elementorBreakpoints = elementorFrontend.config.responsive.activeBreakpoints;

    if ('carousel' != elementSettings.layout) {
      return;
    }

    const swiperOptions = {
      slidesPerView: elementSettings.cols,
      spaceBetween: 30,
      loop: 'yes' === elementSettings.loop,
      autoplay: 'yes' === elementSettings.autoplay,
      handleElementorBreakpoints: true
    };

    swiperOptions.breakpoints = {};

    Object.keys(elementorBreakpoints).reverse().forEach((breakpointName) => {
      swiperOptions.breakpoints[elementorBreakpoints[breakpointName].value] = {
        slidesPerView: +elementSettings['cols_' + breakpointName]
      };
    });

    if ('yes' === elementSettings.arrows) {
      swiperOptions.navigation = {
        nextEl: `.elementor-element-${this.getID()} .pt-swiper-button-next`,
        prevEl: `.elementor-element-${this.getID()} .pt-swiper-button-prev`
      };
    }

    if ('yes' === elementSettings.dots) {
      swiperOptions.pagination = {
        el: `.elementor-element-${this.getID()} .pt-swiper-pagination`,
        type: 'bullets',
        clickable: true
      };
    }

    const Swiper = elementorFrontend.utils.swiper;

    this.swiper = new Swiper(elements.$swiperContainer, swiperOptions);

    elements.$swiperContainer.find('.swiper-slide').mouseover(function() {
      elements.$swiperContainer.addClass('hovered')
    });

    elements.$swiperContainer.find('.swiper-slide').mouseleave(function() {
      elements.$swiperContainer.removeClass('hovered')
    });
  }

  onInit() {
    this.initSwiper();
  }
}

jQuery(window).on('elementor/frontend/init', () => {
  elementorFrontend.elementsHandler.attachHandler('pt-icon-box', PTIconBoxHandler);
});
