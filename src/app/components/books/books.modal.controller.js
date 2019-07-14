import { evalResponse, errorResponse }  from '../../../public/assets/js/jsCommonFunctions';

class BooksModalController{
	constructor($uibModalInstance, Response, BooksService, SweetAlert){
		this.sweetAlert = SweetAlert;
		this.booksService = BooksService;
		this.uibModalInstance = $uibModalInstance;
		this.book = Response;

		this.form = {
			data: {}
		};

		for(const i in this.book){
			const value = this.book[i];

			if(i === 'authorId'){
				this.form.data.author_id = value;
			}
			else if(i === 'publisherId'){
				this.form.data.publisher_id = value;
			}else{
				this.form.data[i] = value;
			}
		}
	}

	save() {
		if(this.form.data.id){
			this.updateBook(this.form.data);
		}else{
			this.createBook(this.form.data);
		}
  	}

  	cancel() {
    	this.uibModalInstance.dismiss('cancel');
  	}

	createBook(book) {
        this.booksService.createBook(book)
            .then(response => {
                if(evalResponse(response)){
                    this.uibModalInstance.close(true);
                }
            });
    }  

	updateBook(book) {
        this.booksService.updateBook(book)
            .then(response => {
                if(evalResponse(response)){
                    this.uibModalInstance.close(false);
                }
            }, err => {
				const data = err.data;
				const status = err.status;
				const message = data.message;

				if(status === 422){
					const errors = data.errors;
					const template = errorResponse.validationForm(message, errors);

					this.sweetAlert.alert(template, {html: true});
				}

				this.sweetAlert.alert(message);
			});
    }  
}

BooksModalController.$inject = ['$uibModalInstance', 'Response', 'BooksService', 'SweetAlert'];

export default BooksModalController;