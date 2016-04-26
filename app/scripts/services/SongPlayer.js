(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        /**
        * @desc Current album object
        * @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();
        /**
        * @desc Sets current Buzz object audio file to first song in album
        * @type {Object}
        */
        var currentBuzzObject = new buzz.sound(currentAlbum.songs[0].audioUrl, {
                formats: ['mp3'],
                preload: true
            });
        
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });
            
            SongPlayer.currentSong = song;
        };
        
        /**
        * @function playSong
        * @desc Plays currentBuzzObject and sets playing property of song object to true
        * @param {Object} song
        */
        var playSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.play();
                song.playing = true;
            }
        };
        
        /**
        * @function stopSong
        * @desc Stops currentBuzzObject and sets playing property of song object to null
        * @param {Object} song
        */
        var stopSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                song.playing = null;
            }
        };
        
        /**
        * @function getSongIndex
        * @desc Returns index of selected song in currently playing album
        * @param {Object} song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        /**
        * @desc Active song object from list of songs
        * @type {Object}
        */
        SongPlayer.currentSong = currentAlbum.songs[0];
        
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = 0;
        
        /**
        * @desc Set current playback volume to 60%
        * @type {Number}
        */
        SongPlayer.volume = 60;
        
        /**
        * @function play
        * @desc Play current or new song
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            } else {
                playSong(song);
            }
        };
        
        /**
        * @function pause
        * @desc Pause current song
        * @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function previous
        * @desc Move to previous song and start playing unless already at first song. If already at beginning then stop playing and set current song to first song
        */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            var song = SongPlayer.currentSong;
            
            if (currentSongIndex < 0) {
                stopSong(song);
            } else {
                song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        * @function next
        * @desc Move to next song and start playing unless at end of album, then it cycles back to the first song
        */
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            var song = SongPlayer.currentSong;
            
            if (currentSongIndex >= currentAlbum.songs.length) {
                stopSong(song);
            } else {
                song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /** 
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        
        /**
        * @function setVolume
        * desc Set volume of currently playing song
        * @param {Number} level
        */
        SongPlayer.setVolume = function(level) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(level);
            }
        };
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();