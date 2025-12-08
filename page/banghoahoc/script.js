/** @format */

// COLOR MAPPING
function getColorForType(type) {
  const colors = {
    // Khớp với chú thích "Kim loại nhóm A" (#c2e69d)
    alkali: "#c2e69d",

    // Khớp với chú thích "Kim loại chuyển tiếp" (#a0d468)
    transition: "#a0d468",

    // Khớp với chú thích "Á kim" (#eb9c52)
    metalloid: "#eb9c52",

    // Khớp với chú thích "Phi kim" (#e19ca8)
    nonmetal: "#e19ca8",

    // Khớp với chú thích "Khí hiếm" (#e0c210)
    noble: "#e0c210",

    // Lanthanide & Actinide (Lấy theo màu xanh Teal của ảnh bạn gửi trước đó)
    lanthanide: "#72b2ee",
    actinide: "#72b2ee",
  };

  // Trả về màu tương ứng, nếu không tìm thấy thì trả về màu mặc định (Kim loại nhóm A)
  return colors[type] || "#c2e69d";
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

        // Chỉ cần set thuộc tính lọc
        cell.setAttribute("data-period", "6");
        cell.setAttribute("data-group", "IIIB");

        // CẬP NHẬT: Thêm class "number-bg-dark" vào div đầu tiên
        cell.innerHTML = `
        <div class="placeholder-range number-bg-dark">57-71</div>
        <div class="placeholder-symbol">La-Lu</div>
        <div class="placeholder-name">Lanthanide**</div>
      `;
        tableContainer.appendChild(cell);
      } else if (z === "ACT") {
        const cell = document.createElement("div");
        cell.className = "element-cell placeholder-cell";

        // Chỉ cần set thuộc tính lọc
        cell.setAttribute("data-period", "7");
        cell.setAttribute("data-group", "IIIB");

        // CẬP NHẬT: Thêm class "number-bg-dark" vào div đầu tiên
        cell.innerHTML = `
        <div class="placeholder-range number-bg-dark">89-103</div>
        <div class="placeholder-symbol">Ac-Lr</div>
        <div class="placeholder-name">Actinide***</div>
      `;
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
  const formulaInput = document.getElementById("formulaInput");
  const resultDiv = document.getElementById("molarMassResult");
  const formula = formulaInput.value.trim(); // Xóa khoảng trắng thừa đầu đuôi

  // 1. Kiểm tra đầu vào trống
  if (!formula) {
    resultDiv.textContent = "Vui lòng nhập công thức hóa học (Ví dụ: H2SO4).";
    resultDiv.style.color = "#d97706"; // text-amber-600
    return;
  }

  try {
    // 2. Kiểm tra dữ liệu elements có tồn tại không
    if (typeof elements === "undefined" || !Array.isArray(elements)) {
      throw new Error("Dữ liệu nguyên tố chưa được tải. Hãy tải lại trang.");
    }

    // 3. Tạo map tra cứu khối lượng (Đặt trong try để bắt lỗi nếu có)
    const massMap = new Map();
    elements.forEach(el => {
      massMap.set(el.symbol, el.mass);
    });

    // 4. Tính toán
    const totalMass = parseFormula(formula, massMap);

    // 5. Kiểm tra kết quả = 0 (Thường do nhập sai chữ hoa/thường)
    if (totalMass === 0) {
      throw new Error(
        "Không tìm thấy nguyên tố hợp lệ. Hãy chắc chắn bạn VIẾT HOA chữ cái đầu của nguyên tố (Ví dụ: 'Na' thay vì 'na', 'O' thay vì 'o')."
      );
    }

    resultDiv.innerHTML = `Kết quả: <span class="text-purple-700">${formula}</span> = <span class="text-2xl text-red-600">${formatNumber(
      totalMass.toFixed(4)
    )}</span> g/mol`;
    resultDiv.style.color = "#1f2937";
  } catch (error) {
    console.error(error); // Log lỗi ra console để dễ debug
    resultDiv.textContent = `Lỗi: ${error.message}`;
    resultDiv.style.color = "#ef4444"; // text-red-500
  }
}

function parseFormula(formula, massMap) {
  let totalMass = 0;
  // Loại bỏ tất cả khoảng trắng giữa công thức
  const cleanFormula = formula.replace(/\s/g, "");

  // Regex giải thích:
  // (\([^\)]+\)\d*) : Bắt nhóm trong ngoặc, vd: (OH)2
  // ([A-Z][a-z]*)   : Bắt nguyên tố, BẮT BUỘC chữ cái đầu viết hoa (VD: H, He)
  // (\d*)           : Bắt số lượng nguyên tử (VD: 2, 4)
  const regex = /(\([^\)]+\)\d*)|([A-Z][a-z]*)(\d*)/g;

  let match;
  let lastIndex = 0; // Dùng để kiểm tra xem có ký tự nào bị bỏ qua không

  while ((match = regex.exec(cleanFormula)) !== null) {
    // Kiểm tra tính hợp lệ: Nếu regex nhảy cóc qua các ký tự không hợp lệ (như chữ thường 'h2o')
    if (match.index !== lastIndex) {
      // Phát hiện ký tự lạ không khớp pattern
      // Bạn có thể throw Error ở đây nếu muốn chặt chẽ, hoặc để nó tự bỏ qua
    }
    lastIndex = regex.lastIndex;

    if (match[1]) {
      // TRƯỜNG HỢP 1: Nhóm trong ngoặc (VD: (OH)2 )
      // Tách nội dung trong ngoặc và số lượng
      const groupMatch = match[1].match(/\(([^\)]+)\)(\d*)/);
      if (groupMatch) {
        const groupFormula = groupMatch[1];
        const groupCount = groupMatch[2] ? parseInt(groupMatch[2]) : 1;
        // Đệ quy để tính khối lượng trong ngoặc
        totalMass += parseFormula(groupFormula, massMap) * groupCount;
      }
    } else if (match[2]) {
      // TRƯỜNG HỢP 2: Nguyên tố đơn lẻ (VD: H2, Cu)
      const elementSymbol = match[2];
      const elementCount = match[3] ? parseInt(match[3]) : 1;

      if (!massMap.has(elementSymbol)) {
        throw new Error(
          `Nguyên tố '${elementSymbol}' không tồn tại trong bảng tuần hoàn`
        );
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
<div class="element-number" style="background-color: ${darkerColor};">${
    element.z
  }</div>
<div class="element-mass">${formatNumber(element.mass)}</div>
<div class="element-symbol">${element.symbol}</div>
<div class="element-name">${element.name}</div>
`;

  cell.onclick = () => showElementDetails(element);
  return cell;
}

// SHOW ELEMENT DETAILS
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
    
    <div class="grid md:grid-cols-2 gap-6 items-start"> 
      
      <div class="md:col-span-2">
        <h3 class="text-xl font-bold mb-4 text-purple-700 border-b-2 border-purple-100 pb-2">Thông tin cơ bản</h3>
        <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
           <p class="flex justify-between"><strong>Số hiệu nguyên tử:</strong> <span>${
             element.z
           }</span></p>
           <p class="flex justify-between"><strong>Ký hiệu hóa học:</strong> <span>${
             element.symbol
           }</span></p>
           <p class="flex justify-between"><strong>Tên nguyên tố:</strong> <span>${
             element.name
           }</span></p>
           <p class="flex justify-between"><strong>Nguyên tử khối trung bình:</strong> <span>${formatNumber(
             element.mass
           )}</span></p>
           <p class="flex justify-between"><strong>Độ âm điện:</strong> <span>${
             formatNumber(element.electronegativity) || "N/A"
           }</span></p>
           <p class="flex justify-between"><strong>Chu kì:</strong> <span>${
             element.period
           }</span></p>
           <p class="flex justify-between"><strong>Nhóm:</strong> <span>${
             element.group
           }</span></p>
        </div>
        <div class="mt-4 pt-2 border-t border-gray-100">
            <p class="text-sm text-gray-500">Cấu hình electron:</p>
            <p class="font-mono font-semibold text-purple-600 text-lg">${
              element.config
            }</p>
        </div>
      </div>

      <div class="md:col-span-2 flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 shadow-inner mt-4">
        <h3 class="text-xl font-bold mb-4 text-purple-700">Mô hình nguyên tử</h3>
        
        <svg viewBox="0 0 400 400" class="w-full max-w-[450px] h-auto overflow-visible">
          ${drawAtomModel(element)}
        </svg>
      </div>

    </div>
  `;

  modal.style.display = "block";
}
// --- DRAW ATOM MODEL (CẬP NHẬT KÍCH THƯỚC LỚN) ---
function drawAtomModel(element) {
  // SỬA: Tâm hình tròn đổi thành 200 (vì khung là 400x400)
  const cx = 200;
  const cy = 200;

  const baseRadius = 40;
  const spacing = 22; // Tăng khoảng cách lên một chút cho thoáng

  let svg = "";

  // 1. ĐỊNH NGHĨA GRADIENT
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

  // 2. VẼ CÁC LỚP
  const shells = getElectronShells(element);

  shells.forEach((electronCount, index) => {
    const radius = baseRadius + index * spacing;

    // Vòng quỹ đạo
    svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#94a3b8" stroke-width="1" opacity="0.6" />`;

    // Electron
    const startAngleOffset = -90;
    for (let i = 0; i < electronCount; i++) {
      const angle = startAngleOffset + (i * 360) / electronCount;
      const radian = (angle * Math.PI) / 180;

      const x = cx + radius * Math.cos(radian);
      const y = cy + radius * Math.sin(radian);

      // Tăng kích thước electron lên r=5 cho dễ nhìn
      svg += `<circle cx="${x}" cy="${y}" r="5" fill="url(#electronGrad)" />`;
    }
  });

  // 3. VẼ HẠT NHÂN
  svg += `<circle cx="${cx}" cy="${cy}" r="25" fill="url(#nucleusGrad)" stroke="#b91c1c" stroke-width="2" />`;
  svg += `<text x="${cx}" y="${cy}" dy=".35em" text-anchor="middle" fill="white" font-size="16" font-weight="bold" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">+${element.z}</text>`;

  return svg;
}
function formatNumber(num) {
  if (num === null || num === undefined) return "N/A";
  // Chuyển thành string rồi thay dấu chấm bằng phẩy
  return num.toString().replace(".", ",");
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
