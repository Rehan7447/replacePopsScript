function transformHTMLContent(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const businesses = Array.from(doc.querySelectorAll(".gear"));
  
    const transformedHTML = businesses
      .map((business) => {
        const id = business.getAttribute("id") || "";
        const name = business.querySelector("h3.mapname")?.textContent.trim() || "";
  
        // Collect all categories
        const categories = Array.from(business.querySelectorAll("p.business"))
          .map(p => p.textContent.trim());
  
        // Collect all info from either p.info or p.phara
        const infos = [
          ...Array.from(business.querySelectorAll("p.info")).map(p => p.textContent.trim()),
          ...Array.from(business.querySelectorAll("p.phara")).map(p => p.textContent.trim())
        ];
  
        // Create multiple gearDetails divs
        const gearDetailsDivs = categories.length > 0 || infos.length > 0
          ? Array.from({ length: Math.max(categories.length, infos.length) })
              .map((_, index) => `
                <div class="gearDetails">
                  ${categories[index] ? `<p class="business">${categories[index]}</p>` : ''}
                  ${infos[index] ? `<p class="info">${infos[index]}</p>` : ''}
                </div>
              `)
              .join('')
          : '';
  
        const address = business.querySelector("p.address")?.textContent.replace(/^Address:/, "").trim() || "";
        const town = business.querySelector("p.town")?.textContent.replace(/^Town:/, "").trim() || "";
        const phone = business.querySelector("p.Phone")?.textContent.replace(/^Phone:/, "").trim() || "";
        const websiteElement = business.querySelector("p.web a");
        const website = websiteElement
          ? `<a href="${websiteElement.href}" target="_blank">${websiteElement.textContent}</a>`
          : "";
        const discount = business.querySelector("p.discount")?.textContent.replace(/^Shoppers Discount:/, "").trim() || business.querySelector("p.discount-1")?.textContent.replace(/^Shoppers Discount:/, "").trim() || "";
        const exp = business.querySelector("p.exp")?.textContent || "";
  
        return `
          <div class="gear" id="${id}">
              ${name || gearDetailsDivs ? `
              <div class="gearTop">
                  ${name ? `<p class="mapname">${name}</p>` : ''}
                  ${gearDetailsDivs}
              </div>` : ''}
              ${
                address || phone || website || discount || exp
                  ? 
                  `<div class="contacts">
                    ${phone ? `<p class="Phone"><img class="gearIcon" src="./images/popup-icons/phone.svg"/><span>${phone}</span></p>` : ''}
                    ${(town || address) ? `<p class="Address"><img class="gearIcon" src="./images/popup-icons/location.svg"/><span>${address} ${town}</span></p>` : ''}
                    ${website ? `<p class="web"><img class="gearIcon" src="./images/popup-icons/globe.svg"/><span>${website}</span></p>` : ''}
                    ${discount ? `<p class="discount"><img class="gearIcon" src="./images/popup-icons/discount.svg"/><span>${discount}</span></p>` : ''}
                    ${exp ? `<p class="exp"><img class="gearIcon" src="./images/popup-icons/calendar.svg"/><span>${exp}</span></p>` : ''}
                  </div>` : ''
              }
          </div>
          `;
      })
      .join("");
  
    return transformedHTML;
  }
  

const button = document.getElementById("extract");
button.addEventListener("click", async () => {
  const htmlContent = document.getElementById("data").value;
  const businessData = transformHTMLContent(htmlContent);
  document.getElementById("output").value = businessData;
});
