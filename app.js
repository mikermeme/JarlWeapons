const DATA_URL = "https://script.google.com/macros/s/AKfycbzuvWcMBQ6K5m78uQrKmJXI8tc1HbNaqZV2A276IpVcH0v8Up0VCyVD8MM48RuBQk3Gag/exec";

let weapons = [];
let enabledTypes = new Set();

fetch(DATA_URL)
  .then(res => res.json())
  .then(data => {
    weapons = data;

    const allTypes = [...new Set(weapons.map(w => w.type))];

    allTypes.forEach(type => enabledTypes.add(type));

    buildFilters(allTypes);
    renderWeapons();
  });

function buildFilters(types) {
  const filters = document.getElementById("filters");

  types.forEach(type => {
    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        enabledTypes.add(type);
      } else {
        enabledTypes.delete(type);
      }

      renderWeapons();
    });

    label.appendChild(checkbox);
    label.append(" " + type + " ");

    filters.appendChild(label);
  });
}

function renderWeapons() {
  const container = document.getElementById("weaponContainer");

  container.innerHTML = "";

  const grouped = {};

  weapons.forEach(w => {
    if (!enabledTypes.has(w.type)) return;

    if (!grouped[w.type]) {
      grouped[w.type] = [];
    }

    grouped[w.type].push(w);
  });

  Object.entries(grouped).forEach(([type, list]) => {
    const section = document.createElement("div");
    section.className = "type-group";

    const title = document.createElement("div");
    title.className = "type-title";
    title.textContent = type;

    const grid = document.createElement("div");
    grid.className = "weapon-grid";

    list.forEach(weapon => {
      const card = document.createElement("div");
      card.className = "weapon-card";

      const img = document.createElement("img");
      img.src = `sprites/${weapon.sprite}.png`;

      const badge = document.createElement("div");
      badge.className = "level-badge";
      badge.textContent = weapon.level;

      const name = document.createElement("div");
      name.className = "weapon-name";
      name.textContent = weapon.name;

      card.appendChild(img);
      card.appendChild(badge);
      card.appendChild(name);

      weapon.damages.forEach(dmg => {
        const line = document.createElement("div");
        line.className = "damage-line";

        line.textContent =
          `${dmg.total} ${dmg.type} (${dmg.base} + ${dmg.scale}×${weapon.level})`;

        card.appendChild(line);
      });

      grid.appendChild(card);
    });

    section.appendChild(title);
    section.appendChild(grid);

    container.appendChild(section);
  });
}