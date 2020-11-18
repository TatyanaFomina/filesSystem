const data = [
  {
    folder: true,
    title: 'Grow',
    children: [
      {
        title: 'logo.png'
      },
      {
        folder: true,
        title: 'English',
        children: [
          {
            title: 'Present_Perfect.txt'
          }
        ]
      }
    ]
  },
  {
    folder: true,
    title: 'Soft',
    children: [
      {
        folder: true,
        title: 'NVIDIA',
        children: null
      },
      {
        title: 'nvm-setup.exe'
      },
      {
        title: 'node.exe'
      }
    ]
  },
  {
    folder: true,
    title: 'Doc',
    children: [
      {
        title: 'project_info.txt'
      }
    ]
  },
  {
    title: 'credentials.txt'
  }
];

const rootNode = document.getElementById('root');

function createTree(container, arr) {
  container.append(createTreeDom(arr));
}
function createTreeDom(arr) {
  let ul = document.createElement('ul');
  ul.className = 'list';
  if (arr === null) {
    ul.append(document.createTextNode('Folder is empty'));
    ul.classList.add('empty');
  } else {
    for (let i = 0; i < arr.length; i++) {
      let li = document.createElement('li');

      if (arr[i].folder) {
        li.innerHTML = `
                        <span class="menu-item-wrapper" tabindex="0"><i class="material-icons">folder</i>
                        <span class="menu-text">${arr[i].title}</span></span>
                    `;
      } else {
        li.innerHTML = `
                        <span class="menu-item-wrapper" tabindex="0"><i class="material-icons">insert_drive_file</i>
                        <span class="menu-text">${arr[i].title}</span></span>
                    `;
      }
      if (arr[i].folder) {
        let childrenUl = createTreeDom(arr[i].children);
        if (childrenUl) {
          li.append(childrenUl);
        }
      }
      ul.append(li);
    }
  }
  return ul;
}

createTree(rootNode, data);

const icons = document.querySelectorAll('.material-icons');

for (let icon of icons) {
  if (icon.innerHTML === 'insert_drive_file') {
    icon.style.color = '#b0b0b0';
  }

  if (icon.innerHTML === 'folder' || icon.innerHTML === 'folder_open') {
    icon.style.color = '#c09809';
  }
}

const menu = document.querySelector('ul');
menu.className = 'menu';
menu.onclick = function (event) {
  if (event.target.parentNode.tagName !== 'SPAN') {
    return;
  }

  let childrenContainer = event.target.parentNode.parentNode.querySelector(
    'ul'
  );
  if (!childrenContainer) {
    return;
  }

  childrenContainer.classList.toggle('open');

  if (
    event.target.parentNode.firstElementChild.innerHTML === 'folder' &&
    childrenContainer.classList.contains('open')
  ) {
    event.target.parentNode.firstElementChild.innerHTML = 'folder_open';
  }

  if (
    event.target.parentNode.firstElementChild.innerHTML === 'folder_open' &&
    !childrenContainer.classList.contains('open')
  ) {
    event.target.parentNode.firstElementChild.innerHTML = 'folder';
  }
};

const contextMenu = document.createElement('div');
contextMenu.className = 'context-menu';
const contextMenuOptions = document.createElement('ul');
contextMenuOptions.className = 'context-menu-options';
const renameOption = document.createElement('li');
renameOption.innerHTML = 'Rename';
renameOption.className = 'rename';
contextMenu.append(contextMenuOptions);
const deleteOption = renameOption.cloneNode(false);
deleteOption.innerHTML = 'Delete item';
deleteOption.className = 'delete';
contextMenuOptions.append(renameOption, deleteOption);
menu.after(contextMenu);
const message = document.createElement('p');

menu.oncontextmenu = function (e) {
  e.preventDefault();
  let field = e.target;

  if (e.target.nodeName === 'I') {
    field = e.target.nextSibling.nextSibling;
  }
  contextMenu.style.position = 'absolute';
  contextMenu.style.display = 'block';
  let indent = 60;
  let left = e.clientX + indent;
  let top = e.clientY;
  contextMenu.style.left = left + 'px';
  contextMenu.style.top = top + 'px';

  if (field.tagName === 'SPAN') {
    if (renameOption.classList.contains('disabled')) {
      renameOption.classList.remove('disabled');
    }

    if (deleteOption.classList.contains('disabled')) {
      deleteOption.classList.remove('disabled');
    }
    renameOption.onclick = function () {
      let input = document.createElement('input');

      input.value = field.innerHTML;
      field.replaceWith(input);
      let regexp = /^[a-zA-Z_-]+[^.]/g;
      let curValue = input.value.match(regexp);
      let selectionEnd = curValue[0].toString().length;

      input.focus();
      input.setSelectionRange(0, selectionEnd);
      input.onchange = function () {
        field.innerHTML = input.value;
        input.replaceWith(field);
      };
      input.onblur = function () {
        input.replaceWith(field);
      };
    };
    e.target.parentNode.focus();
    deleteOption.onclick = function () {
      if (field.parentNode.parentNode.parentNode.tagName === 'UL') {
        let list = field.parentNode.parentNode.parentNode;
        field.parentNode.parentNode.remove();

        if (!list.children.length) {
          list.append(document.createTextNode('Folder is empty'));
          list.classList.add('empty');
        }
      } else {
        field.parentNode.parentNode.remove();
      }
    };
  } else {
    renameOption.classList.add('disabled');
    deleteOption.classList.add('disabled');
  }
};

window.onclick = function () {
  const contextMenu = document.querySelector('.context-menu');

  if (contextMenu) {
    contextMenu.style.display = 'none';
  }
};
