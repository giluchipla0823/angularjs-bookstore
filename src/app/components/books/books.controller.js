import {evalResponse}  from '../../../public/assets/js/jsCommonFunctions';

class BooksController{
    constructor($uibModal, BooksService){
        this.uibModal = $uibModal;
        this.booksService = BooksService;
        this.title = 'Books Page';
        
        this.getBooks();

        this.items = ['item1', 'item2', 'item3'];
        this.selectedItem;
    }

    getBooks(){
        this.booksService.getBooks()
            .then( response =>{
                if(evalResponse(response)){
                    console.log('books', response.data);
                }
            });
    }

    openModal(){
        const modalInstance = this.uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'myModalContent.html',
          controller: 'ModalController',
          controllerAs: '$ctrl',
          size: '',
          resolve: {
            Items:() => {
                return this.items;
            }
          }
        });

        modalInstance.result.then(selectedItem => {
            this.selectedItem = selectedItem;
        }, () => {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
}

BooksController.$inject = ['$uibModal', 'BooksService'];

export default BooksController;