import { packages } from "./packages.mjs";
const canonicallink = document.querySelector("head link[rel='canonical']");
const metadesc = document.querySelector("head meta[name='description']");
const urlParams = new URLSearchParams(window.location.search);
const defaultsdk = "client-s3";
let selectedSdk = urlParams.get('sdk');
if (!(selectedSdk && packages[selectedSdk])) {
    selectedSdk = defaultsdk;
}
let selectedVersion = urlParams.get('version');
if (!(selectedVersion && packages[selectedSdk][selectedVersion])) {
    selectedVersion = "latest";
}
const latestversion = Object.keys(packages[selectedSdk])[0];
if (selectedVersion === "latest") {
    selectedVersion = latestversion;
}
const sdkselect = document.getElementById("sdkName");
const versionselect = document.getElementById("sdkversion");
const mynavigator = document.getElementById("mynavigator");
sdkselect.innerHTML += Object.keys(packages).map(sdk => `<option value="${sdk}"${sdk==selectedSdk ? ' selected' : ''}>${sdk}</option>`).join('');
const url = new URL(window.location.href);
url.searchParams.set("sdk", selectedSdk);
url.searchParams.set("version", selectedVersion);
history.replaceState({"sdk": selectedSdk, "version": selectedVersion}, "", url);

new TomSelect(sdkselect, {
    create: false,
    sortField: {
		field: "text",
		direction: "asc"
	}
});

const versiontomselect = new TomSelect(versionselect, {
    create: false,
    valueField: 'id',
	labelField: 'title',
	searchField: 'title',
    options:[
        {
            id: "",
            title: "loading versions..."
        }
    ]
});


function changepackage(selectedSdk, selectedVersion) {
    const latestversion = Object.keys(packages[selectedSdk])[0];
    if (selectedVersion === "latest") {
        selectedVersion = latestversion;
    }
    versiontomselect.clear();
    versiontomselect.clearOptions();
    versiontomselect.addOptions(Object.keys(packages[selectedSdk]).map(version => ({
        id: version,
        title: `${version}${version == latestversion ? ' - Latest' : ''}`
    })));
    versiontomselect.setValue(selectedVersion, true);
    changecontent(selectedSdk, selectedVersion);
}

sdkselect.addEventListener("change", (event) => {
    if (selectedSdk !== event.target.value) {
        selectedSdk = event.target.value;
        selectedVersion = "latest";
        changepackage(selectedSdk, selectedVersion);
    }
});

versionselect.addEventListener("change", (event) => {
    if (selectedVersion !== event.target.value) {
        selectedVersion = event.target.value;
        changecontent(selectedSdk, selectedVersion);
    }
});

changepackage(selectedSdk, selectedVersion);
function changecontent(selectedSdk, selectedVersion) {
    canonicallink["href"] = `https://cloud-sdk-builds.github.io/?sdk=${selectedSdk}&version=${selectedVersion}`;
    metadesc["content"] = `@aws-sdk/${selectedSdk} v${selectedVersion} - Prebuilt for JavaScript v3 via CDN with import maps, no bundling or build tools, just fast browser integration of aws packages`;
    const url = new URL(window.location.href);
    url.searchParams.set("sdk", selectedSdk);
    url.searchParams.set("version", selectedVersion);
    history.pushState({"sdk": selectedSdk, "version": selectedVersion}, "", url);



    const sdkreplacerels = mynavigator.querySelectorAll("span.sdkversionreplacer");
    if (sdkreplacerels) {
        sdkreplacerels.forEach(el => {
            el.innerText = selectedVersion;
        });
    }
    const urihashreplacerels = mynavigator.querySelectorAll("span.urihashreplacer");
    if (urihashreplacerels) {
        urihashreplacerels.forEach(el => {
            el.innerText = packages[selectedSdk][selectedVersion];
        });
    }
    const sdknamereplacerels = mynavigator.querySelectorAll("span.sdknamereplacer");
    if (sdknamereplacerels) {
        sdknamereplacerels.forEach(el => { 
            el.innerText = selectedSdk;
        });
    }
}

function copycode(event) {
    const button = event.target.closest("button.copy-btn");
    const codeblock = event.target.closest(".code-block");

    if (codeblock && button) {
        button.disabled = true;
        const code = codeblock.querySelector("pre code").textContent;
        navigator.clipboard.writeText(code).then(() => {
            button.innerHTML = '<i class="bi bi-check" aria-hidden="true"></i>';
            setTimeout(() => {
                button.innerHTML = '<i class="bi bi-copy" aria-hidden="true"></i>';
                button.disabled = false;
            }, 2000);
        }).catch(err => {
            button.disabled = false;
            console.error("Failed to copy code: ", err);
        });
    }
}

const buttonsel = mynavigator.querySelectorAll("button.copy-btn").forEach(btn => {
    btn.addEventListener("click", copycode)
});