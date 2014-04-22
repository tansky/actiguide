actiGuide.mainModule.controller('TestFormCtrl', function ($scope, $timeout, alertBox) {

	$scope.Model = {};

	$scope.Model.PaymentTypeCatalog = [
		{
			Name: 'Оплата контрагенту',
			Id: 1
		},
		{
			Name: 'Возврат контрагенту',
			Id: 2
		},
		{
			Name: 'Штраф и неустойка контрагенту',
			Id: 3
		},
		{
			Name: 'Выплата зарплаты',
			Id: 4
		}
	];

	$scope.Model.PaymentType = $scope.Model.PaymentTypeCatalog[0];

	$scope.saveTestForm = function (disabled) {
		if (disabled) return;

		$scope.sending = true;

		$timeout(function () {
			$scope.sending = false;
			$timeout(function () {
				alertBox.push('Сохранение успешно');
			});
		}, 2000);
	};

	$scope.checkPaymentType = function () {
		return $scope.Model.PaymentType.Id == 4;
	};
});
