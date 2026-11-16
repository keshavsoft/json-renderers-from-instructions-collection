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
    state.render({
        data: filteredData,
        columns: state.columns,
        targetHtmlId: "table-content-container",
        appendPosition: "replace",
        renderers: [
            {
                type: "table.simple",
                options: state.options
            }
        ],
        classToApply: "",
        showLog: false
    });
};

export const actions = {
    onSearchEnter: (event, matchElement) => {
        if (event.key !== "Enter") return;
        event.preventDefault();

        const query = matchElement.value.trim().toLocaleLowerCase();
        const filteredData = !query
            ? state.dataset
            : state.dataset.filter((record) =>
                Object.values(record).some((value) =>
                    String(value ?? "").toLocaleLowerCase().includes(query)
                )
            );

        renderTable(filteredData);
        setFeedback(
            query
                ? `Showing ${filteredData.length} of ${state.dataset.length} records for "${matchElement.value.trim()}".`
                : `Showing all ${state.dataset.length} records.`
        );
    }
};

export default actions;
