
export function evalResponse(response) {
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
}



export default {evalResponse};