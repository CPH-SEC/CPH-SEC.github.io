//     The control using Google APIs Client Library for JavaScript
//     control (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     License: MIT

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {

    // This code loads the IFrame Player API code asynchronously
    var script_state = 0; // -1 - error, +1 - loaded
    var script_state_event = new controls.Event();
    var tag = document.createElement('script');
    tag.addEventListener('error', function() { script_state = -1; script_state_event.raise(); });
    tag.addEventListener('load', function() {
        script_state = 1;
        // YT.Player yet not loaded
        var attempts = 400;
        var timer = setInterval(function()
        {
            attempts--;
            if (YT.loaded)
                attempts = 0;
            if (attempts <= 0)
            {
                clearInterval(timer);
                script_state = (YT.loaded) ? 1 : -1;
                script_state_event.raise();
            }
        },50);
    });
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


    // >> control, external use marked, controls

    // CYouTubeIFramePlayer wrapper control
    // 
    // Parameters:
    //  ID or videoID {string} - specifies the YouTube Video ID of the video to be played
    //  position - seconds at begin
    //  quality - {'small','medium','large','hd720','hd1080','highres','default'}
    //  width,height - iframe size
    // Passing parameters via inner attributes.$text:
    //  ID,position,quality,width,height,commands
    //  where position,quality - optional
    //
    var quality_enum = ['tiny','small','medium','large','hd720','hd1080','highres','default'];
    function CYouTubeIFramePlayer(parameters, attributes)
    {
        controls.controlInitialize(this, 'YouTube.Player', parameters, attributes, CYouTubeIFramePlayer.outer_template);

        var videoID = parameters.ID || parameters.videoID,
            position = parameters.start || parameters.position || 0,
            quality = parameters.quality || 'default',
            width = parameters.width || 640,
            height = parameters.height || 390,
            command = parameters.command;

        var text_params = attributes.$text;
        if (text_params)
        {
            text_params = text_params.trim().split(',');

            // first argument not videoID
            if (text_params[0].length < 8)
                text_params.unshift(videoID);
            else
                videoID = text_params[0];

            // second argument not number
            if (isNaN(text_params[1]))
                text_params.splice(1, 0, position);
            else
                position = parseInt(text_params[1]) || position;

            // third argument is number
            var third = text_params[2];
            if (!isNaN(third))
                text_params.splice(2, 0, quality);
            else
                quality = third.toLowerCase() || quality;

            var fourth = text_params[3];
            if (isNaN(fourth))
                text_params.splice(3, 0, width);
            else
                width = parseInt(fourth) || width;

            var fifth = text_params[4];
            if (isNaN(fifth))
                text_params.splice(4, 0, height);
            else
                height = parseInt(fifth) || height;

            command = text_params.slice(5).join(',') || command;
        }



        Object.defineProperty(this, "videoID",
        {
            enumerable: true, 
            get: function() { return videoID; },
            set: function(value)
            {
                videoID = value;
                this.parameters.videoID = value;

                // on the ID changed
                this.getPlayer(function(player)
                {
                    player.cueVideoById(videoID, position, quality);
                });
            }
        });

        Object.defineProperty(this, "width",
        {
            enumerable: true, 
            get: function() { return width; },
            set: function(value)
            {

            }
        });

        Object.defineProperty(this, "height",
        {
            enumerable: true, 
            get: function() { return height; },
            set: function(value)
            {

            }
        });

        var player;
        this.forcePlayer = function()
        {
            if (!player && typeof YT !== 'undefined' && YT.Player)
            {
                var params = controls.extend({}, this.parameters);
                controls.extend(params,
                {
                    videoId: videoID,
                    width: width    || '640',
                    height: height   || '390',
                    origin: params.origin || window.location.origin,
                    events:
                    {
                      'onReady': onPlayerReady.bind(this),
                      'onStateChange': onPlayerStateChange.bind(this)
                    }
                });

                if (command)
                {
                    if (command.indexOf('play') >= 0)
                        params.autoplay  = 1;
                    if (command.indexOf('autohide') >= 0)
                        params.autohide  = 1;
                }

                player = new YT.Player(this.id, params);
                // after player YT.Player created, methods (playVideo etc) undefined some time interval
            }
            return player;
        };
        this.getPlayer = function(callback)
        {
            // if DOM refreshed, destroy player
            var element = this._element;
            if (!element) {
                player = undefined;
                return;
            }
            if (element.tagName.toLowerCase() === 'div')
                player = undefined;


            if (typeof YT === 'undefined' || !YT.loaded)
            {
                script_state_event.addListener(this, function() 
                {
                    if (script_state > 0 && this.forcePlayer() && callback)
                        callback.call(this, player);
                });
            }
            else if (script_state > 0 && this.forcePlayer() && callback)
                callback.call(this, player);
        };


        // player is ready callback
        function onPlayerReady(event)
        {
    //        try {
    //            event.target.playVideo();
    //        } catch (e)
    //        {
    //            setTimeout(function() { event.target.playVideo(); }, 999);
    //        }
            if (quality)
                player.setPlaybackQuality(quality);
            if (position)
            {
                // seekTo starts playing
                player.seekTo(position);
                if (!this.parameters.autoplay && (!command || command.indexOf('play') < 0))
                    player.pauseVideo();
            }
        }

        // player's state changes callback
        function onPlayerStateChange(event)
        {
    //      if (event.data == YT.PlayerState.PLAYING && !done) {
    //        setTimeout(stopVideo, 6000);
    //        done = true;
    //      }
        }




        this.play = function() {
            this.getPlayer(function(player) {
                if (typeof player.playVideo === 'function')
                    player.playVideo();
                var timer = setInterval(function() {
                    if (typeof player.playVideo === 'function')
                    {
                        clearInterval(timer);
                        player.playVideo();
                    }
                }, 555);
                setTimeout(function() { clearInterval(timer); }, 3000);
            });
        };

        this.pause = function() {
            this.getPlayer(function(player) {
                player.pauseVideo();
            });
        };

        this.stop = function() {
            this.getPlayer(function(player) {
                player.stopVideo();
            });
        };

        this.seekTo = function(seconds, allowSeekAhead) {
            this.getPlayer(function(player) {
                player.seekTo(seconds, allowSeekAhead);
            });
        };

        this.listen('element', function()
        {
            // FIX: autoplay parameters not work
            if (command && command.indexOf('play') >= 0)
                this.play();
            else 
                if (videoID)
                this.getPlayer();
        });
    };
    CYouTubeIFramePlayer.prototype = controls.control_prototype;
    CYouTubeIFramePlayer.outer_template = function(it) { return '<div' + it.printAttributes() + '></div>\n'; };
    controls.typeRegister('YouTube.Player', CYouTubeIFramePlayer);


    // << control
}


}).call(this);
