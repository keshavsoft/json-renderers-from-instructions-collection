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
                options: { showSerial: true, showOptions: true }
            }
        ],
        classToApply: "",
        showLog: false
    });
};

export const actions = {
    // 1. Click Row -> Populate in Form
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

        rows.forEach(r => r.classList.remove("table-primary"));
        row.classList.add("table-primary");

        setFeedback(`Loaded Row #${rowIndex + 1} into Data Entry Form`);
    },

    // 2. Select Dropdown -> Filter Table
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
        setFeedback(val ? `Filter by ${fieldName}: "${matchElement.value}"` : "Showing all records");
    },

    // 3. Search Bar -> Filter Table
    onTableSearch: (event, matchElement) => {
        const query = (matchElement?.value || "").trim().toLowerCase();
        const filtered = query
            ? state.dataset.filter(item =>
                Object.values(item).some(v => String(v ?? "").toLowerCase().includes(query))
            )
            : state.dataset;

        renderTable(filtered);
        setFeedback(query ? `Search: "${matchElement.value}"` : "Showing all records");
    },

    // 4. Form Submit -> Update Row or Add New Row
    onFormSubmit: (event, matchElement) => {
        event.preventDefault();
        const record = {};
        state.columns.forEach(col => {
            const input = document.getElementById(col.columnName);
            if (input) record[col.columnName] = input.value.trim();
        });

        if (!record.itemName && !record.category) {
            alert("Please enter values into form");
            return;
        }

        if (state.selectedIndex >= 0 && state.selectedIndex < state.dataset.length) {
            state.dataset[state.selectedIndex] = record;
            setFeedback(`Updated Row #${state.selectedIndex + 1} from Form`);
        } else {
            state.dataset.push(record);
            setFeedback(`Added new record "${record.itemName}" to Table!`);
        }

        renderTable(state.dataset);
    },

    // 5. Form Reset
    onFormReset: (event, matchElement) => {
        state.selectedIndex = -1;
        document.querySelectorAll("#table-simple-body-id tr").forEach(r => r.classList.remove("table-primary"));
        setFeedback("Form cleared. Select a table row to edit.");
    }
};

export default actions;
