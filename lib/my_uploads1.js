/**
 * Created by georgepipkin on 7/8/15.
 */

function videoObj(){
    var OAUTH2_CLIENT_ID = '173376356605-o0kp3lu663nqha1m61tjf9v5s5phuulc.apps.googleusercontent.com';
    var OAUTH2_SCOPES = [
        'https://www.googleapis.com/auth/youtube'
    ];
    this.contentEntry = function(x,y,n,popName,saveContext) {
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        showVideoEntryScreen(this,x,y,n, popName);

    };

    this.doCheckAuth = function(){
        var handleAuthResult = function(authResult) {
            if (authResult && !authResult.error) {
                // Authorization was successful. Hide authorization prompts and show
                // content that should be visible after authorization succeeds.
                $('.pre-auth').hide();
                $("#doAuth").hide();
                $('.post-auth').show();
                //       loadAPIClientInterfaces();
            } else {
                // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
                // client flow. The current function is called when that flow completes.
                $('#login-link').click(function() {
                    gapi.auth.authorize({
                        client_id: OAUTH2_CLIENT_ID,
                        scope: OAUTH2_SCOPES,
                        immediate: false
                    }, thisVideoOb.handleAuthResult);
                });
            }
        }

        gapi.auth.authorize({
            client_id: OAUTH2_CLIENT_ID,
            scope: OAUTH2_SCOPES,
            immediate: false
        }, handleAuthResult);
    }

// Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
// If the currently logged-in Google Account has previously authorized
// the client specified as the OAUTH2_CLIENT_ID, then the authorization
// succeeds with no user intervention. Otherwise, it fails and the
// user interface that prompts for authorization needs to display.
    function checkAuth() {
        gapi.auth.authorize({
            client_id: OAUTH2_CLIENT_ID,
            scope: OAUTH2_SCOPES,
            immediate: true
        }, handleAuthResult);
    }

// Handle the result of a gapi.auth.authorize() call.

// Call the Data API to retrieve the playlist ID that uniquely identifies the
// list of videos uploaded to the currently authenticated user's channel.
    this.loadAPIClientInterfaces=function() {
        gapi.client.load('youtube', 'v3', function() {
            var handleAPILoaded = function(){
                var requestUserUploadsPlaylistId=function() {
                    // See https://developers.google.com/youtube/v3/docs/channels/list
                    var request = gapi.client.youtube.channels.list({
                        mine: true,
                        part: 'contentDetails'
                    });
                    request.execute(function(response) {
                        var requestVideoPlaylist=function(playlistId, pageToken) {
                            $('#video-container').html('');
                            var requestOptions = {
                                playlistId: playlistId,
                                part: 'snippet',
                                maxResults: 5
                            };
                            if (pageToken) {
                                requestOptions.pageToken = pageToken;
                            }
                            var request = gapi.client.youtube.playlistItems.list(requestOptions);
                            request.execute(function(response) {
                                // Only show pagination buttons if there is a pagination token for the
                                // next or previous page of results.
                                nextPageToken = response.result.nextPageToken;
                                var nextVis = nextPageToken ? 'visible' : 'hidden';
                                $('#next-button').css('visibility', nextVis);
                                prevPageToken = response.result.prevPageToken
                                var prevVis = prevPageToken ? 'visible' : 'hidden';
                                $('#prev-button').css('visibility', prevVis);

                                var playlistItems = response.result.items;
                                if (playlistItems) {
                                    $.each(playlistItems, function(index, item) {
                                        displayResult(item.snippet);
                                    });
                                } else {
                                    $('#video-container').html('Sorry you have no uploaded videos');
                                }
                            });
                        }
                        var displayResult=function(videoSnippet) {
                            var title = videoSnippet.title;
                            var videoId = videoSnippet.resourceId.videoId;
                            $('#video-container').append('<p>' + title + ' - ' + videoId + '</p>');
                        }






                        playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
                        requestVideoPlaylist(playlistId);
                    });
                }
                requestUserUploadsPlaylistId();
            }
            handleAPILoaded();
        });
    }


// Retrieve the list of videos in the specified playlist.




// Retrieve the next page of videos in the playlist.
    function nextPage() {
        requestVideoPlaylist(playlistId, nextPageToken);
    }

// Retrieve the previous page of videos in the playlist.
    function previousPage() {
        requestVideoPlaylist(playlistId, prevPageToken);
    }

    var getVideoEntryHTML= function(layerName,x,y,n, mode){
        var strVar="";
        strVar += "    <div class=\"docComponent\" id=\"videoInfo\">";
        strVar += "        <div class=\"componentTypeLabel\" id=\"videoComponentTypeLabel\">";
        strVar += "        <\/div>";
        strVar += "        <div class=\"componentTitleLabel\" id = \"videoComponentLabel\">";
        strVar += "            <span id=\"videoComponentTitleLabelValue\"><\/span>";
        strVar += "                <input type=\"text\" size=\"40\" maxlength=\"60\" id=\"videoComponentLabelValue\" \/>";
        strVar += "        <\/div>";
        strVar += "        <div class=\"videoClipTitleLabel\" >";
        strVar += "            <span class=\"componentTitleLabel\" id=\"videoClipTitleLabelValue\"><\/span><span style=\"color: red;\" id=\"videoTitle\"><\/span>";
        strVar += "        <\/div>";
        strVar += "        <div class=\"componentTitleLabel\"  >";
        strVar += "            <table>";
        strVar += "                <tr>";
        strVar += "                    <td>";
        strVar += "                        <div>";
        strVar += "                            <div class=\"componentTitleLabel\" id=\"descriptionLabel\">";
        strVar += "                            <\/div>";
        strVar += "                            <div style=\"background-color: #cccccc; height: 175px; width: 400px;\" id=\"videoDescription\" >";
        strVar += "";
        strVar += "                            <\/div>";
        strVar += "                        <\/div>";
        strVar += "                    <\/td>";
        strVar += "                    <td>";
        strVar += "                        <div style=\"margin-left: 100px;\">";
        strVar += "                            <div class=\"componentTitleLabel\" id=\"thumbnailLabel\">";
        strVar += "                                <span id=\"thumbNailLabel\"><\/span>";
        strVar += "                            <\/div>";
        strVar += "                            <div style=\"background-color: #cccccc; height: 175px; width: 200px;\" >";
        strVar += "                                <img src=\"images\/blankThumbnail.jpg\" height=\"175px\" width=\"200px\" id = \"videoThumbnail\"\/>";
        strVar += "                            <\/div>";
        strVar += "                        <\/div>";
        strVar += "                    <\/td>";
        strVar += "                <\/tr>";
        strVar += "            <\/table>";
        strVar += "        <\/div>";
        strVar += "        <div class=\"componentTitleLabel\"  >";
        strVar += "            <span id=\"startLabel\"><\/span>";
        strVar += "            <input type=\"radio\" name=\"startOption\" value=\"startAtBegining\" id=\"radioStartBegining\"\/>";
        strVar += "            <span id = \"atBeginingLabel\"><\/span>";
        strVar += "            <input type=\"radio\" name=\"startOption\" value=\"startIntoClip\" id=\"radioStartIntoClip\"\/>";
        strVar += "            <span id=\"intoClipLabel\"><\/span>";
        strVar += "            <input type=\"text\" size=\"5\" maxlength=\"5\" id=\"textStartIntoClip\"\/>";
        strVar += "            <span id=\"secondsLabel\"><\/span>";
        strVar += "        <\/div>";
        strVar += "        <div class=\"componentTitleLabel\"  >";
        strVar += "            <span id=\"endLabel\"><\/span>";
        strVar += "            <input type=\"radio\" name=\"endOption\" value=\"endAtEnd\" id=\"radioEndAtEnd\"\/>";
        strVar += "            <span id=\"atEndLabel\"><\/span>";
        strVar += "            <input type=\"radio\" name=\"endOption\" value=\"endIntoClip\" id=\"radioEndInClip\"\/>";
        strVar += "            <span id=\"secondsToRunLabel\"><\/span>";
        strVar += "            <input type=\"text\" size=\"5\" maxlength=\"5\" id=\"textEndIntoClip\"\/>";
        strVar += "            <span id=\"endSecondsLabel\"><\/span>";
        strVar += "        <\/div>";
        strVar += "        <div class=\"componentTitleLabel\"  style=\"top:10px;\">";
        strVar += "            <input type=\"button\" id=\"buttonFindVideo\"\/>";
        strVar += "            <span id=\"onLabel\"><\/span>";
        strVar += "            <select id=\"sourceSelect\">";
        strVar += "                <option value=\"notSelected\" id=\"optionNotSelected\"><\/option>";
        strVar += "                <option value=\"youtube\" label=\"YouTube\" id=\"optionYouTube\">YouTube<\/option>";
        strVar += "                <option value=\"kaltura\" label=\"Kaltura\" id=\"optionKaltura\">Kaltura<\/option>";
        strVar += "                <option value=\"khan\" label=\"Khan Academy\" id=\"optionKahn\">Khan Academy<\/option>";
        strVar += "            <\/select>";
        strVar += "            <input type=\"button\"  id=\"buttonUploadVideo\"\/>";
        strVar += "            <input type=\"button\"  id=\"buttonEditThisVideoComponent\"\/>";
        strVar += "            <input type=\"button\" id=\"buttonSave\" \/>";
        strVar += "            <input type=\"button\"  id=\"buttonCancel\"\/>";
        strVar += "        <\/div>";
        strVar += "    <\/div>";
        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\" value=\""+x+"\" \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" value=\""+y+"\"\/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"video\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" value=\""+n+"\"\/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentEditMode\" name=\"componentEditMode\" hidden=\"true\"  value=\""+mode+"\"/>";
        strVar += "";
        return strVar;
    };


    var showVideoEntryScreen = function(t,x,y,n, popName) {
        $('#'+popName).html(getVideoEntryHTML(t.layerName, x, y, n, 'entry'));
        $("#videoComponentTypeLabel").html($.t("video.componentTitle"));
        $("#videoComponentLabelValue").prop('disabled', false);
        $("#videoComponentTitleLabelValue").html($.t("video.componentLabel"));
        $("#videoClipTitleLabelValue").html($.t("video.clipTitle"));
        $("#descriptionLabel").html($.t("video.description"));
        $("#thumbNailLabel").html($.t("video.thumbNailLabel"));
        $("#startLabel").html($.t("video.startLabel"));
        $("#atBeginingLabel").html($.t("video.atBegining"));
        $("#intoClipLabel").html($.t("video.intoClip"));
        $("#secondsLabel").html($.t("video.seconds"));
        $("#endLabel").html($.t("video.endLabel"));
        $("#atEndLabel").html($.t("video.atEnd"));
        $("#secondsToRunLabel").html($.t("video.secondsToRun"));
        $("#endSecondsLabel").html($.t("video.seconds"));


        $("#onLabel").html($.t("video.onLabel"));
        $("#optionNotSelected").html($.t("video.selectVideoSource"));
        $("#optionYouTube").html($.t("video.youTubeSource"));
        $("#optionKaltura").html($.t("video.kalturaSource"));
        $("#optionKhan").html($.t("video.khanSource"));

        $("#radioStartBegining").prop('disabled', true);
        $("#radioStartIntoClip").prop('disabled', true);
        $("#textStartIntoClip").prop('disabled', true);
        $("#radioEndAtEnd").prop('disabled', true);
        $("#textEndIntoClip").prop('disabled', true);
        $("#buttonFindVideo").prop('disabled', true);
        $("#buttonFindVideo").prop('value', $.t("video.findVideo"));
        $("#buttonUploadVideo").prop('disabled', true);
        $("#buttonUploadVideo").prop('value', $.t("video.uploadVideo"));
        $("#buttonEditThisVideoComponent").prop('disabled', true);
        $("#buttonEditThisVideoComponent").prop('value', $.t("video.editThisVideo"));
        $("#buttonSave").prop('disabled', true);
        $("#buttonSave").prop('value', $.t("video.saveVideo"));
        $("#buttonCancel").prop('disabled', false);
        $("#buttonCancel").prop('value', $.t("video.cancel"));
        $("#buttonCancel").on("click", function () {
            $("#" + popName).html("");
            $("#" + popName).hide();
            eatNextClick = true;
            var thisContextId = $("#componentContext").val();
            reloadAllComponents(thisContextId, true);
        });
        $("#"+popName).show();
    }





}
