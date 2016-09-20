var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Credit Card Validation App' });
});

function validateDetails(cardNumber, expiryDate, cvvNumber, callback) {
	var visaElectronCardRE = new RegExp("^(?:(?:2131|1800|35\d{3})\d{11})$");
	var americanExpressCardRE = new RegExp("^(?:3[47][0-9]{13})$");
	var dinersCardRE = new RegExp("^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$");
	var visaCardRE = new RegExp("^(?:4[0-9]{12}(?:[0-9]{3})?)$");
    var masterCardRE = new RegExp("^(?:5[1-5][0-9]{14})$");
    var discoverCardRE = new RegExp("^(?:6(?:011|5[0-9][0-9])[0-9]{12})$");
    var cvvRegex = new RegExp("^[0-9]{3,4}$");
    var expiryDateRegex = new RegExp("^(0[1-9]|1[0-2])\/?(20)?([0-9]{2})$");
    var isValidCard = false;
    var isValidExp = false;
    var isValidCVV = false;
    var isNotExpired = false;
    var dateMatch = expiryDate.match(expiryDateRegex);
    if(cardNumber.match(visaElectronCardRE) !== null || cardNumber.match(americanExpressCardRE) !== null || cardNumber.match(dinersCardRE) !== null || 
    		cardNumber.match(visaCardRE) !== null || cardNumber.match(masterCardRE) !== null || cardNumber.match(discoverCardRE) !== null) {
    	isValidCard = true;
    }
    if(dateMatch !== null) {
    	isValidExp = true;
    	var today = new Date();
    	var expiryMonth = dateMatch[1];
    	var expiryYear = dateMatch[3];
    	if(today.getFullYear() < Number("20" + expiryYear)) {
    		isNotExpired = true;
    	} else if(today.getFullYear() === Number("20" + expiryYear)) {
    		if(today.getMonth() + 1 <= Number(expiryMonth)) {
    			isNotExpired = true;
    		}
    	}
    }
    if(cvvNumber.match(cvvRegex) !== null) {
    	isValidCVV = true;
    }
	callback(isValidCard, isValidExp, isValidCVV, isNotExpired);
}

router.get('/validate', function(req, res, next) {
	var cardNumber = req.param('cc');
	var expiryDate = req.param('exp');
	var cvvNumber = req.param('cvv');
	validateDetails(cardNumber, expiryDate, cvvNumber, function(isValidCard, isValidExp, isValidCVV, isNotExpired) {
		var messages = [];
		if(!isValidCard) {
			messages.push("Credit Card Number NOT Valid.!");
		}
		if(!isValidExp) {
			messages.push("Credit Card Expiry NOT Valid.!");
		} else if(!isNotExpired) {
			messages.push("Credit Card is Already Expired.!");
		}
		if(!isValidCVV) {
			messages.push("CVV Number NOT Valid.!");
		}
		if(messages.length === 0) {
			messages.push("Valid Details..!!");
		}
		res.render('result', { messages: messages });
	});
});

module.exports = router;
