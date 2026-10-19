"use strict";

(() => {
  const countySlug = new URLSearchParams(window.location.search).get("county");
  const profile = document.querySelector("[data-county-profile]");
  const feature = document.querySelector("[data-county-feature]");

  function showMessage(container, message) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    container.replaceChildren(paragraph);
  }

  function buildLuxembourgFeature() {
    const section = document.createElement("section");
    section.className = "partner-country-feature";
    section.setAttribute("aria-labelledby", "partner-country-title");
    const heading = document.createElement("h2");
    heading.id = "partner-country-title";
    heading.textContent = "Luxembourg";
    const subtitle = document.createElement("p");
    subtitle.className = "partner-country-subtitle";
    subtitle.textContent = "Lëtzebuerg · “Grand Duchy”";
    const grid = document.createElement("div");
    grid.className = "partner-country-grid";
    const landmark = document.createElement("figure");
    landmark.className = "partner-landmark";
    const image = document.createElement("img");
    image.src = "https://commons.wikimedia.org/wiki/Special:FilePath/Palais%20grand-ducal%20facade.jpg?width=1200";
    image.alt = "Facade of the Grand Ducal Palace in Luxembourg City.";
    image.loading = "lazy";
    const caption = document.createElement("figcaption");
    caption.textContent = "Grand Ducal Palace";
    landmark.append(image, caption);
    const map = document.createElement("div");
    map.className = "luxembourg-map";
    map.setAttribute("role", "img");
    map.setAttribute("aria-label", "Map panel locating Luxembourg in Europe");
    map.innerHTML = '<div class="map-label">Europe</div><div class="map-continent" aria-hidden="true"></div><div class="luxembourg-pin" aria-hidden="true"><span></span></div><p>Luxembourg</p>';
    grid.append(landmark, map);
    section.append(heading, subtitle, grid);
    feature.insertAdjacentElement("afterend", section);
  }

  async function initialiseProfile() {
    if (!countySlug) {
      showMessage(profile, "Choose a county from the atlas to open its profile.");
      return;
    }
    try {
      const countyResponse = await fetch("../data/counties.json");
      if (!countyResponse.ok) throw new Error("Profile data unavailable");
      const { counties } = await countyResponse.json();
      const county = counties.find((item) => item.slug === countySlug);
      if (!county) throw new Error("Unknown county");
      document.title = `${county.name} and ${county.officialUmbrellaPairing.partnerCountry} | Europa Society at UCC`;
      profile.replaceChildren();
      const label = document.createElement("p");
      label.className = "eyebrow";
      label.textContent = "County Pairing";
      const heading = document.createElement("h1");
      heading.textContent = `${county.name} × ${county.officialUmbrellaPairing.partnerCountry}`;
      const text = document.createElement("p");
      text.className = "hero-intro";
      text.textContent = `${county.name} is paired with ${county.officialUmbrellaPairing.partnerCountry}. Explore the county and its European pairing.`;
      profile.append(label, heading, text);
      if (county.slug === "carlow" && feature) {
        const artwork = feature.querySelector("[data-county-artwork]");
        artwork.src = "../assets/carlow-county.jpg";
        artwork.alt = "Carlow county artwork featuring Brownshill Dolmen, a historic map and the county flag.";
        feature.hidden = false;
        buildLuxembourgFeature();
      }
    } catch (error) {
      showMessage(profile, "This county profile could not be loaded. Please return to the atlas and try again.");
      console.error("County profile failed to load:", error);
    }
  }

  initialiseProfile();
})();
