$(document).ready(function () {

    // Global defaults
    var maxLength = 300,
        callContent = $('.video_item');

    if (window.history && window.history.pushState) {

        $(window).on('popstate', function () {
            var hashLocation = location.hash;
            var hashSplit = hashLocation.split("#/");
            var hashName = hashSplit[1];

            if (hashName === '') {
                $(".detail-view").hide();
                $("#thumbnailslist").show();
                setHash('');
            }
        });
        
    }
    
    // Search through ajax response for specific video
    function SearchObj(obj, query) {
        this.itemData;

        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                SearchObj(obj[key], query);
            }

            if (obj[key] == query) {
                itemData = obj;
                return false;
            }
        }
        return this.itemData;
    }

    // Get URL hash and set content based on hash
    function getHash(ajaxResp) {
        var page = window.location.href,
            page = page.replace(/%20/g, ' ');

        if (page.indexOf('#') >= 0) {
            pInfo = page.split('/#/');

            if (pInfo[1].length > 0) {
                var itemData = SearchObj(ajaxResp, pInfo[1]),
                    date = moment(itemData.publishedAt).format('LL'),
                    desc = itemData.description,
                    title = itemData.title,
                    iframesrc = itemData.resourceId.videoId;

                setContent(desc, title, date, iframesrc);
            }
        } else {
            setHash('');
        }
    }

    // Window hash
    function setHash(location) {
        window.location.hash = '/' + location;
    }

    // Verify existence of description 
    function checkDesc(desc) {
        if (desc.length == 0) {
            desc = "<strong> Sorry, there is no description for this video.</strong>";
        }
        return desc;
    }

    // Truncate description
    function trucateDesc(desc) {
        if (desc.length > maxLength) {
            desc = desc.substring(0, maxLength) + "...";
        }
        return desc;
    }

    // Set individual item content and set hash
    function setContent(description, title, date, iframesrc, hash) {
        if (hash) {
            setHash(title);
        }
        $(".detail-view-item .full-description").html(checkDesc(description));
        $(".detail-view-item .detail-title").html(title);
        $(".detail-view-item .detailed-date").html(date);
        $(".detail-view-item .video-link").attr("src", "http://www.youtube.com/embed/" + iframesrc);
        $(".detail-view").show();
        $("#thumbnailslist").hide();
    }

    // Request data
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&maxResults=10&playlistId=PLSi28iDfECJPJYFA4wjlF5KUucFvc0qbQ&key=AIzaSyCuv_16onZRx3qHDStC-FUp__A6si-fStw',
        dataType: 'jsonp',
        success: function (youtubeContent) {

            // Set page content based upon url after response
            getHash(youtubeContent);

            // Build playlist items
            $.each(youtubeContent.items, function (i, v) {
                var self = this.snippet,
                    title = self.title,
                    thumbnail = i !== 0 ? callContent = $('.video_item').first().clone() : callContent.find('.thumbnail'),
                    detailTitleList = callContent.find('.detail-title-list'),
                    date = moment(self.publishedAt).format('LL'),
                    title = self.title,
                    description = checkDesc(self.description),
                    iframesrc = self.resourceId.videoId;


                // Set item content
                callContent.find('.title').html(title);
                callContent.find('.date').html(date);
                callContent.find('.description_truncate').html(trucateDesc(description));

                // Update thumbnail
                thumbnail = callContent.find('.thumbnail');

                //thumbnail
                thumbnail
                    .attr('src', self.thumbnails.high.url)
                    .attr('title', title)
                    .attr('alt', title);

                // Click events
                thumbnail.click(function (e) {
                    e.preventDefault();
                    setContent(description, title, date, iframesrc, true);
                });

                detailTitleList.click(function (e) {
                    e.preventDefault();
                    setContent(description, title, date, iframesrc, true);
                });

                // Append content for each item in loop
                $('.playlist > .row').append(callContent);
            });
        }
    });

    //end ajax1
    $(".back-button").click(function (e) {
        e.preventDefault();
        $(".detail-view").hide();
        $("#thumbnailslist").show();
        setHash('');
    });
});
