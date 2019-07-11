class ModalController{
	constructor($uibModalInstance, Items){
		this.uibModalInstance = $uibModalInstance;
		this.items = Items;
		this.selected = {};
	}

	accept() {
    	this.uibModalInstance.close(this.selected.item);
  	};

  	cancel() {
    	this.uibModalInstance.dismiss('cancel');
  	};
}

ModalController.$inject = ['$uibModalInstance', 'Items'];

export default ModalController;