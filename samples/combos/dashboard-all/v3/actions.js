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

// Refreshes the table component with current dataset
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
                type: "table.withFooter",
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

// Populates a record into the vertical form
const populateForm = (record, rowIndex) => {
    state.selectedIndex = rowIndex;

    state.columns.forEach(col => {
        const input = document.querySelector(`#form-simple-form-id #${col.columnName}`);
        if (input && record[col.columnName] !== undefined) {
            input.value = record[col.columnName];
        }
    });

    // Highlight row in table
    const rows = Array.from(document.querySelectorAll("#table-simple-body-id tr"));
    rows.forEach(r => r.classList.remove("table-primary"));
    if (rows[rowIndex]) {
        rows[rowIndex].classList.add("table-primary");
    }

    setFeedback(`Selected Row #${rowIndex + 1} ("${record.itemName || ""}") &rarr; Displayed in Form`);
};

export const actions = {
    // 1. Click "show" button in table row -> Project data vertically into Form
    onRowShowClick: (event, matchElement) => {
        event.stopPropagation();
        const row = matchElement.closest("tr");
        const rows = Array.from(document.querySelectorAll("#table-simple-body-id tr"));
        const rowIndex = rows.indexOf(row);
        if (rowIndex >= 0 && rowIndex < state.dataset.length) {
            populateForm(state.dataset[rowIndex], rowIndex);
        }
    },

    // 2. Click any table row -> Project data vertically into Form
    onRowClickSelect: (event, matchElement) => {
        if (event.target.tagName === "BUTTON" || event.target.closest("button")) return;
        const row = matchElement;
        const rows = Array.from(document.querySelectorAll("#table-simple-body-id tr"));
        const rowIndex = rows.indexOf(row);
        if (rowIndex >= 0 && rowIndex < state.dataset.length) {
            populateForm(state.dataset[rowIndex], rowIndex);
        }
    },

    // 3. Search Bar Filter
    onTableSearch: (event, matchElement) => {
        const query = (matchElement?.value || "").trim().toLowerCase();
        const filtered = query
            ? state.dataset.filter(item =>
                Object.values(item).some(val => String(val ?? "").toLowerCase().includes(query))
            )
            : state.dataset;

        renderTable(filtered);
        setFeedback(query ? `Search: "${matchElement.value.trim()}" (${filtered.length} matches)` : "Showing all records");
    },

    // 4. Submit Form -> Update existing row or Add new record
    onFormSubmit: (event, matchElement) => {
        event.preventDefault();
        const record = {};
        state.columns.forEach(col => {
            const input = document.querySelector(`#form-simple-form-id #${col.columnName}`);
            if (input) record[col.columnName] = input.value.trim();
        });

        if (!record.itemName && !record.category) {
            alert("Please enter values in the form.");
            return;
        }

        if (state.selectedIndex >= 0 && state.selectedIndex < state.dataset.length) {
            state.dataset[state.selectedIndex] = record;
            setFeedback(`Updated Row #${state.selectedIndex + 1} from Form`);
        } else {
            state.dataset.push(record);
            setFeedback(`Added new record "${record.itemName}" from Form to Table`);
        }

        renderTable(state.dataset);
    },

    // 5. Reset Form
    onFormReset: (event, matchElement) => {
        state.selectedIndex = -1;
        document.querySelectorAll("#table-simple-body-id tr").forEach(r => r.classList.remove("table-primary"));
        setFeedback("Form reset. Select a table row to view or edit.");
    },

    // 6. Save from Table Footer Inputs
    onFooterSave: (event, matchElement) => {
        const footerRow = matchElement.closest("tr");
        if (!footerRow) return;

        const newRecord = {};
        state.columns.forEach(col => {
            const input = footerRow.querySelector(`input[name="${col.columnName}"]`);
            if (input) {
                newRecord[col.columnName] = input.value.trim();
                input.value = "";
            }
        });

        if (Object.values(newRecord).some(v => v.length > 0)) {
            state.dataset.push(newRecord);
            renderTable(state.dataset);
            setFeedback(`Added new record "${newRecord.itemName || ""}" from Footer to Table!`);
        } else {
            setFeedback("Please enter values into footer row inputs before saving.");
        }
    }
};

export default actions;
