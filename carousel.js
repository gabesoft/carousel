'use strict';

function Carousel(el, options) {
  this.el = el;
  this.$el = $(el);

  this.slideWidth = options.slideWidth;
  this.slideHeight = options.slideHeight;
  this.slideRatio = options.slideHeight / options.slideWidth;
}

Carousel.prototype.init = function() {
  this.build();
  this.setDimensions();
  this.attachEvents();
};

Carousel.prototype.build = function() {
  this.$slides = this.$el.children();
  this.$slides.addClass('carousel-slide');
  this.slideCount = this.$slides.length;

  // this.$slides.css('width', this.slideWidth);
  this.$slides.each(function(index, el) {
    $(el).attr('data-carousel-index', index);
  });

  this.$el.addClass('carousel-slider');
  this.$track = this.$slides.wrapAll('<div class="carousel-track"/>').parent();

  this.$list = this.$track
    .wrap('<div aria-live="polite" class="carousel-list"/>')
    .parent();
  this.$list.addClass('draggable');

  // this.$track.css('opacity', 0);
};

Carousel.prototype.setDimensions = function() {
  this.listWidth = this.$list.width();
  this.listHeight = this.$list.height();

  this.slideWidth = this.$el.width();
  this.slideHeight = Math.ceil(this.slideRatio * this.slideWidth);

  this.$slides.width(this.slideWidth);
  this.$track.height(this.slideHeight);
  this.$track.width(Math.ceil(this.slideCount * this.slideWidth));

  this.$list.width(this.slideWidth);
};

Carousel.prototype.slide = function(index) {
  var pos = Math.max(0, Math.min(index || 0, this.slideCount - 1));
  var $slide = this.$track.find('[data-carousel-index=' + pos + ']');
  var offset = pos * this.slideWidth;

  this.$slides
    .removeClass('carousel-slide-active')
    .attr('tabindex', -1);
  $slide
    .addClass('carousel-slide-active')
    .attr('tabindex', 0);

  this.$track.css('transform', 'translate3d(-' + offset + 'px, 0, 0)');
  this.currentSlide = pos;
};

Carousel.prototype.resize = function() {
  this.$track.css('transition', 'none');
  this.setDimensions();
  this.slide(this.currentSlide);
  setTimeout(function() {
    this.$track.css('transition', '');
  }.bind(this), 0);
};

// TODO: fullscreen should be set on a parent element
Carousel.prototype.fullscreen = function() {
  var el = this.$el[0];

  if (this.isFullScreen) {
    if (el.exitFullscreen) {
      el.exitFullscreen();
    } else if (el.msCancelFullscreen) {
      el.msCancelFullscreen();
    } else if (el.mozCancelFullScreen) {
      el.mozCancelFullScreen();
    } else if (el.webkitExitFullscreen) {
      el.webkitExitFullscreen();
    }
  } else {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }

  this.isFullScreen = !this.isFullScreen;
};


Carousel.prototype.attachEvents = function() {
  $(window).on('resize', this.resize.bind(this));

  this.hammer = new Hammer(this.$track[0]);

  this.hammer.on('panstart', function(e) {
    console.log('panstart panright', e.deltaX);
    this.$list.addClass('dragging');

    var offset = this.currentSlide * this.slideWidth - e.deltaX;
    console.log('offset', offset);
    this.$track.css('transform', 'translate3d(' + (-1 * offset) + 'px, 0, 0)');
  }.bind(this));

  this.hammer.on('panmove', function(e) {
    var offset = this.currentSlide * this.slideWidth - e.deltaX;
    console.log('offset', offset);
    this.$track.css('transform', 'translate3d(' + (-1 * offset) + 'px, 0, 0)');
  }.bind(this));

  this.hammer.on('panend', function(e) {
    e.preventDefault();
    console.log('panend', e.deltaX, this.slideWidth);

    if (Math.abs(e.deltaX) >= this.slideWidth / 2) {
      if (e.deltaX > 0) {
        this.prev();
      } else {
        this.next();
      }
    } else {
      this.slide(this.currentSlide);
    }

    this.$list.removeClass('dragging');
  }.bind(this));

  this.$list.live('mousedown', function(e) {
    this.$list.addClass('dragging');
  }.bind(this));

  this.$list.live('mouseup', function(e) {
    this.$list.removeClass('dragging');
  }.bind(this));

  this.$track.on('dragstart', function(e) {
    e.preventDefault();
  }.bind(this));
};


Carousel.prototype.next = function() {
  this.slide(this.currentSlide + 1);
};

Carousel.prototype.prev = function() {
  this.slide(this.currentSlide - 1);
};
