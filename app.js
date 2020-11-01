const addItemForm = document.querySelector('.add-item-form');
const shoppingList = document.querySelector('.shopping-list');

// Item factory
class Item {
	static appendToList = ({ id, title, completed }) => {
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
		if (completed) checkItemIcon.classList.add('fas', 'fa-ban');
		else checkItemIcon.classList.add('fas', 'fa-check');
		const checkItemBtn = document.createElement('button');
		checkItemBtn.appendChild(checkItemIcon);
		if (completed) checkItemBtn.classList.add('cancel-item-btn');
		else checkItemBtn.classList.add('check-item-btn');
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
		if (completed) item.classList.add('checked');
		item.id = id;

		// Append item to DOM
		shoppingList.appendChild(item);
	};

	static checkInList = (state, checkItemBtn) => {
		const item = checkItemBtn.parentElement;
		const localItem = this.getOneFromLocalStorage(state, { id: item.id });
		const itemTitle = checkItemBtn.previousElementSibling;
		const checkItemIcon = checkItemBtn.children[0];
		const editItemBtn = checkItemBtn.nextElementSibling;
		const editItemIcon = editItemBtn.children[0];

		// Validate edited item
		if (!itemTitle.value.trim()) {
			alert('Item field is required');
			itemTitle.value = '';
			return;
		}

		// Update the item title in the local storage
		if (!itemTitle.disabled) {
			itemTitle.value = itemTitle.value.trim();
			this.update(state, { id: item.id }, { title: itemTitle.value });

			if (localItem.completed) {
				item.classList.add('checked');
				checkItemIcon.classList.replace('fa-check', 'fa-ban');
				checkItemBtn.classList.replace('check-item-btn', 'cancel-item-btn');
			}
			itemTitle.disabled = true;
			editItemIcon.classList.replace('fa-ban', 'fa-edit');
			editItemBtn.classList.replace('cancel-item-btn', 'edit-item-btn');
			return;
		}

		if (item.classList.contains('checked')) {
			this.update(state, { id: item.id }, { completed: false });
			item.classList.remove('checked');
			checkItemIcon.classList.replace('fa-ban', 'fa-check');
			checkItemBtn.classList.replace('cancel-item-btn', 'check-item-btn');
			return;
		}
		this.update(state, { id: item.id }, { completed: true });
		item.classList.add('checked');
		checkItemIcon.classList.replace('fa-check', 'fa-ban');
		checkItemBtn.classList.replace('check-item-btn', 'cancel-item-btn');
	};

	static editInList = (state, editItemBtn) => {
		const item = editItemBtn.parentElement;
		const localItem = this.getOneFromLocalStorage(state, { id: item.id });
		const itemTitle = editItemBtn.previousElementSibling.previousElementSibling;
		const checkItemBtn = editItemBtn.previousElementSibling;
		const checkItemIcon = checkItemBtn.children[0];
		const editItemIcon = editItemBtn.children[0];

		// Cancel item editing
		if (!itemTitle.disabled) {
			if (localItem.completed) {
				item.classList.add('checked');
				checkItemIcon.classList.replace('fa-check', 'fa-ban');
				checkItemBtn.classList.replace('check-item-btn', 'cancel-item-btn');
			}
			itemTitle.value = localItem.title;
			itemTitle.disabled = true;
			editItemIcon.classList.replace('fa-ban', 'fa-edit');
			editItemBtn.classList.replace('cancel-item-btn', 'edit-item-btn');
			return;
		}

		if (item.classList.contains('checked')) {
			item.classList.remove('checked');
			checkItemIcon.classList.replace('fa-ban', 'fa-check');
			checkItemBtn.classList.replace('cancel-item-btn', 'check-item-btn');
		}
		itemTitle.disabled = false;
		itemTitle.focus();
		editItemIcon.classList.replace('fa-edit', 'fa-ban');
		editItemBtn.classList.replace('edit-item-btn', 'cancel-item-btn');
	};

	static deleteInList = (state, delItemBtn) => {
		const item = delItemBtn.parentElement;

		this.delete(state, { id: item.id });
		item.classList.add('deleted');
		item.addEventListener('transitionend', () => {
			item.remove();
		});
	};

	// Save item to local storage
	static create = (state, { title }) => {
		const items = this.getFromLocalStorage(state);
		const item = {
			id: `d${Date.now()}`,
			title,
			completed: false,
		};

		localStorage.setItem(state, JSON.stringify([...items, item]));
		return item;
	};

	static render = (state) => {
		const items = this.getFromLocalStorage(state);
		if (!items) return;
		items.forEach((item) => this.appendToList(item));
	};

	static update = (state, { id }, props) => {
		const items = this.getFromLocalStorage(state);
		const keys = Object.keys(props);

		localStorage.setItem(
			state,
			JSON.stringify(
				items.map((item) => {
					if (item.id === id)
						keys.forEach((key) => {
							item[key] = props[key];
						});
					return item;
				})
			)
		);
	};

	static delete = (state, { id }) => {
		const items = this.getFromLocalStorage(state);
		localStorage.setItem(
			state,
			JSON.stringify(items.filter((item) => item.id !== id))
		);
	};

	static getFromLocalStorage = (state) => {
		if (!localStorage.getItem(state)) return [];
		return JSON.parse(localStorage.getItem(state));
	};

	static getOneFromLocalStorage = (state, { id }) => {
		const items = JSON.parse(localStorage.getItem(state));
		return items.find((item) => item.id === id);
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

	// Save item to local storage
	const item = Item.create('items', { title: itemInp });

	// Append item to list
	Item.appendToList(item);

	// Reset input value
	addItemForm.itemInp.value = '';
	addItemForm.itemInp.focus();
});

// Handle button clicks inside shopping list
shoppingList.addEventListener('click', (e) => {
	const elClicked = e.target;
	switch (elClicked.id) {
		case 'check-item-btn':
			Item.checkInList('items', elClicked);
			break;
		case 'edit-item-btn':
			Item.editInList('items', elClicked);
			break;
		case 'del-item-btn':
			Item.deleteInList('items', elClicked);
			break;
	}
});

window.addEventListener('DOMContentLoaded', () => {
	Item.render('items');
});
