/**
 * User: Numan <diegosevillano@gmail.com>
 *
 * Auto Scroll Slider
 * Version: 0.1
 */

/*global jQuery */
var autoScrollSlider = (function () {

    'use strict';

    // private properties

    var seconds         = 1000,
        scrollTrans     = 1.3 * seconds,
        windowTime      = 10 * seconds,
        iframes         = [],
        position        = 0,
        iframeHeight    = 0,
        animate         = true,
        animateType     = 'linear', // jQuery animations (swing / linear)
        scrollType      = 'adaptive', // (adaptive, window)
        selectorDefault = 'body',
        random          = true,
        $container,
        $iframe,


        // Private Methods

        /**
         * Render the iframe inside the container
         */
        printIframe = function printIframe() {

            $container.prepend($('<iframe>', {src: '', width: '100%', frameborder: '0', scrolling: 'no', style: 'display:none;width:100%;'}));

            $iframe = $container.find('iframe');
        },

        /**
         * Resize the iframe with the height of the content
         */
        resizeIframe = function () {

            var height = $iframe[0].contentWindow.document.body.offsetHeight;

            $iframe[0].style.height = height + 'px';
            iframeHeight = height;
        },


        /**
         * Select the next page to show
         *
         * @param [pos] Position of the next page in the array of pages
         */
        getNextPage = function (pos) {

            if (typeof pos !== 'undefined'
                && /^\d+$/.test(pos)) {
                position = pos;
            }
            else if (position >= iframes.length) {
                position = 0;
            }

            $iframe.attr("src", iframes[position]);

            position = position + 1;

        },

        /**
         * Calculate the parameters for the scrolling
         */
         configScroll = function () {

            var windowHeight = ($container.selector === selectorDefault) ? $(window).height() : $container.height(),
                scrollTotal = Math.ceil(iframeHeight / windowHeight),
                scrollHeight;


            switch (scrollType) {
                case 'window':
                    scrollHeight = windowHeight;
                    break;
                default :
                    scrollHeight = (iframeHeight - windowHeight) / (scrollTotal - 1);
            }

            scroll(0, scrollTotal, scrollHeight);

        },

        /**
         * Scroll all the pages until the last iteration
         *
         * @param iteration current iteration of the recursive function
         * @param numberScrolls teh total number of scrolls
         * @param windowPosition the total position of the window
         */
         scroll = function (iteration, numberScrolls, windowPosition) {

            var animationTime = scrollTrans;

            if (iteration < numberScrolls) {

                if (animate) {
                    $container.animate( {
                        scrollTop: windowPosition * (iteration),
                        easing : animateType
                    }, scrollTrans );
                    if (iteration === 0) {
                        animationTime = 0;
                    }

                }
                else {
                    $container.scrollTop(windowPosition * (iteration));
                    animationTime = 0;
                }

                setTimeout(function () {
                    scroll(iteration + 1, numberScrolls, windowPosition);
                }, windowTime + animationTime);

            }
            else if (iteration >= numberScrolls) {
                swapPage();
            }
            else {
                throw {message: "Error in the scrolling" };
            }
        },

        /**
         * Swap the current page with the new content apply a fadeOut
         */
         swapPage = function () {

            $iframe.fadeOut( "slow", function() {
                getNextPage();
            });
        },

        /**
         * Check the dependencies
         */
        checkRequire = function (libs) {

            var el;

            if (libs.length > 0) {

                el = libs.shift();

                if (typeof(window[el['lib']]) !== 'function') {

                    throw { message :'jQuery is required, please insert the library.'};
                }
                else {
                    checkRequire(libs);
                }
            }
        },

        // Public methods

        /**
         * Start the application process
         */
        start = function () {

            //Print Iframe
            printIframe();

            $iframe.load(function () {
                // Resize the iframe
                resizeIframe();
                $iframe.fadeIn( "slow", function() {
                    resizeIframe();
                    configScroll();
                });

            });

            getNextPage();
        },

        /**
         * The constructor of the applicacion, initialize all the parameters
         *
         * @param {object} pages we want to slide them
         * @param {object} param configuration array with all the parameters to personalize the app
         *
         * @constructor
         */
         Constructor = function (pages, param) {

            var selector = selectorDefault;

            try {

                checkRequire([{'lib': 'jQuery'}]);

                if (typeof iframes === "object") {
                    iframes = pages;
                }
                else {
                    throw {message: "API error: Wrong parameters" };
                }

                if (typeof param === "object") {

                    // scroll type
                    if (param.hasOwnProperty('scrollType')
                        && typeof param.scrollType === "string") {
                        scrollType = param.scrollType;
                    }

                    // animation
                    if (param.hasOwnProperty('animate')
                        && typeof param.random === "boolean") {
                        animate = param.random;

                    }

                    // Random
                    if (param.hasOwnProperty('random')
                        && typeof param.random === "boolean") {
                        random = param.random;

                        random && iframes.sort(function() {
                            return Math.random() - 0.5;
                        });
                    }

                    // windowTime
                    if (param.hasOwnProperty('windowTime')
                        && typeof param.windowTime === "number"
                        && /^\d+?$/.test(param.windowTime)) {
                        windowTime = param.windowTime;

                    }

                    // scrollTrans
                    if (param.hasOwnProperty('scrollTrans')
                        && typeof param.scrollTrans === "number"
                        && /^\d+?$/.test(param.scrollTrans)) {
                        scrollTrans = param.scrollTrans;
                    }

                    // selector
                    if (param.hasOwnProperty('selector')
                        && typeof param.selector === "string") {
                        selector = param.selector;
                    }

                }

                //Selector
                $container = $("#" + selector);
                if ($container.length === 0) {
                    $container = $(selectorDefault);
                }

            }
            catch (error) {
                alert(error.message);
            }

        };


    Constructor.prototype = {
        version: '0.1',
        author: 'Diego Sevillano',
        start: start
    };

    return Constructor;

})();


