const GTM_ID = 'GTM-M34WCR46';
const gaadsclient = 'ca-pub-4844210403916763';

window['dataLayer'] = window['dataLayer'] || [];
window['dataLayer'].push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
});

// Load the GTM script
const s = document.createElement('script');
s.async = true;
s.type = 'text/javascript';
s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
document.head.appendChild(s);

// Load the Google AdSense script and set up the ad slot
const adScript = document.createElement('script');
adScript.async = true;
adScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${gaadsclient}`;
adScript.crossOrigin = 'anonymous';

adScript.onload = () => {
    const adplaceel = document.createElement('ins');
    adplaceel.className = 'adsbygoogle';
    adplaceel.style.display = 'block';
    adplaceel.setAttribute('data-ad-client', gaadsclient);
    adplaceel.setAttribute('data-ad-slot', '4882948161');
    adplaceel.setAttribute('data-ad-format', 'auto');
    adplaceel.setAttribute('data-full-width-responsive', 'true');
    document.body.appendChild(adplaceel);
    (window.adsbygoogle = window.adsbygoogle || []).push({});
};

document.head.appendChild(adScript);