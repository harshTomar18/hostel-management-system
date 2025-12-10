// src/utils/formatDate.js
export const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
        day: "2-digit",
        month: "numeric", // "Jan", "Feb", "Mar"
        year: "numeric"
    };

    return date.toLocaleDateString("en-GB", options);
};
