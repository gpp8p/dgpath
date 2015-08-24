/**
 * Created by georgepipkin on 6/23/15.
 */

function youtubeVideoSource(itemSelectorObject, popname, videoComponent){

    var DEFAULT_SMALL_WIDTH = 120;
    var DEFAULT_MEDIUM_WIDTH = 320;
    var DEFAULT_HIGH_WIDTH = 480;
    var DEFAULT_SMALL_HEIGHT = 90;
    var DEFAULT_MEDIUM_HEIGHT = 180;
    var DEFAULT_HIGH_HEIGHT = 360;


    this.itemSelectorObject = itemSelectorObject;
    this.thisSelectorObject = null;
    this.popname=popname;
    this.displayFunction = null;
    this.playListId = null;
    this.nextPageToken = null;
    this.prevPageToken = null;
    this.authorized= false;
    this.nextVis = null;
    this.prevVis = null;
    var videoComponent = videoComponent;

    this.sourceLogin = function(){
        console.log('sourceLogin');
        doCheckAuth();
    }

    this.fetchItemList = function(){
        requestUserUploadsPlaylistId();
    }
    var thisYtObject = this;

    var OAUTH2_CLIENT_ID = '173376356605-o0kp3lu663nqha1m61tjf9v5s5phuulc.apps.googleusercontent.com';
    var OAUTH2_SCOPES = [
        'https://www.googleapis.com/auth/youtube'
    ];

    this.currentItemList = [];
    this.createYouTubeItem = function(videoSnippet){
        var thisNewVideoItem = new Object();
        thisNewVideoItem.title = videoSnippet.title;
        thisNewVideoItem.id = videoSnippet.resourceId.videoId;
        thisNewVideoItem.smallThumbnailUrl = videoSnippet.thumbnails.default.url;
        thisNewVideoItem.smallThumbnailWidth = videoSnippet.thumbnails.default.width;
        thisNewVideoItem.smallThumbnailHeight = videoSnippet.thumbnails.default.height;
        thisNewVideoItem.mediumThumbnailUrl = videoSnippet.thumbnails.medium.url;
        thisNewVideoItem.mediumThumbnailWidth = videoSnippet.thumbnails.medium.width;
        thisNewVideoItem.mediumThumbnailHeight = videoSnippet.thumbnails.medium.height;
        thisNewVideoItem.highThumbnailUrl = videoSnippet.thumbnails.high.url;
        thisNewVideoItem.highThumbnailWidth = videoSnippet.thumbnails.high.width;
        thisNewVideoItem.highThumbnailHeight = videoSnippet.thumbnails.high.height;
        thisNewVideoItem.description = videoSnippet.description;
        thisNewVideoItem.datePublished = videoSnippet.publishedAt;
        return thisNewVideoItem;
    }

    this.createSearchResultItem = function(thisItem){
        var thisNewVideoItem = new Object();
        thisNewVideoItem.id = thisItem.id.videoId;
        thisNewVideoItem.smallThumbnailUrl = thisItem.snippet.thumbnails.default.url;
        thisNewVideoItem.smallThumbnailHeight = DEFAULT_SMALL_HEIGHT;
        thisNewVideoItem.mediumThumbnailWidth = DEFAULT_SMALL_WIDTH;
        thisNewVideoItem.mediumThumbnailUrl = thisItem.snippet.thumbnails.medium.url;
        thisNewVideoItem.mediumThumbnailHeight = DEFAULT_MEDIUM_HEIGHT;
        thisNewVideoItem.mediumThumbnailWidth = DEFAULT_MEDIUM_WIDTH;
        thisNewVideoItem.highThumbnailUrl = thisItem.snippet.thumbnails.high.url;
        thisNewVideoItem.highThumbnailWidth = DEFAULT_HIGH_WIDTH;
        thisNewVideoItem.highThumbnailHeight = DEFAULT_HIGH_HEIGHT;
        thisNewVideoItem.description = thisItem.snippet.description;
        thisNewVideoItem.title = thisItem.snippet.title;
        thisNewVideoItem.datePublished = thisItem.snippet.publishedAt;
        return thisNewVideoItem;

    }

    this.fetchItems = function(moveDirection, st, ss) {
        var move = moveDirection;
        var searchType = st;
        var searchSpec = ss;


// Call the Data API to retrieve the playlist ID that uniquely identifies the
// list of videos uploaded to the currently authenticated user's channel.

        gapi.client.load('youtube', 'v3', function() {


            var requestUserUploadsPlaylistId = function () {
                var request = gapi.client.youtube.channels.list({
                    mine: true,
                    part: 'contentDetails'
                });
                request.execute(function (response) {
                    playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
                    requestVideoPlaylist(playlistId);
                });
            }

            var requestSearchResults = function(){
                var thisMoveDirection = moveDirection;
                var availableWindowHeight = window.innerHeight-150;
                var numItemLines = Math.round(availableWindowHeight/110)-1;
                requestOptions = {
                    q: searchSpec,
                    part: 'snippet'
                }
                if(moveDirection=='fwd'){
                    requestOptions.pageToken = thisYtObject.nextPageToken;
                }
                if(moveDirection=='back'){
                    requestOptions.pageToken = thisYtObject.prevPageToken;
                }
                request = gapi.client.youtube.search.list(requestOptions);
                request.execute(function (response) {
                    // Only show pagination buttons if there is a pagination token for the
                    // next or previous page of results.
                    thisYtObject.nextPageToken = response.result.nextPageToken;
                    thisYtObject.prevPageToken = response.result.prevPageToken;
                    thisYtObject.nextVis = response.result.nextPageToken ? 'visible' : 'hidden';
                    thisYtObject.prevVis = response.result.prevPageToken ? 'visible' : 'hidden';
                    thisYtObject.thisSelectorObject  = new thisYtObject.itemSelectorObject(videoComponent);
                    thisYtObject.thisSelectorObject.displayWindow();
                    var playlistItems = response.result.items;
                    if (playlistItems) {
                        $.each(playlistItems, function (index, item) {
                            if(item.id.kind=='youtube#video') {
                                thisYtObject.currentItemList[index] = thisYtObject.createSearchResultItem(item);
                                thisYtObject.thisSelectorObject.displayLine(thisYtObject.currentItemList[index], index);
                            }
                        });
                        thisYtObject.thisSelectorObject.showIt();
                    } else {
//                        $("#" + this.popname).html('<h2>Sorry you have no uploaded videos</h2>');
                    }
                });
            }

// Retrieve the list of videos in the specified playlist.
            var requestVideoPlaylist = function (playlistId, pageToken) {
                var thisMoveDirection = moveDirection;
                var availableWindowHeight = window.innerHeight-150;
                var numItemLines = Math.round(availableWindowHeight/110)-1;
                var thisSearchType = searchType;
                var requestOptions = {
                    playlistId: playlistId,
                    part: 'snippet',
                    maxResults: numItemLines
                };
                if(moveDirection=='fwd'){
                    requestOptions.pageToken = thisYtObject.nextPageToken;
                }
                if(moveDirection=='back'){
                    requestOptions.pageToken = thisYtObject.prevPageToken;
                }
//                if (pageToken) {
//                    requestOptions.pageToken = pageToken;
//                }
                var request = gapi.client.youtube.playlistItems.list(requestOptions);
                request.execute(function (response) {
                    // Only show pagination buttons if there is a pagination token for the
                    // next or previous page of results.
                    thisYtObject.nextPageToken = response.result.nextPageToken;
                    thisYtObject.prevPageToken = response.result.prevPageToken;
                    thisYtObject.nextVis = response.result.nextPageToken ? 'visible' : 'hidden';
                    thisYtObject.prevVis = response.result.prevPageToken ? 'visible' : 'hidden';
                    thisYtObject.thisSelectorObject  = new thisYtObject.itemSelectorObject(videoComponent);
                    thisYtObject.thisSelectorObject.displayWindow();
                    var playlistItems = response.result.items;
                    if (playlistItems) {
                        $.each(playlistItems, function (index, item) {
                            thisYtObject.currentItemList[index] = thisYtObject.createYouTubeItem(item.snippet);
                            thisYtObject.thisSelectorObject.displayLine(thisYtObject.currentItemList[index],index);

                        });
                        thisYtObject.thisSelectorObject.showIt();
                    } else {
//                        $("#" + this.popname).html('<h2>Sorry you have no uploaded videos</h2>');
                    }
                });
            }
            if(searchType=='myvideos') {
                requestUserUploadsPlaylistId();
            }else{
                requestSearchResults();
            }
        });
    }

// Create a listing for a video.
    var displayResult = function(videoSnippet) {
        var title = videoSnippet.title;
        var videoId = videoSnippet.resourceId.videoId;
        $("#availableVideoList").append("<option value=\""+ videoId+"\" >" + title + '</option>');
    }
    

}
