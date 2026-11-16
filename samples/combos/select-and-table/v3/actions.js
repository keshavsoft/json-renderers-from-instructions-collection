let state = {
    dataset: [],
    columns: [],
    render: null,
    targetTableId: "table-container"
};

export const initState = ({ dataset, columns, render }) => {
    state = { dataset, columns, render, targetTableId: "table-container" };
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
        const row = matchElement.closest("tr");
        const itemName = row?.querySelector("td:nth-child(2)")?.textContent.trim() || "";
        alert(`Selected Product: ${itemName}`);
    }
};

export default actions;
