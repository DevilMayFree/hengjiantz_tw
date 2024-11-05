(function (jQuery) {
  "use strict";
  jQuery.fn.yprmLoadMore = function (options) {

    function rebuild_array(src, filt) {
      var result = [];

      for (let index = 0; index < src.length; index++) {
        let id = src[index].id || src[index].uniqid,
          flag = false;
        for (let index2 = 0; index2 < filt.length; index2++) {
          let id2 = filt[index2].id || filt[index2].uniqid;
          if (id == id2) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          result.push(src[index]);
        }
      }

      return JSON.stringify(result);
    }

    function getFromCategory(array, slug, count, return_type) {
      var result = [],
        i = 0;

      for (let index = 0; index < array.length; index++) {
        let flag = false;

        if (typeof array[index].cat === undefined || typeof array[index].cat === 'undefined') continue;

        for (let index2 = 0; index2 < array[index].cat.length; index2++) {

          if (array[index].cat[index2] == slug) {
            flag = true;
            break;
          }
        }
        if (flag) {
          i++;
          result.push(array[index]);
        }

        if (i == count && !return_type) {
          break;
        }
      }

      if (result == []) {
        return false;
      }

      return result;
    }

    return this.each(function () {
      var _this = jQuery(this),
        $button = _this.find('.loadmore-button'),
        $filter = _this.find('[class^="filter-butt"]'),
        $items = _this.find('.load-wrap'),
        type = $button.attr('data-type'),
        action = 'loadmore_' + $button.attr('data-action'),
        count = $button.attr('data-count'),
        re = '.istp-item',
        prefix = '.category-',
        style = $button.attr('data-style');

      if (_this.hasClass('product-block')) {
        re = '.product-item';
        prefix = '.product_cat-';
      }

      if (!_this.find('.load-items-area').length) {
        _this.append('<div class="load-items-area"></div>');
      }

      $items.css('min-height', $items.find('.item').height());

      $button.on('click', function (event, loading) {
        if (jQuery(this).hasClass('loading')) return false;

        if (typeof loading === 'undefined' || loading === undefined) {
          loading = true;
        }

        var array = JSON.parse($button.attr('data-array')),
          atts = JSON.parse($button.attr('data-atts')),
          load_items = array.slice(0, count),
          filter_value = '*';

        if ($filter.length > 0) {
          var filter_value = $filter.find('.current').attr('data-filter'),
            slug = filter_value.replace(prefix, ''),
            current_count = $items.find(filter_value).length;

          if (filter_value != '*') {
            var cat_full_length = getFromCategory(array, slug, count, true).length,
              cat_length = getFromCategory(array, slug, count, false).length;

            if (current_count < count && cat_full_length != 0) {
              load_items = getFromCategory(array, slug, count - current_count, false);
              loading = true;
            } else if (loading) {
              load_items = getFromCategory(array, slug, count, false);
            }

            if ((loading && cat_full_length - load_items.length <= 0) || (!loading && cat_full_length == 0)) {
              $button.fadeOut();
            } else {
              $button.fadeIn();
            }
          } else {
            $button.fadeIn();
          }

          $items.isotope({
            filter: filter_value
          });
        }

        if (!loading) {
          return false;
        }

        $button.addClass('loading');
        jQuery('body').addClass('loading');

        jQuery.ajax({
          url: yprm_ajax.url,
          type: "POST",
          data: {
            action: action,
            array: load_items,
            atts: atts,
            type: type,
            style: style,
            start_index: _this.find(re).length
          },
          success: function (data) {
            var temp_block = _this.find('.load-items-area').append(data);
            array = rebuild_array(array, load_items);

            var items = temp_block.find(re);

            if ($items.hasClass('isotope')) {
              console.log(items, re);
              $items.append(items).isotope('appended', items).isotope({
                filter: filter_value
              }).queue(function (next) {
                $button.attr('data-array', array).removeClass('loading');
                jQuery('body').removeClass('loading');

                jQuery(this).find('.wpb_animate_when_almost_visible:not(.wpb_start_animation)').each(function () {
                  var $el = jQuery(this);

                  $el.vcwaypoint(function () {
                    $el.addClass("wpb_start_animation animated")
                  }, {
                    offset: "85%"
                  });
                });
                jQuery(window).trigger('resize').trigger('scroll').trigger('added_items')
                next();
              });
            } else {
              $items.append(items).queue(function (next) {
                $button.attr('data-array', array).removeClass('loading');
                jQuery('body').removeClass('loading');

                jQuery(this).find('.wpb_animate_when_almost_visible:not(.wpb_start_animation)').each(function () {
                  var $el = jQuery(this);

                  $el.vcwaypoint(function () {
                    $el.addClass("wpb_start_animation animated")
                  }, {
                    offset: "85%"
                  });
                });
                jQuery(window).trigger('resize').trigger('scroll').trigger('added_items')
                next();
              });
            }

            if (array == '[]') {
              $button.parent().slideUp();
            }
          },
          error: function (errorThrown) {
            console.log(errorThrown);
          }
        });
      });
    });
  };

})(jQuery);
