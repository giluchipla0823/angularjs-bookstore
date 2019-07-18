import { evalResponse, errorResponse }  from '../../../public/assets/js/jsResponseFunctions';

class BooksModalController{
	constructor($uibModalInstance, Response, BooksService, SweetAlert, AuthorsService, PublishersService){
		this.sweetAlert = SweetAlert;
		this.authorsService = AuthorsService;
		this.booksService = BooksService;
		this.publishersService = PublishersService;
		this.uibModalInstance = $uibModalInstance;
		this.book = Response;

		this.form = {
			loading: false,
			data: {}
		};

		this.publisher = {};

		this.publishers = {
			loading: false,
			data: []
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
		this.getPublishers();
	}

	evtChangeAuthor(data){
        let isValid = false;
        const $_select = angular.element('#author.ui-select-container');
        const $_form = angular.element('form[name="frm_books"]');

        delete this.form.data.author_id;

        if(data){
        	isValid = true;
        	$_form.scope().frm_books.author.$setPristine();

            this.form.data.author_id = data.id;
        }

        if(!isValid){
        	$_select.parents('.form-group').addClass('has-error has-feedback');
        }
    }

	evtChangePublisher(data){
        let isValid = false;
        const $_select = angular.element('#publisher.ui-select-container');
        const $_form = angular.element('form[name="frm_books"]');

        delete this.form.data.publisher_id;

        if(data){
        	isValid = true;
        	$_form.scope().frm_books.publisher.$setPristine();

            this.form.data.publisher_id = data.id;
        }

        if(!isValid){
        	$_select.parents('.form-group').addClass('has-error has-feedback');
        }
    }

	getPublishers(){
		this.publishers.loading = true;

        this.publishersService.getPublishers()
            .then( response => {
                if(evalResponse(response)){
                    const data = response.data;
                    const publishers = data.map( item => {
                        const id = item.id;
                        const name = item.name;

						let obj = {
                            id: id,
                            text: name
                        };

						if(this.form.data.publisher_id == id){
							obj.selected = true;
							this.publisher.selected = obj;
						}

                        return obj;
                    });

                    this.publishers.loading = false;
                    this.publishers.data = publishers;
                }
            });
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

BooksModalController.$inject = ['$uibModalInstance', 'Response', 'BooksService', 'SweetAlert', 'AuthorsService', 'PublishersService'];

export default BooksModalController;