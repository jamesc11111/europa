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
        artwork.alt = "Carlow county artwork with Brownshill Dolmen, an old map and county flag; the facts are repeated in text below.";
        feature.hidden = false;
      }
    } catch (error) {
      showMessage(profile, "This county profile could not be loaded. Please return to the atlas and try again.");

      console.error("County profile failed to load:", error);
    }
  }

  initialiseProfile();
})();
