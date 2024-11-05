class PTBlogHandler extends elementorModules.frontend.handlers.Base {
	getDefaultSettings() {
		return {
      enable_carousel: this.getElementSettings('enable_carousel'),
			type: this.getElementSettings('type'),
			loop: this.getElementSettings('swiper_loop'),
			autoplay: this.getElementSettings('swiper_autoplay'),
			autoplay_timeout: this.getElementSettings('swiper_autoplay_timeout'),
			arrows: this.getElementSettings('swiper_arrows'),
			cols: {
				xs: this.getElementSettings('cols_xs'),
				sm: this.getElementSettings('cols_sm'),
				md: this.getElementSettings('cols_md'),
				lg: this.getElementSettings('cols_lg'),
				xl: this.getElementSettings('cols_xl'),
			},
			selectors: {
				block: '.blog-items',
				swiper: '.swiper',
				prevEl: '.pt-swiper-button-prev',
				nextEl: '.pt-swiper-button-next',
        paginationEl: '.pt-swiper-pagination',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings('selectors');

		return {
			$block: this.$element.find(selectors.block),
			$swiperContainer: this.$element.find(selectors.swiper),
			$prevEl: this.$element.find(selectors.prevEl),
			$nextEl: this.$element.find(selectors.nextEl),
      $paginationEl: this.$element.find(selectors.paginationEl),
		}
	}

	initSwiper() {
		const settings = this.getSettings()
		const elements = this.getDefaultElements()

		if(settings.enable_carousel != 'yes') return;

		let autoplay = false,
			breakpoints = {
				0: {
					slidesPerView: 1
				}
			}

		if (settings.autoplay == 'yes') {
			autoplay = {
				delay: settings.autoplay_timeout
			}
		}

		if (settings.cols.xs) {
      if(typeof breakpoints[0] === 'undefined') breakpoints[0] = {}
			breakpoints[0].slidesPerView = settings.cols.xs
		}
		if (settings.cols.sm) {
      if(typeof breakpoints[576] === 'undefined') breakpoints[576] = {}
			breakpoints[576].slidesPerView = settings.cols.sm
		}
		if (settings.cols.md) {
      if(typeof breakpoints[768] === 'undefined') breakpoints[768] = {}
			breakpoints[768].slidesPerView = settings.cols.md
		}
		if (settings.cols.lg) {
      if(typeof breakpoints[992] === 'undefined') breakpoints[992] = {}
			breakpoints[992].slidesPerView = settings.cols.lg
		}
		if (settings.cols.xl) {
      if(typeof breakpoints[1200] === 'undefined') breakpoints[1200] = {}
			breakpoints[1200].slidesPerView = settings.cols.xl
		}

    // let slidesCount = 0;

    const swiperConfig = {
      loop: settings.loop == 'yes' ? true : false,
      autoplay: autoplay,
      spaceBetween: 30,
      // watchSlidesProgress: true,
      // watchSlidesVisibility: true,
      loopAdditionalSlides: 1,
      navigation: {
        nextEl: `.elementor-element-${this.getID()} .pt-swiper-button-next`,
        prevEl: `.elementor-element-${this.getID()} .pt-swiper-button-prev`
      },
      pagination: {
        el: `.elementor-element-${this.getID()} .pt-swiper-pagination`,
        type: 'bullets',
        clickable: true
      },
      breakpoints: breakpoints,
      // on: {
      //   slideChangeTransitionStart: function() {
      //     slidesCount = this.visibleSlidesIndexes.length;
      //   },
      //   setTranslate: function(e) {
      //     var _this = this;

      //     if(!slidesCount) {
      //       slidesCount = this.visibleSlidesIndexes.length;
      //     }
    
      //     jQuery(this.slides).each(function(index) {
      //       var left = _this.slidesGrid[index],
      //           x = -_this.translate - left,
      //           k = 1 - x / jQuery(this).outerWidth(true),
      //           o = k < 0 ? 0 : k;

      //       x = x <= 0 ? 0 : x;

      //       if (o > slidesCount) {
      //         o = slidesCount - k + 1;
      //       }

      //       jQuery(this).css({
      //         opacity: o,
      //         transition: jQuery(_this.$wrapperEl).css('transition-duration')
      //       });
      //     })
      //   },
      // }
    };

    const Swiper = elementorFrontend.utils.swiper;

    this.swiper = new Swiper(elements.$swiperContainer, swiperConfig);
	}

  initIsotope() {
    const settings = this.getSettings()
		const elements = this.getDefaultElements()

    if (settings.enable_carousel == 'yes') return;

    if (settings.type == 'grid' || settings.type == 'list' || settings.type == 'overlay' || settings.type == 'masonry' || settings.type == 'packery') {
      elements.$block.isotope()
    }
  }

	onDestroy() {
		const elements = this.getDefaultElements()

		if(elements.$swiperContainer.length && typeof elements.$swiperContainer.swiper !== 'undefined') {
			elements.$swiperContainer.swiper.destroy()
		}
	}

	bindEvents() {
	}

  initLoadMore() {
    if (this.$element.find('.filter-block').length) {
      this.$element.find('.filter-block').yprmLoadMore();
    }
  }

	onInit() {
		this.initSwiper()
    this.initIsotope()
    this.initLoadMore()
	}
}

jQuery(window).on('elementor/frontend/init', () => {
  elementorFrontend.elementsHandler.attachHandler('pt-blog', PTBlogHandler);
});
