$(document).ready(function () {
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&maxResults=10&playlistId=PLSi28iDfECJPJYFA4wjlF5KUucFvc0qbQ&key=AIzaSyCuv_16onZRx3qHDStC-FUp__A6si-fStw',
        dataType: 'jsonp',
        success: function (youtubeContent) {
            //log API objects
            console.log(youtubeContent);
           // for or each loop for array
           for (var i = 0; i < youtubeContent.items.length; i++) {
                    var callContent;
                   // debugger;
                    if(i==0){
                        callContent = $('.video_list'); 
                    }else{
                        callContent= $('.video_list').first().clone();
                    }
                    //title
                    callContent.find('.title').html(youtubeContent.items[i].snippet.title);
                    //format JSON date
                    var date_format = youtubeContent.items[i].snippet.publishedAt;
                    var date_formatted = moment(date_format).format('LL');
                    callContent.find('.date').html(date_formatted);
                    callContent.find('.thumbnail').data("detailDate", date_formatted);
                    callContent.find('.detail-title-list').data("detailDate", date_formatted);
                    //description
                    var description = youtubeContent.items[i].snippet.description;
                    //truncated description
                    var maxLength = 300;
                    var truncated_description;
                    if (description.length > maxLength) {
                        truncated_description = description.substring(0, maxLength) + "...";
                    }
                    else if (description.length <= 0) {
                        truncated_description = "<strong> Sorry, there is no description for this video.</strong>"
                    }
                    callContent.find('.description_truncate').html(truncated_description);
                    callContent.find('.thumbnail').data('description', youtubeContent.items[i].snippet.description);
                    callContent.find('.detail-title-list').data('description', youtubeContent.items[i].snippet.description);
                    //thumbnail
                    callContent.find('.thumbnail').attr('src', youtubeContent.items[i].snippet.thumbnails.high.url);
                    callContent.find('.thumbnail').attr('title', youtubeContent.items[i].snippet.title);
                    callContent.find('.detail-title-list').data('title', youtubeContent.items[i].snippet.title);
                    callContent.find('.thumbnail').attr('alt', youtubeContent.items[i].snippet.title);
                    //video embed link
                    callContent.find('.thumbnail').data('videosrc', youtubeContent.items[i].snippet.resourceId.videoId);
                    callContent.find('.detail-title-list').data('videosrc', youtubeContent.items[i].snippet.resourceId.videoId);
                    //for thumbanil click
                    callContent.find('.thumbnail').click(function(e){
                        var iframesrc = $(this).data("videosrc");
                        var title = $(this).attr("title");
                        var date = $(this).data("detailDate");
                        var description = $(this).data("description");

                        $(".full-description").html(description);
                        $(".detail-title").html(title);
                        $(".detailed-date").html(date);
                        $("#detail-view").wrap("<div class='row'></div>");
                        $(".video-link").attr("src", "http://www.youtube.com/embed/"+iframesrc);
                        $(".detail-view").show();
                        $("#thumbnailslist").hide();
                        window.location.hash=$(this).attr("title");
                        e.preventDefault();
                    });
                    //for title click
                    callContent.find('.detail-title-list').click(function(e){
                        var iframesrc = $(this).data("videosrc");
                        var title = $(this).data("title");
                        var date = $(this).data("detailDate");
                        var description = $(this).data("description");
                        
                        $(".full-description").html(description);
                        $(".detailed-date").html(date);
                        $(".detail-title").html(title);
                        $("#detail-view").wrap("<div class='row'></div>");
                        $(".video-link").attr("src", "http://www.youtube.com/embed/"+iframesrc);
                        $(".detail-view").show();
                        $("#thumbnailslist").hide();
                        window.location.hash=$(this).text();
                        e.preventDefault();
                    });                   
                    //append content for each item in loop
                    $('div.container .row').append(callContent);            
              }
        }
    });
    //end ajax1
    $("#back").click(function(e){
        $(".detail-view").hide();
        $("#thumbnailslist").show();
        $("#detail-view").unwrap("<div class='row'></div>");
        window.location.hash="";
        e.preventDefault();
        
        
    });
});
