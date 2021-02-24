ayahContainer = document.getElementById("ayah-content");
nextBtn = document.getElementById("btn-next");
prevBtn = document.getElementById("btn-prev");

var reference = 0;



chrome.storage.sync.get(['hefd_ayah_reference'], function (result) {
    console.log('Value currently is ', result);
    reference = result?.hefd_ayah_reference || 1;
    getAyah(reference);
});

function updateReference(reference) {
    chrome.storage.sync.set({ hefd_ayah_reference: reference }, function () {
        console.log('Value is set to ' + reference);
    });
}



function showAyah({ number, text, surah }) {
    ayahContainer.innerHTML = `
    <div>
        <h5><span>${surah.number}</span> ${surah.name}</h5>
        <p>${text}<strong>(${number})</strong></p>
    </div>
    `
}

function getAyah(reference, edition = "ar.simple") {
    const Http = new XMLHttpRequest();
    const url = `http://api.alquran.cloud/v1/ayah/${reference}/${edition}`;
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        if (!Http.responseText) return;
        try {
            const jsonData = JSON.parse(Http.responseText);
            console.log(jsonData && jsonData.data);
            showAyah(jsonData.data);
        } catch (error) {
            console.error(error);
        }
    }
}

document.addEventListener("load", function () {
});

nextBtn.onclick = function () {
    getAyah(++reference);
    updateReference(reference);
}

prevBtn.onclick = function () {
    getAyah(--reference);
    updateReference(reference);
}

window.onbeforeunload = function(){
    updateReference(reference + 1);
 }