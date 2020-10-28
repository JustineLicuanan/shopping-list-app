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
		checkItemIcon.id = 'check-item-icon';
		const checkItemBtn = document.createElement('button');
		checkItemBtn.appendChild(checkItemIcon);
		checkItemBtn.classList.add('check-item-btn');
		checkItemBtn.id = 'check-item-btn';
		item.appendChild(checkItemBtn);

		// Configure edit item button
		const editItemIcon = document.createElement('span');
		editItemIcon.classList.add('fas', 'fa-edit');
		editItemIcon.id = 'edit-item-icon';
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
