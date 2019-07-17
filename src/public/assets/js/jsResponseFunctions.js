export const errorResponse = {
    validationForm: (message, errors) => {
        let template = `<p>${message}<p><br />`;
        template += `<ul style="text-align:left;">`;

        errors.forEach(error => {
            template += `<li>${ error.message }</li>`;
        });

        template += `</ul>`;

        return template;
    }
};

export const evalResponse = (response) => {
    if(!response){
        return false;
    }

    if (typeof response === "string") {
        response = $.parseJSON(response);
    }

    var response_code = response.code;

    if (response_code === 2 || response_code === 3) {
        return false;
    } 

    return true;
};

export default {
    evalResponse, 
    errorResponse
}
