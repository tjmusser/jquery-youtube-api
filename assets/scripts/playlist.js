$(document).ready(function () {

    var hashSet = new Playlist();

    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            var hashLocation = location.hash;
            var hashSplit = hashLocation.split("#/");
            var hashName = hashSplit[1];

            if (hashName === '') {
                $(".detail-view").hide();
                $("#thumbnailslist").show();
                hashSet.setHash('');
            }
        });
    }

    function Playlist(dataObj) {
        this.callContent = $('.video_item');
        this.truncateText = '...';
        this.maxLength = 300;
        this.dataObj = dataObj;
        this.nodesc = "<strong> Sorry, there is no description for this video.</strong>";
        this.desc = null;
        this.itemData = null;
        this.page = window.location.href;
    }

    Playlist.prototype.setHash = function (location) {
        var location = decodeURIComponent(location);
        window.location.hash = '/' + location;
    }

    Playlist.prototype.checkDesc = function (desc) {
        if (desc.length === 0) {
            this.desc = this.nodesc;
        } else {
            this.desc = desc;
        }
        return this.desc;
    }

    Playlist.prototype.trucateDesc = function (desc) {
        if (desc.length > this.maxLength) {
            this.desc = desc.substring(0, this.maxLength) + this.truncateText;
        } else {
            this.desc = desc;
        }
        return this.desc;
    }

    Playlist.prototype.setContent = function (description, title, date, iframesrc, hash) {
        if (hash) {
            this.setHash(title);
        }

        $(".detail-view-item .full-description").html(this.checkDesc(description));
        $(".detail-view-item .detail-title").html(title);
        $(".detail-view-item .detailed-date").html(date);
        $(".detail-view-item .video-link").attr("src", "http://www.youtube.com/embed/" + iframesrc);
        $(".detail-view").show();
        $("#thumbnailslist").hide();
    }

    Playlist.prototype.searchObj = function (obj, query) {
        var q = decodeURIComponent(query);

        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                this.searchObj(obj[key], q);
            }
            
            if (obj[key] == q) {
                this.itemData = obj;
                return false;
            }
        }
        return this.itemData;
    }

    Playlist.prototype.getHash = function () {
        this.page = this.page.replace(/%20/g, ' ');

        if (this.page.indexOf('#') >= 0) {
            pInfo = this.page.split('/#/');

            if (pInfo[1].length > 0) {
                this.searchObj(this.dataObj, pInfo[1]);
                var date = moment(this.itemData.publishedAt).format('LL'),
                    desc = this.itemData.description,
                    title = this.itemData.title,
                    iframesrc = this.itemData.resourceId.videoId;

                this.setContent(desc, title, date, iframesrc);
            }
        } else {
            this.setHash('');
        }
    }

    Playlist.prototype.bindEvents = function (thumbnail, detailTitleList, description, title, date, iframesrc, hash) {
        var self = this;
        thumbnail.click(function (e) {
            e.preventDefault();
            self.setContent(description, title, date, iframesrc, hash);
        });

        detailTitleList.click(function (e) {
            e.preventDefault();
            self.setContent(description, title, date, iframesrc, hash);
        });
    }

    Playlist.prototype.buildPlaylist = function () {
        var self = this;

        $.each(this.dataObj.items, function (i, v) {
            var snippet = this.snippet,
                title = self.title,
                thumbnail = i !== 0 ? self.callContent = $('.video_item').first().clone() : self.callContent.find('.thumbnail'),
                detailTitleList = self.callContent.find('.detail-title-list'),
                date = moment(snippet.publishedAt).format('LL'),
                title = snippet.title,
                description = self.checkDesc(snippet.description),
                iframesrc = snippet.resourceId.videoId;

            // Set item content
            self.callContent.find('.title').html(title);
            self.callContent.find('.date').html(date);
            self.callContent.find('.description_truncate').html(self.trucateDesc(description));

            // Update thumbnail
            thumbnail = self.callContent.find('.thumbnail');

            //thumbnail
            thumbnail
                .attr('src', snippet.thumbnails.high.url)
                .attr('title', title)
                .attr('alt', title);

            self.bindEvents(thumbnail, detailTitleList, description, title, date, iframesrc, true);

            // Append content for each item in loop
            $('.playlist > .row').append(self.callContent);
        });
    }

    // Request data
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&maxResults=10&playlistId=PLSi28iDfECJPJYFA4wjlF5KUucFvc0qbQ&key=AIzaSyCuv_16onZRx3qHDStC-FUp__A6si-fStw',
        dataType: 'jsonp',
        success: function (response) {
            // Set page content based upon url after response
            var playlist = new Playlist(response);
            playlist.getHash();
            playlist.buildPlaylist();
        }
    });

    //end ajax1
    $(".back-button").click(function (e) {
        e.preventDefault();
        $(".detail-view").hide();
        $("#thumbnailslist").show();
        hashSet.setHash('');
    });
});
