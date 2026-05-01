const { jsPDF } = window.jspdf;
const OSLO_TIME_ZONE = "Europe/Oslo";
const STORAGE_KEY = "timeregistrering:v1";
const DAY_NAMES = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
const WEEKDAY_INPUT_NAMES = DAY_NAMES.slice(0, 5);

let weeksData = [];
let savedState = loadSavedState();

function loadSavedState() {
    try {
        const rawState = localStorage.getItem(STORAGE_KEY);
        return rawState ? JSON.parse(rawState) : { months: {} };
    } catch {
        return { months: {} };
    }
}

function ensureSavedStateShape() {
    if (!savedState || typeof savedState !== "object") {
        savedState = {};
    }

    if (!savedState.months || typeof savedState.months !== "object") {
        savedState.months = {};
    }
}

function saveState() {
    ensureSavedStateShape();

    const monthSelect = document.getElementById("month");
    const monthValue = monthSelect ? monthSelect.value : "";

    savedState.selectedMonth = monthValue;
    savedState.defaultHours = document.getElementById("defaultHours").value;
    savedState.customerName = document.getElementById("customerName").value;
    savedState.projectName = document.getElementById("projectName").value;

    if (monthValue) {
        const monthState = savedState.months[monthValue] || { days: {} };
        monthState.days = monthState.days || {};

        weeksData.forEach((week) => {
            week.days.forEach((day) => {
                monthState.days[day.dateKey] = day.hours;
            });
        });

        savedState.months[monthValue] = monthState;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    } catch {
        // Ignore storage failures; the form should keep working without persistence.
    }
}

function getSavedDayHours(monthValue, dateKey) {
    ensureSavedStateShape();
    const savedHours = savedState.months[monthValue]?.days?.[dateKey];
    return typeof savedHours === "number" && Number.isFinite(savedHours) ? savedHours : null;
}

function areHoursModified(hours, defaultHours) {
    return Number(hours) !== Number(defaultHours);
}

function updateModifiedState(input, dayData) {
    if (!input || !dayData) {
        return;
    }

    input.classList.toggle("modified", areHoursModified(dayData.hours, dayData.defaultHours));
}

function updateMonthTheme(monthValue) {
    const month = monthValue.split("-")[1];

    document.body.classList.forEach((className) => {
        if (className.startsWith("month-")) {
            document.body.classList.remove(className);
        }
    });

    if (month) {
        document.body.classList.add(`month-${month}`);
    }
}

function formatDateKey(date) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: OSLO_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    return formatter.format(date);
}

function createUtcDate(year, month, day) {
    return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date, days) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
}

function getEasterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return createUtcDate(year, month, day);
}

function getNorwegianPublicHolidays(year) {
    const holidays = new Map([
        [`${year}-01-01`, "1. nyttårsdag"],
        [`${year}-05-01`, "Arbeidernes dag"],
        [`${year}-05-17`, "Grunnlovsdag"],
        [`${year}-12-25`, "1. juledag"],
        [`${year}-12-26`, "2. juledag"]
    ]);

    const easterSunday = getEasterSunday(year);
    const movableHolidayOffsets = [
        { offset: -3, name: "Skjærtorsdag" },
        { offset: -2, name: "Langfredag" },
        { offset: 0, name: "1. påskedag" },
        { offset: 1, name: "2. påskedag" },
        { offset: 39, name: "Kristi himmelfartsdag" },
        { offset: 49, name: "1. pinsedag" },
        { offset: 50, name: "2. pinsedag" }
    ];

    for (const { offset, name } of movableHolidayOffsets) {
        holidays.set(formatDateKey(addDays(easterSunday, offset)), name);
    }

    return holidays;
}

function getOsloDateInfo(date) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: OSLO_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short"
    });

    const parts = formatter.formatToParts(date);
    const lookup = new Map(parts.map((part) => [part.type, part.value]));
    const year = Number(lookup.get("year"));
    const month = lookup.get("month");
    const day = lookup.get("day");
    const weekday = lookup.get("weekday") || "";

    return {
        dateKey: `${year}-${month}-${day}`,
        weekday,
        year
    };
}

function isWeekendInOslo(date) {
    const { weekday } = getOsloDateInfo(date);
    return weekday === "Sat" || weekday === "Sun";
}

function isNorwegianPublicHoliday(date) {
    const { dateKey, year } = getOsloDateInfo(date);
    return getNorwegianPublicHolidays(year).get(dateKey) || "";
}

function initMonthSelector() {
    const monthSelect = document.getElementById("month");
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const months = [
        "Januar", "Februar", "Mars", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Desember"
    ];

    for (let i = 0; i < 12; i++) {
        const option = document.createElement("option");
        option.value = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
        option.textContent = `${months[i]} ${currentYear}`;
        if (savedState.selectedMonth === option.value || (!savedState.selectedMonth && i === currentMonth)) {
            option.selected = true;
        }
        monthSelect.appendChild(option);
    }

    monthSelect.addEventListener("change", generateWeeks);
}

function initSavedFields() {
    const defaultHoursInput = document.getElementById("defaultHours");
    const customerNameInput = document.getElementById("customerName");
    const projectNameInput = document.getElementById("projectName");

    if (savedState.defaultHours !== undefined) {
        defaultHoursInput.value = savedState.defaultHours;
    }

    if (savedState.customerName !== undefined) {
        customerNameInput.value = savedState.customerName;
    }

    if (savedState.projectName !== undefined) {
        projectNameInput.value = savedState.projectName;
    }

    defaultHoursInput.addEventListener("change", saveState);
    customerNameInput.addEventListener("input", saveState);
    projectNameInput.addEventListener("input", saveState);
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getWeeksInMonth(year, month) {
    const weeks = new Map();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let currentDate = new Date(firstDay);

    while (currentDate <= lastDay) {
        const weekNum = getWeekNumber(currentDate);

        if (!weeks.has(weekNum)) {
            weeks.set(weekNum, []);
        }

        weeks.get(weekNum).push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const weeksArray = [];
    weeks.forEach((days, weekNumber) => {
        weeksArray.push({
            weekNumber,
            days: days.sort((a, b) => a.getDate() - b.getDate())
        });
    });

    return weeksArray.sort((a, b) => a.weekNumber - b.weekNumber);
}

function generateWeeks() {
    const monthValue = document.getElementById("month").value;
    const [year, month] = monthValue.split("-").map(Number);
    const weeks = getWeeksInMonth(year, month - 1);
    const weekContainer = document.getElementById("weekContainer");
    const defaultHours = parseFloat(document.getElementById("defaultHours").value) || 8;

    updateMonthTheme(monthValue);
    weekContainer.innerHTML = "";
    weeksData = [];

    weeks.forEach((weekInfo, weekIndex) => {
        const week = weekInfo.days;
        const weekDiv = document.createElement("div");
        weekDiv.className = "week";

        const weekHeader = document.createElement("div");
        weekHeader.className = "week-header";

        weekHeader.innerHTML = `
            <span>Uke ${weekInfo.weekNumber}</span>
            <span class="week-total" id="week-${weekIndex}-total">0 timer</span>
        `;

        const daysGrid = document.createElement("div");
        daysGrid.className = "days-grid";

        const weekData = { weekNumber: weekInfo.weekNumber, days: [] };

        for (let i = 0; i < 7; i++) {
            const dayDiv = document.createElement("div");
            dayDiv.className = "day-input";

            const targetDayOfWeek = i === 6 ? 0 : i + 1;
            const date = week.find((d) => d.getDay() === targetDayOfWeek);

            if (date) {
                const isWeekend = isWeekendInOslo(date);
                const holidayName = isNorwegianPublicHoliday(date);
                const isHoliday = Boolean(holidayName);
                const shouldHighlightHoliday = isHoliday && !isWeekend;
                const defaultValue = isWeekend || isHoliday ? 0 : defaultHours;
                const dateKey = formatDateKey(date);
                const savedHours = getSavedDayHours(monthValue, dateKey);
                const hours = savedHours ?? defaultValue;

                const dayData = {
                    name: DAY_NAMES[i],
                    dateKey,
                    date: date.getDate(),
                    fullDate: date,
                    hours,
                    defaultHours: defaultValue,
                    isWeekend,
                    isHoliday,
                    shouldHighlightHoliday,
                    holidayName
                };
                weekData.days.push(dayData);

                dayDiv.innerHTML = `
                    <label class="day-label ${isWeekend ? "weekend" : ""} ${shouldHighlightHoliday ? "holiday" : ""}">${DAY_NAMES[i]} ${date.getDate()}</label>
                    <input type="number"
                           id="week-${weekIndex}-day-${i}"
                           class="${isWeekend ? "weekend" : ""} ${shouldHighlightHoliday ? "holiday" : ""} ${areHoursModified(hours, defaultValue) ? "modified" : ""}"
                           min="0"
                           max="24"
                           step="1"
                           value="${hours}"
                           oninput="updateTotals(${weekIndex}, ${i})">
                    ${isHoliday ? `<div class="holiday-name ${shouldHighlightHoliday ? "" : "weekend"}">${holidayName}</div>` : ""}
                `;
            } else {
                dayDiv.innerHTML = `
                    <label class="day-label">-</label>
                    <input type="number" disabled style="visibility: hidden;">
                `;
            }

            daysGrid.appendChild(dayDiv);
        }

        weekDiv.appendChild(weekHeader);
        weekDiv.appendChild(daysGrid);
        weekContainer.appendChild(weekDiv);
        weeksData.push(weekData);
    });

    updateAllTotals();
    saveState();
}

function prefillHours() {
    const defaultHours = parseFloat(document.getElementById("defaultHours").value) || 0;

    weeksData.forEach((week, weekIndex) => {
        for (let i = 0; i < 5; i++) {
            const input = document.getElementById(`week-${weekIndex}-day-${i}`);
            if (input && !input.disabled) {
                input.value = defaultHours;
                const dayData = week.days.find((d) => d.name === WEEKDAY_INPUT_NAMES[i]);
                if (dayData) {
                    dayData.hours = defaultHours;
                    dayData.defaultHours = defaultHours;
                    updateModifiedState(input, dayData);
                }
            }
        }
    });

    updateAllTotals();
    saveState();
}

function updateTotals(weekIndex, dayIndex) {
    const input = document.getElementById(`week-${weekIndex}-day-${dayIndex}`);
    const value = parseFloat(input.value) || 0;

    const dayData = weeksData[weekIndex].days.find((d) => d.name === DAY_NAMES[dayIndex]);
    if (dayData) {
        dayData.hours = value;
        updateModifiedState(input, dayData);
    }

    updateAllTotals();
    saveState();
}

function updateAllTotals() {
    let grandTotal = 0;

    weeksData.forEach((week, weekIndex) => {
        let weekTotal = 0;

        for (let i = 0; i < 7; i++) {
            const input = document.getElementById(`week-${weekIndex}-day-${i}`);
            if (input && !input.disabled) {
                const value = parseFloat(input.value) || 0;
                weekTotal += value;
                grandTotal += value;
            }
        }

        const weekTotalElement = document.getElementById(`week-${weekIndex}-total`);
        if (weekTotalElement) {
            weekTotalElement.textContent = `${weekTotal} timer`;
        }
    });

    document.getElementById("totalHours").textContent = grandTotal;
}

function generatePDF() {
    const doc = new jsPDF("p", "mm", "a4");
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margins = { top: 20, bottom: 20, left: 20, right: 20 };
    const monthSelect = document.getElementById("month");
    const [year, month] = monthSelect.value.split("-");
    const monthName = monthSelect.options[monthSelect.selectedIndex].text;
    const projectName = document.getElementById("projectName").value || "";
    const customerName = document.getElementById("customerName").value || "";

    doc.setFontSize(20);
    doc.text("Timeregistrering", pageWidth / 2, margins.top, { align: "center" });

    let yPos = margins.top + 12;
    if (customerName) {
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text(`Kunde: ${customerName}`, pageWidth / 2, yPos, { align: "center" });
        doc.setFont(undefined, "normal");
        yPos += 8;
    }

    if (projectName) {
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text(`Prosjekt: ${projectName}`, pageWidth / 2, yPos, { align: "center" });
        doc.setFont(undefined, "normal");
        yPos += 8;
    }

    doc.setFontSize(14);
    doc.text(monthName, pageWidth / 2, yPos, { align: "center" });
    yPos += 20;

    doc.setFontSize(11);

    weeksData.forEach((week) => {
        const weekDaysWithHours = week.days.filter((d) => d.hours > 0);

        if (weekDaysWithHours.length === 0) {
            return;
        }

        const titleHeight = 8;
        const headerHeight = 8;
        const rowHeight = 8;
        const tableSpacing = 10;
        const tableHeight = titleHeight + headerHeight + (weekDaysWithHours.length * rowHeight) + tableSpacing;
        if (yPos + tableHeight > pageHeight - margins.bottom) {
            doc.addPage();
            yPos = margins.top;
        }

        doc.setFont(undefined, "bold");
        doc.setFontSize(12);
        doc.text(`Uke ${week.weekNumber}`, margins.left, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        const col1X = margins.left + 5;
        const col2X = margins.left + 65;
        const col3X = margins.left + 115;
        const tableTopY = yPos - 5;
        const headerBottomY = tableTopY + headerHeight;

        doc.setFillColor(240, 240, 240);
        doc.rect(margins.left, tableTopY, pageWidth - margins.left - margins.right, headerHeight, "F");

        doc.text("Dag", col1X, yPos);
        doc.text("Dato", col2X, yPos);
        doc.text("Timer", col3X, yPos);
        yPos = headerBottomY + 5;

        doc.setFont(undefined, "normal");
        weekDaysWithHours.forEach((day, index) => {
            const rowTopY = headerBottomY + (index * rowHeight);
            if (index % 2 === 0) {
                doc.setFillColor(250, 250, 250);
                doc.rect(margins.left, rowTopY, pageWidth - margins.left - margins.right, rowHeight, "F");
            }

            const dateObj = day.fullDate || new Date(year, month - 1, day.date);
            const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}.${String(dateObj.getMonth() + 1).padStart(2, "0")}.${dateObj.getFullYear()}`;
            const textY = rowTopY + 5;

            doc.text(day.name, col1X, textY);
            doc.text(formattedDate, col2X, textY);
            doc.text(day.hours.toString(), col3X, textY);
        });

        const tableBottomY = headerBottomY + (weekDaysWithHours.length * rowHeight);

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);

        doc.line(margins.left, tableTopY, pageWidth - margins.right, tableTopY);
        doc.line(margins.left, headerBottomY, pageWidth - margins.right, headerBottomY);
        doc.line(margins.left, tableBottomY, pageWidth - margins.right, tableBottomY);

        doc.line(margins.left, tableTopY, margins.left, tableBottomY);
        doc.line(col2X - 5, tableTopY, col2X - 5, tableBottomY);
        doc.line(col3X - 5, tableTopY, col3X - 5, tableBottomY);
        doc.line(pageWidth - margins.right, tableTopY, pageWidth - margins.right, tableBottomY);

        yPos = tableBottomY + tableSpacing;
    });

    const grandTotal = parseFloat(document.getElementById("totalHours").textContent);

    if (yPos > pageHeight - margins.bottom - 20) {
        doc.addPage();
        yPos = margins.top;
    }

    yPos += 5;
    doc.setFont(undefined, "bold");
    doc.setFontSize(14);

    doc.setFillColor(240, 240, 240);
    doc.rect(margins.left, yPos - 7, pageWidth - margins.left - margins.right, 12, "F");
    doc.setDrawColor(150, 150, 150);
    doc.rect(margins.left, yPos - 7, pageWidth - margins.left - margins.right, 12, "S");

    doc.text(`Totale timer: ${grandTotal}`, margins.left + 5, yPos);

    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setTextColor(128, 128, 128);
        doc.text(`Side ${i} av ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "center" });

        if (i === pageCount) {
            doc.text(`Generert ${new Date().toLocaleDateString("nb-NO")}`, pageWidth / 2, pageHeight - 15, { align: "center" });
        }
        doc.setTextColor(0, 0, 0);
    }

    const filenameParts = ["timeregistrering"];
    if (customerName) filenameParts.push(customerName.replace(/[^a-z0-9]/gi, "_"));
    if (projectName) filenameParts.push(projectName.replace(/[^a-z0-9]/gi, "_"));
    filenameParts.push(monthSelect.value);
    const filename = `${filenameParts.join("_")}.pdf`;

    const pdfOutput = doc.output("dataurlstring");
    const link = document.createElement("a");
    link.href = pdfOutput;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

initSavedFields();
initMonthSelector();
generateWeeks();
