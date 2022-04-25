// 개발부터 바로 들어가기 전에 요구사항 분석부터 한다.
// 한 문장에 구현해야 할 요구사항이 2가지 이상이면 쪼갠다.
// 순서의 의존성이 있을 수 있으므로 순서를 정해본다.

// 메뉴 추가
// [x] 확인 버튼 누르면 메뉴가 추가된다.
// [x] 엔터키를 누르면 메뉴가 추가된다.
// [x] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// [x] 총 메뉴 개수를 count하여 상단에 보여준다.
// [x] 메뉴가 추가되고 나면 input은 빈 값으로 바꾼다.
// [x] 사용자 입력값이 빈 값이면 추가 x

// 메뉴 수정
// [x] 수정 버튼을 누르면 prompt 창이 떠서 수정이 가능하다.
// [x] 확인 버튼을 누르면 수정이 완료된다.

// 메뉴 삭제
// [x] 삭제 버튼을 클릭하면 confirm 창이 떠서 진짜 삭제할것인지 물어본다.
// [x] 확인 버튼을 누르면 메뉴가 삭제된다.
// [x] 총 메뉴 개수를 count하여 상단에 보여준다.

// 관용적으로 줄여서 사용 - 반복되는 코드를 줄임
const $ = (selector) => document.querySelector(selector);

function App() {
  const updateMenuCount = () => {
    const menuCount = $('#espresso-menu-list').querySelectorAll('li').length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  $('#espresso-menu-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-edit-button')) {
      const $menuName = e.target.closest('li').querySelector('.menu-name');
      const updatedMenuName = prompt('메뉴명을 수정하세요', $menuName.innerText);
      $menuName.innerText = updatedMenuName;
    }
    if (e.target.classList.contains('menu-remove-button')) {
      if (confirm('정말 삭제하시겠습니까?')) {
        e.target.closest('li').remove();
        updateMenuCount();
      }
    }
  });
  $('#espresso-menu-form').addEventListener('submit', (e) => {
    e.preventDefault();
  });

  const addMenuName = () => {
    if ($('#espresso-menu-name').value === '') {
      alert('메시지를 입력해 주세요');
      return;
    }
    const espressoMenuName = $('#espresso-menu-name').value;
    const menuItemTemplate = (espressoMenuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
    };
    $('#espresso-menu-list').insertAdjacentHTML('beforeend', menuItemTemplate(espressoMenuName));
    updateMenuCount();
    $('#espresso-menu-name').value = '';
  };

  $('#espresso-menu-submit-button').addEventListener('click', () => {
    addMenuName();
  });

  $('#espresso-menu-name').addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') {
      return;
    }
    addMenuName();
  });
}
App();
