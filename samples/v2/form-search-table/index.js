import columns from "../common/columns.json" with { type: "json" };
import initialData from "../common/data.json" with { type: "json" };
import render from "../../../docs/dist/v2/min.js";

const targetHtmlId = "dom-render-container";
const dataset = [...initialData];

// 1. Initial composite render: Category Select + Table With Search
render({
    data: dataset,
    columns,
    targetHtmlId,
    appendPosition: "replace",
    renderers: [
        {
            type: "select.simple",
            options: {}
        },
        {
            type: "table.withSearch",
            options: {
                showSerial: false
            }
        }
    ],
    showLog: false
});

// 2. Helper to refresh table in-place
const refreshTable = (filtered) => {
    const tableContainer = document.getElementById("table-content-container") ||
        document.getElementById("table-simple-table-id")?.parentElement;

    const targetId = tableContainer?.id || "table-content-container";
    if (tableContainer) {
        tableContainer.innerHTML = "";
    }

    render({
        data: filtered,
        columns,
        targetHtmlId: targetId,
        appendPosition: "replace",
        renderers: [
            {
                type: "table.simple",
                options: { showSerial: false }
            }
        ],
        showLog: false
    });

    const feedback = document.getElementById("search-feedback");
    if (feedback) {
        feedback.textContent = filtered.length === dataset.length
            ? "Showing all records"
            : `Showing ${filtered.length} of ${dataset.length} records`;
    }
};

// 3. Search Input Event (Enter key)
const searchInput = document.getElementById("tableSearch");
if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();

        const query = searchInput.value.trim().toLowerCase();
        const filtered = !query
            ? dataset
            : dataset.filter(item =>
                Object.values(item).some(val => String(val ?? "").toLowerCase().includes(query))
            );

        refreshTable(filtered);
    });
}

// 4. Category Select Change Event
const selectEl = document.querySelector("#dom-render-container select");
if (selectEl) {
    selectEl.addEventListener("change", (e) => {
        const selected = e.target.value;
        const filtered = !selected
            ? dataset
            : dataset.filter(item => item.category === selected || Object.values(item).includes(selected));

        refreshTable(filtered);
    });
}
