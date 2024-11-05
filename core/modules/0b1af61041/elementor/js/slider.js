class PTSliderHandler extends elementorModules.frontend.handlers.Base {
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

    const swiperOptions = {
      loop: 'yes' === elementSettings.loop,
      autoplay: 'yes' === elementSettings.autoplay,
      effect: 'fade',
      speed: 1400
    };

    if ( 'yes' === elementSettings.arrows ) {
      swiperOptions.navigation = {
        nextEl: `.elementor-element-${this.getID()} .pt-swiper-button-next`,
        prevEl: `.elementor-element-${this.getID()} .pt-swiper-button-prev`
      };
    }

    if ( '' !== elementSettings.autoplay_delay && 'yes' === elementSettings.autoplay ) {
      swiperOptions.autoplay = {
        delay: elementSettings.autoplay_delay
      }
    }

    const slider = new Swiper(elements.$swiperContainer.get(0), swiperOptions);
  }

  onInit() {
    this.initSwiper();
  }
}

jQuery(window).on('elementor/frontend/init', () => {
  elementorFrontend.elementsHandler.attachHandler('pt-slider', PTSliderHandler);
});
