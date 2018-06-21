var monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var provincesCanada = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon Territory'];
var provincesUS = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

/**
 * ShoppingBag object contains list of products
 * uses product image link as unique key for an item
 * @param {string} img link product image
 * @param {number} price of product
 * @param {number} quantity of product
 * @param {string} name product name
 * "totalItem" number of items in the bag
 * "totalCost" total cost of all items in the bag
 */
function ShoppingBag(img, price, quantity, name) {
	this[img] = [price, quantity, name];
	this.totalItem = quantity;
	this.totalCost = price;
}
const PRICE = 0, QUANTITY = 1, NAME = 2;
// Update total items in bag
function updateTotalItem(obj, quantity, operation = 'add') {
	operation === 'add'? obj.totalItem += quantity : obj.totalItem -= quantity;
}
// Update total cost in bag
function updateTotalCost(obj, amount, operation = 'add') {
	operation === 'add'? obj.totalCost =parseFloat(obj.totalCost) + parseFloat(amount) : obj.totalCost = parseFloat(obj.totalCost) - parseFloat(amount);
	obj.totalCost = parseFloat(obj.totalCost.toFixed(2));
}

 /**
 * number of items on navigation bag menu
 */
function updateNavBag() {// update number of items in bag on navigation bar
	var navBag = document.getElementById('nav-bag');
	var shoppingBag = JSON.parse(sessionStorage.getItem('shoppingBagGlobal'));
	navBag.innerHTML = shoppingBag? `<img src="./imgs/cart-icon.png" alt=""> <sup>${shoppingBag.totalItem}</sup>` : '<img src="./imgs/cart-icon.png" alt=""> <sup>0</sup>';
}
/**
 * number of items on navigation bag menu end
 */

/**
 * product page 
 */
function addToBag(figCaption) { // add item to global shopping bag object
	var img = figCaption.parentElement.firstElementChild.src;
	var price = figCaption.innerText.slice(1, -11);
	var name = figCaption.parentElement.getElementsByTagName('div')[0].innerText;
	var shoppingBag = JSON.parse(sessionStorage.getItem('shoppingBagGlobal'));
	// add new item to shopping bag
	if (shoppingBag == null){// no bag -> create new Bag, add first item
		shoppingBag = new ShoppingBag(img, price, 1, name);
	} else if (shoppingBag[img] === undefined) {// item not in bag -> add new item
		shoppingBag[img] = [price, 1, name];
		updateTotalCost(shoppingBag, price);
		updateTotalItem(shoppingBag, 1);
	} else {// item in bag -> increase item quantity
		shoppingBag[img][QUANTITY]++;
		updateTotalCost(shoppingBag, shoppingBag[img][PRICE]);
		updateTotalItem(shoppingBag, 1);
	}
	// Update shared bag object between pages
	sessionStorage.setItem('shoppingBagGlobal', JSON.stringify(shoppingBag));
	// Update navigation Bag
	updateNavBag();
}
/**
 * product page end
 */

/**
 * order form page 
 */

 /**
 * tab content navigation  
 */
function changeTab(evt, tabID) {
	var tabContents = document.getElementsByClassName("tab-content");
	// hide all tab contents
	for (i = 0; i < tabContents.length; i++){
		tabContents[i].style.display = "none";
	}
	// show tab content by its id
	document.getElementById(tabID).style.display = "block";
}
 /**
 * tab content navigation end
 */

/**
 * customer bag tab
 */
function updateSubtotal(totalItem, totalCost){// subtotal element display total cost & number of items
	if(totalItem>0){
		document.getElementById('subtotal').innerHTML = `Subtotal (${totalItem} items): <em>$${totalCost}</em>`;
	}else{ // load no item view
		// hide table
		document.getElementById('item-list-table').style = "display:none;";
		// load backgroud image from wallpapers4u.org 
		document.getElementById('customer-bag').style.background = "url(./imgs/shopnow.jpg) 45%/auto 60vh no-repeat";
		// get subtotal text
		var subTotalP = document.getElementById('subtotal');
		subTotalP.innerHTML = 'Your Shopping Bag is empty!<br/><a href="./products.html">Shop now</a>';
		subTotalP.style = "text-align: center; font-size:1.5em; color: rgb(167, 54, 6); margin-top:35vh;padding-bottom:10px; line-height: 2em; background: rgba(255,255,255,.6)";
		// hide next button
		document.getElementById('customer-bag').querySelector('input[type=button]').style = 'display:none';
	}
}
function displayItemList() {
	var shoppingList = document.getElementById('item-list-table');
	var shoppingBag = JSON.parse(sessionStorage.getItem('shoppingBagGlobal'));
	var content = "<tbody>";
	if(shoppingList && shoppingBag){ // at order form page and shoppingBag not null
		Object.keys(shoppingBag).forEach(item => {// Note: "item" is product image link
		if (item !== 'totalItem' && item !== 'totalCost') { // dont loop through 'totalItem' & 'totalCost' properties
			content += `
			<tr>
				<td class="col-6">
					<div>
						<img src="${item}" alt="">
					</div>		
					<div class="product-info">
						<p>
						${shoppingBag[item][NAME]}
						</p>
						<button type="button"  class="deleteBtn">Delete</button>
					</div>
				</td>
				<td class="col-2"><p>$${shoppingBag[item][PRICE]}</p></td>
				<td class="col-2">
					<button class="minusBtn" type="button">&#8722;</button> 
					<input class="quantity" type="number" value="${shoppingBag[item][QUANTITY]}" disabled>
					<button class="addBtn" type="button">&#43;</button>
				</td>
			</tr>
			`;
		}
	});
	shoppingList.innerHTML += content + '</tbody>';
	}
}
function loadShoppingBagTab(){
	// display first tab content
	document.getElementById("customer-bag").style.display = "block";
	document.getElementsByClassName("tabBtn")[0].className += " active";
	// get global shoppingBag object
	var shoppingBag = JSON.parse(sessionStorage.getItem('shoppingBagGlobal'));
	if(shoppingBag == null || shoppingBag.totalItem == 0){ // no global shoppingBag object / no item 
		updateSubtotal(0, 0);
	}else{
		displayItemList();
		updateSubtotal(shoppingBag.totalItem, shoppingBag.totalCost);
		// add event listenner for delete/add/minus/next buttons in Item List
		var deleteBtns = document.getElementsByClassName('deleteBtn');
		for(var i=0;i<deleteBtns.length;i++){
			deleteBtns[i].addEventListener('click',removeAll);
		}
		var addBtns = document.getElementsByClassName('addBtn');
		for(var i=0;i<addBtns.length;i++){
			addBtns[i].addEventListener('click',addOne);
		}
		var minusBtns = document.getElementsByClassName('minusBtn');	
		for(var i=0;i<minusBtns.length;i++){
			minusBtns[i].addEventListener('click',minusOne);
		}
		var nextBtn = document.getElementById("customer-bag").querySelector('input[type=button]');
		nextBtn.addEventListener('click',function(evt){
			changeTab(evt, 'customer-info');
			loadCustomerInfoTab();
			// highlight tab navigation
			document.getElementById('customer-info-tab').className += " active"; 
		});
	}
}
function removeAll(evt) {
	// get table row
	var itemRow = evt.path[3];
	// get image src
	var itemKey = itemRow.querySelector('img').src;
	var shoppingBag = JSON.parse(sessionStorage.getItem('shoppingBagGlobal'));
	updateTotalItem(shoppingBag, shoppingBag[itemKey][QUANTITY],'minus');
	updateTotalCost(shoppingBag, (shoppingBag[itemKey][QUANTITY]*shoppingBag[itemKey][PRICE]),'minus');
	delete shoppingBag[itemKey];
	// Update shared bag object between pages
	sessionStorage.setItem('shoppingBagGlobal', JSON.stringify(shoppingBag));
	// update view
	itemRow.parentElement.removeChild(itemRow);
	// Update navigation Bag
	updateNavBag();
	updateSubtotal(shoppingBag.totalItem, shoppingBag.totalCost);
}

function minusOne(evt){
	var qttCell = evt.path[1];
	var itemRow = evt.path[2];
	var itemKey = itemRow.querySelector('img').src;
	var shoppingBag = JSON.parse(sessionStorage.getItem('shoppingBagGlobal'));

	updateTotalItem(shoppingBag, QUANTITY,'minus');
	updateTotalCost(shoppingBag, QUANTITY*shoppingBag[itemKey][PRICE],'minus');
	// decrease item quantity by one
	shoppingBag[itemKey][QUANTITY] -= 1;
	if(shoppingBag[itemKey][QUANTITY] == 0){
		// delete item key 
		delete shoppingBag[itemKey];
		// update view
		itemRow.parentElement.removeChild(itemRow);
	}else{ // update view
		qttCell.querySelector('input[type=number]').value = shoppingBag[itemKey][QUANTITY];
	}
	// Update shared bag object between pages
	sessionStorage.setItem('shoppingBagGlobal', JSON.stringify(shoppingBag));
	// Update navigation Bag
	updateNavBag();
	updateSubtotal(shoppingBag.totalItem, shoppingBag.totalCost);
}

function addOne(evt){
	var qttCell = evt.path[1];
	var itemRow = evt.path[2];
	var itemKey = itemRow.querySelector('img').src;
	var shoppingBag = JSON.parse(sessionStorage.getItem('shoppingBagGlobal'));
	updateTotalItem(shoppingBag, QUANTITY);
	updateTotalCost(shoppingBag, QUANTITY*shoppingBag[itemKey][PRICE]);
	if(shoppingBag[itemKey][QUANTITY] == 99){
		alert('Sorry!!! Each item is limited at 99 per order.');
	}else{
		// increase item quantity by one
		shoppingBag[itemKey][QUANTITY] += 1;
		// update view
		qttCell.querySelector('input[type=number]').value = shoppingBag[itemKey][QUANTITY];
		// Update shared bag object between pages
		sessionStorage.setItem('shoppingBagGlobal', JSON.stringify(shoppingBag));
		// Update navigation Bag
		updateNavBag();
		updateSubtotal(shoppingBag.totalItem, shoppingBag.totalCost);
	}
}
/**
 * customer bag tab end
 */

/**
 * customer info tab 
 */
function loadProvince(){
	// get province & country selection list
	var selectProvince = document.getElementById('province');
	var selectCountry = document.getElementById('country');
	// reset province list
	var content = "";
	if(selectCountry.value == 'Canada'){ // load Canada provinces
		provincesCanada.forEach(function(province){
			content += `<option value="${province}">${province}</option>`;
		});
	}else if (selectCountry.value == 'United State'){ // load US provinces
		provincesUS.forEach(function(province){
			content += `<option value="${province}">${province}</option>`;
		});
	}
	selectProvince.innerHTML = content;
}
function loadCustomerInfoTab(){
	// get month selection list
	var selectMonth = document.getElementById('expire-month');
	// create selection list
	monthArr.forEach(function(month){
		selectMonth.innerHTML += `<option value="${month}">${month}</option>`;
	});
	// get year selection list
	var selectYear = document.getElementById('expire-year');
	// create year selection list
	var curYear = new Date().getFullYear();
	for(var i=0;i<11;i++){
		selectYear.innerHTML += `<option value="${curYear+i}">${curYear+i}</option>`;
	}
	// load province selection list
	loadProvince();
	// add event listener to country selection list
	document.getElementById('country').addEventListener("change",loadProvince);
	// get 2 navigate buttons
	var navBtns = document.getElementById("customer-info").querySelectorAll('.btn-form');
	// add event listener to previous button
	navBtns[0].addEventListener('click',function(evt){
		changeTab(evt, 'customer-bag');
		// cancel highlight current tab
		document.getElementById('customer-info-tab').className = document.getElementById('customer-info-tab').className.replace(" active", ""); 		
		
	});
	// add event listener to next button
	navBtns[1].addEventListener('click',function(evt){
		if(document.getElementById('form-order').reportValidity()){// form validation check
			changeTab(evt, 'check-out');
			loadCheckOutTab();
			// highlight next tab
			document.getElementById('check-out-tab').className += " active";
		}
});
}
/**
 * customer info tab end
 */

/**
 * check out tab 
 */
function loadCheckOutTab(){
	var shoppingBag = JSON.parse(sessionStorage.getItem('shoppingBagGlobal'));
	// add shipping address content
	var shippingAddress = document.getElementById('shipping-address');
	shippingAddress.innerHTML = `
	<h4>Shipping address</h4>
	<img src="./imgs/shippingaddress.png" alt="http://freebackgroundcheck.org" style="width:130px;">
	<p>
		${document.getElementById('first-name').value} ${document.getElementById('last-name').value} <br/>
		${document.getElementById('address').value} <br/>
		${document.getElementById('city').value}, ${document.getElementById('province').value}<br/>
		${document.getElementById('country').value}<br/>
		Postal: ${document.getElementById('postal').value.toUpperCase()}<br/>
		Phone: ${document.getElementById('phone').value}
	</p>`;
	// add payment method content
	var paymentMethod = document.getElementById('payment-method');
	paymentMethod.innerHTML = `
	<h4>Payment method</h4>
	<img style="width: 200px;" src="./imgs/${document.getElementById('card-type').value}.png" alt="icon from iconfinder.com"> 
	<p>
  	Number: xxxx-xxxx-xxxx-${document.getElementById('card-number').value.slice(12,16)}<br/> 
		Expiration: ${document.getElementById('expire-month').value}/${document.getElementById('expire-year').value} 
	</p>`;
	// add order summary content
	var tax, shipping, total, orderTotal, purchaseDateTime;
	if (document.getElementById('country').value == 'United State'){
		// apply tax 2% shipping $20
		tax = shoppingBag.totalCost * 0.02;
		shipping = 20;
	}else if (document.getElementById('country').value == 'Canada'){
		// apply tax and shipping in Canada
		switch(document.getElementById('province').value){
			case 'British Columbia':
				tax = shoppingBag.totalCost * 0.12;
				break;
			case 'Quebec':
				tax = shoppingBag.totalCost * 0.13;
			 	break;
			case 'Ontario':
				tax = shoppingBag.totalCost * 0.13;
				break;
			default:
				tax = shoppingBag.totalCost * 0.10;
				break;
		}
		shipping = 0;
	}
	orderTotal = shoppingBag.totalCost + tax + shipping;
	purchaseDateTime = new Date();
	var orderSummary = document.getElementById('order-summary');
	orderSummary.innerHTML = `
	<h4>Order Summary</h4>
	<table>
		<tbody>
			<tr>
				<td colspan="2" style="text-align: center;">
				<img src="./imgs/cimo-logo.jpg" alt="" style="width:200px;">
				</td>
			</tr>
			<tr>
				<td>Items (${shoppingBag.totalItem}):</td>
				<td>$${shoppingBag.totalCost}</td>
			</tr>
			<tr>
				<td>Tax:</td>
				<td>$${tax.toFixed(2)}</td>
			</tr>
			<tr>
				<td>Shipping:</td>
				<td>$${shipping.toFixed(2)}</td>
			</tr>
			<tr id="order-total">
				<td>Order Total:</td>
				<td>$${orderTotal.toFixed(2)}</td>
			</tr>
			<tr>
				<td colspan="2">
					<input id="purchaseBtn" type="button" value="Purchase">
				</td>
			</tr>
			<tr>
				<td colspan="2">Purchased at ${purchaseDateTime.toLocaleTimeString()} ${purchaseDateTime.toLocaleDateString()}</td>
			</tr>
		</tbody>	
	</table>`;
	// add content to purchased list
	var shoppingList = document.getElementById('purchased-list-table');
	// reset table
	var content = `<thead>
		<tr>
			<th class="col-6">Purchased list</th>
			<th class="col-2">Quantity &times Price</th>
			<th class="col-2">Total</th>
		</tr>
	</thead>
	<tbody>`;
	if(shoppingList && shoppingBag){ // at order form page and shoppingBag not null
		Object.keys(shoppingBag).forEach(item => {// Note: "item" is product image link
		if (item !== 'totalItem' && item !== 'totalCost') {
			total = shoppingBag[item][QUANTITY] * shoppingBag[item][PRICE];
			content += `
			<tr>
				<td class="col-6">
					<div>
						<img src="${item}" alt="">
					</div>		
					<div class="product-info">
						<p>
						${shoppingBag[item][NAME]}
						</p>
					</div>
				</td>
				<td class="col-2">${shoppingBag[item][QUANTITY]} &times $${Number(shoppingBag[item][PRICE]).toFixed(2)}</td>
				<td class="col-2">
					<p>$${total.toFixed(2)}</p>
				</td>
			</tr>
			`;
		}
	});
	shoppingList.innerHTML = content + '</tbody>';
	}
	// add event listener for previous button
	var previousBtn = document.getElementById("check-out").querySelector('.btn-form');
	previousBtn.addEventListener('click',function(evt){
		changeTab(evt, 'customer-info');
		// cancel highlight current tab
		document.getElementById('check-out-tab').className = document.getElementById('check-out-tab').className.replace(" active", ""); 
	});
	// add event listener for purchase button
	var purchaseBtn = document.getElementById('purchaseBtn');
	purchaseBtn.addEventListener('click',function(evt){
		var username = document.getElementById('username').value;
		// save data to local storage
		submitIt(username,[purchaseDateTime.toLocaleTimeString()+' '+purchaseDateTime.toDateString(),shoppingBag.totalItem,orderTotal.toFixed(2)]);
		// delete global shopping bag object
		sessionStorage.removeItem('shoppingBagGlobal');
		// update number of item on navigation
		updateNavBag();
		// navigate to history page + add username to url
		var curlinks = window.location.href;
		window.location.href = curlinks.slice(0,curlinks.indexOf('order_form'))+'history.html?username=' + username;
	});
}
/**
 * check out tab end
 */

/**
 * order form page end
 */

 /**
 * history page 
 */
// load history page 
function loadHistory(){
	// add event listener to search button
	document.getElementById('btnSearch').addEventListener('click', function(evt){
		// check validity of username
		var searchField = document.getElementById('search');
		var purchaseInfo = retreiveIt(searchField.value);
		if(purchaseInfo == null){// no username exist 
			searchField.setCustomValidity('This username is not available!');
			// delete non-valid username
			searchField.value = "";
			// turn off validate message prevent validate message pop-up multiple time when user enter another name
			setTimeout(() => {// display 
				searchField.setCustomValidity('');
			}, 1000);
		} 
		// document.getElementById('search-form').reportValidity();
		loadHistoryContent();
	});
	// load content first time
	loadHistoryContent();
}
// load history of username which is conatained in href
function loadHistoryContent(){
	var index = window.location.href.indexOf('=');
	if(index > 0){ // href was intentionally created contain '=' contain username
		// get username from href
		var username = window.location.href.slice(index+1,);
		// history: 2D array [Date|Number of Items|Total]
		var history = retreiveIt(username);
		if(history != null){// user available
			var historyTable = document.getElementById('history-table');
			var qtt = 0;
			var total = 0;
			var content;
			// add content to history table
			content = `<caption>Purchased history of <b>${username}</b></caption>
			<thead>	
				<tr>
					<th>Purchased date</th>
					<th>Purchased items</th>
					<th>Total</th>
				</tr>
			</thead>
			<tbody>`;
			history.reverse().forEach(function(purchaseInfo){
				content += `
				<tr>
					<td>${purchaseInfo[0]}</td>
					<td>${purchaseInfo[1]}</td>
					<td>$${purchaseInfo[2]}</td>
				</tr>`;
				total += Number(purchaseInfo[2]);
				qtt += Number(purchaseInfo[1]);
			});
			content += `
				<tr>
					<td colspan="3">In total, you have purchased <b>${qtt}</b> items and spent <b>$${total.toFixed(2)}</b> with us</td>
				</tr>
			</tbody>`;
			historyTable.innerHTML = content;
		}else{ // user manually enter incorrect username on the url
			document.getElementById('history-table').style = 'display:none;';
		}
	}else{ // href does not contain username -> display blank history page
		document.getElementById('history-table').style = 'display:none;';
	}
}
/**
 * history page end
 */

/**
 * first load actions
 */
function initializeView() {
	updateNavBag();
	if(window.location.href.split('/').pop().split('.')[0] == 'order_form'){// @ order page
		loadShoppingBagTab();
	} else if(window.location.href.split('/').pop().split('.')[0] == 'history'){// @ history page
		loadHistory();
	}
}
initializeView();
/**
 * first load actions end
 */