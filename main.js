console.log("Loading JavaScript");

// Get element groups
var picker = document.getElementById("select");
var nativeSelect = document.getElementById("native-lang-drop");
var nativeSelectFirst = document.getElementById("native-lang-drop-first");
var otherSelect = document.getElementById("other-lang-drop");
var otherSelectFirst = document.getElementById("other-lang-drop-first");
var help = document.getElementById("help");
var helpButton = document.getElementById("help-button");
var helpButtonArea = document.getElementById("help-button-area");
var conversation = document.getElementsByClassName("conversation");
var conversationText = document.getElementById("conversation-text");
var translations = document.getElementById("translations");
var nativeTranslate = document.getElementById("native-lang");
var otherTranslate = document.getElementById("other-lang");
var survey = document.getElementById("survey");
var surveyButton = document.getElementById("survey-button");
var restart = document.getElementById("restart");
var restartButton = document.getElementById("restart-button");

// Assign events the elements on the page
survey.addEventListener("click", linkToSurvey);
restart.addEventListener("click", restartPage);
nativeSelect.addEventListener("change", setLangauge);
otherSelect.addEventListener("change", setLangauge);
help.addEventListener("click", startTranslating);
helpButton.addEventListener("click", startTranslating);
helpButtonArea.addEventListener("click", startTranslating);
nativeTranslate.addEventListener("click", speakNativeLangauge);
otherTranslate.addEventListener("click", speakOtherLanguage);

// Language values
var native = "en";
var other = "en";
var listOfLanguages = {};

restartPage();

// Functions
function restartPage() {
	// Show selectors
	picker.style.display = "block";

	// Hide other elements
	help.style.display = "none";
	helpButtonArea.style.display = "none";
	for (var i = 0; i < conversation.length; i++) {
		conversation[i].style.display = "none";
	}

	// Reset select
	nativeSelect.selectedIndex = 0;
	otherSelect.selectedIndex = 0;	

	// Clear translations
	translations.innerHTML = "";
}

function setLangauge() {
	// Make sure each option is selected
	if (nativeSelect.value != "") {
		// Set the languages
		var lastNative = native;
		native = nativeSelect.value;

		getTranslation(nativeSelectFirst.innerHTML, lastNative, native, nativeSelectFirst);
		getTranslation(otherSelectFirst.innerHTML, lastNative, native, otherSelectFirst);
		getTranslation(helpButton.innerHTML, lastNative, native, helpButton);		
		getTranslation(surveyButton.innerHTML, lastNative, native, surveyButton);
		getTranslation(restartButton.innerHTML, lastNative, native, restartButton);

		for (var i = 0; listOfLanguages.codes.length; i++) {
			if (native == listOfLanguages.codes[i]) {
				nativeTranslate.innerHTML = listOfLanguages.names[i];
				break;
			}
		}

		if (otherSelect.value != "") {
			// Set the languages
			var lastOther = other;
			other = otherSelect.value;

			getTranslation(help.innerHTML, lastOther, other, help);

			for (var i = 0; listOfLanguages.codes.length; i++) {
				if (other == listOfLanguages.codes[i]) {
					otherTranslate.innerHTML = listOfLanguages.names[i];
					break;
				}
			}
			
			// Switch to help screen
			picker.style.display = "none";
			help.style.display = "block";
			helpButtonArea.style.display = "block";
		}

	}
}

function startTranslating() {
	// Hide help screen
	help.style.display = "none";
	helpButtonArea.style.display = "none";

	// Show translate screen
	for (var i = 0; i < conversation.length; i++) {
		conversation[i].style.display = "block";
	}
}

function speakNativeLangauge() {
	// Listens and then translates native language to other onto screen
	var text = conversationText.value;
	conversationText.value = "";	
	var translate = document.createElement("p");
	getTranslation(text, native, other, translate);
	translations.appendChild(translate); 
}

function speakOtherLanguage() {
	// Listens and then translates other language to selected onto screen
	var text = conversationText.value;
	conversationText.value = "";	
	var translate = document.createElement("p");
	getTranslation(text, other, native, translate);
	translations.appendChild(translate); 
}

function linkToSurvey() {
	window.location.href = "https://ufl.qualtrics.com/jfe/form/SV_a5XefpoULKKuhyR";	
}

// Translate text
function getTranslation(text, from, to, element){
	var data = {
		text: text, 
		from: from, 
		to: to
	};

	fetch('http://localhost:8081/api/translate',
	{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)			
	})
	.then(function(response) {
		response.text().then(function(text) {
			data = text;
			console.log(data);
			element.innerHTML = data;
	  });
	});
}

function getLangauges(){
	fetch('http://localhost:8081/api/language',
	{
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
	})
	.then(function(response) {
		response.text().then(function(text) {
			listOfLanguages = JSON.parse(text);
			console.log(listOfLanguages);
			
			// Fill out selects
			for(var i = 0; i < listOfLanguages.codes.length; i++)
			{
				var nativeOpt = document.createElement("option");
				nativeOpt.value = listOfLanguages.codes[i];
				nativeOpt.innerHTML = listOfLanguages.names[i];

				var otherOpt = document.createElement("option");
				otherOpt.value = listOfLanguages.codes[i];
				otherOpt.innerHTML = listOfLanguages.names[i];

				// Append it to the select elements
				nativeSelect.appendChild(nativeOpt);
				otherSelect.appendChild(otherOpt);
			}
	  });
	});
}

function getLangaugeName(code, element){
	var data = {
		code: code
	};

	fetch('http://localhost:8081/api/language',
	{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)						
	})
	.then(function(response) {
		response.text().then(function(text) {
			console.log(text);
			element.innerHTML = text;
	  });
	});
}

getLangauges();

console.log("JavaScript Loaded");
