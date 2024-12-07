export function get(url) {
    // Perform a GET request to the provided URL
    return fetch(url, { method: "GET" })
    // Convert the response to JSON format
    .then(response => response.json())
    // Catch any errors and log them to the console
    .catch(error => console.log(error));
} // This function is used to make a GET request to a specified URL

export function post(url, product) {
    return fetch(url, {
        // This method used for the request POST
        method: "POST",
        // Convert the product object to a JSON string
        body: JSON.stringify(product)
    })
    // Convert the response to JSON format
    .then(response => response.json())
    // Catch any error and log them to the console
    .catch(error => console.log(error));
}

export function patch(url, value) {
    return fetch(url, {
        // This method used for the request PATCH
        method: "PATCH",
        // Send the updated quantity in the request body
        body: JSON.stringify({ quantity: value })
    })
    // Convert the response to JSON format
    .then(response => response.json())
    // Catch any errors and log them to the console
    .catch(error => console.log(error));
} /* This function is used to make a PATCH request to a specified URL to update the quantity of a product */

export function remove(url) {
    // Perform a DELETE request to the provided URL
    return fetch(url, { method: "DELETE" })
    // Convert the response to JSON format
    .then(response => response.json())
    // Catch any errors and log them to the console
    .catch(error => console.log(error));
} /* This function is used to make a DELETE request to a specified URL to remove a resource */
