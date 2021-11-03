// Переменная для Бургера, блокировки скролла
let unlock = true;

// include('script/burger.js', {})
// Для работы webP
function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support === true) {
		document.querySelector('html').classList.add('_webp');
	} else {
		document.querySelector('html').classList.add('_no-webp');
	}
});



let search = document.querySelector(".search");
if (search) {
	let field = document.querySelector(".field")
	search.addEventListener("click", function () {
		field.classList.toggle("_active");
	});
	document.body.addEventListener("click", function (e) {
		if (field.classList.contains("_active")) {
			let close = e.target;
			if (!close.closest(".form")) {
				field.classList.remove("_active");
			}
		}

		// console.log(document.querySelector(".field").children);
	})

}


/*Динамический адаптив=========================================*/
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

// ПОДКЛЮЧИТЬ ФАЙЛ =======================================================================================


// Для отсчета слайдов справа на лево в html указать в <div> главного контейнера для слайдера dir="rtl" 
// Если Swiper является флекс элементом, то указываем этому элементу min-width = 0;
// Дочерний слайд. В html слайд в слайде и в js делвем новую инициализацию + указать параметр в дочернем слайде nested: true, чтобы не влияло на родителя + отключить переключение по клику на слайд slideToClickedSlide: false,
// Инициализируем Swiper, дав ему имя главного контейнера
new Swiper('.swiper-container', {
	// Настройки Swiper

	// Свой класс swiper-wrapper 
	// wrapperClass: "ИМЯ_КЛАССА",
	// Свой класс swiper-slide
	// slideClass: "ИМЯ_КЛАССА",

	// Стрелки
	navigation: {
		
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev'
		
	},
	// Навигация 
	// Буллеты, текущее положение, прогресс
	// Добавить html
	// pagination: {
		/*
		// Имя класса буллетов
		el: '.swiper-pagination',
	    
		*/

		// String with type of pagination. Can be "bullets", "fraction", "progressbar" or "custom"

		/*
		// Булдеты
		// Чтобы при нажатии на кружок срабатывал переход        
		// type: 'bullets',
		// clickable: true,
		// Динамический буллет
		dynamicBullets: true,
		// Кастомные буллеты. Изменяем параметры вывода
		// Параметры изменяются в классе .swiper-pagination-bullet
		renderBullet: function (index, className) {
			return '<span class="' + className + '">' + (index + 1) + '</span>';
		},
		// Стилизация буллета (свой класс)
		// bulletClass: "ИМЯ_КЛАССА",
		// Стилизация активного буллета (свой класс)
		// bulletActiveClass: "ИМЯ_КЛАССА",
		*/

		/*
		// Фракция
		type: 'fraction',
		// Кастомный вывод фракции
		renderFraction: function (currentClass, totalClass) {
			return 'Фото <span class="' + currentClass + '"></span>' +
				' из ' +
				'<span class="' + totalClass + '"></span>';
		},
		*/

		/*
		// Прогрессбар
		type: 'progressbar'
		*/
	// },


	// Скролл
	// Добавить html
	// scrollbar: {
		/*
		el: '.swiper-scrollbar',
		// Возможность перетаскивать скролл
		draggable: true
		*/
	// },

	// Навигация по хешу
	// В html каждому слайду добавить в <div > data-hash="ПРОИЗВОЛЬНОЕ_ИМЯ"
	// hashNavigation: {
		/*
		// Отслеживать состояние
		watchState: true,
		*/
	// },

	// Управление клавиатурой
	// keyboard: {
		/*
		// Включить\выключить
		enabled: true,
		// Включить\выключить
		// только когда слайдер
		// в пределах вьюпорта
		onlyInViewport: true,
		// Включить\выключить
		// управление клавишами
		// pageUp, pageDown
		pageUpDown: true,
		*/
	// },

	// Управление колесом мыши
	// mousewheel: {
		/*
		// Чувствительность колеса мыши
		sensitivity: 1,
		// Класс объекта на котором
		// будет срабатывать прокрутка мышью.
		//eventsTarget: ".image-slider"
		*/
	// },


	/*
	// Включение/отключение
	// перетаскивания слайдов на ПК
	simulateTouch: true,
	// Чувствительность свайпа
	touchRatio: 1,
	// Угол срабатывания свайпа/перетаскивания
	touchAngle: 45,
	// Курсор перетаскивания
	grabCursor: true,
	// Переключение при клике на слайд
	// Работает тогда, когда слайдов не один (slidesPerView: ;)
	slideToClickedSlide: false,
	// Автовысота
	autoHeight: false,
	// Отключение функционала 
	// если слайдов меньше чем нужно 
	// (Уберуться кнопки, кролл ...)
	watchOverflow: true,
	// Активный слайд по центру
	centeredSlides: false,
   
	*/

	// При работе, например, с табами, когда слайдер изначально не виден
	// Обновить свайпер
	// при изменении элементов слайдера
	// observer: true,

	// Обновить свайпер
	// при изменении родительских
	// элементов слайдера
	// observeParents: true,

	// Обновить свайпер
	// при изменении дочерних
	// элементов слайда
	// observeSlideChildren: true,

	// Количество слайдов для показа
	slidesPerView: 4, 

	// Отступ между слайдами
	// spaceBetween: 0, 

	// Количество пролистываемых слайдов
	/* slidesPerGroup: 1, */

	// Стартовый слайд.
	/* initialSlide: 0, */

	// Мультирядность
	// Отключить автовысоту
	// Изменить стили :
	// 1)для всего слайдера указать высоту
	//  либо поместить его в блок
	//  у которого есть определенная высота 
	// 2)изменить высоту для самих слайдов 
	// height: calc((100% - ОТСТУПЫ_МЕЖДУ_СЛАЙДАМИ_px) / КОЛИЧЕСТВО_РЯДОВ)
	/* slidesPerColumn: 2, */

	// Бесконечный слайдер
	// скролл отключить
	// мультирядность не больше 1
	/* loop: true, */

	// ??
	// Кол-во дублирующих слайдов
	// Если используем slidesPerView: 'auto';, то стоит
	// указать этот параметр
	// ??
	/* loopedSlides: 2, */

	// Свободный режим
	// при скролле блоки не фиксируются на каком-то конкретном
	/* freeMode: true, */

	// Автопрокрутка
	/*
	autoplay: {
		// Пауза между прокруткой
		delay: 1000,
		// Закончить на последнем слайде
		stopOnLastSlide: true,
		// Отключить после ручного переключения
		disableOnInteraction: false
	},
	*/

	// Скорость переключения слайдов
	/* speed: 300, */

	// Вертикальный слайдер 
	// vertical  horizontal
	/* direction: 'horizontal', */


	// Эффекты переключения слайдов.
	// effect: 'slide',
	// {=============================
	// Листание slide
	// Cмена прозрачности fade
	// Дополнение к fade
	/*   fadeEffect: {
	// Параллельная
	// смена прозрачности
	crossFade: true
	},     */
	// Переворот flip
	// Дополнение к flip
	/*    flipEffect: {
		// Тень
		slideShadows: true,
		// Показ только активного слайда
		limitRotation: true
	},    */
	// Куб cube
	// Дополнение к cube
	/*     cubeEffect: {
		// Настройки тени
		slideShadows: true,
		shadow: true,
		shadowOffset: 20,
		shadowScale: 0.94
	},    */
	// Эффект потока coverflow
	// Дополнение к coverflow
	/*    coverflowEffect: {
		// Угол
		rotate: 20,
		// Наложение
		stretch: 50,
		// Тень
		slideShadows: true,
	},*/
	// =============================}    

	
	// Брейк поинты (адаптив). 
	// Срабатывают на ширинах больше указанных
	// Ширина экрана
	breakpoints: {
		320: {
			slidesPerView: 1,
		},
		480: {
			slidesPerView: 2,
		},
		992: {
			slidesPerView: 4,
		}
	},

	/*
	 // Брейк поинты (адаптив)
	 // Соотношение сторон
	 breakpoints: {
		 '@0.75': {
			 slidesPerView: 1,
		 },
		 '@1.00': {
			 slidesPerView: 2,
		 },
		 '@1.50': {
			 slidesPerView: 3,
		 }
	 },
	 */

	// Отключить предзагрузка картинок
	// Для картинки в html указать class="swiper-lazy"
	// Путь к изображению прописать в <img > как data-src="..."
	// а для самого изображения маленькое 1х1 изображение
	// После добавить блок с class="swiper-lazy-preloader", котроая добавит иконку подгрузки
	// Желательно включать, когда slidesPerView = 'auto' или больше 1
	/* preloadImages: false,
	 // Lazy Loading
	 // (подгрузка картинок)
	 lazy: {
		 // Подгружать на старте
		 // переключения слайда
		 loadOnTransitionStart: false,
		 // Подгрузить предыдущую
		 // и следующую картинки
		 loadPrevNext: false,
	 },
	 // Слежка за видимыми слайдами
	 watchSlidesProgress: true,
	 // Добавление класса видимым слайдам
	 watchSlidesVisibility: true,
	 */

	// Миниатюры (превью)
	// В html под главным слайдером создаем новый swiper-container с классом (к примеру) .image-mini-slider
	// с миниатюрами. Количество миниатюр = количеству слайдов
	/*
	thumbs: {
		// Свайпер с мениатюрами
		// и его настройки
		swiper: {
			el: '.image-mini-slider',
			slidesPerView: 5,
		}
	},
	*/



	/*
		// События
	on: {
		// Событие инициализации
		init: function () {
			console.log('Слайдер запущен!');
		},
		// Событие смены слайда
		slideChange: function () {
			console.log('Слайд переключен');
		}
	},
	*/

});

/*
// Слайдер в слайдере
new Swiper('.image-in-slider', {
	// Курсор перетаскивания
	grabCursor: true,
	// Навигация
	// пагинация, текущее положение, прогрессбар
	pagination: {
		el: '.swiper-pagination',
		// Буллеты
		clickable: true,
	},
	// Корректная работа
	// перетаскивания\свайпа
	// для дочернего слайдера
	nested: true,
});
*/
/*
// Еще один слайдер
let myTextSlider = new Swiper('.text-slider', {
	// Количество слайдов для показа
	slidesPerView: 3,
	// Отступ между слайдами
	spaceBetween: 30,
});

// Передача управления
myImageSlider.controller.control = myTextSlider;
myTextSlider.controller.control = myImageSlider;
*/

/*
// Параллакс слайдер
new Swiper('.parallax-slider', {
	// Включаем параллакс
	parallax: true,
	// скорость переключения
	speed: 2000,
	// Стрелки
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev'
	},
});
*/


/*
// Параметры
// Получение
let qSlides = myImageSlider.slides.length;

// Изменение
myImageSlider.params.speed = 3000;
*/

/*
// Методы
// Обновить слайдер
myImageSlider.update();

// Переключится на слайд 2, скорость 800
myImageSlider.slideTo(2, 800);
*/

/*
// События
// Событие смены слайда
myImageSlider.on('slideChange', function () {
	console.log('Слайд переключен');
});
*/


/*
// Запуск автоппрокрутки при наведении
let sliderBlock = document.querySelector('.image-slider');

// myImageSlider  - это переменная которой присвоен слайдер

sliderBlock.addEventListener("mouseenter", function (e) {
	myImageSlider.params.autoplay.disableOnInteraction = false;
	myImageSlider.params.autoplay.delay = 500;
	myImageSlider.autoplay.start();
});
sliderBlock.addEventListener("mouseleave", function (e) {
	myImageSlider.autoplay.stop();
});

*/


/*
// Фракция
let mySliderAllSlides = document.querySelector('.image-slider__total');
let mySliderCurrentSlide = document.querySelector('.image-slider__current');

mySliderAllSlides.innerHTML = myImageSlider.slides.length;

myImageSlider.on('slideChange', function () {
	let currentSlide = ++myImageSlider.realIndex;
	mySliderCurrentSlide.innerHTML = currentSlide;
});
*/

// Указать .wrapper для всего документа.

// Обычный POPUP
// class="_popup-link" для ссылки
// href="#ИМЯ_POPUP_НА_КОТОРЫЙ_ССЫЛАЕМСЯ"
// В popap указываем дополнительный класс "popup_ИМЯ_POPUP_НА_КОТОРЫЙ_ССЫЛАЕМСЯ" 
// class="popup popup_ИМЯ_POPUP_НА_КОТОРЫЙ_ССЫЛАЕМСЯ"

// POPUP-VIDEO
// class="_popup-link" для ссылки
// href="#video"
// data-video="ID_VIDEO_ИЗ_ССЫЛКИ_В_ЮТУБЕ" 
// Ссылка на popup-video <a class="_popup-link" href="#video" data-video="ID_VIDEO_ИЗ_ССЫЛКИ_В_ЮТУБЕ">Попап</a>
// Например <a class="_popup-link" href="#video" data-video="2FiNGbXTFJo">Это попап</a>



// ПОДКЛЮЧИТЬ bodyLock.js  =======================================================================================
// Он указывается и в бургере (body_lock)

// Нужна переменная unlock

//=================
//ActionsOnHash
if (location.hash) {
	const hsh = location.hash.replace('#', '');
	if (document.querySelector('.popup_' + hsh)) {
		popup_open(hsh);
	} else if (document.querySelector('div.' + hsh)) {
		_goto(document.querySelector('.' + hsh), 500, '');
	}
}
//=================
//Popups
let popup_link = document.querySelectorAll('._popup-link');
let popups = document.querySelectorAll('.popup');
for (let index = 0; index < popup_link.length; index++) {
	const el = popup_link[index];
	el.addEventListener('click', function (e) {
		if (unlock) {
			let item = el.getAttribute('href').replace('#', '');
			let video = el.getAttribute('data-video');
			popup_open(item, video);
		}
		e.preventDefault();
	})
}
for (let index = 0; index < popups.length; index++) {
	const popup = popups[index];
	popup.addEventListener("click", function (e) {
		if (!e.target.closest('.popup__body')) {
			popup_close(e.target.closest('.popup'));
		}
	});
}
function popup_open(item, video = '') {
	let activePopup = document.querySelectorAll('.popup._active');
	if (activePopup.length > 0) {
		popup_close('', false);
	}
	let curent_popup = document.querySelector('.popup_' + item);
	if (curent_popup && unlock) {
		if (video != '' && video != null) {
			let popup_video = document.querySelector('.popup_video');
			popup_video.querySelector('.popup__video').innerHTML = '<iframe src="https://www.youtube.com/embed/' + video + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
		}
		if (!document.querySelector('.menu__body._active')) {
			body_lock_add(500);
		}
		curent_popup.classList.add('_active');
		history.pushState('', '', '#' + item);
	}
}
function popup_close(item, bodyUnlock = true) {
	if (unlock) {
		if (!item) {
			for (let index = 0; index < popups.length; index++) {
				const popup = popups[index];
				let video = popup.querySelector('.popup__video');
				if (video) {
					video.innerHTML = '';
				}
				popup.classList.remove('_active');
			}
		} else {
			let video = item.querySelector('.popup__video');
			if (video) {
				video.innerHTML = '';
			}
			item.classList.remove('_active');
		}
		if (!document.querySelector('.menu__body._active') && bodyUnlock) {
			body_lock_remove(500);
		}
		history.pushState('', '', window.location.href.split('#')[0]);
	}
}
let popup_close_icon = document.querySelectorAll('.popup__close,._popup-close');
if (popup_close_icon) {
	for (let index = 0; index < popup_close_icon.length; index++) {
		const el = popup_close_icon[index];
		el.addEventListener('click', function () {
			popup_close(el.closest('.popup'));
		})
	}
}
document.addEventListener('keydown', function (e) {
	if (e.code === 'Escape') {
		popup_close();
	}
});