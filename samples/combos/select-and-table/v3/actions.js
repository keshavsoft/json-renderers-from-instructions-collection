let state = {
    dataset: [],
    columns: [],
    render: null,
    targetTableId: "table-area"
};

export const initState = ({ dataset, columns, render }) => {
    state = { dataset, columns, render, targetTableId: "table-area" };
};

const setFeedback = (message) => {
    let box = document.getElementById("select-table-feedback");
    if (!box) {
        box = document.createElement("div");
        box.id = "select-table-feedback";
        box.className = "alert alert-primary shadow-sm mb-3";
        document.getElementById("table-area")?.parentElement?.insertBefore(box, document.getElementById("table-area"));
    }
    box.innerHTML = `<strong>Selected Record:</strong> ${message}`;
};

const renderTable = (filteredData) => {
    state.render({
        data: filteredData,
        columns: state.columns,
        targetHtmlId: "table-area",
        appendPosition: "replace",
        renderers: [
            {
                type: "table.simple",
                options: {
                    showSerial: true,
                    showOptions: true
                }
            }
        ],
        classToApply: "",
        showLog: false
    });
};

export const actions = {
    onDropdownFilter: (event, matchElement) => {
        const selectedVal = (matchElement?.value || "").trim().toLowerCase();
        const fieldName = matchElement?.getAttribute("data-name") || matchElement?.id || "";

        const filtered = selectedVal
            ? state.dataset.filter(item => {
                if (fieldName && item[fieldName]) {
                    return String(item[fieldName]).toLowerCase() === selectedVal;
                }
                return Object.values(item).some(v => String(v).toLowerCase() === selectedVal);
            })
            : state.dataset;

        renderTable(filtered);
    },

    onRowShow: (event, matchElement) => {
        event.stopPropagation();
        const row = matchElement.closest("tr");
        const rows = Array.from(document.querySelectorAll("#table-simple-body-id tr"));
        const rowIndex = rows.indexOf(row);
        if (rowIndex >= 0 && rowIndex < state.dataset.length) {
            const item = state.dataset[rowIndex];
            rows.forEach(r => r.classList.remove("table-primary"));
            row.classList.add("table-primary");
            setFeedback(`Row #${rowIndex + 1}: <strong>${item.itemName || ""}</strong> &middot; Category: <span class="badge bg-secondary">${item.category || ""}</span> &middot; Unit: <span class="badge bg-info text-dark">${item.baseUnit || ""}</span>`);
        }
    }
};

export default actions;
