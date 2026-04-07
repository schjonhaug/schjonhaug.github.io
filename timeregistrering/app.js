const { jsPDF } = window.jspdf;
const OSLO_TIME_ZONE = "Europe/Oslo";

let weeksData = [];

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
        if (i === currentMonth) {
            option.selected = true;
        }
        monthSelect.appendChild(option);
    }

    monthSelect.addEventListener("change", generateWeeks);
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

    weekContainer.innerHTML = "";
    weeksData = [];

    weeks.forEach((weekInfo, weekIndex) => {
        const week = weekInfo.days;
        const weekDiv = document.createElement("div");
        weekDiv.className = "week";

        const weekHeader = document.createElement("div");
        weekHeader.className = "week-header";

        const startDate = week[0].getDate();
        const endDate = week[week.length - 1].getDate();
        weekHeader.innerHTML = `
            <span>Uke ${weekInfo.weekNumber} (${startDate}-${endDate})</span>
            <span class="week-total" id="week-${weekIndex}-total">0 timer</span>
        `;

        const daysGrid = document.createElement("div");
        daysGrid.className = "days-grid";

        const dayNames = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
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
                const defaultValue = isWeekend || isHoliday ? 0 : defaultHours;

                const dayData = {
                    name: dayNames[i],
                    date: date.getDate(),
                    fullDate: date,
                    hours: defaultValue,
                    isWeekend,
                    isHoliday,
                    holidayName
                };
                weekData.days.push(dayData);

                dayDiv.innerHTML = `
                    <label class="day-label ${isWeekend ? "weekend" : ""} ${isHoliday ? "holiday" : ""}">${dayNames[i]} ${date.getDate()}</label>
                    <input type="number"
                           id="week-${weekIndex}-day-${i}"
                           class="${isWeekend ? "weekend" : ""} ${isHoliday ? "holiday" : ""}"
                           min="0"
                           max="24"
                           step="0.5"
                           value="${defaultValue}"
                           onchange="updateTotals(${weekIndex}, ${i})">
                    ${isHoliday ? `<div class="holiday-name">${holidayName}</div>` : ""}
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
}

function prefillHours() {
    const defaultHours = parseFloat(document.getElementById("defaultHours").value) || 0;

    weeksData.forEach((week, weekIndex) => {
        for (let i = 0; i < 5; i++) {
            const input = document.getElementById(`week-${weekIndex}-day-${i}`);
            if (input && !input.disabled) {
                input.value = defaultHours;
                const dayData = week.days.find((d) => d.name === ["Man", "Tir", "Ons", "Tor", "Fre"][i]);
                if (dayData) {
                    dayData.hours = defaultHours;
                }
            }
        }
    });

    updateAllTotals();
}

function updateTotals(weekIndex, dayIndex) {
    const input = document.getElementById(`week-${weekIndex}-day-${dayIndex}`);
    const value = parseFloat(input.value) || 0;

    const dayNames = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
    const dayData = weeksData[weekIndex].days.find((d) => d.name === dayNames[dayIndex]);
    if (dayData) {
        dayData.hours = value;
    }

    updateAllTotals();
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

        const tableHeight = 10 + (weekDaysWithHours.length * 8) + 5;
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
        const col2X = margins.left + 35;
        const col3X = margins.left + 65;

        doc.setFillColor(240, 240, 240);
        doc.rect(margins.left, yPos - 5, pageWidth - margins.left - margins.right, 7, "F");

        doc.text("Dag", col1X, yPos);
        doc.text("Dato", col2X, yPos);
        doc.text("Timer", col3X, yPos);
        yPos += 8;

        doc.setFont(undefined, "normal");
        weekDaysWithHours.forEach((day, index) => {
            if (index % 2 === 0) {
                doc.setFillColor(250, 250, 250);
                doc.rect(margins.left, yPos - 5, pageWidth - margins.left - margins.right, 7, "F");
            }

            const dateObj = day.fullDate || new Date(year, month - 1, day.date);
            const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}.${String(dateObj.getMonth() + 1).padStart(2, "0")}.${dateObj.getFullYear()}`;

            doc.text(day.name, col1X, yPos);
            doc.text(formattedDate, col2X, yPos);
            doc.text(day.hours.toString(), col3X, yPos);
            yPos += 7;
        });

        const tableStartY = yPos - (weekDaysWithHours.length * 7) - 8;
        const tableEndY = yPos - 7;

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);

        doc.line(margins.left, tableStartY - 5, pageWidth - margins.right, tableStartY - 5);
        doc.line(margins.left, tableStartY + 2, pageWidth - margins.right, tableStartY + 2);
        doc.line(margins.left, tableEndY, pageWidth - margins.right, tableEndY);

        doc.line(margins.left, tableStartY - 5, margins.left, tableEndY);
        doc.line(col2X - 5, tableStartY - 5, col2X - 5, tableEndY);
        doc.line(col3X - 5, tableStartY - 5, col3X - 5, tableEndY);
        doc.line(pageWidth - margins.right, tableStartY - 5, pageWidth - margins.right, tableEndY);

        yPos += 10;
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

initMonthSelector();
generateWeeks();
