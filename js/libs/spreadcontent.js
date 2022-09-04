(function($,document,window,undefined){
 
                /**
                * Computes the offset (minimum 600px) needed to position the element
                * on the scrolling canvas, separate enought from the other
                * so that they don't overlap each other when displayed
                */
                var _verticalOffset = function(element){
 
                  var offset = ($(document).height() - element.height())/2;
                  return offset > 600 ? offset : 600;
                }
 
                var _horizontalOffset = function(element){
 
                  var offset = ($(document).width() - element.width())/2;
                  return offset > 600 ? offset : 600;
                }
 
                /**
                * Returns the number corresponding to given px value.
                * eg. For 145px, returns 145
                */
                var _pxToNumber = function(px){
 
                  return parseInt(px.substring(0,px.indexOf('px')));
                }
 
                /**
                * Spreads the articles on the scroller element so that they are positioned for the scrolling nav
                * according to the size of the viewport. Also takes into account the margins used for the positioning
                * of the element once scrolled to.
                *
                */
                var spreadArticles = function(){

                  var s4 = $('#s4');
                  s4.css({

                    'top': _verticalOffset(s4) - _pxToNumber(s4.css('margin-top')),
                    'left': - _pxToNumber(s4.css('margin-left'))
                  });

                  var s2 = $('#s2');

                  s2.css({

                    'top': - _pxToNumber(s2.css('margin-top')),
                    'left': s4.width() + _horizontalOffset(s4) - _pxToNumber(s2.css('margin-left'))
                  });

                  var home = $('#home');
                  home.css({

                    'top': s2.height() + _verticalOffset(home) - _pxToNumber(home.css('margin-top')),
                    'left': s4.width() - _pxToNumber(home.css('margin-left'))
                  });

                  var s3 = $('#s3');
                  s3.css({

                    'top': home.position().top - _pxToNumber(s3.css('margin-top')),
                    'left': home.position().left + home.width() + _horizontalOffset(home) - _pxToNumber(s3.css('margin-left'))
                  });

                  var s5 = $('#s5');
                  s5.css({

                    'top': s3.position().top + s3.height() + _verticalOffset(s3) - _pxToNumber(s5.css('margin-top')),
                    'left': s3.position().left - _pxToNumber(s5.css('margin-left'))
                  });

                  var s6 = $('#s6');
                  s6.css({

                    'top': home.position().top + home.height() + _verticalOffset(home) - _pxToNumber(s6.css('margin-top')),
                    'left': - _pxToNumber(s6.css('margin-left'))
                  });
                };

                /**
                * Clears the positioning of the article
                */
                var clearArticlePositioning = function (){
 
                  $('article').css({
                    position: '',
                    top: '',
                    left: ''
                  });
                }
 
                /**
                * Updates the sections' content heights
                * and adds a scrollbar if needed
                */
                var updateContentHeight = function (target){
 
                  var content = $('.content', target);
 
                  if(content.length){
 
                    // Resize the content according to remaining space
                    content.height($(document).height() - content.offset().top);
                    content.jScrollPane();
                  }
                };
 
 
                /**
                * Moves the scroller div so that it displays target
                */
                var navigateTo = function(target, animate, updateLoc){
 
                  target= $(target);
                  var nav = $('nav');
 
                  var css = {
 
         'top': (-target.position().top + $(document).height()/2.9)-230,
                    'left': (-target.position().left + $(document).width()/2.9)-230
                  };
 
                  if(animate){
                    $('#scroller').animate(css,750, 'easeInOutCirc', function(){updateContentHeight(target)});
                  }
                  else{
 
                    $('#scroller').css(css);
                    updateContentHeight(target);
                  }
 
                  if(updateLoc){
                    updateLocation(target);
                  }
                  updateActiveLink(target);
                };
 
                /**
                * Updates the window.location to make it point to given hash
                */
                var updateLocation = function(target){
 
                  target = $(target)
 
                  // Prepends an anchor with given hash so that window doesn't move when location is changed
                  var id = target.attr('id');
                  var dummyAnchor = $('<a></a>').css({
 
                    'position': 'absolute',
                    'top': $(window).scrollTop(),
                    'left': $(window).scrollLeft()
                  }).attr('id',id);
 
                  target.attr('id','');
                  $('body').prepend(dummyAnchor);
                  window.location = '#'+id;
                  dummyAnchor.remove();
                  target.attr('id',id);
                };
 
              /**
              * Updates the active link in the nav
              */
              var updateActiveLink = function(target){
 
                $('nav .active').removeClass('active');
                $('[href=#'+target.attr('id')+']').addClass('active');
              }
 
              /**
              * Callback for clicks on the nav links
              */
              var onNavLinkClick = function(event, data){
 
                event.preventDefault();
 
                var article = $($(event.currentTarget).attr('href'));
 
                // Prevents navigating to the dummy links used to update location
                navigateTo(article, true, true);
              };
 
              /**
              * Callback for window resizing handling
              */
              var onWindowResize = function(event, data){
 
                if($(document).width() > 994){
 
                  if(!$(document.documentElement).hasClass('iscroll')){
 
                    $(document.documentElement).addClass('iscroll');
                    $('#wrapper').css('overflow','hidden');
                    var scroller = $('#scroller').css({
                      'position':'absolute',
                      'top': 0,
                      'left':0
                    });
                    
                    // Register custom behaviour on local links
                    $('[href^=#]').on('click',onNavLinkClick);
                    
                  }
 
                  // Compute spacing again
                  spreadArticles();
 
                  // And adjust positioning to keep the current page in the viewport
                  var target = window.location.hash || '#home';
                  navigateTo($(target),true);
                  removeMobileMenu();
                }
                else{
 
                  // Clears desktop positioning
                  clearArticlePositioning();
 
                  $('.content').css({
                    'height':'',
                    'width':''
                  });
 
                  $('#scroller').css({
                    position: '',
                    top: '',
                    left: ''
                  });
                  $(document.documentElement).removeClass('iscroll');
                  
                  // Unregister custom behaviour on local links
                  $('[href^=#]').off('click',onNavLinkClick);
                  setupMobileMenu();
                }
              };
 
              var onMobileMenuToggleClick = function(event,data){
 
                event.preventDefault();
                $('.mobile-menu').toggle();
              }
 
              var onMobileMenuLinkClick = function(event,data){
 
                $('.mobile-menu').hide();
              }
 
              // Add custom easing to jQuery
              jQuery.extend(jQuery.easing,{
 
                easeInOutCirc: function (x, t, b, c, d) {
                  if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                  return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                }
              });
 
 
 
              var setupMobileMenu = function(){
 
                if(!$('.mobile-menu-toggle').length){
                  // Hide the links from the nav and display a button to open a custome menu
                  var nav = $('nav').addClass('mobile');
                  var links = $('a',$('nav')).not('[href^=tel]').clone();
                  var menuToggle = $('<a>').text('Menu').attr('class','mobile-menu-toggle').prependTo(nav);
 
                  // Create a custom menu (hidden by default)
                  var menu = $('<div>')
                  .attr('class','mobile-menu')
                  .hide()
                  .prependTo($('body'))
                  .append(links);
 
                  // Add listeners to the toggle for opening/closing the menu
                  menuToggle.on('click',onMobileMenuToggleClick);
 
                  // And to links for closing the menu once they are toggled
                  links.on('click',onMobileMenuLinkClick);
                }
                else{
 
                  $('.mobile-menu-toggle').show();
                }
              };
 
              var removeMobileMenu = function(){
 
                $('.mobile-menu').hide();
                $('.mobile-menu-toggle').hide();
              }
 
              $(document).ready(function(){
 
                // Set up wrapper and scroller for scrolling
 
 
                // Spread out the articles if width is > 994px
                if($(document).width() > 994){
 
                  // Add a class to the <html> element to trigger custom CSS
                  $(document.documentElement).addClass('iscroll');
 
                  $('#wrapper').css('overflow','hidden');
                  var scroller = $('#scroller').css({
                    'position':'absolute',
                    'top': 0,
                    'left':0
                  });
 
                  // Spread out the articles in the scroller
                  spreadArticles();
                  
                  // Register custom link behaviour on '#...' links
                  $('[href^=#]').on('click',onNavLinkClick);
 
                  // Move the scroller
                  navigateTo($(window.location.hash || '#home'));
                }
                // Create custom menu for mobile headed if width is < 994px
                else{
 
                  setupMobileMenu();
                }
 
                // Register listeners to handle window resizing
                // Debounced so that it doesn't trigger too often
                $(window).on('resize',_.debounce(onWindowResize,80));
 
            
              
                });
 
})(jQuery,document, window);
              