document.querySelector('.save-prompt').style.display = 'none';	
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari) {
	document.querySelector('.save-screen').style.display = '';
}

function closePrompt() {
	document.querySelector('.save-prompt').style.display = 'none';
}

function openPrompt() {
	document.querySelector('.save-prompt').style.display = 'block';
}