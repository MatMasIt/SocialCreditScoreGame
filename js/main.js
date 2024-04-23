var audio, audiostate;
var d = Math.random();
// choose random bgm to start
if (d < 0.50) {
    audiostate = "mix";
}
else {
    audiostate = "maobgm";
}
//handles bgm files to create a continous bgm
function audiosegm() {
    if (audiostate != "mix") {
        audio = new Audio('assets/music/main.mp3');
        audiostate = "mix";
    }
    else {
        audio = new Audio('assets/music/maobgm.mp3');
        audiostate = "maobgm";
    }
    audio.play();
    audio.onended = audiosegm;
}
// plays a sound effect
function sef(filename) {
    new Audio("assets/music/" + filename + ".mp3").play();
}
$("#playBegin").click(function () {
    try {// this might fail, expecially on safari
        document.getElementsByTagName("html")[0].requestFullscreen();
    } catch (e) { }
    audiosegm();
    $(this).fadeOut();
});
var data = {}, cQuestion = {}, indexeslist = [], indexesProgress = 0, total = 100;
$.ajax({
    type: 'GET',
    url: 'data.yaml',
    complete: function (r) {
        data = jsyaml.load(r.responseText);
        total = data["initialScore"];
        $("#scoreDisplay").html("Social credit score: " + total);
        for (var i = 0; i < data["questions"].length; i++) {
            indexeslist.push(i);
        }
        $("#progress").html("1 of " + indexeslist.length);
        shuffle(indexeslist);
        displayQuestion();
    }
});
function displayQuestion() {
    $("html, body").scrollTop(0);
    if (total < 1) {
        audio.pause();
        audio = new Audio('assets/music/anthem.mp3');
        audio.play();
        $("#loose").show();
    }
    else {

        if (total < 2000) sef("pullup");
        var index = 0;

        // sends comrad Dwayne to help (or calls him back)
        if (total > 4000) { // comes when low score
            $("#rock-approves").hide();
            $("#rock-disapproves").hide();
        }
        else {
            $("#rock-approves-video").get(0).currentTime = 0;
            $("#rock-approves").show();
        }
        // **************************************
        // sends comrad baby cha-cha to help (or calls him back)
        if (indexesProgress != 0) // comes when first question
            $("#bbchacha").hide();
        else
            $("#bbchacha").show();
        // **************************************        

        if (indexesProgress < indexeslist.length) {
            index = indexeslist[indexesProgress];
            indexesProgress++;
        }
        else {
            audio.pause();
            sef("applause");
            audio = new Audio('assets/music/march_vol_charged.mp3');
            audio.play();
            $("#win").show();
        }
        cQuestion = data["questions"][index];
        $("[data-ans=1]").html(data["questions"][index]["answers"][0]["text"]);
        $("[data-ans=2]").html(data["questions"][index]["answers"][1]["text"]);
        if (data["questions"][index]["answers"][2]) $("[data-ans=3]").html(data["questions"][index]["answers"][2]["text"]);
        else $("[data-ans=3]").html("");
        if (data["questions"][index]["answers"][3]) $("[data-ans=4]").html(data["questions"][index]["answers"][3]["text"]);
        else $("[data-ans=4]").html("");
        $("#questionTitle").html(data["questions"][index]["title"]);
    }
}

// comrad Dwaynes feedback *************************
$(".ans").mouseenter(function () {
    try {
        var res = cQuestion["answers"][$(this).attr("data-ans") - 1]["effect"];

        if ((total <= 4000) && (res < 0)) {
            $("#rock-approves").hide();
            $("#rock-disapproves").show();
            $("#rock-disapproves-video").get(0).currentTime = 0;
            $("#rock-disapproves-video").get(0).play();
        }
    } catch (e) {
        if (e instanceof TypeError) return true;
        else throw e;
    }
});
$(".ans").mouseleave(function () {
    try {
        var res = cQuestion["answers"][$(this).attr("data-ans") - 1]["effect"];

        if ((total <= 4000) && (res < 0)) {
            $("#rock-disapproves").hide();
            $("#rock-approves").show();
            $("#rock-approves-video").get(0).currentTime = 0;
            $("#rock-approves-video").get(0).play();
        }
    } catch (e) {
        if (e instanceof TypeError) return true;
        else throw e;
    }
});
// ***8888888************************************8

$(".ans").click(function () {
    $("#progress").html(indexesProgress + 1 + " of " + indexeslist.length);
    var res = cQuestion["answers"][$(this).attr("data-ans") - 1]["effect"];
    total += res;
    $("#scoreDisplay").html("Social credit score: " + total);
    var d = Math.random();
    if (d < 0.10) {
        d = Math.random();
        if (d < 0.30) {
            $("#mao").fadeIn();
            $("#mao").fadeOut();
            sef("mao");
        }
        else if (d < 0.60) {
            $("#xi").fadeIn();
            $("#xi").fadeOut();
        }
        else {
            $("#square").fadeIn();
            $("#square").fadeOut();
        }
    }
    if (res < 0) {
        $("#wrong").fadeIn();
        sef("wrong");
        if (res < -1000) {
            sef("boo");
        }
        $("#wrong").fadeOut();
    }
    else {
        sef("correct");
        $("#correct").fadeIn();
        if (res > 1000) {
            sef("applause");
        }
    }
    displayQuestion();
    $("#correct").fadeOut();
});

$('.fadeOutVideo').on('ended', function () {
    $(this).parent().fadeOut();
})
