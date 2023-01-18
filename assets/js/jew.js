API_URL = `https://api.lanyard.rest/v1`;
USERID = `DISCORDIDHERE`;
document.addEventListener(`contextmenu`, (e) => e.preventDefault());
function ctrlShiftKey(e, keyCode) {
  return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
}
window.onscroll = function () {
    window.scrollTo(0,0);
}
document.onkeydown = (e) => {
  if (
    event.keyCode === 123 ||
    ctrlShiftKey(e, `I`) ||
    ctrlShiftKey(e, `J`) ||
    ctrlShiftKey(e, `C`) ||
    (e.ctrlKey && e.keyCode === `U`.charCodeAt(0))
  )
    return false;
};
async function fetchResponse(userId) {
    try {
        const url = await fetch(`${API_URL}/users/${userId}`);
        const response = await url.json();
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function setAvatar(USERID, card) {
    const response = await fetchResponse(USERID);
    var avatarId = response.data.discord_user.avatar;
    var fullUrl = `https://cdn.discordapp.com/avatars/${USERID}/${avatarId}`;
    if (response.data.discord_user.avatar) document.getElementsByClassName(`${card}-pfp`)[0].src = fullUrl;
    else document.getElementsByClassName(`${card}-pfp`)[0].src = "https://cdn.discordapp.com/embed/avatars/1.png"
}

async function setAvatarFrame(USERID, card) {
    const response = await fetchResponse(USERID);
    const activity2 = document.getElementsByClassName(`${card}-status2`)[0];
    switch (response.data.discord_status) {
        case `online`:
            document.getElementsByClassName(`${card}-activity-dot`)[0].style.background = `#3ba45d`;
            document.getElementsByClassName(`${card}-activity-dot`)[0].title = `online`;
            activity2.innerHTML = `online`;
            activity2.style.cssText = `color: #3ba45d; opacity: 0.5;`;
            break;
        case `dnd`:
            document.getElementsByClassName(`${card}-activity-dot`)[0].style.background = `#ed4245`;
            document.getElementsByClassName(`${card}-activity-dot`)[0].title = `do not disturb`;
            activity2.innerHTML = `do not disturb`;
            activity2.style.cssText = `color: #ed4245; opacity: 0.5;`;
            break;
        case `idle`:
            document.getElementsByClassName(`${card}-activity-dot`)[0].style.background = `#faa81a`;
            document.getElementsByClassName(`${card}-activity-dot`)[0].title = `idle`;
            activity2.innerHTML = `idle`;
            activity2.style.cssText = `color: #faa81a; opacity: 0.5;`;
            break;
        case `offline`:
            document.getElementsByClassName(`${card}-activity-dot`)[0].style.background = `#747e8c`;
            document.getElementsByClassName(`${card}-activity-dot`)[0].title = `offline`;
            activity2.innerHTML = `offline`;
            activity2.style.cssText = `color: #747e8c; opacity: 0.5;`;
            break;
    }
    let presence = response.data.activities.find(r=> r.type === 1)
    if (presence) {
        if (presence.url.includes("twitch.tv")) {
            document.getElementsByClassName(`${card}-activity-dot`)[0].style.background = `#301934`;
            document.getElementsByClassName(`${card}-activity-dot`)[0].title = `streaming`;
            activity2.innerHTML = `streaming`;
            activity2.style.cssText = `color: #301934; opacity: 0.5;`;
        }
    }

}
async function setUsername(USERID, card) {
    const response = await fetchResponse(USERID);
    var user = response.data.discord_user.username;
    var discriminator = response.data.discord_user.discriminator;
    var fullName = `${user}#${discriminator}`;
    document.getElementsByClassName(`${card}-username`)[0].innerHTML = fullName;
    document.getElementById(`${card}-title`).innerHTML
    document.getElementById(`title-name`).content = fullName;
    document.getElementById(`connection-username`).title = fullName;
}
async function setPresence() {
    const response = await fetchResponse(USERID);
    let rpc = response.data.activities.find(r=> r.type === 0)
    console.log(rpc)
    // PFP //
    if(response.data.listening_to_spotify === true) {
        document.getElementsByClassName(`card1-pfp`)[0].src = response.data.spotify.album_art_url;
        document.getElementsByClassName(`card1-pfp`)[0].style = `
            width: 128px;
            height: 128px;
            border-radius: 10%;
            -webkit-transition-property: all; 
            -webkit-transition-duration: 0.3s; 
            -webkit-transition-timing-function: ease; `
    }
    else if(rpc) {
        if (rpc.assets.large_image.includes("mp:external")) {
            document.getElementsByClassName(`card1-pfp`)[0].src = "https://" + rpc.assets.large_image.split("https/")[1]
        }
        else {
            document.getElementsByClassName(`card1-pfp`)[0].src = `https://cdn.discordapp.com/app-assets/` + rpc.application_id + `/` + rpc.assets.large_image + `.png`
            document.getElementsByClassName(`card1-pfp`)[0].style = `
                width: 128px;
                height: 128px;
                border-radius: 10%;
                -webkit-transition-property: all; 
                -webkit-transition-duration: 0.3s; 
                -webkit-transition-timing-function: ease; `
        }
    }
    else {
        document.getElementsByClassName(`card1-pfp`)[0].style = `width: 150px;
height: 128px;
border-radius: 10%;
-webkit-transition-property: all; 
-webkit-transition-duration: 0.3s; 
-webkit-transition-timing-function: ease; `
    }

    if (response.data.listening_to_spotify === true) document.getElementsByClassName(`card1-username`)[0].innerHTML = response.data.spotify.song
    else if (rpc) document.getElementsByClassName(`card1-username`)[0].innerHTML = rpc.name
    else document.getElementsByClassName(`card1-username`)[0].innerHTML = "no activity"

    if(response.data.listening_to_spotify === true) document.getElementById(`card1-title`)
    else if (rpc) document.getElementById(`card1-title`).innerHTML = `playing ${rpc.name}`
    else document.getElementById(`card1-title`).innerHTML

    if(response.data.listening_to_spotify === true) document.getElementsByClassName(`card1-status`)[0].innerHTML = response.data.spotify.artist
    else if(rpc) document.getElementsByClassName(`card1-status`)[0].innerHTML = rpc.details
    
    else {document.getElementsByClassName(`card1-status`)[0].innerHTML = response.data.spotify.artist}
}

async function setStatus(USERID, card) {
    const response = await fetchResponse(USERID);
    let status = response.data.activities[0].name;
    if (response.data.discord_status == `offline`) {
        return;
    }
    if (response.data.listening_to_spotify === true) {
        return document.getElementsByClassName(`${card}-status`)[0].innerHTML = "listening to spotify"
    }
    let rpc1 = response.data.activities.find(r=> r.type === 3)
    if (rpc1)  return document.getElementsByClassName(`${card}-status`)[0].innerHTML = `watching ${rpc1.name}`
    let rpc2 = response.data.activities.find(r=> r.type === 1)
    if (rpc2)  return document.getElementsByClassName(`${card}-status`)[0].innerHTML = `streaming ${rpc2.name}`
    let rpc3 = response.data.activities.find(r=> r.type === 5)
    if (rpc3)  return document.getElementsByClassName(`${card}-status`)[0].innerHTML = `Competing in ${rpc3.name}`
    if(status === undefined) return document.getElementsByClassName(`${card}-status`)[0].innerHTML = `Status unavailable.`;
    document.getElementsByClassName(`${card}-status`)[0].innerHTML = `Status unavailable.`;
}
async function setSpotifyBar() {
    const response = await fetchResponse(USERID);
    var bar = document.getElementsByClassName(`card1-spotify-innerbar`)[0];
    var bar2 = document.getElementsByClassName(`card1-spotify-time-end`)[0];
    var bar3 = document.getElementsByClassName(`card1-spotify-time-start`)[0];
    if (response.data.listening_to_spotify == false) {
        bar.style.display = `none`;
        bar2.innerHTML = ``;
        bar3.innerHTML = ``;
        return;
    }
    const date = new Date().getTime();
    const v1 = response.data.spotify.timestamps.end -
        response.data.spotify.timestamps.start;
    const v2 = date - response.data.spotify.timestamps.start;

    function spotifyTimeSet(date, element) {
        const x = document.getElementsByClassName(element)[0];
        const y = new Date(date);
        const minutes = y.getMinutes();
        const seconds = y.getSeconds();
        const formmatedseconds = seconds < 10 ? `0${seconds}` : seconds;
        x.innerHTML = `${minutes}:${formmatedseconds}`;
    }
    spotifyTimeSet(v1, `card1-spotify-time-end`);
    spotifyTimeSet(v2, `card1-spotify-time-start`);
    prcnt = (v2 / v1) * 100;
    precentage = Math.trunc(prcnt);
    prccc = Math.round((prcnt + Number.EPSILON) * 100) / 100;
    i = 1;
    bar.style.display = `block`;
    bar.style.width = prccc + `%`;
}

async function statusInvoke(USERID, card) {
    setStatus(USERID, card);
    setAvatarFrame(USERID, card);
}
async function invoke(USERID, card) {
    setAvatar(USERID, card);
    setUsername(USERID, card);
    setInterval(function() {
        setSpotifyBar();
        statusInvoke(USERID, card)
        setPresence();
    }, 1000)

}
