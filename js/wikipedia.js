const form = document.getElementById("form");
const input = document.getElementById("input");
const submit = document.getElementById("submit");
const errorMessage = document.getElementById("errorMessage");
const errorContainer = document.getElementById("errorContainer");
const resultsContainer = document.getElementById("resultsContainer");

const endpoint = "https://es.wikipedia.org/w/api.php?";
const params = {
  origin: "*",
  format: "json",
  action: "query",
  generator: "search",
  grnnamespace: 0,
  grnlimit: 20,
  prop: "info|extracts",
  inprop: "url",
  exchars: "200",
  exintro: true,
  explaintext: true,
  gsrlimit: 20,
};

const clearContent = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const isEmpty = (value) => {
  return !value || value === "";
};

const showError = (message) => {
  clearContent(errorMessage);

  const text = document.createTextNode(message);
  errorMessage.appendChild(text);
  errorContainer.style.display = "flex";
};

const clearError = () => {
  clearContent(errorMessage);
  errorContainer.style.display = "none";
};

const processResponse = (response) => {
  clearContent(resultsContainer);

  const pages = response.query.pages;

  Object.keys(pages).forEach((pageId) => {
    const outerDiv = document.createElement("div");
    outerDiv.setAttribute("class", "ba b--light-red w-25 pa2 ma2");

    const link = document.createElement("a");
    const canonicalurl = pages[pageId].canonicalurl;
    const titleText = document.createTextNode(pages[pageId].title);
    link.setAttribute("href", canonicalurl);
    link.setAttribute("class", "link light-red f4 b");
    link.appendChild(titleText);

    const extract = document.createElement("p");
    const extractText = document.createTextNode(pages[pageId].extract);
    extract.setAttribute("class", "gray");
    extract.appendChild(extractText);

    outerDiv.appendChild(link);
    outerDiv.appendChild(extract);

    resultsContainer.appendChild(outerDiv);
  });
};

const search = (e) => {
  e.preventDefault();

  const userInput = input.value;

  if (isEmpty(userInput)) {
    return;
  }

  params.gsrsearch = userInput;

  const stringParams = [];
  Object.entries(params).forEach(([k, v], i) => {
    stringParams.push(`${k}=${v}`);
  });

  const wikiReq = new XMLHttpRequest();

  wikiReq.open("GET", `${endpoint}${stringParams.join("&")}`, true);

  wikiReq.onreadystatechange = function (e) {
    if (wikiReq.readyState == 4) {
      if (wikiReq.status == 200) {
        const response = JSON.parse(wikiReq.responseText);

        if (response.error) {
          showError(response.error.info);
        } else {
          processResponse(response);
        }
      } else {
        showError("Oh noes! Something went wrong");
      }
    }
  };

  wikiReq.send();
};

const registerEventHandlers = () => {
  submit.addEventListener("click", search);
  form.addEventListener("submit", search);
};

registerEventHandlers();
