// todo web server 구동하기
// [x] 링크에 있는 웹 서버 저장소를 clone하고 로컬에서 웹 서버를 실행시킨다.

// todo 웹 서버 요청 부분
// [x] 서버에 새로운 메뉴명이 추가될 수 있도록 요청
// [x] 카테고리별 메뉴리스트 불러오는 요청
// [x] 서버에 메뉴 이름 수정하는 요청
// [x] 서버에 메뉴 품절 상태를 토글될 수 있도록 요청
// [x] 서버에 메뉴 삭제하는 요청

// todo 리팩터링
// [x] localStorage에 저장하는 로직은 지운다.
// [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// todo 사용자 경험
// [] API 통신이 실패하는 경우에, alert으로 예외처리를 진행한다.
// [] 중복되는 메뉴는 추가할 수 없다.

import { $ } from './utils/dom.js';
import MenuApi from './api/index.js';

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso';
  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    initEventListeners();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    const template = this.menu[this.currentCategory]
      .map((item) => {
        return `<li data-menu-id='${item.id}' class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name ${item.isSoldOut ? 'sold-out' : ''}">${item.name}</span>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
      >
        품절
      </button>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
      >
        수정
      </button>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
      >
        삭제
      </button>
    </li>`;
      })
      .join('');

    $('#menu-list').innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const addMenuName = async () => {
    if ($('#menu-name').value === '') {
      alert('메시지를 입력해 주세요');
      return;
    }
    const menuName = $('#menu-name').value;
    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    $('#menu-name').value = '';
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt('메뉴명을 수정하세요', $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    render();
  };

  const removeMenuName = async (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const menuId = e.target.closest('li').dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains('cafe-category-name');
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  };

  const initEventListeners = () => {
    $('#menu-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-edit-button')) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains('menu-remove-button')) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains('menu-sold-out-button')) {
        soldOutMenu(e);
        return;
      }
    });

    $('#menu-form').addEventListener('submit', (e) => {
      e.preventDefault();
    });

    $('#menu-submit-button').addEventListener('click', addMenuName);

    $('#menu-name').addEventListener('keypress', (e) => {
      if (e.key !== 'Enter') {
        return;
      }
      addMenuName();
    });

    $('nav').addEventListener('click', changeCategory);
  };
}

const app = new App();
app.init();
