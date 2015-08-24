/**
 * Created by georgepipkin on 6/14/15.
 */
/**
 * Created by georgepipkin on 6/18/14.
 */

function video(loadedComponent){


    var thisComponentId;

    if(typeof loadedComponent=="undefined"){
        this.x = 0;
        this.y = 0;
        this.icon = "video";
        this.active = false;
        this.layerName = "";
    }else{
        this.x = loadedComponent.x;
        this.y = loadedComponent.y;
        this.title = loadedComponent.title;
        this.icon = "video";
        thisContent = loadedComponent.content;
        this.content = thisContent;
        this.type = loadedComponent.type;
        this.context = loadedComponent.context;
        this.id = loadedComponent.id;
        thisComponentId = this.id;
        this.elementId = loadedComponent.elementId;
        //       res = thisContent.replace("\n","\\n");
        //       res = res.replace("{","\\{");
        //       res = res.replace("}","\\}");
        //       parsedContent = jQuery.parseJSON(res);
    }
    this.contentEntry = function(x,y,n,popName,saveContext) {
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        videoEntryScreen(this,x,y,n, popName, "entry");

    };
    this.contentUpdate = function(l){ $("componentId").val(l); updateVideo(this,l)};
    this.contentEdit = function(thisComponent,layer, connections, popName, saveContext) {
        $("#saveContext").val(saveContext);
        $("#reLoadContext").val($("#subContext").val());
        videoEditScreen(thisComponent, popName, connections);

    };
    this.getPathOptions = function(componentId, contextId, connectionId){
        return [];
    };
    this.createComponent = function(layerName){

    };
    this.getUserView = function(componentId){

    };
    this.libraryEdit = function(thisComponent){
        setupEdit(thisComponent, "libPopup");
    };

    this.displayInit = function(c){
        var thisComponent = c;
        console.log('video display init called');
        return function() {
            console.log("entering video play"+thisComponent.title);
            if(typeof window.youtube_api_init == 'undefined'){
                console.log("waiting for api"+thisComponent.title);
                var itr = 10;
                while(typeof window.youtube_api_init != 'undefined'){
                    window.setTimeout(function(){
                        itr++;
                        console.log("waiting for video api:"+itr);
                    }, 250)
                    if(itr>10) break;
                }

            }
            if (isFirefox) {
                console.log(thisComponent.content);
                thisContent = thisComponent.content;
                res = thisContent.replace("\n", "\\n");
                parsedContent = jQuery.parseJSON(res);
                console.log(parsedContent.id);
                var thisDivId = "ytPlayerDiv" + thisComponent.elementId;
                var pWidth;
                var pHeight;
                if (parsedContent.playerSize == 'large') {
                    pWidth = parsedContent.highThumbnailWidth + 'px';
                    pHeight = parsedContent.highThumbnailHeight + 'px';
                } else if (parsedContent.playerSize == 'medium') {
                    pWidth = parsedContent.mediumThumbnailWidth + 'px';
                    pHeight = parsedContent.mediumThumbnailHeight + 'px';
                } else {
                    pWidth = parsedContent.smallThumbnailWidth + 'px';
                    pHeight = parsedContent.smallThumbnailHeight + 'px';
                }
                ytPlayer(pHeight, pWidth, thisContent.id, thisDivId, parsedContent);
            }else if(isChrome | isSafari){
                thisContent = thisComponent.content;
                res = thisContent.replace("\n","\\n");
                parsedContent = jQuery.parseJSON(res);
                if(parsedContent.autoStart) {
                    var thisDivId = "ytPlayerDiv" + thisComponent.elementId;
                    var pWidth;
                    var pHeight;
                    if (parsedContent.playerSize == 'large') {
                        pWidth = parsedContent.highThumbnailWidth + 'px';
                        pHeight = parsedContent.highThumbnailHeight + 'px';
                    } else if (parsedContent.playerSize == 'medium') {
                        pWidth = parsedContent.mediumThumbnailWidth + 'px';
                        pHeight = parsedContent.mediumThumbnailHeight + 'px';
                    } else {
                        pWidth = parsedContent.smallThumbnailWidth + 'px';
                        pHeight = parsedContent.smallThumbnailHeight + 'px';
                    }
                    ytPlayer(pHeight, pWidth, thisContent.id, thisDivId, parsedContent);
                }else{
                    var thisDivId = "ytPlayerDiv"+thisComponent.elementId;
                    var thisParentDiv = "ytPlayerDiv_parent"+thisComponent.elementId;
                    var pContent = parsedContent;
                    $("#"+thisDivId).on('click', function(){
                        var ytDiv =  "<table border=\"0\"><tr><td width=\"10%\"></td><td id=\""+thisParentDiv+"\" width=\"90%\"><div id=\""+thisDivId+"\" ></div></td> </tr></table>";
                        $("#"+thisParentDiv).html(ytDiv);
                        var pWidth;
                        var pHeight;
                        if (pContent.playerSize == 'large') {
                            pWidth = pContent.highThumbnailWidth + 'px';
                            pHeight = pContent.highThumbnailHeight + 'px';
                        } else if (pContent.playerSize == 'medium') {
                            pWidth = pContent.mediumThumbnailWidth + 'px';
                            pHeight = pContent.mediumThumbnailHeight + 'px';
                        } else {
                            pWidth = pContent.smallThumbnailWidth + 'px';
                            pHeight = pContent.smallThumbnailHeight + 'px';
                        }
                        ytPlayer(pHeight, pWidth, thisContent.id, thisDivId, pContent);
                    });

                }
            }
        }
    }
    this.dataSource = null;
    this.selectedVideo = null;
    var thisObject = this;


    var packVideoComponent = function(){
        if(! checkVideoDialogEntries()){
            $("#errMsgArea").show();
            return;
        }else{
            $("#noComponentTitle").hide();
            $("#noStartTime").hide();
            $("#noStopTime").hide();
            $("#errMsgArea").hide();
        }
        if ( $("#radioStartIntoClip").prop( "checked" ) ){
            thisObject.selectedVideo.startIntoClip=true;
            thisObject.selectedVideo.startPointInClip = $("#textStartIntoClip").val();
        }else{
            thisObject.selectedVideo.startIntoClip=false;
            thisObject.selectedVideo.startPointInClip = "";
        }
        if ( $("#radioEndInClip").prop( "checked" ) ){
            thisObject.selectedVideo.radioEndInClip=true;
            thisObject.selectedVideo.endPointInClip = $("#textEndIntoClip").val();
        }else{
            thisObject.selectedVideo.radioEndInClip=false;
            thisObject.selectedVideo.endPointInClip = "";
        }

        thisObject.selectedVideo.dataSourceType = "youTube";
        if($("#autoStart").attr('checked')=='checked'){
            thisObject.selectedVideo.autoStart=true;
        }else{
            thisObject.selectedVideo.autoStart=false;
        }
        if($("#psizeSmall").attr('checked')=='checked'){
            thisObject.selectedVideo.playerSize = 'small';
        }else if($("#psizeMedium").attr('checked')=='checked'){
            thisObject.selectedVideo.playerSize = 'medium';
        }else {
            thisObject.selectedVideo.playerSize = 'large';
        }
        var packedContent = JSON.stringify(thisObject.selectedVideo);
        return packedContent;
    }

    var saveVideoComponent = function(){
        if(! checkVideoDialogEntries()){
            $("#errMsgArea").show();
            return;
        }else{
            $("#noComponentTitle").hide();
            $("#noStartTime").hide();
            $("#noStopTime").hide();
            $("#errMsgArea").hide();
        }
        if ( $("#radioStartIntoClip").prop( "checked" ) ){
            thisObject.selectedVideo.startIntoClip=true;
            thisObject.selectedVideo.startPointInClip = $("#textStartIntoClip").val();
        }else{
            thisObject.selectedVideo.startIntoClip=false;
            thisObject.selectedVideo.startPointInClip = "";
        }
        if ( $("#radioEndInClip").prop( "checked" ) ){
            thisObject.selectedVideo.radioEndInClip=true;
            thisObject.selectedVideo.endPointInClip = $("#textEndIntoClip").val();
        }else{
            thisObject.selectedVideo.radioEndInClip=false;
            thisObject.selectedVideo.endPointInClip = "";
        }
        thisObject.selectedVideo.dataSourceType = "youTube";
        if($("#autoStart").attr('checked')=='checked'){
            thisObject.selectedVideo.autoStart=true;
        }else{
            thisObject.selectedVideo.autoStart=false;
        }
        var packedContent = JSON.stringify(thisObject.selectedVideo);
        var elementId = generateUUID();
        var getDocumentEvents= function(elementId){
            theseEvents = Array();
            theseEvents.push(new dgEvent('Component viewed by user',false, componentViewed,'', elementId));
            return theseEvents;
        }
        insertComponent($("#componentX").val(), $("#componentY").val(), "video", $("#videoComponentLabelValue").val(), packedContent, $("#saveContext").val(), getDocumentEvents(elementId),"false", elementId, $("#reLoadContext").val());
    }

    var checkVideoDialogEntries = function(){
        var entriesOk = true;
        var errMsg = "";
        if( $("#videoComponentLabelValue").val()==""){
            entriesOk = false;
            $("#noComponentTitle").show();
        }else{
            $("#noComponentTitle").hide();
        }
        if ( $("#radioStartIntoClip").prop( "checked" ) && $("#textStartIntoClip").val() ==""){
            entriesOk = false;
            $("#noStartTime").show();
        }else{
            $("#noStartTime").hide();
        }
        if ( $("#radioEndInClip").prop( "checked" ) && $("#textEndIntoClip").val() ==""){
            entriesOk = false;
            $("#noStopTime").show();
        }else{
            $("#noStopTime").hide();
        }
        return entriesOk;
    }

    var selectThisVideo = function(vItem){
        var thisVitem = vItem;

        console.log('selectThisVideo->vItem.title',vItem.title);
        $("#videoTitle").html(vItem.title);
        $("#videoDescription").html(vItem.description);
        $("#videoThumbnail").prop("src", vItem.mediumThumbnailUrl);
        $("#radioStartBegining").prop('disabled', false);
        $("#radioStartBegining").attr('checked', true);
        $("#radioStartIntoClip").prop('disabled', false);
        $("#textStartIntoClip").prop('disabled', false);
        $("#radioEndAtEnd").prop('disabled', false);
        $("#radioEndAtEnd").attr('checked', true);
        $("#textEndIntoClip").prop('disabled', false);
        $("#buttonSave").prop('disabled', false);
        $("#pvid").show();
        $("#previewVideo").on('click', function(){
            $("#markVideo").show();
            $("#thumbnailDiv").html("");
            ytPlayer('175px', '200px', thisVitem.id, 'thumbnailDiv', thisVitem);
        });
        $("#buttonSave").on('click', function(){

            saveVideoComponent();
        });

    }

    var showVideoComponentDialog = function(t,x,y,popName){

        t.popName = popName;
        $('#'+popName).html(getVideoEntryHTML(t.layerName,x,y,popName));
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
        $("#thumbnailDiv").css('background-color', '#cccccc');
        $("#thumbnailDiv").css('height', '175px');
        $("#thumbnailDiv").css('width', '250px');
        var thumbElement = "<img src=\"images\/blankThumbnail.jpg\" height=\"175px\" width=\"250px\" id = \"videoThumbnail\"\/>";
        $("#thumbnailDiv").html(thumbElement);

        $("#onLabel").html($.t("video.onLabel"));
        $("#optionNotSelected").html($.t("video.selectVideoSource"));
        $("#optionYouTube").html($.t("video.youTubeSource"));
        $("#optionKaltura").html($.t("video.kalturaSource"));
        $("#optionKhan").html($.t("video.khanSource"));

    }

    var cancelVideoDialog = function(popName){
        $("#"+popName).html("");
        $("#"+popName).hide();
        eatNextClick=true;
        var thisContextId = $("#componentContext").val();
        reloadAllComponents(thisContextId, true);
    }

    var findYtVideosDialog = function(st, ss){
        var searchType = st;
        var searchSpec = ss;
        var handleAuthResult;
        var OAUTH2_CLIENT_ID = '173376356605-o0kp3lu663nqha1m61tjf9v5s5phuulc.apps.googleusercontent.com';
        var OAUTH2_SCOPES = [
            'https://www.googleapis.com/auth/youtube'
        ];

        var doCheckAuth = function(){
            console.log('checkAuth');
            gapi.auth.authorize({
                client_id: OAUTH2_CLIENT_ID,
                scope: OAUTH2_SCOPES,
                immediate: false
            }, handleAuthResult);
        }
        handleAuthResult = function (authResult) {
            console.log('handleAuthResult');
            if (authResult && !authResult.error) {
                // Authorization was successful. Hide authorization prompts and show
                // content that should be visible after authorization succeeds.


                var videoItemSelector = function(videoComponent){
                    var videoComponent = videoComponent;
                    var dataSourceObject = thisObject.dataSource;
                    thisObject.selectedVideo=null;
                    this.popname = dataSourceObject.popname;
                    this.displayWindow = function(){
                        var strVar="";
                        strVar += "    <table id=\"itemTable\" border=\"0\">";
                        strVar += "        <tr>";
                        strVar += "            <th><div id=\"vTitleHdr\" class=\"itemTableHeaderCss\" style=\"width:200px;\"><\/div><\/th>";
                        strVar += "            <th><div id=\"vDescHdr\" class=\"itemTableHeaderCss\" style=\"width:500px;\"><\/div><\/th>";
                        strVar += "            <th><div id=\"vDateHdr\" class=\"itemTableHeaderCss\"style=\"width:100px;\"><\/div><\/th>";
                        strVar += "            <th><div id=\"vThumbHdr\" class=\"itemTableHeaderCss\" style=\"width:130px;\"><\/div><\/th>";
                        strVar += "        <\/tr>";
                        strVar += "    <\/table>";
                        strVar += "    <table id=\"itemTable\" border=\"0\" width=\"100%\">";
                        strVar += "        <tr>";
                        strVar += "        <td align=\"center\">";
                        strVar += "<input type=\"button\"  id=\"buttonPrev\"\/>";
                        strVar += "<input type=\"button\"  id=\"buttonSelectVideo\"\/>";
                        strVar += "<input type=\"button\"  id=\"cancelSelection\"\/>";
                        strVar += "<input type=\"button\"  id=\"buttonNext\"\/>";
                        strVar += "        <td>";
                        strVar += "        <\/tr>";
                        strVar += "    <\/table>";
                        $("#"+this.popname).html(strVar);
                        $("#"+this.popname).css('top', '-450px');
                        $("#vTitleHdr").html($.t("video.itemTitle"));
                        $("#vDescHdr").html($.t("video.itemDesc"));
                        $("#vDateHdr").html($.t("video.itemDate"));
                        $("#vThumbHdr").html($.t("video.itemThumb"));
                        $("#buttonPrev").prop('value',$.t("video.prevPage"));
                        if(dataSourceObject.prevVis=='hidden'){
                            $("#buttonPrev").hide();
                        }else{
                            $("#buttonPrev").show();
                        }
                        $("#buttonPrev").on('click', function(){
                            dataSourceObject.thisSelectorObject.prevScreen();
                        })
                        $("#buttonNext").prop('value',$.t("video.nextPage"));
                        if(dataSourceObject.nextVis=='hidden'){
                            $("#buttonNext").hide();
                        }else{
                            $("#buttonNext").show();
                        }
                        $("#buttonNext").on('click', function(){
                            dataSourceObject.thisSelectorObject.nextScreen();
                        });
                        $("#buttonSelectVideo").prop('disabled', true);
                        $("#buttonSelectVideo").prop('value',$.t("video.selectVideo"));
                        $("#buttonSelectVideo").on('click', function(){
                            $("#"+thisObject.dataSource.popname).html("");
                            $("#"+thisObject.dataSource.popname).hide();
                            selectThisVideo(videoComponent.selectedVideo);
                        });
                        $("#cancelSelection").prop('value',$.t("video.cancelSelect"));
                        $("#cancelSelection").on('click', function(){
                            dataSourceObject.thisSelectorObject.cancelSelect();
                        });

                    }

                    this.displayLine = function(vItem, index){
                        var vTitleId = "vtitle"+index;
                        var vDescId = "vdesc"+index;
                        var vDateId = "vdate"+index;
                        var vThumbId = "vthumb"+index;
                        var thisTitle = vItem.title;
                        var thisDescription = vItem.description;
                        var rawDate = vItem.datePublished;
                        var rawDateClipPos = rawDate.indexOf('T');
                        var thisDate = rawDate.substring(0,rawDateClipPos);
                        var thisThumbnail = vItem.smallThumbnailUrl;
                        var thisResourceId = vItem.id;
                        var videoPopup = this.popname+"_videoPlayer";
                        var popName = this.popname;
                        var strVar="";
                        strVar += "        <tr>";
                        strVar += "            <td id=\""+vTitleId+"\" class=\"vItemCss\" ><input type=\"radio\" id=\"v_"+thisResourceId+"\" name=\"vselect\"\/>"+thisTitle+"<\/td>";
                        strVar += "            <td id=\""+vDescId+"\" class=\"vItemCss\" >"+thisDescription+"<\/td>";
                        strVar += "            <td id=\""+vDateId+"\" class=\"vItemCss\" >"+thisDate+"<\/td>";
                        strVar += "            <td id=\""+vThumbId+"\" class=\"vItemCss\" ><img src=\""+thisThumbnail+"\"\/><\/td>";
                        strVar += "        <\/tr>";
                        $("#itemTable").append(strVar);
                        $("#v_"+thisResourceId).on('click', function(){
                            thisObject.selectedVideo = vItem;
                            videoComponent.selectedVideo = vItem;
                            $("#buttonSelectVideo").prop('disabled', false);

                        });
                        $("#"+vThumbId).on('click', function(){

                            var cancelPreview = function(){
                                $("#"+videoPopup).html("");
                                $("#"+videoPopup).hide();
                            }
                            var selectVideo = function(){
                                thisObject.selectedVideo = vItem;
                                $("#"+videoPopup).html("");
                                $("#"+videoPopup).hide();
                                $("#"+thisObject.dataSource.popname).hide();
                                selectThisVideo(vItem);
                            }

                            var vEmbedHtml="";
                            vEmbedHtml += "<iframe id=\"ytplayer\" type=\"text\/html\" width=\"320\" height=\"195\"";
                            vEmbedHtml += "  src=\"http:\/\/www.youtube.com\/embed\/"+thisResourceId+"?autoplay=1&&rel=0&&origin=http:\/\/example.com\"";
                            vEmbedHtml += "  frameborder=\"0\"\/>";
                            vEmbedHtml += "<input type=\"button\"  id=\"selectPreviewVideo\"\/>";
                            vEmbedHtml += "<input type=\"button\"  id=\"cancelVideoPreview\"\/>";
                            vEmbedHtml += "";

                            $("#"+videoPopup).html(vEmbedHtml);
                            $("#selectPreviewVideo").prop('value',$.t("video.selectVideo"));
                            $("#selectPreviewVideo").on('click',function(){
                                selectVideo();
                            });
                            $("#cancelVideoPreview").prop('value',$.t("video.cancelSelect"));
                            $("#cancelVideoPreview").on('click', function(){
                                cancelPreview();
                            });
                            $("#"+videoPopup).addClass('smallPlayerDiv');
                            //                            var thisYtPlayer = new youTubePlayer('player',thisResourceId,275,300);
                            $("#"+videoPopup).show();

                        });
                        return strVar;

                    }
                    this.showIt = function(){
                        $("#"+this.popname).addClass('ytSelector');
                        var availableWindowHeight = window.innerHeight-150;
                        var dialogHeight = availableWindowHeight.toString();
                        dialogHeight +="px";
                        $("#"+this.popname).css('height',dialogHeight);
                        $("#"+this.popname).show();
                    }
                    this.nextScreen = function(){
                        dataSourceObject.fetchItems('fwd', searchType, searchSpec);
                    }
                    this.prevScreen = function(){
                        dataSourceObject.fetchItems('back', searchType, searchSpec)
                    }
                    this.cancelSelect = function(){
                        $("#"+this.popname).html("");
                        $("#"+this.popname).hide();
                    }

                }
                thisObject.dataSource = new youtubeVideoSource(videoItemSelector, "popup2", thisObject);
                thisObject.dataSource.fetchItems('start', searchType, searchSpec);




            } else {
                console.log('authResult returned an error');
                // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
                // client flow. The current function is called when that flow completes.
                $('#login-link').click(function () {
                    var OAUTH2_CLIENT_ID = '173376356605-o0kp3lu663nqha1m61tjf9v5s5phuulc.apps.googleusercontent.com';
                    var OAUTH2_SCOPES = [
                        'https://www.googleapis.com/auth/youtube'
                    ];
                    gapi.auth.authorize({
                        client_id: OAUTH2_CLIENT_ID,
                        scope: OAUTH2_SCOPES,
                        immediate: false
                    }, handleAuthResult);
                });
            }
        };

        doCheckAuth();


    }

    var ytUpload = function(popName){

        var handleUploadAuthorizeResult;
        var OAUTH2_CLIENT_ID = '173376356605-o0kp3lu663nqha1m61tjf9v5s5phuulc.apps.googleusercontent.com';
        var YOUTUBE_API_KEY = 'AIzaSyA7sOUX-XrnKXA1QBub--8-BF3SmODoSxU';
        var OAUTH2_SCOPES = [
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.upload'
        ];
        var thisPopName = popName;

        var authorizeUpload = function(){
            gapi.auth.authorize({
                client_id: OAUTH2_CLIENT_ID,
                scope: OAUTH2_SCOPES,
                immediate: false
            }, handleUploadAuthorizeResult);
        }

        var getUploadScreen = function () {
            var strVar = "";
            strVar += "    <table border=\"0\" width=\"800px\">";
            strVar += "        <tr>";
            strVar += "            <td width=\"25%\" id=\"titleLabel\" align=\"left\"><\/td>";
            strVar += "            <td width=\"75%\" align=\"left\"><input id=\"title\" type=\"text\" size=\"50\"><\/td>";
            strVar += "        <\/tr>";
            strVar += "        <tr>";
            strVar += "            <td width=\"25%\" id=\"videoDescriptionLabel\" align=\"left\"><\/td>";
            strVar += "            <td width=\"75%\" align=\"left\"><textarea id=\"description\" rows=\"5\" cols=\"80\"><\/textarea><\/td>";
            strVar += "        <\/tr>";
            strVar += "        <tr>";
            strVar += "            <td width=\"25%\" id=\"privacyStatusLabel\" align=\"left\"><\/td>";
            strVar += "            <td width=\"75%\" align=\"left\"><select id=\"privacy-status\"><\/select><\/td>";
            strVar += "        <\/tr>";
            strVar += "    <tr>";
            strVar += "    <td colspan=\"2\" ";
            strVar += "    <div>";
            strVar += "        <input input type=\"file\" id=\"file\" class=\"button\" accept=\"video\/*\">";
            strVar += "        <button id=\"button\"><span id=\"uploadButtonLabel\"></span><\/button>";
            strVar += "        <div class=\"during-upload\">";
            strVar += "            <p><span id=\"percent-transferred\"><\/span><span id=\"percentDoneLabel\"><\/span>(<span id=\"bytes-transferred\"><\/span>\/<span id=\"total-bytes\"><\/span> <span id=\"bytesLabel\"><\/span>)<\/p>";
            strVar += "            <progress id=\"upload-progress\" max=\"1\" value=\"0\"><\/progress>";
            strVar += "        <\/div>";
            strVar += "";
            strVar += "        <div class=\"post-upload\">";
            strVar += "            <p><span id=\"uploadedVideoIdLabel\"><\/span><span id=\"video-id\"><\/span>.<span id=\"pollingForStatusLabel\" ><\/span><\/p>";
            strVar += "            <ul id=\"post-upload-status\"><\/ul>";
            strVar += "        <\/div>";
            strVar += "        <p id=\"disclaimer\"><span id=\"disclaimerLabel\"><\/span><a href=\"http:\/\/www.youtube.com\/t\/terms\" target=\"_blank\">http:\/\/www.youtube.com\/t\/terms<\/a><\/p>";
            strVar += "    <\/div>";
            strVar += "    </td>";
            strVar += "    </tr>";
            strVar += "    <tr>";
            strVar += "    <td colspan=\"2\" align=\"center\">";
            strVar += "        <button id=\"cancelUploadButton\"><span id=\"cancelUploadButtonLabel\"></span><\/button>";
            strVar += "        <button id=\"selectUploadButton\"><span id=\"selectUploadButtonLabel\"></span><\/button>";
            strVar += "        <button id=\"doneUploadButton\"><span id=\"doneUploadButtonLabel\"></span><\/button>";
            strVar += "    </td>";
            strVar += "    </tr>";
            strVar += "    <\/table>";
            return strVar;
        }

        var cancelUpload = function(){
            $("#"+thisPopName).html("");
            $("#"+thisPopName).hide();
        }

        var selectUploadedVideo = function(videoId){
            var thisVideoId = videoId
            $.getJSON('https://www.googleapis.com/youtube/v3/videos?id='+thisVideoId+'&key='+YOUTUBE_API_KEY+'&part=snippet&callback=?',function(data){

                if (typeof(data.items[0]) != "undefined") {
                    console.log('video exists ' + data.items[0].snippet.title);
                    var videoSnippet = data.items[0].snippet;
                    var thisNewVideoItem = new Object();
                    thisNewVideoItem.title = videoSnippet.title;
                    thisNewVideoItem.id = thisVideoId;
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
                    thisObject.selectedVideo = thisNewVideoItem;
                    selectThisVideo(thisObject.selectedVideo);

                } else {
                    console.log('video not exists');
                }
            });
        }


        handleUploadAuthorizeResult = function (authResult) {
            if (authResult && !authResult.error) {
                $("#"+thisPopName).addClass('videoUpload')
                $("#"+thisPopName).html(getUploadScreen());

                $("#titleLabel").html($.t("video.titleLabel"));
                $("#videoDescriptionLabel").html($.t("video.videoDescriptionLabel"));
                $("#privacyStatusLabel").html($.t("video.privacyStatusLabel"));
                $("#percentDoneLabel").html($.t("video.percentDoneLabel"));
                $("#bytesLabel").html($.t("video.bytesLabel"));
                $("#uploadedVideoIdLabel").html($.t("video.uploadedVideoIdLabel"));
                $("#pollingForStatusLabel").html($.t("video.pollingForStatusLabel"));
                $("#disclaimerLabel").html($.t("video.disclaimerLabel"));
                var privacyOption = "<option>"+$.t("video.privacyStatusPublic")+"</option>";
                $("#privacy-status").append(privacyOption);
                privacyOption = "<option>"+$.t("video.privacyStatusUnlisted")+"</option>";
                $("#privacy-status").append(privacyOption);
                privacyOption = "<option>"+$.t("video.privacyStatusPrivate")+"</option>";
                $("#privacy-status").append(privacyOption);
                $("#uploadButtonLabel").html($.t("video.uploadButton"));
                $("#cancelUploadButtonLabel").html($.t("video.cancelUploadButtonLabel"));
                $("#cancelUploadButton").on('click', function(){
                    cancelUpload();
                });
                $("#selectUploadButtonLabel").html($.t("video.selectUploadButtonLabel"));
                $("#selectUploadButton").prop('disabled', true);
                $("#selectUploadButton").on('click', function(){
                    $("#"+thisPopName).html("");
                    $("#"+thisPopName).hide();
                    selectUploadedVideo($("#thisVideoId").val());
                });
                $("#doneUploadButtonLabel").html($.t("video.doneUploadButtonLabel"));
                $("#doneUploadButton").prop('disabled', true);
                var uploadVideo = new UploadVideo();
                uploadVideo.ready(authResult.access_token);
                $("#"+thisPopName).show();
             }else{
                alert("login error");
            }

        }

        authorizeUpload();

    }


    var videoEditScreen = function(t,popName, connections){
        $("#"+popName).html("");
        showVideoComponentDialog(t, t.x, t.y,popName);
        $("#videoComponentLabelValue").val(t.title);
        var thisContent = JSON.parse(t.content);
        thisObject.selectedVideo=thisContent;
        var thisPopName = popName;
        $("#videoTitle").html(thisContent.title);
        $("#videoDescription").html(thisContent.description);
        $("#videoThumbnail").prop("src", thisContent.mediumThumbnailUrl);
        $("#buttonSave").prop('value', $.t("video.saveVideo"));
        $("#buttonFindVideo").prop('value', $.t("video.findVideo"));
//        $("#buttonEditThisVideoComponent").prop('value', $.t("video.editThisVideo"));

        if(typeof(thisContent.startIntoClip)!='undefined'){
            if(thisContent.startIntoClip==true){
                $("#radioStartIntoClip").attr('checked', true);
                $("#textStartIntoClip").val(thisContent.startPointInClip);
                $("#radioStartBegining").attr('checked', false);
            }else{
                $("#radioStartBegining").attr('checked', true);
                $("#radioStartIntoClip").attr('checked', false);
                $("#textStartIntoClip").val("");
            }
        }else{
            $("#radioStartBegining").attr('checked', true);
            $("#radioStartIntoClip").attr('checked', false);
            $("#textStartIntoClip").val("");
        }
        if(typeof(thisContent.radioEndInClip)!='undefined'){
            if(thisContent.radioEndInClip==true){
                $("#radioEndInClip").attr('checked', true);
                $("#textEndIntoClip").val(thisContent.endPointInClip);
                $("#radioEndAtEnd").attr('checked', false);
            }else{
                $("#radioEndInClip").attr('checked', false);
                $("#radioEndAtEnd").attr('checked', true);
                $("#textEndIntoClip").val("");
            }
        }else{
            $("#radioEndAtEnd").attr('checked', true);
            $("#radioEndInClip").attr('checked', false);
            $("#textEndIntoClip").val("");
        }
        if(checkVideoDialogEntries()){
            $("#errMsgArea").hide();
        }else{
            $("#errMsgArea").show();
        }
        $("#buttonSave").prop('disabled', false);
        $("#buttonSave").prop('value', $.t("video.updateVideo"));
        $("#buttonSave").on('click', function(){
            if(checkVideoDialogEntries()){
                var thisPackedData = packVideoComponent();
                updateComponent($("#componentX").val(), $("#componentY").val(), $("#componentType").val(), $("#videoComponentLabelValue").val(), thisPackedData, $("#componentContext").val(), thisComponentId, $("#reLoadContext").val() );
                $('#'+thisPopName).hide();
            }
        });
        $("#buttonCancel").prop('disabled', false);
        $("#buttonCancel").prop('value', $.t("video.cancel"));
        $("#buttonCancel").on("click", function(){
            cancelVideoDialog(thisPopName);
        });
        $("#videoSourceSelector").html(thisContent.dataSourceType);
        $("#buttonFindVideo").prop('value', $.t("video.changeYTVideoSelection"));
        $("#buttonFindVideo").on('click', function(){
            findYtVideosDialog("myvideos", "");
        });
        $("#buttonUploadVideo").hide();
        $("#buttonRemoveComponent").prop('value',$.t("nav.removeComponent"));
        $("#buttonRemoveComponent").on("click", function(){
            $("#"+thisPopName).hide();
            deleteComponent(thisComponentId, $("#videoComponentLabelValue").val());
        });
        $("#previewVideo").prop('value', $.t("video.previewVideoLabel"));
        $("#pvid").show();
        $("#previewVideo").on('click', function(){
            $("#markVideo").show();
            $("#thumbnailDiv").html("");
            ytPlayer('175px', '200px', thisContent.id, 'thumbnailDiv', thisContent);
        });

        $("#markVideo").on('click', function(){
            var currentTime = window.player.getCurrentTime();
            $("#textStartIntoClip").val(currentTime);
            $("#radioStartBegining").attr('checked', false);
            $("#radioStartIntoClip").attr('checked', true);
            $("#markVideo").hide();
            $("#markVideoEnd").show();
        });
        $("#markVideoEnd").on('click', function(){
            var currentTime = window.player.getCurrentTime();
            $("#textEndIntoClip").val(currentTime);
            $("#radioEndAtEnd").prop('checked', false);
            $("#radioEndInClip").prop('checked', true);
            $("#markVideoEnd").hide();
        });
//        $("#buttonEditThisVideoComponent").hide();
        $("#markVideo").prop('value', $.t("video.markStart"));
        $("#markVideo").hide();
        $("#markVideoEnd").prop('value', $.t("video.markEnd"));
        $("#markVideoEnd").hide();
        $("#pathSelectDiv").html(getPathSelectHtml());
        setPathSelect(connections);
        $("#pathSelectDropDown").on('change', function(){
            editPath(t.id, t.context);
        });
        $("#playerSizeLabel").html($.t("video.playerSizeLabel"));
        $("#optionPlayerSizeNotSelected").html($.t("video.playerSizeNotSelected"));
        $("#optionPlayerSizeSmall").html($.t("video.smallPlayer"));
        $("#optionPlayerSizeMedium").html($.t("video.mediumPlayer"));
        $("#optionPlayerSizeLarge").html($.t("video.largePlayer"));
        if(thisObject.selectedVideo.playerSize=='small') {
            $("#psizeSmall").attr('checked', true);
        }else if(thisObject.selectedVideo.playerSize=='medium'){
            $("#psizeMedium").attr('checked', true);
        }else if(thisObject.selectedVideo.playerSize=='large'){
            $("#psizeLarge").attr('checked', true);
        }
        $("#autoStartLabel").html($.t("video.autoStart"));
        if(thisObject.selectedVideo.autoStart==true){
            $("#autoStart").attr('checked', 'checked');
        }
        $("#"+popName).show();

    }



    var videoEntryScreen = function(t,x,y,n, popName){

        showVideoComponentDialog(t,x,y,popName);
        var thisPopName = popName;
        $("#radioStartBegining").prop('disabled', true);
        $("#radioStartIntoClip").prop('disabled', true);
        $("#textStartIntoClip").prop('disabled', true);
        $("#radioEndAtEnd").prop('disabled', true);
        $("#textEndIntoClip").prop('disabled', true);
        $("#buttonFindVideo").prop('disabled', false);
        $("#buttonFindVideo").prop('value', $.t("video.findVideo"));
        $("#buttonUploadVideo").prop('disabled', false);
        $("#buttonUploadVideo").on('click', function(){
            ytUpload("popup3");
        });
        $("#buttonUploadVideo").prop('value', $.t("video.uploadVideo"));
//        $("#buttonEditThisVideoComponent").prop('disabled', true);
//        $("#buttonEditThisVideoComponent").prop('value', $.t("video.editThisVideo"));
        $("#buttonSave").prop('disabled', true);
        $("#buttonSave").prop('value', $.t("video.saveVideo"));
        $("#buttonSave").on('click', function(){

        });
        $("#buttonCancel").prop('disabled', false);
        $("#buttonCancel").prop('value', $.t("video.cancel"));
        $("#buttonCancel").on("click", function(){
            cancelVideoDialog(thisPopName);
        });
        $("#noComponentTitle").hide();
        $("#noStartTime").hide();
        $("#noStopTime").hide();
        $("#errMsgArea").hide();
        $("#buttonRemoveComponent").hide();
        $("#previewVideo").prop('value', $.t("video.previewVideoLabel"));
        $("#pvid").hide();
        $("#markVideo").prop('value', $.t("video.markStart"));
        $("#markVideo").hide();
        $("#markVideoEnd").prop('value', $.t("video.markEnd"));
        $("#markVideoEnd").hide();

        $("#buttonFindVideo").on('click', function(){
            findYtVideosDialog("myvideos", "");
        });
        $("#autoStartLabel").html($.t("video.autoStart"));
        $("#buttonFindVideo").prop('value', $.t("video.listYtVideos"));
        $("#searchYtButton").prop('value', $.t("video.searchYtVideos"));
        $("#searchYtButton").prop('disabled', true);
        $("#searchYt").keydown(function(){
            $("#searchYtButton").prop('disabled', false);
        });
        $("#searchYtButton").on('click', function(){
            var searchSpec = $("#searchYt").val();
            console.log('search spec is:'+searchSpec);
            findYtVideosDialog("ytsearch", searchSpec);
        });

/*
// user has selected a video source.
        $("#sourceSelect").change(function(){
            var selectedSource =  $("#sourceSelect").val();
            if(selectedSource=='youtube'){
                $("#buttonFindVideo").prop('disabled', false);
                $("#buttonFindVideo").on('click', function(){
                    findYtVideosDialog();
                });

                $("#buttonFindVideo").prop('value', $.t("video.listYtVideos"));
            }

        });
*/
        $("#playerSizeLabel").html($.t("video.playerSizeLabel"));
        $("#optionPlayerSizeNotSelected").html($.t("video.playerSizeNotSelected"));
        $("#optionPlayerSizeSmall").html($.t("video.smallPlayer"));
        $("#optionPlayerSizeMedium").html($.t("video.mediumPlayer"));
        $("#optionPlayerSizeLarge").html($.t("video.largePlayer"));
        $("#psizeSmall").attr('checked', true);
        $('#popup').show();


    }

    var setupEdit = function(thisComponent, popName){

    };



    var ytPlayer = function(height, width, videoUrl, thisPlayerDiv, vit){

        var tag = document.createElement('script');
        var playerHeight = height;
        var playerWidth = width;
//        var playerUrl = videoUrl;
        var playerDiv = thisPlayerDiv;
        var playerInit = false;
        var thisVit = vit;
        var playerUrl=thisVit.id;
/*
        if (typeof window.youtube_api_init == 'undefined') {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            playerInit=true;
            console.log('api loaded');
        }
*/
        if (typeof window.youtube_api_init != 'undefined') {
            console.log('window.youtube_api_init is defined - player being called directly')
            var autoPlayValue;
            if(thisVit.autoStart == true){
                autoPlayValue=1;
            }else{
                autoPlayValue=0;
            }
            window.player = new YT.Player(playerDiv, {
                playerVars: { 'autoplay': autoPlayValue, 'controls': 2, rel: 0 },
                height: playerHeight,
                width: playerWidth,
                videoId: thisVit.id,
                events: {
                    'onReady': window.onPlayerReady
                }
            });
//            onYouTubeIframeAPIReady();
        }
/*
        if(playerInit){
            window.youtube_api_init=true;
        }
*/
/*
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
*/
        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
//        window.player;
/*
        window.onYouTubeIframeAPIReady=function() {
//            window.youtube_api_init=true;
            console.log('player being called from APIReady');
//            console.log(playerUrl);
            var autoPlayValue;
            if(thisVit.autoStart == true){
                autoPlayValue=1;
            }else{
                autoPlayValue=0;
            }
            window.player = new YT.Player(playerDiv, {
                playerVars: { 'autoplay': autoPlayValue, 'controls': 2, rel: 0 },
                height: playerHeight,
                width: playerWidth,
                videoId: thisVit.id,
                events: {
                    'onReady': window.onPlayerReady
                }
            });
        }
*/

        // 4. The API will call this function when the video player is ready.
        window.onPlayerReady = function(event) {
            event.target.playVideo();
        }


        function onPlayerStateChange(event) {

        }
        window.stopVideo = function() {
            window.player.stopVideo();
        }

    }



    var getVideoEntryHTML= function(layerName,x,y,n, mode){
        var strVar="";
        strVar += "    <div class=\"docComponent\" id=\"videoInfo\">";
        strVar += "        <div class=\"componentTypeLabel\" id=\"videoComponentTypeLabel\">";
        strVar += "        <\/div>";
        strVar += "        <div id=\"errMsgArea\">"
        strVar += "        <span class=\"componentTitleLabel\" style=\"color: red\" >Please correct entries marked in red below<\/span>";
        strVar += "        <\/div>";
        strVar += "        <div class=\"componentTitleLabel\" id = \"videoComponentLabel\">";
        strVar += "            <span id=\"videoComponentTitleLabelValue\"><\/span>";
        strVar += "                <input type=\"text\" size=\"40\" maxlength=\"60\" id=\"videoComponentLabelValue\" \/><span class=\"componentTitleLabel\" style=\"color: red\" id=\"noComponentTitle\" >*</span>";
        strVar += "        <\/div>";
        strVar += "        <div class=\"videoClipTitleLabel\" >";
        strVar += "            <span class=\"componentTitleLabel\" id=\"videoClipTitleLabelValue\"><\/span><span class=\"componentTitleLabel\" style=\"color: blue\" id=\"videoTitle\"><\/span>";
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
        strVar += "                            <div id=\"thumbnailDiv\">";
//        strVar += "                                <img src=\"images\/blankThumbnail.jpg\" height=\"175px\" width=\"250px\" id = \"videoThumbnail\"\/>";
        strVar += "                            <\/div>";
        strVar += "                            <div id=\"pvid\">";
        strVar += "                                 <span>";
        strVar += "                                     <input type=\"button\" id=\"previewVideo\"\/>";
        strVar += "                                     <input type=\"button\" id=\"markVideo\"\/>";
        strVar += "                                     <input type=\"button\" id=\"markVideoEnd\"\/>";
        strVar += "                                 <\/span>";
        strVar += "                                  <div class=\"smallRadio\">";
        strVar += "                                  <span id=\"playerSizeLabel\"></span>";
        strVar += "                                  <input type=\"radio\" name=\"playerSize\" value=\"playerSizeSmall\" id = \"psizeSmall\"><span id=\"optionPlayerSizeSmall\"></span></input>";
        strVar += "                                  <input type=\"radio\" name=\"playerSize\" value=\"playerSizeMedium\" id = \"psizeMedium\"><span id=\"optionPlayerSizeMedium\"></span></input>";
        strVar += "                                  <input type=\"radio\" name=\"playerSize\" value=\"playerSizeLarge\" id = \"psizeLarge\"><span id=\"optionPlayerSizeLarge\"></span></input>";
        strVar += "                                  </div>";
        strVar += "                                  <div class=\"smallRadio\">";
        strVar += "                                         <span id=\"autoStartLabel\"></span><input type=\"checkbox\"  id = \"autoStart\"></input>";
        strVar += "                                  </div>";
        strVar += "                                     </span>";
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
        strVar += "            <span id=\"secondsLabel\"><\/span><span class=\"componentTitleLabel\" style=\"color: red\" id=\"noStartTime\" >*</span>";
        strVar += "        <\/div>";
        strVar += "        <div class=\"componentTitleLabel\"  >";
        strVar += "            <span id=\"endLabel\"><\/span>";
        strVar += "            <input type=\"radio\" name=\"endOption\" value=\"endAtEnd\" id=\"radioEndAtEnd\"\/>";
        strVar += "            <span id=\"atEndLabel\"><\/span>";
        strVar += "            <input type=\"radio\" name=\"endOption\" value=\"endIntoClip\" id=\"radioEndInClip\"\/>";
        strVar += "            <span id=\"secondsToRunLabel\"><\/span>";
        strVar += "            <input type=\"text\" size=\"5\" maxlength=\"5\" id=\"textEndIntoClip\"\/>";
        strVar += "            <span id=\"endSecondsLabel\"><\/span><span class=\"componentTitleLabel\" style=\"color: red\" id=\"noStopTime\" >*</span>";
        strVar += "        <\/div>";
        strVar += "        <div class=\"componentTitleLabel\"  style=\"top:10px;\">";
/*
        strVar += "            <span id=\"onLabel\"><\/span>";
        strVar += "            <span id=\"videoSourceSelector\" >"
        strVar += "            <select id=\"sourceSelect\">";
        strVar += "                <option value=\"notSelected\" id=\"optionPlayerSizeNotSelected\"><\/option>";
        strVar += "                <option value=\"youtube\" label=\"YouTube\" id=\"optionYouTube\">YouTube<\/option>";
        strVar += "                <option value=\"kaltura\" label=\"Kaltura\" id=\"optionKaltura\">Kaltura<\/option>";
        strVar += "                <option value=\"khan\" label=\"Khan Academy\" id=\"optionKahn\">Khan Academy<\/option>";
        strVar += "            <\/select>";
        strVar += "            <\/span>";
*/
        strVar += "            <input type=\"button\" id=\"buttonFindVideo\"\/>";
        strVar += "            <input type=\"button\"  id=\"buttonUploadVideo\"\/>";
//        strVar += "            <input type=\"button\"  id=\"buttonEditThisVideoComponent\"\/>";
        strVar += "            <input type=\"button\" id=\"buttonSave\" \/>";
        strVar += "            <input type=\"button\"  id=\"buttonCancel\"\/>";
        strVar += "            <input type=\"button\"  id=\"buttonRemoveComponent\"\/>";
        strVar += "            <input type=\"button\"  id=\"searchYtButton\"\/>";
        strVar += "            <input type=\"text\" size=\"40\" maxlength=\"60\" id=\"searchYt\" \/>";
        strVar += "            <span id=\"pathSelectDiv\"><\/span>";
        strVar += "        <\/div>";
        strVar += "    <\/div>";
        strVar += "    <input id=\"componentX\" name=\"componentX\" hidden=\"true\" value=\""+x+"\" \/>";
        strVar += "    <input id=\"componentY\" name=\"componentY\" hidden=\"true\" value=\""+y+"\"\/>";
        strVar += "    <input id=\"componentType\" name=\"componentType\" hidden=\"true\" value=\"video\" \/>";
        strVar += "    <input id=\"componentId\" name=\"componentId\" hidden=\"true\" hidden=\"true\" value=\""+n+"\"\/>";
        strVar += "    <input id=\"componentContent\" name=\"componentContent\" hidden=\"true\" \/>";
        strVar += "    <input id=\"thisVideoId\" name=\"thisVideoId\" hidden=\"true\" \/>";
        strVar += "    <input id=\"debug\" name=\"debug\" hidden=\"true\" \/>";
        strVar += "    <input id=\"componentEditMode\" name=\"componentEditMode\" hidden=\"true\"  value=\""+mode+"\"/>";
        strVar += "";
        return strVar;
    };

    var getYtSelectHTML = function(){
        var strVar="";
        strVar += "<select id=\"availableVideoList\" class=\"chooserSelect\" size=\"6\">";
        strVar += "<\/select>";
        strVar += "<table width=\"100%\">";
        strVar += "    <tr>";
        strVar += "        <td>";
        strVar += "            <input type=\"button\" id=\"useVideo\" value=\"Use This Video\" \/>";
        strVar += "        <\/td>";
        strVar += "        <td>";
        strVar += "            <input type=\"button\" id=\"cancelSelectVideo\" value=\"Cancel\" \/>";
        strVar += "        <\/td>";
        strVar += "    <\/tr>";
        strVar += "<\/table>";
        return strVar;
    }

    var getComponentEvents = function(content){

    };



    this.entry = function(thisComponent){

        var thisDivId = "ytPlayerDiv"+thisComponent.elementId;
        var thisParentDiv = "ytPlayerDiv_parent"+thisComponent.elementId;
        if(isFirefox){
            var ytDiv =  "<table border=\"0\"><tr><td width=\"10%\"></td><td id=\""+thisParentDiv+"\" width=\"90%\"><div id=\""+thisDivId+"\" ></div></td> </tr></table>";
            $("#contentArea").append(ytDiv);
        }else if(isChrome | isSafari){
            thisContent = thisComponent.content;
            res = thisContent.replace("\n","\\n");
            parsedContent = jQuery.parseJSON(res);
            if(!parsedContent.autoStart) {
                var thisDivId = "ytPlayerDiv" + thisComponent.elementId;
                var pWidth;
                var pHeight;
                var pUrl;
                if (parsedContent.playerSize == 'large') {
                    pWidth = parsedContent.highThumbnailWidth + 'px';
                    pHeight = parsedContent.highThumbnailHeight + 'px';
                    pUrl = parsedContent.highThumbnailUrl;
                } else if (parsedContent.playerSize == 'medium') {
                    pWidth = parsedContent.mediumThumbnailWidth + 'px';
                    pHeight = parsedContent.mediumThumbnailHeight + 'px';
                    pUrl = parsedContent.mediumThumbnailUrl;
                } else {
                    pWidth = parsedContent.smallThumbnailWidth + 'px';
                    pHeight = parsedContent.smallThumbnailHeight + 'px';
                    pUrl = parsedContent.smallThumbnailUrl;
                }
                var clickMsg = $.t("video.clickMsg");
                var ytDiv =  "<table border=\"0\"><tr><td width=\"10%\"></td><td id=\""+thisParentDiv+"\" width=\"90%\"><div id=\""+thisDivId+"\" ><div class=\"smallRadio  smallRadioBold\">"+clickMsg+"</div><img height=\""+pHeight+"\" width=\""+pWidth+"\" src=\""+pUrl+"\"\/></div></td> </tr></table>";
                $("#contentArea").append(ytDiv);
            }else{
                var ytDiv =  "<table border=\"0\"><tr><td width=\"10%\"></td><td id=\""+thisParentDiv+"\" width=\"90%\"><div id=\""+thisDivId+"\" ></div></td> </tr></table>";
                $("#contentArea").append(ytDiv);
            }

        }else{
            var ytDiv =  "<table border=\"0\"><tr><td width=\"10%\"></td><td id=\""+thisParentDiv+"\" width=\"90%\"><div id=\""+thisDivId+"\" ></div></td> </tr></table>";
            $("#contentArea").append(ytDiv);

        }
        var returnVideoUserEvents = function(){
            var thisUserEventsArray = [];
            thisUserEventsArray.push(new userEvent(thisComponent.id, "", componentViewed, thisComponent.elementId));
            return thisUserEventsArray;
        }
        return returnVideoUserEvents;



    }

}

// Upon loading, the Google APIs JS client automatically invokes this callback.
googleApiClientReady = function() {
    gapi.auth.init(function() {
//        window.setTimeout(checkAuth, 1);
    });
//    $('.pre-auth').hide();
}

video.prototype = new component();



toolIcons.push("video");



