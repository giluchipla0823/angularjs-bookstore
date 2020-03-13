import { evalResponse, errorResponse } from "../../../utils/Response";
import { StatusCodes } from "../../../utils/StatusCodes";

class AuthorsFormController{
	constructor($uibModalInstance, Response, AuthorsService, SweetAlert){
		this.sweetAlert = SweetAlert;
		this.authorsService = AuthorsService;
		this.uibModalInstance = $uibModalInstance;
		this.author = Response;
	}

	$onInit() {
		this.form = {
			loading: false,
			data: this.author
		};
	}

	save() {
		this.form.loading = true;

		if(this.form.data.id){
			this.updateAuthor(this.form.data);
		}else{
			this.createAuthor(this.form.data);
		}
  	}

  	cancel() {
    	this.uibModalInstance.dismiss('cancel');
  	}

	createAuthor(author) {
        this.authorsService.createAuthor(author)
            .then(response => {
            	this.form.loading = false;

                if(evalResponse(response)){
                    this.uibModalInstance.close(true);
                }
            }, error => {
				this.form.loading = false;

				const data = error.data;
				const status = error.status;
				const message = data.message;

				if(status === StatusCodes.HTTP_UNPROCESSABLE_ENTITY){
					const errors = data.errors;
					const template = errorResponse.validationForm(message, errors);

					this.sweetAlert.alert(template, {html: true});
				}else{
					this.sweetAlert.alert(message);
				}
			});
    }  

	updateAuthor(author) {
        this.authorsService.updateAuthor(author)
            .then(response => {
            	this.form.loading = false;

                if(evalResponse(response)){
                    this.uibModalInstance.close(false);
                }
            }, error => {
				this.form.loading = false;
				
				const data = error.data;
				const status = error.status;
				const message = data.message;

				if(status === StatusCodes.HTTP_UNPROCESSABLE_ENTITY){
					const errors = data.errors;
					const template = errorResponse.validationForm(message, errors);

					this.sweetAlert.alert(template, {html: true});
				}else{
					this.sweetAlert.alert(message);
				}
			});
    }  
}

AuthorsFormController.$inject = ['$uibModalInstance', 'Response', 'AuthorsService', 'SweetAlert'];

export default AuthorsFormController;