/** @format */

// COLOR MAPPING
function getColorForType(type) {
  const colors = {
    metal: "#88C0BE",
    nonmetal: "#E19CA8",
    noble: "#E0C210",
  };
  return colors[type] || "#88C0BE";
}
function darkenHexColor(hex, percent) {
  if (!hex) return "#ccc";
  hex = hex.replace(/^\s*#|\s*$/g, "");
  if (hex.length === 3)
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
// CREATE PERIODIC TABLE
function clearHeaderHighlights() {
  const headers = document.querySelectorAll(".group-header, .period-label");
  headers.forEach(h => h.classList.remove("header-active"));
}
function createPeriodicTable() {
  const headersContainer = document.getElementById("groupHeaders");
  const tableContainer = document.getElementById("periodicTable");
  const bottomRowsContainer = document.getElementById("bottomRowsContainer");

  headersContainer.innerHTML = "";
  tableContainer.innerHTML = "";
  bottomRowsContainer.innerHTML = "";

  // 1. VẼ BẢNG CHÍNH (GRID)
  const layout = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10],
    [11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    [55, 56, "LAN", 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86],
    [
      87,
      88,
      "ACT",
      104,
      105,
      106,
      107,
      108,
      109,
      110,
      111,
      112,
      113,
      114,
      115,
      116,
      117,
      118,
    ],
  ];

  // --- XỬ LÝ HEADER NHÓM (CỘT DỌC) ---
  const groups = [
    "CK/N",
    "IA",
    "IIA",
    "IIIB",
    "IVB",
    "VB",
    "VIB",
    "VIIB",
    "VIIIB",
    "",
    "",
    "IB",
    "IIB",
    "IIIA",
    "IVA",
    "VA",
    "VIA",
    "VIIA",
    "VIIIA",
  ];

  groups.forEach((group, i) => {
    if (i > 8 && i <= 10) return; // Bỏ qua các cột trống của nhóm VIIIB

    const header = document.createElement("div");
    header.className = "group-header";
    header.textContent = group;

    // Merge cột cho nhóm VIIIB
    if (group === "VIIIB") header.style.gridColumn = "9 / 12";

    // == TÍNH NĂNG MỚI: CLICK FILTER ==
    header.onclick = function () {
      clearHeaderHighlights(); // Xóa highlight cũ

      if (group === "CK/N") {
        // Nếu bấm vào góc CK/N -> Reset về hiện tất cả
        filterByPeriod(0);
        // Không add class active để trả về trạng thái bình thường
      } else {
        // Filter theo nhóm
        filterByGroup(group);
        this.classList.add("header-active"); // Highlight header vừa bấm
      }
    };

    headersContainer.appendChild(header);
  });

  // --- VẼ CÁC Ô GRID VÀ NHÃN CHU KÌ (HÀNG NGANG) ---
  layout.forEach((row, rowIndex) => {
    // Label Chu kỳ (1, 2, 3...)
    const periodNum = rowIndex + 1;
    const periodLabel = document.createElement("div");
    periodLabel.className = "period-label";
    periodLabel.textContent = periodNum;

    // == TÍNH NĂNG MỚI: CLICK FILTER ==
    periodLabel.onclick = function () {
      clearHeaderHighlights(); // Xóa highlight cũ
      filterByPeriod(periodNum); // Filter theo chu kì
      this.classList.add("header-active"); // Highlight số chu kì vừa bấm
    };

    tableContainer.appendChild(periodLabel);

    // Vẽ các ô nguyên tố (Giữ nguyên logic cũ)
    row.forEach(z => {
      if (z === 0) {
        tableContainer.appendChild(document.createElement("div"));
      } else if (z === "LAN") {
        const cell = document.createElement("div");
        cell.className = "element-cell placeholder-cell";
        cell.innerHTML = `<div class="placeholder-range">57-71</div><div class="placeholder-symbol">La-Lu</div><div class="placeholder-name">Lanthanide</div>`;
        tableContainer.appendChild(cell);
      } else if (z === "ACT") {
        const cell = document.createElement("div");
        cell.className = "element-cell placeholder-cell";
        cell.innerHTML = `<div class="placeholder-range">89-103</div><div class="placeholder-symbol">Ac-Lr</div><div class="placeholder-name">Actinide</div>`;
        tableContainer.appendChild(cell);
      } else {
        const element = elements.find(el => el.z === z);
        if (element) tableContainer.appendChild(createElementCell(element));
      }
    });
  });

  // 2. VẼ 2 HÀNG PHỤ (LANTHANIDE/ACTINIDE) - Giữ nguyên
  function createBottomRow(labelName, startZ, endZ) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "bottom-row";
    const labelDiv = document.createElement("div");
    labelDiv.className = "side-label";
    labelDiv.textContent =
      labelName + (labelName === "Lanthanide" ? "**" : "***");
    rowDiv.appendChild(labelDiv);
    for (let z = startZ; z <= endZ; z++) {
      const element = elements.find(el => el.z === z);
      if (element) {
        const cell = createElementCell(element);
        rowDiv.appendChild(cell);
      }
    }
    bottomRowsContainer.appendChild(rowDiv);
  }
  createBottomRow("Lanthanide", 57, 71);
  createBottomRow("Actinide", 89, 103);
}

function calculateMolarMass() {
  const formula = document.getElementById("formulaInput").value;
  const resultDiv = document.getElementById("molarMassResult");

  // Tạo một "map" để tra cứu khối lượng nhanh
  // Bạn chỉ cần chạy cái này một lần nếu tối ưu, nhưng để đây cho đơn giản
  const massMap = new Map();
  elements.forEach(el => {
    massMap.set(el.symbol, el.mass);
  });

  try {
    const totalMass = parseFormula(formula, massMap);
    resultDiv.textContent = `Kết quả: ${formula} = ${totalMass.toFixed(
      4
    )} g/mol`;
    resultDiv.style.color = "#1f2937"; // text-gray-800
  } catch (error) {
    resultDiv.textContent = `Lỗi: ${error.message}. Hãy kiểm tra lại công thức.`;
    resultDiv.style.color = "#ef4444"; // text-red-500
  }
}

function parseFormula(formula, massMap) {
  let totalMass = 0;

  // Regex để tìm các nhóm (trong ngoặc) hoặc các nguyên tố
  const regex = /(\([^\)]+\)\d*)|([A-Z][a-z]*)(\d*)/g;
  let match;

  // Xử lý chuỗi công thức không có khoảng trắng
  const cleanFormula = formula.replace(/\s/g, "");

  while ((match = regex.exec(cleanFormula)) !== null) {
    if (match[1]) {
      // Trường hợp 1: Nhóm trong ngoặc, ví dụ: (OH)3
      const groupMatch = match[1].match(/\(([^\)]+)\)(\d*)/);
      const groupFormula = groupMatch[1];
      const groupCount = groupMatch[2] ? parseInt(groupMatch[2]) : 1;
      totalMass += parseFormula(groupFormula, massMap) * groupCount;
    } else {
      // Trường hợp 2: Nguyên tố, ví dụ: H2 hoặc Fe
      const elementSymbol = match[2];
      const elementCount = match[3] ? parseInt(match[3]) : 1;

      if (!massMap.has(elementSymbol)) {
        throw new Error(`Nguyên tố '${elementSymbol}' không tồn tại.`);
      }
      totalMass += massMap.get(elementSymbol) * elementCount;
    }
  }
  return totalMass;
}
// UPDATED: Cấu trúc HTML phẳng, hiện đại
function createElementCell(element) {
  const cell = document.createElement("div");
  cell.className = "element-cell";

  // Lấy màu gốc
  const baseColor = element.color || getColorForType(element.type);
  // Tính màu đậm hơn 20% cho ô số hiệu
  const darkerColor = darkenHexColor(baseColor, 20);

  cell.style.backgroundColor = baseColor;
  cell.setAttribute("data-period", element.period);
  cell.setAttribute("data-group", element.group);

  cell.innerHTML = `
<div class="element-number" style="background-color: ${darkerColor};">${element.z}</div>
<div class="element-mass">${element.mass}</div>
<div class="element-symbol">${element.symbol}</div>
<div class="element-name">${element.name}</div>
`;

  cell.onclick = () => showElementDetails(element);
  return cell;
}

// SHOW ELEMENT DETAILS
// SHOW ELEMENT DETAILS
function showElementDetails(element) {
  const modal = document.getElementById("elementModal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
<h2 class="text-4xl font-black text-center mb-6" style="color: ${
    element.color || getColorForType(element.type)
  }">
${element.symbol} - ${element.name}
</h2>
<div class="grid md:grid-cols-2 gap-8 items-center"> <div>
<h3 class="text-xl font-bold mb-4 text-purple-700 border-b-2 border-purple-100 pb-2">Thông tin cơ bản</h3>
<div class="space-y-2 text-gray-700">
<p class="flex justify-between"><strong>Số hiệu nguyên tử:</strong> <span>${
    element.z
  }</span></p>
<p class="flex justify-between"><strong>Ký hiệu:</strong> <span>${
    element.symbol
  }</span></p>
<p class="flex justify-between"><strong>Tên nguyên tố:</strong> <span>${
    element.name
  }</span></p>
<p class="flex justify-between"><strong>Nguyên tử khối:</strong> <span>${
    element.mass
  }</span></p>
<p class="flex justify-between"><strong>Độ âm điện:</strong> <span>${
    element.electronegativity || "N/A"
  }</span></p>
<p class="flex justify-between"><strong>Chu kì:</strong> <span>${
    element.period
  }</span></p>
<p class="flex justify-between"><strong>Nhóm:</strong> <span>${
    element.group
  }</span></p>
<div class="mt-2 pt-2 border-t border-gray-100">
<p class="text-sm text-gray-500">Cấu hình electron:</p>
<p class="font-mono font-semibold text-purple-600">${element.config}</p>
</div>
</div>
</div>

<div class="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4 shadow-inner">
<h3 class="text-xl font-bold mb-2 text-purple-700">Mô hình nguyên tử</h3>
<svg viewBox="0 0 300 300" class="w-[300px] h-[300px] overflow-visible">
${drawAtomModel(element)}
</svg>
</div>

</div>
`;

  modal.style.display = "block";
}

// DRAW ATOM MODEL
// --- DRAW ATOM MODEL (FIX: THẲNG HÀNG & CÂN ĐỐI) ---
function drawAtomModel(element) {
  const cx = 150; // Tâm X
  const cy = 150; // Tâm Y
  const containerSize = 300;

  // Cấu hình kích thước
  const maxRadius = 135;
  const baseRadius = 40;

  let svg = "";

  // 1. ĐỊNH NGHĨA GRADIENT (Giữ nguyên)
  svg += `
<defs>
<radialGradient id="nucleusGrad" cx="30%" cy="30%" r="70%">
<stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
<stop offset="100%" style="stop-color:#c0392b;stop-opacity:1" />
</radialGradient>
<radialGradient id="electronGrad" cx="30%" cy="30%" r="70%">
<stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
<stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
</radialGradient>
</defs>
`;

  // 2. TÍNH TOÁN KHOẢNG CÁCH (Giữ nguyên logic chống tràn)
  const shells = getElectronShells(element);
  const numShells = shells.length;

  let spacing = 0;
  if (numShells > 1) {
    spacing = (maxRadius - baseRadius) / (numShells - 1);
  }

  // 3. VẼ CÁC LỚP
  shells.forEach((electronCount, index) => {
    const radius = baseRadius + index * spacing;

    // Vẽ vòng tròn quỹ đạo
    svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity="0.6" />`;

    // Vẽ các Electron
    // --- SỬA ĐỔI TẠI ĐÂY ---
    // Thay vì xoay lệch (index % 2...), ta cố định tất cả bắt đầu từ góc -90 độ (đỉnh 12h)
    const startAngleOffset = -90;

    for (let i = 0; i < electronCount; i++) {
      // Chia đều 360 độ cho số lượng electron
      const angle = startAngleOffset + (i * 360) / electronCount;
      const radian = (angle * Math.PI) / 180;

      const x = cx + radius * Math.cos(radian);
      const y = cy + radius * Math.sin(radian);

      svg += `<circle cx="${x}" cy="${y}" r="4" fill="url(#electronGrad)" />`;
    }
  });

  // 4. VẼ HẠT NHÂN
  svg += `<circle cx="${cx}" cy="${cy}" r="22" fill="url(#nucleusGrad)" stroke="#b91c1c" stroke-width="2" />`;
  svg += `<text x="${cx}" y="${cy}" dy=".35em" text-anchor="middle" fill="white" font-size="14" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">+${element.z}</text>`;

  return svg;
}

// GET ELECTRON SHELLS
function getElectronShells(element) {
  const z = element.z;
  const period = element.period;
  const maxPerShell = [2, 8, 8, 18, 18, 32, 32];
  const shells = [];
  let remaining = z;

  for (let i = 0; i < period; i++) {
    if (i === period - 1) {
      shells.push(remaining);
      break;
    }
    const fill = Math.min(remaining, maxPerShell[i]);
    shells.push(fill);
    remaining -= fill;
  }

  return shells;
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("elementModal").style.display = "none";
}

// FILTER BY PERIOD
function filterByPeriod(period) {
  const cells = document.querySelectorAll(".element-cell");
  cells.forEach(cell => {
    if (period === 0) {
      cell.style.opacity = "1";
      cell.classList.remove("active-filter");
    } else if (cell.getAttribute("data-period") == period) {
      cell.style.opacity = "1";
      cell.classList.add("active-filter");
    } else {
      cell.style.opacity = "0.3";
      cell.classList.remove("active-filter");
    }
  });
}

// FILTER BY GROUP
function filterByGroup(group) {
  const cells = document.querySelectorAll(".element-cell");
  cells.forEach(cell => {
    if (cell.getAttribute("data-group") === group) {
      cell.style.opacity = "1";
      cell.classList.add("active-filter");
    } else {
      cell.style.opacity = "0.3";
      cell.classList.remove("active-filter");
    }
  });
}

// CLOSE MODAL ON OUTSIDE CLICK
window.onclick = function (event) {
  const modal = document.getElementById("elementModal");
  if (event.target === modal) {
    closeModal();
  }
};

// INITIALIZE
createPeriodicTable();
function openTab(event, tabName) {
  // Lấy tất cả nội dung tab và ẩn đi
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach(tab => {
    tab.classList.remove("active");
  });

  // Lấy tất cả các nút tab và bỏ trạng thái active
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach(button => {
    button.classList.remove("active");
  });

  // Hiển thị tab được chọn và đặt nút của nó là active
  document.getElementById(tabName).classList.add("active");
  event.currentTarget.classList.add("active");
}
