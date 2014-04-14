Auto Scroll Slider
=============

JavaScript library to generate a scroll and slide your personal pages using iframes.

Installation
-------

    <script src="//code.jquery.com/jquery-1.9.1.min.js"></script>
    <script src="../lib/autoScrollSlider.js">

Usage
-----

    var pages = [
        'iframes/mozilla.org.html',
        'iframes/css-tricks.com.html',
        'iframes/smashingmagazine.com.html',
        'iframes/incredibletypes.com.html'
    ];

    aScroll = new autoScrollSlider(pages);

    aScroll.start();
