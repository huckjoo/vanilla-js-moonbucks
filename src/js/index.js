// todo 저장소 관련
// [x] localStorage에 데이터를 저장한다.
// [x] 메뉴를 추가할 때
// [x] 메뉴를 수정할 때
// [x] 메뉴를 삭제할 때
// [x] localStorage에서 데이터를 읽어온다. -> 새로고침시에도 남아있게

// todo 카테고리별 메뉴판 관리
// [x] 에스프레소 메뉴판 관리
// [x] 프라푸치노 메뉴판 관리
// [x] 블렌디드 메뉴판 관리
// [x] 티바나 메뉴판 관리
// [x] 디저트 메뉴판 관리

// todo 페이지 접근시 최초 데이터 read & rendering
// [x] 페이지에 최초로 접근할 때 localstorage에서 에스프레소 메뉴 data를 불러온다.
// [x] 블러온 데이터를 가지고 화면에 에스프레소 메뉴를 그려준다.

// todo 품절상태 관리
// [] 품절 상품에 품절 버튼을 추가한다.
// [] 품절 버튼을 클릭시 '품절입니다' alert 표시
// [] sold-out class를 추가하여 상태를 변경한다.

const $ = (selector) => document.querySelector(selector);

// 상태 == data
const store = {
  setLocalStorage(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem('menu'));
  },
};

function App() {
  // 상태는 변하는 데이터 - 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso';
  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        return `<li data-menu-id='${index}' class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name ${item.soldOut ? 'sold-out' : ''}">${item.name}</span>
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
    const menuCount = $('#menu-list').querySelectorAll('li').length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    if ($('#menu-name').value === '') {
      alert('메시지를 입력해 주세요');
      return;
    }
    const MenuName = $('#menu-name').value;
    this.menu[this.currentCategory].push({ name: MenuName });
    store.setLocalStorage(this.menu);
    render();
    $('#menu-name').value = '';
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt('메뉴명을 수정하세요', $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const menuId = e.target.closest('li').dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest('li').remove();
      updateMenuCount();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

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

  $('nav').addEventListener('click', (e) => {
    const isCategoryButton = e.target.classList.contains('cafe-category-name');
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  });
}
// new App()을 사용하면 새로운 객체를 여러개 만들 수 있다..!
// app이 하나의 인스턴스가 됨, App()은 계속 재사용됨
const app = new App(); //여기서 App(); 이렇게 실행하면 this가 undefined가 됨
app.init();
