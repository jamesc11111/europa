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


  const factsheets = {"carlow":[{"name":"Carlow","Population":"61,968","Area":"897 km²","Capital":"Carlow Town","Website":"Welcome to Carlow County Council","url":"https://carlow.ie/"},{"name":"Luxembourg","Population":"696,268","Area":"2,586.4 km²","Capital":"Luxembourg City","Language":"Luxembourgish, French, German","EU Member Since":"1958","Website":"Luxembourg","url":"https://luxembourg.public.lu/en.html"}],"cavan":[{"name":"Cavan","Population":"81,704","Area":"1,932 km²","Capital":"Cavan Town","Website":"Official website for Visiting Cavan","url":"https://thisiscavan.ie/"},{"name":"Latvia","Population":"1.84 million","Area":"64,589 km²","Capital":"Riga","Language":"Latvian","EU Member Since":"2004","Website":"Latvia | Latvia.eu","url":"https://www.latvia.eu/"}],"clare":[{"name":"Clare","Population":"127,938","Area":"3,450 km²","Capital":"Ennis","Website":"Home - Clare Tourism |","url":"https://www.claretourism.ie/"},{"name":"Croatia","Population":"3.87 million","Area":"56,594 km²","Capital":"Zagreb","Language":"Croatian","EU Member Since":"2013","Website":"Croatia full of life","url":"https://croatia.hr/en-gb"}],"cork":[{"name":"Cork","Population":"584,156","Area":"7,467 km²","Capital":"Cork City","Website":"Pure Cork","url":"https://www.purecork.ie/"},{"name":"France","Population":"68.64 million","Area":"643,801 km²","Capital":"Paris","Language":"French","EU Member Since":"1958","Website":"France.fr","url":"https://www.france.fr/en/"}],"donegal":[{"name":"Donegal","Population":"167,084","Area":"4,860 km²","Capital":"Lifford","Website":"EN | Donegal.ie | Donegal.ie","url":"https://donegal.ie/"},{"name":"Poland","Population":"37.24 million","Area":"312,696 km²","Capital":"Warsaw","Language":"Polish","EU Member Since":"2004","Website":"Home page - Poland Travel (EN)","url":"https://www.poland.travel/en/"}],"dublin":[{"name":"Dublin","Population":"1.5 million","Area":"922 km²","Capital":"Dublin City","Website":"Dublin.ie","url":"https://dublin.ie/"},{"name":"Greece","Population":"10.37 million","Area":"131,957 km²","Capital":"Athens","Language":"Greek","EU Member Since":"1981","Website":"Visit Greece","url":"https://www.visitgreece.gr/en"}],"galway":[{"name":"Galway","Population":"277,737","Area":"6,151 km²","Capital":"Galway City","Website":"Galway Ireland","url":"https://www.galwaytourism.ie/"},{"name":"Estonia","Population":"1.34 million","Area":"45,355 km²","Capital":"Tallinn","Language":"Estonian","EU Member Since":"2004","Website":"Estonia","url":"https://estonia.ee/"}],"kerry":[{"name":"Kerry","Population":"156,458","Area":"4,807 km²","Capital":"Tralee","Website":"Discover Kerry","url":"https://www.discoverkerry.com/"},{"name":"Czechia","Population":"10.9 million","Area":"78,871 km²","Capital":"Prague","Language":"Czech","EU Member Since":"2004","Website":"Home | Government of the Czech Republic","url":"https://vlada.gov.cz/en/"}],"kildare":[{"name":"Kildare","Population":"247,744","Area":"1,694 km²","Capital":"Naas","Website":"Get Into Kildare","url":"https://intokildare.ie/"},{"name":"Austria","Population":"9.17 million","Area":"83,879 km²","Capital":"Vienna","Language":"German","EU Member Since":"1995","Website":"Holiday in Austria","url":"https://www.austria.info/en-us/"}],"kilkenny":[{"name":"Kilkenny","Population":"104,160","Area":"2,073","Capital":"Kilkenny City","Website":"Home - Kilkenny","url":"https://kilkenny.ie/"},{"name":"Romania","Population":"17.99 million","Area":"238,397 km²","Capital":"Bucharest","Language":"Romanian","EU Member Since":"2007","Website":"ROMANIA Tours, Travel and Tourism Information","url":"https://romaniatourism.com/"}],"laois":[{"name":"Laois","Population":"91,877","Area":"1,719.6","Capital":"Portlaoise","Website":"Things to Do & Stay and Explore in Laois | Laois Tourism","url":"https://laoistourism.ie/"},{"name":"Malta","Population":"552,816","Area":"316","Capital":"Valletta","Language":"Maltese","EU Member Since":"2004","Website":"Visit Malta - The Official Tourism Site for Malta, Gozo and Comino - Visit Malta","url":"https://www.visitmalta.com/en/"}],"leitrim":[{"name":"Leitrim","Population":"35,000","Area":"1,590","Capital":"Carrick-on-Shannon","Website":"Welcome to Leitrim | Explore Experience Enjoy","url":"https://leitrimtourism.com/"},{"name":"Cyprus","Population":"1.37 million","Area":"9,251","Capital":"Nicosia","Language":"Greek and Turkish","EU Member Since":"2004","Website":"Home Page - Visit Cyprus","url":"https://www.visitcyprus.com/"}],"limerick":[{"name":"Limerick","Population":"209,536","Area":"2,756","Capital":"Limerick City","Website":"This is Limerick | Limerick.ie","url":"https://www.limerick.ie/"},{"name":"Germany","Population":"83.5 million","Area":"357,588","Capital":"Berlin","Language":"German","EU Member Since":"1958","Website":"Travel in Germany","url":"https://www.deutschland.de/en/travel-in-germany"}],"longford":[{"name":"Longford","Population":"46,634","Area":"1,091","Capital":"Longford Town","Website":"Visit Longford – explore scenic lakes, heritage sites, outdoor adventures, and unforgettable Irish escapes. - Visit Longford","url":"https://visitlongford.ie/"},{"name":"Hungary","Population":"9.6 million","Area":"93,030","Capital":"Budapest","Language":"Hungarian","EU Member Since":"2004","Website":"Visit Hungary","url":"https://visithungary.com/"}],"louth":[{"name":"Louth","Population":"139,100","Area":"826","Capital":"Dundalk","Website":"Visit Louth | Official Louth Tourism Website, Ireland","url":"https://www.visitlouth.ie/"},{"name":"Portugal","Population":"10.7 million","Area":"92,212","Capital":"Lisbon","Language":"Portuguese","EU Member Since":"1986","Website":"Homepage | www.visitportugal.com","url":"https://www.visitportugal.com/en"}],"mayo":[{"name":"Mayo","Population":"137,970","Area":"5,598.1","Capital":"Castlebar","Website":"Visit Mayo","url":"https://www.mayo.ie/en-ie/visit-mayo"},{"name":"Netherlands","Population":"18.1 million","Area":"42,531","Capital":"Amsterdam","Language":"Dutch","EU Member Since":"1958","Website":"Discover the Netherlands: cities, nature & culture - Holland.com","url":"https://www.holland.com/global/tourism"}],"meath":[{"name":"Meath","Population":"220,826","Area":"2,324","Capital":"Navan","Website":"Discover | Meath.ie","url":"https://www.meath.ie/discover"},{"name":"Italy","Population":"58.9 million","Area":"301,340","Capital":"Rome","Language":"Italian","EU Member Since":"1958","Website":"Discover Italy: Official Tourism Website - Italia.it","url":"https://www.italia.it/en"}],"monaghan":[{"name":"Monaghan","Population":"65,288","Area":"1,295","Capital":"Monaghan Town","Website":"Visit Monaghan - Comhairle Contae Mhuineacháin","url":"https://monaghantourism.com/"},{"name":"Finland","Population":"5.65 million","Area":"338,455","Capital":"Helsinki","Language":"Finnish","EU Member Since":"1995","Website":"Your Official Finland Travel Guide | Visit Finland","url":"https://www.visitfinland.com/en/"}],"offaly":[{"name":"Offaly","Population":"83,150","Area":"2,001","Capital":"Tullamore","Website":"Visit Offaly | Things to Do & Places to Visit in County Offaly","url":"https://www.visitoffaly.ie/"},{"name":"Belgium","Population":"11.9 million","Area":"30,667","Capital":"Brussels","Language":"Dutch, French and German","EU Member Since":"1958","Website":"Welcome to belgium.be | Belgium.be","url":"https://www.belgium.be/en"}],"roscommon":[{"name":"Roscommon","Population":"75,200","Area":"2,547","Capital":"Roscommon Town","Website":"Roscommon.ie - Roscommon.ie","url":"https://www.roscommon.ie/"},{"name":"Slovenia","Population":"2.11 million","Area":"20,271","Capital":"Ljubljana","Language":"Slovenian","EU Member Since":"2004","Website":"The official travel guide to Slovenia | I feel Slovenia","url":"https://www.slovenia.info/en"}],"sligo":[{"name":"Sligo","Population":"70,198","Area":"1,838","Capital":"Sligo Town","Website":"Visit Sligo | Official Local Authority Guide to Attractions, Activities & Itineraries | Sligo.ie","url":"https://sligo.ie/visit/"},{"name":"Lithuania","Population":"2.79 million","Area":"62,600","Capital":"Vilnius","Language":"Lithuanian","EU Member Since":"2004","Website":"Lithuania - an Open Country for Co-Creation | Lithuania","url":"https://lithuania.lt/"}],"tipperary":[{"name":"Tipperary","Population":"167,895","Area":"4,305","Capital":"Clonmel","Website":"Visit Tipperary | Things to Do, Places to Stay & Attractions in Ireland","url":"https://tipperary.com/"},{"name":"Bulgaria","Population":"6.44 million","Area":"110,996","Capital":"Sofia","Language":"Bulgarian","EU Member Since":"2007","Website":"Visit Bulgaria - Official Tourism Portal of Bulgaria","url":"https://visitbulgaria.com/"}],"waterford":[{"name":"Waterford","Population":"127,363","Area":"1,852","Capital":"Waterford City","Website":"Visit Waterford – Start Your Journey Where Ireland Begins","url":"https://visitwaterford.com/"},{"name":"Denmark","Population":"6.03 million","Area":"43,094","Capital":"Copenhagen","Language":"Danish","EU Member Since":"1973","Website":"Welcome to the official website of Denmark","url":"https://denmark.dk/"}],"westmeath":[{"name":"Westmeath","Population":"95,840","Area":"1,840","Capital":"Mullingar","Website":"Visit Westmeath, Ireland, Tourism and Travel Guide, Holidays and Weekend Breaks, Things to Do and See in Westmeath - Visit Westmeath","url":"https://www.visitwestmeath.ie/"},{"name":"Sweden","Population":"10.59 million","Area":"447,424","Capital":"Stockholm","Language":"Swedish","EU Member Since":"1995","Website":"Hej! Welcome to sweden.se – the official website of Sweden","url":"https://sweden.se/"}],"wexford":[{"name":"Wexford","Population":"163,919","Area":"2,377.1","Capital":"Wexford Town","Website":"Wexford Things to Do | Places to Visit in Wexford | Visit Wexford","url":"https://www.visitwexford.ie/"},{"name":"Slovakia","Population":"5.42 million","Area":"49,034","Capital":"Bratislava","Language":"Slovak","EU Member Since":"2004","Website":"Slovakia.travel","url":"https://slovakia.travel/en"}],"wicklow":[{"name":"Wicklow","Population":"155,000","Area":"2,027","Capital":"Wicklow Town","Website":"Welcome to Wicklow, the Garden of Ireland - Wicklow County Tourism","url":"https://visitwicklow.ie/"},{"name":"Spain","Population":"49 million","Area":"506,000","Capital":"Madrid","Language":"Spanish","EU Member Since":"1986","Website":"Spanish Tourism | Tourist information on Spain | spain.info","url":"https://www.spain.info/en/"}]};
  const artworkByCounty = {"carlow":[28,1],"cavan":[27,10],"clare":[31,3],"cork":[29,12],"donegal":[30,2],"dublin":[32,8],"galway":[33,11],"kerry":[34,24],"kildare":[35,5],"kilkenny":[36,25],"laois":[37,6],"leitrim":[38,7],"limerick":[39,9],"longford":[40,21],"louth":[41,22],"mayo":[42,26],"meath":[43,4],"monaghan":[44,23],"offaly":[45,13],"roscommon":[46,14],"sligo":[47,15],"tipperary":[48,16],"waterford":[49,17],"westmeath":[50,18],"wexford":[51,19],"wicklow":[52,20]};
  function addFactsheets(county) {
    const pair = factsheets[county.slug];
    if (!pair) return;
    const section = document.createElement("section");
    section.setAttribute("aria-label", "County and country factsheets");
    section.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr));gap:1.25rem;margin:2rem 0 3rem";
    pair.forEach((entry, index) => {
      const card = document.createElement("article");
      card.style.cssText = "background:#fffdf8;border:1px solid #d5ddd6;border-radius:1.25rem;padding:clamp(1.25rem,3vw,2rem);min-width:0;overflow-wrap:anywhere";
      const heading = document.createElement("h2");
      heading.textContent = entry.name + " facts";
      card.append(heading);
      const list = document.createElement("dl");
      const fields = index === 0 ? ["Province", "Capital", "Population", "Area"] : ["Capital", "Population", "Area", "Language", "EU Member Since"];
      fields.forEach(key => {
        let value = key === "Province" ? county.province : entry[key];
        if (!value) return;
        if (key === "Area" && !value.includes("km")) value += " km²";
        const row = document.createElement("div");
        row.style.cssText = "display:flex;flex-wrap:wrap;gap:.35rem;padding:.4rem 0;border-bottom:1px solid #e5e8e2";
        const term = document.createElement("dt"); term.style.fontWeight = "700"; term.textContent = key + ":";
        const description = document.createElement("dd"); description.style.margin = "0"; description.textContent = value;
        row.append(term, description); list.append(row);
      });
      card.append(list);
      if (entry.url && /^https?:\/\//.test(entry.url)) {
        const link = document.createElement("a"); link.href = entry.url; link.textContent = "Visit " + entry.name + " website"; link.className = "text-link"; card.append(link);
      }
      section.append(card);
    });
    profile.insertAdjacentElement("afterend", section);
    const designs = document.createElement("section");
    designs.setAttribute("aria-label", "County and country designs");
    designs.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr));gap:1.25rem;margin:2rem 0";
    pair.forEach((entry, index) => {
      const number = artworkByCounty[county.slug]?.[index];
      const container = document.createElement("div");
      container.style.cssText = "min-width:0";
      if (number) {
        const img = document.createElement("img");
        img.src = "../assets/pairing-artwork/" + number + ".png";
        img.alt = "Illustrated map and landmark for " + entry.name + ".";
        img.loading = "lazy";
        img.width = 1080;
        img.height = 1350;
        img.style.cssText = "display:block;width:100%;height:auto;border-radius:.75rem";
        container.append(img);
      } else {
        const note = document.createElement("p");
        note.textContent = entry.name + " design coming soon.";
        container.append(note);
      }
      designs.append(container);
    });
    profile.insertAdjacentElement("afterend", designs);
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
      addFactsheets(county);
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
