let state = {
    dataset: [],
    columns: [],
    render: null,
    containerId: "dom-render-container",
    options: {}
};

export const initState = ({ dataset, columns, render, containerId, options = {} }) => {
    state = { dataset, columns, render, containerId, options };
};

const setFeedback = (message) => {
    const feedback = document.getElementById("search-feedback");
    if (feedback) feedback.textContent = message;
};

const renderTable = (filteredData) => {
    const tableContainer = document.getElementById("table-content-container") ||
        document.getElementById("table-simple-table-id")?.parentElement;

    const targetId = tableContainer?.id || "table-content-container";
    if (tableContainer) {
        tableContainer.innerHTML = "";
    }

    state.render({
        data: filteredData,
        columns: state.columns,
        targetHtmlId: targetId,
        appendPosition: "replace",
        renderers: [
            {
                type: "table.withFooter",
                options: state.options
            }
        ],
        classToApply: "",
        showLog: false
    });
};

export const actions = {
    onSearchInput: (event, matchElement) => {
        const query = (matchElement?.value || "").trim().toLowerCase();
        const filtered = query
            ? state.dataset.filter(item =>
                Object.values(item).some(val =>
                    String(val ?? "").toLowerCase().includes(query)
                )
            )
            : state.dataset;

        renderTable(filtered);
        setFeedback(
            query
                ? `Showing ${filtered.length} of ${state.dataset.length} records for "${matchElement.value.trim()}".`
                : `Showing all ${state.dataset.length} records.`
        );
    },

    onRowShow: (event, matchElement) => {
        const row = matchElement.closest("tr");
        const cells = Array.from(row?.querySelectorAll("td") || []).map(td => td.textContent.trim());
        setFeedback(`Selected Row: ${cells.filter(c => c && c !== "show" && c !== "save").join(" | ")}`);
    },

    onFooterSave: (event, matchElement) => {
        const footerRow = matchElement.closest("tr");
        if (!footerRow) return;

        const newRecord = {};
        state.columns.forEach(col => {
            const input = footerRow.querySelector(`input[name="${col.columnName}"]`);
            if (input) {
                newRecord[col.columnName] = input.value.trim();
                input.value = ""; // clear after save
            }
        });

        // If at least one field has input
        if (Object.values(newRecord).some(v => v.length > 0)) {
            state.dataset.push(newRecord);

            const searchInput = document.getElementById("tableSearch");
            const query = (searchInput?.value || "").trim().toLowerCase();
            const filtered = query
                ? state.dataset.filter(item =>
                    Object.values(item).some(val =>
                        String(val ?? "").toLowerCase().includes(query)
                    )
                )
                : state.dataset;

            renderTable(filtered);
            setFeedback(`Added new record! Total: ${state.dataset.length} records.`);
        } else {
            setFeedback("Please enter values in the footer inputs before clicking save.");
        }
    }
};

export default actions;
