class PTHeadingHandler extends elementorModules.frontend.handlers.Base {
  getDefaultSettings() {
    const iterationDelay = this.getElementSettings('rotate_iteration_delay'),
      settings = {
        animationDelay: iterationDelay || 2500,
        lettersDelay: iterationDelay * 0.02 || 50,
        typeLettersDelay: iterationDelay * 0.06 || 150,
        selectionDuration: iterationDelay * 0.2 || 500
      };
    settings.typeAnimationDelay = settings.selectionDuration + 800;
    settings.selectors = {
      headline: '.pt-heading-title',
      dynamicWrapper: '.pt-headline-dynamic-wrapper',
      dynamicText: '.pt-headline-dynamic-text'
    };
    settings.classes = {
      dynamicText: 'pt-headline-dynamic-text',
      dynamicLetter: 'pt-headline-dynamic-letter',
      textActive: 'pt-headline-text-active',
      textInactive: 'pt-headline-text-inactive',
      animationIn: 'pt-headline-animation-in',
      typeSelected: 'pt-headline-typing-selected'
    };
    return settings;
  }

  getDefaultElements() {
    var selectors = this.getSettings('selectors');
    return {
      $headline: this.$element.find(selectors.headline),
      $dynamicWrapper: this.$element.find(selectors.dynamicWrapper),
      $dynamicText: this.$element.find(selectors.dynamicText)
    };
  }

  getNextWord($word) {
    return $word.is(':last-child') ? $word.parent().children().eq(0) : $word.next();
  }

  singleLetters() {
    var classes = this.getSettings('classes');
    this.elements.$dynamicText.each(function () {
      var $word = jQuery(this),
        letters = $word.text().split(''),
        isActive = $word.hasClass(classes.textActive);
      $word.empty();
      letters.forEach(function (letter) {
        var $letter = jQuery('<span>', {
          class: classes.dynamicLetter
        }).text(letter);
        if (isActive) {
          $letter.addClass(classes.animationIn);
        }
        $word.append($letter);
      });
      $word.css('opacity', 1);
    });
  }

  showLetter($letter, $word, bool, duration) {
    var self = this,
      classes = this.getSettings('classes');
    $letter.addClass(classes.animationIn);
    if (!$letter.is(':last-child')) {
      setTimeout(function () {
        self.showLetter($letter.next(), $word, bool, duration);
      }, duration);
    } else if (!bool) {
      setTimeout(function () {
        self.hideWord($word);
      }, self.getSettings('animationDelay'));
    }
  }

  hideLetter($letter, $word, bool, duration) {
    var self = this,
      settings = this.getSettings();
    $letter.removeClass(settings.classes.animationIn);
    if (!$letter.is(':last-child')) {
      setTimeout(function () {
        self.hideLetter($letter.next(), $word, bool, duration);
      }, duration);
    } else if (bool) {
      setTimeout(function () {
        self.hideWord(self.getNextWord($word));
      }, self.getSettings('animationDelay'));
    }
  }

  showWord($word, $duration) {
    var self = this,
      settings = self.getSettings(),
      animationType = self.getElementSettings('animation_type');
    if ('typing' === animationType) {
      self.showLetter($word.find('.' + settings.classes.dynamicLetter).eq(0), $word, false, $duration);
      $word.addClass(settings.classes.textActive).removeClass(settings.classes.textInactive);
    }
  }

  hideWord($word) {
    var self = this,
      settings = self.getSettings(),
      classes = settings.classes,
      letterSelector = '.' + classes.dynamicLetter;
    var animationType = self.getElementSettings('animation_type'),
      nextWord = self.getNextWord($word);
    if ('typing' === animationType) {
      self.elements.$dynamicWrapper.addClass(classes.typeSelected);
      setTimeout(function () {
        self.elements.$dynamicWrapper.removeClass(classes.typeSelected);
        $word.addClass(settings.classes.textInactive).removeClass(classes.textActive).children(letterSelector).removeClass(classes.animationIn);
      }, settings.selectionDuration);
      setTimeout(function () {
        self.showWord(nextWord, settings.typeLettersDelay);
      }, settings.typeAnimationDelay);
    } else {
      var bool = $word.children(letterSelector).length >= nextWord.children(letterSelector).length;
      self.hideLetter($word.find(letterSelector).eq(0), $word, bool, settings.lettersDelay);
      self.showLetter(nextWord.find(letterSelector).eq(0), nextWord, bool, settings.lettersDelay);
      self.setDynamicWrapperWidth(nextWord);
    }
  }

  setDynamicWrapperWidth($word) {
    const animationType = this.getElementSettings('animation_type');

    if ('typing' !== animationType) {
      this.elements.$dynamicWrapper.css('width', $word.outerWidth());
    }
  }

  animateHeadline() {
    var self = this,
      animationType = self.getElementSettings('animation_type');

    if ('typing' !== animationType) {
      self.setDynamicWrapperWidth(self.elements.$dynamicText);
    }

    setTimeout(function () {
      self.hideWord(self.elements.$dynamicText.eq(0));
    }, self.getSettings('animationDelay'));
  }

  onInit() {
    elementorModules.frontend.handlers.Base.prototype.onInit.apply(this, arguments);

    if ( !this.getElementSettings('animation_type') ) {
      return;
    }

    this.singleLetters();
    this.animateHeadline();
  }
}

jQuery(window).on('elementor/frontend/init', () => {
  elementorFrontend.elementsHandler.attachHandler('pt-heading', PTHeadingHandler);
});
