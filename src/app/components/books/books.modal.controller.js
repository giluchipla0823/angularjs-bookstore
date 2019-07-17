import { evalResponse, errorResponse }  from '../../../public/assets/js/jsResponseFunctions';

class BooksModalController{
	constructor($uibModalInstance, Response, BooksService, SweetAlert, AuthorsService){
		this.sweetAlert = SweetAlert;
		this.authorsService = AuthorsService;
		this.booksService = BooksService;
		this.uibModalInstance = $uibModalInstance;
		this.book = Response;

		this.form = {
			loading: false,
			data: {}
		};

		this.author = {};

		this.authors = {
			loading: false,
			data: []
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

		this.getAuthors();
	}

	evtChangeAuthor(data){
        delete this.form.data.author_id;

        if(data){
            this.form.data.author_id = data.id;
        }
    }

	getAuthors(){
		this.authors.loading = true;

        this.authorsService.getAuthors()
            .then( response => {
                if(evalResponse(response)){
                    const data = response.data;
                    const authors = data.map( item => {
                        const id = item.id;
                        const name = item.name;

						let obj = {
                            id: id,
                            text: name
                        };

						if(this.form.data.author_id == id){
							obj.selected = true;
							this.author.selected = obj;
						}

                        return obj;
                    });

                    this.authors.loading = false;
                    this.authors.data = authors;
                }
            });
    }

	save() {
		this.form.loading = true;

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
            	this.form.loading = false;

                if(evalResponse(response)){
                    this.uibModalInstance.close(true);
                }
            }, error => {
				this.form.loading = false;

				const data = error.data;
				const status = error.status;
				const message = data.message;

				if(status === 422){
					const errors = data.errors;
					const template = errorResponse.validationForm(message, errors);

					this.sweetAlert.alert(template, {html: true});
				}else{
					this.sweetAlert.alert(message);
				}
			});
    }  

	updateBook(book) {
        this.booksService.updateBook(book)
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

				if(status === 422){
					const errors = data.errors;
					const template = errorResponse.validationForm(message, errors);

					this.sweetAlert.alert(template, {html: true});
				}else{
					this.sweetAlert.alert(message);
				}
			});
    }  
}

BooksModalController.$inject = ['$uibModalInstance', 'Response', 'BooksService', 'SweetAlert', 'AuthorsService'];

export default BooksModalController;