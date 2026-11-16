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

const refreshDataLists = () => {
    state.columns.forEach(col => {
        const dl = document.querySelector(`datalist#${col.columnName}`) ||
                   document.querySelector(`[data-role="datalist-container"] #${col.columnName}`);
        if (dl) {
            const uniqueVals = [...new Set(state.dataset.map(item => item[col.columnName]).filter(Boolean))];
            dl.innerHTML = uniqueVals.map(val => `<option value="${val}"></option>`).join("");
        }
    });
};

const populateForm = (record, rowIndex) => {
    state.selectedIndex = rowIndex;

    state.columns.forEach(col => {
        const input = document.querySelector(`#form-simple-form-id input[name="${col.columnName}"]`) ||
                      document.querySelector(`#form-simple-form-id #${col.columnName}`);
        if (input && record[col.columnName] !== undefined) {
            input.value = record[col.columnName];
        }
    });

    const rows = Array.from(document.querySelectorAll("#table-simple-body-id tr"));
    rows.forEach(r => r.classList.remove("table-primary"));
    if (rows[rowIndex]) {
        rows[rowIndex].classList.add("table-primary");
    }

    setFeedback(`Loaded Row #${rowIndex + 1} ("${record.itemName || ""}") &rarr; Displayed in Form`);
};

export const actions = {
    // 1. Click "show" button in table row
    onRowShowClick: (event, matchElement) => {
        event.stopPropagation();
        const row = matchElement.closest("tr");
        const rows = Array.from(document.querySelectorAll("#table-simple-body-id tr"));
        const rowIndex = rows.indexOf(row);
        if (rowIndex >= 0 && rowIndex < state.dataset.length) {
            populateForm(state.dataset[rowIndex], rowIndex);
        }
    },

    // 2. Click table row -> Populate in Form
    onRowClickSelect: (event, matchElement) => {
        if (event.target.tagName === "BUTTON" || event.target.closest("button")) return;
        const row = matchElement;
        const rows = Array.from(document.querySelectorAll("#table-simple-body-id tr"));
        const rowIndex = rows.indexOf(row);
        if (rowIndex < 0 || rowIndex >= state.dataset.length) return;

        populateForm(state.dataset[rowIndex], rowIndex);
    },

    // 3. Submit form -> Update selected or Add new
    onFormSubmit: (event, matchElement) => {
        event.preventDefault();

        const record = {};
        state.columns.forEach(col => {
            const input = document.querySelector(`#form-simple-form-id input[name="${col.columnName}"]`) ||
                          document.querySelector(`#form-simple-form-id #${col.columnName}`);
            if (input) {
                record[col.columnName] = input.value.trim();
            }
        });

        if (!record.itemName && !record.category) {
            alert("Please enter values in the form.");
            return;
        }

        if (state.selectedIndex >= 0 && state.selectedIndex < state.dataset.length) {
            state.dataset[state.selectedIndex] = record;
            setFeedback(`Updated Row #${state.selectedIndex + 1} from Form!`);
        } else {
            state.dataset.push(record);
            setFeedback(`Added new record "${record.itemName}" to Table!`);
        }

        renderTable(state.dataset);
        refreshDataLists();
    },

    // 4. Reset form
    onFormReset: (event, matchElement) => {
        state.selectedIndex = -1;
        document.querySelectorAll("#table-simple-body-id tr").forEach(r => r.classList.remove("table-primary"));
        setFeedback("Form reset. Select a row to edit or enter a new record.");
    },

    // 5. Live search
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
