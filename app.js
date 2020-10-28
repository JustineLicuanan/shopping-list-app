const addItemForm = document.querySelector('.add-item-form');
const shoppingList = document.querySelector('.shopping-list');

// Item factory
class Item {
	static appendToList = ({ title }) => {
		// Create item container
		const item = document.createElement('li');

		// Configure item title
		const itemTitle = document.createElement('textarea');
		itemTitle.classList.add('item-title');
		itemTitle.placeholder = 'Edit';
		itemTitle.disabled = true;
		itemTitle.textContent = title;
		item.appendChild(itemTitle);

		// Configure check item button
		const checkItemIcon = document.createElement('span');
		checkItemIcon.classList.add('fas', 'fa-check');
		const checkItemBtn = document.createElement('button');
		checkItemBtn.appendChild(checkItemIcon);
		checkItemBtn.classList.add('check-item-btn');
		checkItemBtn.id = 'check-item-btn';
		item.appendChild(checkItemBtn);

		// Configure edit item button
		const editItemIcon = document.createElement('span');
		editItemIcon.classList.add('fas', 'fa-edit');
		const editItemBtn = document.createElement('button');
		editItemBtn.appendChild(editItemIcon);
		editItemBtn.classList.add('edit-item-btn');
		editItemBtn.id = 'edit-item-btn';
		item.appendChild(editItemBtn);

		// Configure delete item button
		const delItemIcon = document.createElement('span');
		delItemIcon.classList.add('fas', 'fa-trash');
		const delItemBtn = document.createElement('button');
		delItemBtn.appendChild(delItemIcon);
		delItemBtn.classList.add('del-item-btn');
		delItemBtn.id = 'del-item-btn';
		item.appendChild(delItemBtn);

		// Configure item container
		item.classList.add('item');
		item.id = `d${Date.now()}`;

		// Append item to DOM
		shoppingList.appendChild(item);
	};

	static checkInList = (checkItemBtn) => {
		const item = checkItemBtn.parentElement;
		const checkItemIcon = checkItemBtn.children[0];

		if (item.classList.contains('checked')) {
			item.classList.remove('checked');
			checkItemIcon.classList.replace('fa-ban', 'fa-check');
			checkItemBtn.classList.replace('cancel-item-btn', 'check-item-btn');
			return;
		}
		item.classList.add('checked');
		checkItemIcon.classList.replace('fa-check', 'fa-ban');
		checkItemBtn.classList.replace('check-item-btn', 'cancel-item-btn');
	};

	static deleteInList = (delItemBtn) => {
		const item = delItemBtn.parentElement;
		item.classList.add('deleted');
		item.addEventListener('transitionend', () => {
			item.remove();
		});
	};
}

// Handle submit event of add item form
addItemForm.addEventListener('submit', (e) => {
	// Prevent unwanted page refresh
	e.preventDefault();

	// Validate item input
	const itemInp = addItemForm.itemInp.value.trim();
	if (!itemInp) {
		alert('Item field is required');
		addItemForm.itemInp.value = '';
		return;
	}

	// Append item to list
	Item.appendToList({
		title: itemInp,
	});

	// Reset input value
	addItemForm.itemInp.value = '';
	addItemForm.itemInp.focus();
});

// Handle button clicks inside shopping list
shoppingList.addEventListener('click', (e) => {
	const elClicked = e.target;
	switch (elClicked.id) {
		case 'check-item-btn':
			Item.checkInList(elClicked);
			break;
		case 'del-item-btn':
			Item.deleteInList(elClicked);
			break;
	}
});
