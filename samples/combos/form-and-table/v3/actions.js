let state = {
    dataset: [],
    columns: [],
    render: null,
    selectedIndex: -1
};

export const initState = ({ dataset, columns, render }) => {
    state = { dataset, columns, render, selectedIndex: -1 };
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
    // 1. Click row -> Populate in Form
    onRowClickSelect: (event, matchElement) => {
        const row = matchElement;
        const rows = Array.from(document.querySelectorAll("#table-simple-body-id tr"));
        const rowIndex = rows.indexOf(row);
        if (rowIndex < 0 || rowIndex >= state.dataset.length) return;

        state.selectedIndex = rowIndex;
        const record = state.dataset[rowIndex];

        state.columns.forEach(col => {
            const input = document.getElementById(col.columnName);
            if (input && record[col.columnName] !== undefined) {
                input.value = record[col.columnName];
            }
        });

        // Highlight selected row visually
        rows.forEach(r => r.classList.remove("table-primary"));
        row.classList.add("table-primary");

        setFeedback(`Loaded row #${rowIndex + 1} ("${record.itemName || ""}") into Form`);
    },

    // 2. Submit form -> Update selected or Add new
    onFormSubmit: (event, matchElement) => {
        event.preventDefault();

        const record = {};
        state.columns.forEach(col => {
            const input = document.getElementById(col.columnName);
            if (input) {
                record[col.columnName] = input.value.trim();
            }
        });

        if (!record.itemName && !record.category) {
            alert("Please enter values in the form.");
            return;
        }

        if (state.selectedIndex >= 0 && state.selectedIndex < state.dataset.length) {
            // Update existing
            state.dataset[state.selectedIndex] = record;
            setFeedback(`Updated row #${state.selectedIndex + 1} from Form!`);
        } else {
            // Add new
            state.dataset.push(record);
            setFeedback(`Added new record "${record.itemName}" to Table!`);
        }

        renderTable(state.dataset);
    },

    // 3. Reset form
    onFormReset: (event, matchElement) => {
        state.selectedIndex = -1;
        document.querySelectorAll("#table-simple-body-id tr").forEach(r => r.classList.remove("table-primary"));
        setFeedback("Form reset. Select a row to edit or enter a new record.");
    },

    // 4. Live search
    onTableSearch: (event, matchElement) => {
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
    }
};

export default actions;
