let state = {
    dataset: [],
    columns: [],
    render: null
};

export const initState = ({ dataset, columns, render }) => {
    state = { dataset, columns, render };
};

const setFeedback = (message) => {
    const feedback = document.getElementById("search-feedback");
    if (feedback) feedback.textContent = message;
};

const renderTable = (filteredData) => {
    const tableContainer = document.getElementById("table-content-container") ||
        document.getElementById("table-simple-table-id")?.parentElement;
    const targetId = tableContainer?.id || "table-content-container";
    if (tableContainer) tableContainer.innerHTML = "";

    state.render({
        data: filteredData,
        columns: state.columns,
        targetHtmlId: targetId,
        appendPosition: "replace",
        renderers: [
            {
                type: "table.simple",
                options: { showSerial: false }
            }
        ],
        classToApply: "",
        showLog: false
    });
};

export const actions = {
    onDropdownFilter: (event, matchElement) => {
        const val = (matchElement?.value || "").trim().toLowerCase();
        const fieldName = matchElement?.getAttribute("data-name") || matchElement?.id || "";

        const filtered = val
            ? state.dataset.filter(item => {
                if (fieldName && item[fieldName]) {
                    return String(item[fieldName]).toLowerCase() === val;
                }
                return Object.values(item).some(v => String(v).toLowerCase() === val);
            })
            : state.dataset;

        renderTable(filtered);
        setFeedback(val ? `Filtered by ${fieldName}: "${matchElement.value}" (${filtered.length} matches)` : "Showing all records");
    },

    onSearchInput: (event, matchElement) => {
        const query = (matchElement?.value || "").trim().toLowerCase();
        const filtered = query
            ? state.dataset.filter(item =>
                Object.values(item).some(v => String(v ?? "").toLowerCase().includes(query))
            )
            : state.dataset;

        renderTable(filtered);
        setFeedback(query ? `Search: "${matchElement.value.trim()}" (${filtered.length} matches)` : "Showing all records");
    }
};

export default actions;
