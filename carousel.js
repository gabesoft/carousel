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
  var el = this.$el.get(0);

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
};


Carousel.prototype.next = function() {
  this.slide(this.currentSlide + 1);
};

Carousel.prototype.prev = function() {
  this.slide(this.currentSlide - 1);
};