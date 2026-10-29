"use strict";

(() => {
  const root = document.body.dataset.root || "";
  const toast = document.querySelector("[data-toast]");
  let toastTimer;
  const approvedVoicesEndpoint = "https://script.google.com/macros/s/AKfycbyXBH1efK9I-atM0_YIgvJEOYoGAqsphl1kgJWXIndhnxZ7IWnIVI2np7XPZ8X63hKS/exec";
  const gaaCountyColours = Object.freeze({
    carlow: ["#177245", "#e4b62e"],
    cavan: ["#1f5fae", "#ffffff"],
    clare: ["#f1bd24", "#2362a8"],
    cork: ["#d92e28", "#ffffff"],
    donegal: ["#167043", "#e5bf24"],
    dublin: ["#65b8df", "#173d70"],
    galway: ["#791f3e", "#ffffff"],
    kerry: ["#177245", "#dfae24"],
    kildare: ["#ffffff", "#23734a"],
    kilkenny: ["#1f2020", "#e4b229"],
    laois: ["#1f5fae", "#ffffff"],
    leitrim: ["#1b7447", "#e8ba2c"],
    limerick: ["#247348", "#ffffff"],
    longford: ["#1f5fae", "#e2bd26"],
    louth: ["#d52c2d", "#ffffff"],
    mayo: ["#1a7449", "#d83234"],
    meath: ["#237444", "#e7b92b"],
    monaghan: ["#ffffff", "#225fa7"],
    offaly: ["#227247", "#e3b52a"],
    roscommon: ["#efd85a", "#2560a7"],
    sligo: ["#252525", "#ffffff"],
    tipperary: ["#2b67b1", "#e2b32a"],
    waterford: ["#ffffff", "#2563aa"],
    westmeath: ["#781f3f", "#ffffff"],
    wexford: ["#5f2a82", "#e2b52c"],
    wicklow: ["#2465af", "#e1b629"],
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  async function copyText(value) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const helper = document.createElement("textarea");
    helper.value = value;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.append(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }

  function initialiseSharing() {
    for (const button of document.querySelectorAll("[data-share]")) {
      button.addEventListener("click", async () => {
        const shareData = {
          title: document.title,
          text: "Explore Europa Society at UCC's county pairings atlas.",
          url: window.location.href,
        };
        try {
          if (navigator.share) {
            await navigator.share(shareData);
            return;
          }
          await copyText(shareData.url);
          showToast("Link copied, ready to share.");
        } catch (error) {
          if (error?.name !== "AbortError") {
            showToast("Sharing was not available. You can copy the page address.");
          }
        }
      });
    }
  }

  async function initialiseCountyAtlas() {
    const mapContainer = document.querySelector("[data-county-map]");
    const listContainer = document.querySelector("[data-county-list]");
    const search = document.querySelector("#county-search");
    const resultCount = document.querySelector("[data-result-count]");
    if (!mapContainer || !listContainer || !search) return;

    try {
      const [mapResponse, countiesResponse] = await Promise.all([
        fetch(`${root}data/county-map.json`),
        fetch(`${root}data/counties.json`),
      ]);
      if (!mapResponse.ok || !countiesResponse.ok) {
        throw new Error("County data could not be loaded.");
      }
      const [mapData, countiesData] = await Promise.all([
        mapResponse.json(),
        countiesResponse.json(),
      ]);
      const geometryBySlug = new Map(
        mapData.counties.map((county) => [county.slug, county]),
      );
      const counties = countiesData.counties.map((county) => ({
        ...geometryBySlug.get(county.slug),
        ...county,
      }));
      const namespace = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(namespace, "svg");
      svg.setAttribute("viewBox", mapData.viewBox);
      svg.setAttribute("role", "group");
      svg.setAttribute("aria-labelledby", "county-map-title county-map-description");
      const title = document.createElementNS(namespace, "title");
      title.id = "county-map-title";
      title.textContent = "Interactive map of Ireland's 26 counties";
      const description = document.createElementNS(namespace, "desc");
      description.id = "county-map-description";
      description.textContent = "Select a county to open its county pairing profile.";
      const group = document.createElementNS(namespace, "g");
      const directoryLinkBySlug = new Map();
      const shapeBySlug = new Map();
      const profileUrl = (slug) => `${root}county/?county=${encodeURIComponent(slug)}`;

      for (const county of counties) {
        const shape = document.createElementNS(namespace, "path");
        shape.classList.add("county-shape");
        shape.dataset.slug = county.slug;
        const [primary, secondary] = gaaCountyColours[county.slug] || ["#d8e1dc", "#667c74"];
        shape.style.setProperty("--county-primary", primary);
        shape.style.setProperty("--county-secondary", secondary);
        shape.setAttribute("d", county.mapPath);
        shape.setAttribute("tabindex", "0");
        shape.setAttribute("role", "link");
        shape.setAttribute("aria-label", `${county.name}: open its profile with ${county.officialUmbrellaPairing.partnerCountry}`);
        const openProfile = () => {
          window.location.href = profileUrl(county.slug);
        };
        shape.addEventListener("click", openProfile);
        shape.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProfile();
          }
        });
        group.append(shape);
        shapeBySlug.set(county.slug, shape);

        const link = document.createElement("a");
        link.className = "county-button";
        link.dataset.slug = county.slug;
        link.href = profileUrl(county.slug);
        link.textContent = county.name;
        listContainer.append(link);
        directoryLinkBySlug.set(county.slug, link);
      }

      svg.append(title, description, group);
      mapContainer.replaceChildren(svg);
      mapContainer.setAttribute("aria-busy", "false");

      search.addEventListener("input", () => {
        const query = search.value.trim().toLocaleLowerCase("en-IE");
        let matches = 0;
        for (const county of counties) {
          const match = county.name.toLocaleLowerCase("en-IE").includes(query) || county.irishName.toLocaleLowerCase("ga-IE").includes(query);
          directoryLinkBySlug.get(county.slug).hidden = !match;
          shapeBySlug.get(county.slug).classList.toggle("is-filtered-out", !match);
          if (match) matches += 1;
        }
        if (resultCount) resultCount.textContent = String(matches);
      });
    } catch (error) {
      mapContainer.setAttribute("aria-busy", "false");
      const message = document.createElement("p");
      message.className = "map-error";
      message.textContent = "The interactive map could not load. The county directory remains available.";
      mapContainer.replaceChildren(message);
      console.error("County atlas failed to load:", error);
    }
  }

  function initialiseQuiz() {
    const form = document.querySelector("[data-quiz]");
    const result = document.querySelector("[data-quiz-result]");
    if (!form || !result) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const questions = [...form.querySelectorAll("[data-answer]")];
      const unanswered = questions.find((question) => !question.querySelector("input:checked"));
      if (unanswered) {
        result.textContent = "Choose one answer for each question first.";
        unanswered.querySelector("input")?.focus();
        return;
      }
      const score = questions.reduce((total, question) => total + Number(question.querySelector("input:checked").value === question.dataset.answer), 0);
      result.textContent = `${score} out of ${questions.length}.`;
      result.focus();
    });
  }


  async function initialiseVoices() {
    const cards = document.querySelector("[data-voice-cards]");
    const more = document.querySelector("[data-more-voices]");
    if (!cards || !more) return;
    more.hidden = true;
    try {
      const response = await fetch(approvedVoicesEndpoint, { cache: "no-store" });
      if (!response.ok) throw new Error("Approved voices unavailable");
      const data = await response.json();
      const voices = (data.entries || []).filter(
        (item) => typeof item.word === "string" &&
          typeof item.story === "string" && item.word.trim() && item.story.trim(),
      );
      if (!voices.length) {
        const empty = document.createElement("p");
        empty.className = "voices-empty";
        empty.textContent = "The first community words and stories will appear here after review.";
        cards.replaceChildren(empty);
        return;
      }
      let limit = 3;
      function render() {
        cards.replaceChildren(...voices.slice(0, limit).map((item) => {
          const article = document.createElement("article");
          article.className = "voice-card";
          const heading = document.createElement("h3");
          heading.textContent = item.word.trim();
          const story = document.createElement("p");
          story.textContent = item.story.trim();
          article.append(heading, story);
          return article;
        }));
        more.hidden = voices.length <= limit;
      }
      more.addEventListener("click", () => { limit += 3; render(); });
      render();
    } catch (error) {
      const message = document.createElement("p");
      message.textContent = "Community responses could not load right now.";
      cards.replaceChildren(message);
      console.error("Approved voices failed to load:", error);
    }
  }

  initialiseSharing();
  initialiseVoices();
  initialiseCountyAtlas();
  initialiseQuiz();
})();


(() => {
  function addCountyAutocomplete() {
    const input = document.querySelector("#county-search");
    const directory = document.querySelector("[data-county-list]");
    if (!input || !directory) {
      window.setTimeout(addCountyAutocomplete, 120);
      return;
    }
    if (input.dataset.autocompleteReady) return;
    input.dataset.autocompleteReady = "true";

    const toolbar = input.parentElement;
    toolbar.classList.add("has-county-suggestions");
    const suggestions = document.createElement("div");
    suggestions.className = "county-suggestions";
    suggestions.setAttribute("role", "listbox");
    suggestions.setAttribute("aria-label", "Matching counties");
    suggestions.hidden = true;
    input.setAttribute("aria-controls", "county-suggestions");
    input.setAttribute("aria-expanded", "false");
    suggestions.id = "county-suggestions";
    input.insertAdjacentElement("afterend", suggestions);

    const style = document.createElement("style");
    style.textContent = ".map-toolbar.has-county-suggestions{position:relative}.county-suggestions{position:absolute;z-index:20;top:calc(100% + .4rem);left:0;right:0;overflow:hidden;border:1px solid var(--line);border-radius:.75rem;background:var(--paper);box-shadow:var(--shadow-sm)}.county-suggestion{display:block;width:100%;padding:.8rem 1rem;border-bottom:1px solid var(--line);color:var(--ink);font-weight:700;text-decoration:none}.county-suggestion:last-child{border-bottom:0}.county-suggestion:hover,.county-suggestion:focus{background:var(--green-pale);outline:none}";
    document.head.append(style);

    const counties = [...directory.querySelectorAll(".county-button")].map((link) => ({
      name: link.textContent.trim(),
      url: link.href,
    }));

    function closeSuggestions() {
      suggestions.hidden = true;
      suggestions.replaceChildren();
      input.setAttribute("aria-expanded", "false");
    }

    function showMatches() {
      const query = input.value.trim().toLocaleLowerCase("en-IE");
      if (!query) {
        closeSuggestions();
        return;
      }
      const matches = counties.filter((county) => county.name.toLocaleLowerCase("en-IE").includes(query)).slice(0, 8);
      if (!matches.length) {
        closeSuggestions();
        return;
      }
      suggestions.replaceChildren(...matches.map((county) => {
        const option = document.createElement("a");
        option.className = "county-suggestion";
        option.href = county.url;
        option.setAttribute("role", "option");
        option.textContent = county.name;
        return option;
      }));
      suggestions.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }

    input.addEventListener("input", showMatches);
    input.addEventListener("focus", showMatches);
    input.addEventListener("keydown", (event) => {
      const options = [...suggestions.querySelectorAll(".county-suggestion")];
      if (event.key === "ArrowDown" && options.length) {
        event.preventDefault();
        options[0].focus();
      }
      if (event.key === "Escape") closeSuggestions();
    });
    suggestions.addEventListener("keydown", (event) => {
      const options = [...suggestions.querySelectorAll(".county-suggestion")];
      const index = options.indexOf(document.activeElement);
      if (event.key === "ArrowDown" && index < options.length - 1) {
        event.preventDefault();
        options[index + 1].focus();
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (index > 0) options[index - 1].focus();
        else input.focus();
      }
      if (event.key === "Escape") {
        closeSuggestions();
        input.focus();
      }
    });
    input.addEventListener("blur", () => window.setTimeout(closeSuggestions, 160));
    document.addEventListener("click", (event) => {
      if (!toolbar.contains(event.target)) closeSuggestions();
    });
  }

  addCountyAutocomplete();
})();


(() => {
  const countyField = document.querySelector("#county-search");
  if (!countyField || document.querySelector("#county-options")) return;
  const countyOptions = ["Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath", "Wexford", "Wicklow"];
  const countyList = document.createElement("datalist");
  countyList.id = "county-options";
  countyList.replaceChildren(...countyOptions.map((name) => {
    const option = document.createElement("option");
    option.value = name;
    return option;
  }));
  document.body.append(countyList);
  countyField.setAttribute("list", countyList.id);
})();




(() => {
  const input = document.querySelector("#county-search");
  const suggestions = document.querySelector("#county-suggestions");
  if (!input || !suggestions) return;

  const counties = ["Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath", "Wexford", "Wicklow"];
  input.removeAttribute("list");

  const renderChoices = () => {
    const query = input.value.trim().toLowerCase();
    const matches = query ? counties.filter((county) => county.toLowerCase().startsWith(query)) : [];
    suggestions.replaceChildren(...matches.map((county) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "county-suggestion";
      button.textContent = county;
      button.addEventListener("mousedown", (event) => {
        event.preventDefault();
        window.location.href = "county/?county=" + county.toLowerCase();
      });
      return button;
    }));
    suggestions.hidden = matches.length === 0;
    input.setAttribute("aria-expanded", String(matches.length > 0));
  };

  input.addEventListener("input", renderChoices);
  input.addEventListener("focus", renderChoices);
})();
