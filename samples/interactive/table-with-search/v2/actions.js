let state = {
    dataset: [],
    columns: [],
    render: null,
    containerId: "dom-render-container"
};

export const initState = ({ dataset, columns, render, containerId }) => {
    state = { dataset, columns, render, containerId };
};

const setFeedback = (message) => {
    const feedback = document.getElementById("search-feedback");
    if (feedback) feedback.textContent = message;
};

const renderBodyOnly = (filteredData) => {
    const currentBody = document.getElementById("table-simple-body-id");
    if (!currentBody) {
        throw new Error('Could not find the existing table body "table-simple-body-id".');
    }

    // Render the table.bodyOnly definition into a temporary mount point.
    // The generated tbody rows are then moved into the existing tbody.
    const temporaryTarget = document.createElement("div");
    const temporaryId = `table-body-render-${Date.now()}`;
    temporaryTarget.id = temporaryId;
    temporaryTarget.hidden = true;
    document.body.appendChild(temporaryTarget);

    try {
        state.render({
            data: filteredData,
            columns: state.columns,
            targetHtmlId: temporaryId,
            appendPosition: "replace",
            renderers: [
                {
                    type: "table.bodyOnly",
                    options: { showSerial: true }
                }
            ],
            classToApply: "",
            showLog: false
        });

        const generatedBody = temporaryTarget.querySelector("#table-body-only-id") ||
            temporaryTarget.querySelector("#ks-id") ||
            temporaryTarget.querySelector("[data-role='table-body']") ||
            temporaryTarget.firstElementChild;
        if (!generatedBody) {
            throw new Error('The table.bodyOnly renderer did not produce "table-body-only-id".');
        }

        // Preserve the existing tbody element and replace only its row children.
        currentBody.replaceChildren(...Array.from(generatedBody.childNodes));
    } finally {
        temporaryTarget.remove();
    }
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

        renderBodyOnly(filteredData);
        setFeedback(
            query
                ? `Showing ${filteredData.length} of ${state.dataset.length} records for "${matchElement.value.trim()}".`
                : `Showing all ${state.dataset.length} records.`
        );
    }
};

export default actions;
