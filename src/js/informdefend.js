; function informdefend(predicateSelector) {
	var predicateModal1;
	if (predicateSelector === undefined || predicateSelector === null) {
		predicateModal1 = '.modal--1';
		predicateSelector = '';
	}
	else {
		predicateModal1 = predicateSelector + '.modal--1 ';
		predicateSelector += " ";
	}

	console.log('informdefend ' + predicateSelector);

	// Мобильное меню
	$(predicateSelector + '.hamburger').click(function () {
		$('.hamburger').toggleClass('hamburger--active');
		$('.header__mobile-menu').fadeToggle(400);
	});

	//отключаем предыдущие подпики на клик.
	$(predicateSelector + '.search-form__expand').off('click');
	// Раскрытие настроек Поиска
	$(predicateSelector + '.search-form__expand').click(function () {
		$(this).toggleClass('round-toggler--active');
		$('.search-form__settings').stop(true).slideToggle(1000);
		$('.search-block__btn').stop(true).toggle(0);

		// прокрутка
		if ($(window).width() < 768) {
			$('html, body').stop(true).animate({
				scrollTop: $('.search-form').offset().top - 80
			}, 1000);
		}
	});


	// Кнопка "очистить" для поиска
	$(predicateSelector + '.search-block__reset').click(function (e) {
		e.preventDefault();

		var resetBtn = $(this);

		resetBtn.siblings('.search-block__input').val(null);
		resetBtn.hide();
	});


	// Показать/Скрыть кнопку сброса текстового поля
	function toggleInputTextReset(inputText) {
		var resetBtn = inputText.siblings('.input-text-block__reset');

		if (inputText.val() != '') {
			resetBtn.show();
		} else {
			resetBtn.hide();
		}
	}
	$(predicateSelector + '.input-text').each(function (index, inputText) {
		toggleInputTextReset($(inputText)); // Показать/Скрыть кнопку сброса текстового поля

		$(inputText).change(function () {
			toggleInputTextReset($(inputText)); // Показать/Скрыть кнопку сброса текстового поля
		});
	});


	// Кнопка "очистить" для текстового поля
	$(predicateSelector + '.input-text-block__reset').click(function (e) {
		e.preventDefault();

		var resetBtn = $(this),
			input = resetBtn.siblings('.input-text-block__input'),
			isWithColon = input.hasClass('input-text--colon') ? true : false;

		if (isWithColon) {
			input.toggleClass('input-text--colon-active').val(input.data('placeholder'));
		} else {
			input.val(null);
		}

		resetBtn.hide();

	});


	// Показать/Скрыть кнопку сброса поиска
	function toggleSearchResetBtn(searchInput) {
		var resetBtn = searchInput.siblings('.search-block__reset');

		if (searchInput.val() != '') {
			resetBtn.show();
		} else {
			resetBtn.hide();
		}
	}

	toggleSearchResetBtn($('.search-block__input')); // Показать/Скрыть кнопку сброса поиска

	$(predicateSelector + '.search-block__input').change(function () {
		toggleSearchResetBtn($(this)); // Показать/Скрыть кнопку сброса поиска
	});


	// Раскрытие тела блока
	$(predicateSelector + '.section__block--toggler').click(function () {
		$(this).find('.section-title--dropdown').stop(true).toggleClass('section-title--expanded');
		$(this).closest('.section').find('.section__block--togglable, .section__subsection--togglable').stop(true).slideToggle(400);
	});

	// Свернуть/Развернуть все
	$(predicateSelector + '.result-control__sliding-btn').click(function () {
		if ( $(this).hasClass('result-control__sliding-btn--slideUp') ) {
			$('.section__block--togglable, .section__subsection--togglable').stop(true).slideUp(400);
			$('.section-title--dropdown').stop(true).removeClass('section-title--expanded');
		} else if ( $(this).hasClass('result-control__sliding-btn--slideDown') ) {
			$('.section__block--togglable, .section__subsection--togglable').stop(true).slideDown(400);
			$('.section-title--dropdown').stop(true).addClass('section-title--expanded');
		}
	});

	// Datetimepicker
	$(predicateSelector + '.datepicker-field').each(function (index, datepicker) {
		var wrapper = $(datepicker),
			input = wrapper.find('.datepicker-field__input'),
			isWithTime = wrapper.hasClass('datepicker-field--with-time') ? true : false;

		input.datetimepicker({
			locale: 'ru',
			format: isWithTime ? false : 'L',
		});
	});


	// Custom file input
	$(predicateSelector + '.input-file__input').change(function () {
		var input = $(this),
			wrapper = input.closest('.input-file'),
			btn = wrapper.find('.input-file__btn'),
			fileBlock = wrapper.find('.input-file__files'),
			errorBlock = wrapper.find('.input-file__error'),
			removeBtn = wrapper.find('.input-file__remove'),
			files = input[0].files[0];

		if (files.type !== 'text/xml' && !files.name.includes(".req") && !files.name.includes(".p10")) {
			btn.addClass('btn--red');
			errorBlock.text('Формат выбранного файла не поддерживается').show();
			fileBlock.text('').hide();
			removeBtn.hide();
		} else {
			btn.removeClass('btn--red');
			fileBlock.text(files.name).show();
			errorBlock.text('').hide();
			removeBtn.show();
		}
	});


	// Remove inputed file
	$(predicateSelector + '.input-file__remove').click(function () {
		var removeBtn = $(this),
			wrapper = removeBtn.closest('.input-file'),
			input = wrapper.find('.input-file__input'),
			fileBlock = wrapper.find('.input-file__files');

		input.val('');
		fileBlock.text('').hide();
		removeBtn.hide();
	});


	// Custom selects
	$(predicateSelector + '.select').each(function (index, item) {
		var selectWrapper = $(this),
			select = selectWrapper.find('select'),
			isMultiple = selectWrapper.hasClass('select--multiple') ? true : false,
			isInModal = selectWrapper.parents('.modal').length ? true : false,
			isNumeric = selectWrapper.hasClass('select--numeric') ? true : false,
			isWithSearch = selectWrapper.hasClass('select--no-search') ? false : true,
			searchPlaceholder = select.data('search') ? select.data('search') : '',
			win = $(window),
			metrics = {},
			state = {
				opened: false,
				selected: select.val() && select.val().length ? true : false,
				change: false,
				unselecting: false,
				searchFocused: false
			},
			searchInput,
			dropdown;

		select.off('select2:opening').off('select2:open').off('select2:closing').off('select2:close').off('change').off('select2:unselecting');
		select
			.css({ 'width': '100%' })
			.select2({
				allowClear: selectWrapper.hasClass('select--no-clear') || selectWrapper.hasClass('select--sort') ? false : true,
				minimumResultsForSearch: select.parent().hasClass('select--no-search') ? -1 : 1,
				placeholder: select.data('placeholder') ? select.data('placeholder') : false,
				shouldFocusInput: -1,
				templateResult: formatSelect,
				templateSelection: formatSelect,
				closeOnSelect: selectWrapper.hasClass('select--multiple') ? false : true,
				matcher: matchStart,
				"language": {
					"noResults": function () {
						return "Результаты не найдены";
					},
					"removeAllItems": function () {
						return "Удалить все элементы";
					}
				}
			})
			.on('select2:opening', function (e) {

				if (state.unselecting) {
					e.preventDefault();
					state.unselecting = false;
					state.change = false;
					console.log('opening PREVENTED');
				}

				console.log('before open', state);
			})
			.on('select2:open', function (e) {
				state.opened = true;

				dropdown = $('.select2-dropdown');
				setModalClasses();
				setMetrics();
				setSearchInput();

				if (isWithSearch) {
					setSearchInput();
					searchInput.attr('placeholder', searchPlaceholder);

					if (isMultiple) {
						searchInput.parent().addClass('select2-search--active');
						setTimeout(function () {
							searchInput.blur();
						}, 10);

						searchInput.off('click');
						searchInput.off('blur');
						searchInput.on('click', function (e1) {
							state.searchFocused = true;
						})
							.on('blur', function (e1) {
								state.searchFocused = false;
							});
					}
				}

				setTimeout(function () {
					handleDropdownPosition(dropdown);
					dropdown.parent().css({ 'opacity': 1 });
				}, 50);

				win.scroll(function () {
					handleDropdownPosition(dropdown)
				});

				console.log('opened', state);
			})
			.on('select2:closing', function (e) {

				if (state.searchFocused) {
					console.log('searchFocused before close', state);
					return false;
				}

				dropdown = $('.select2-dropdown');
				setSearchInput();

				if (state.selected) {
					searchInput.attr('placeholder', '');
				} else {
					searchInput.attr('placeholder', select.data('placeholder'));
				}

				if (isMultiple) {
					searchInput.parent().removeClass('select2-search--active');
				}

				dropdown.parent().css({ 'opacity': 0 });

				console.log('before close', state);
			})
			.on('select2:close', function (e) {
				state.opened = false;
				state.change = false;
				state.unselecting = false;

				setSearchInput();

				// удалим все обработчики событий
				win.unbind('scroll');

				console.log('closed', state);
				console.log('==============================');
			})
			.on('change', function (e) {
				state.change = true;
				state.selected = select.val() && select.val().length>0 ? true : false;

				dropdown = $('.select2-dropdown');
				setMetrics();
				setSearchInput();

				if (state.opened && isWithSearch && isMultiple) {
					searchInput.attr('placeholder', searchPlaceholder);
					searchInput.off('click');
					searchInput.off('blur');
					searchInput.on('click', function (e1) {
						state.searchFocused = true;
					})
						.on('blur', function (e1) {
							state.searchFocused = false;
						});
				}

				setTimeout(function () {
					handleDropdownPosition($('.select2-dropdown'));
				}, 1);

				console.log('change', state);
			})			
			.on('select2:unselecting', function () {
				state.unselecting = true;
				state.selected = select.val().length ? true : false;

				console.log('unselecting', state);
			});

		function formatSelect(select) {
			if (!select.id) {
				return select.text;
			}

			var displayName, required;

			if ($(select.element).data('displayname')) {
				displayName = ' <span class="grey">(' + $(select.element).data('displayname') + ')</span>';
			} else {
				displayName = '';
			}

			if ($(select.element).data('required')) {
				required = '<span class="red">*</span>';
			} else {
				required = '';
			}

			var $select = $(
				'<p>' + select.text + required + displayName + '</p>'
			);

			return $select;
		}

		function matchStart(params, data) {
			// Always return the object if there is nothing to compare
			if ($.trim(params.term) === '') {
				return data;
			}

			// Do a recursive check for options with children
			if (data.children && data.children.length > 0) {
				// Clone the data object if there are children
				// This is required as we modify the object to remove any non-matches
				var match = $.extend(true, {}, data);

				// Check each child of the option
				for (var c = data.children.length - 1; c >= 0; c--) {
					var child = data.children[c];

					var matches = matcher(params, child);

					// If there wasn't a match, remove the object in the array
					if (matches === null) {
						match.children.splice(c, 1);
					}
				}

				// If any children matched, return the new object
				if (match.children.length > 0) {
					return match;
				}

				// If there were no matching children, check just the plain object
				return matcher(params, match);
			}

			var original = data.text.toUpperCase();
			var term = params.term.toUpperCase();

			// Check if the text contains the term
			if (original.indexOf(term) === 0) {
				return data;
			}

			// If it doesn't contain the term, don't return anything
			return null;
		}

		function setModalClasses() {
			if (isInModal) {
				if (selectWrapper.parents('.modal').hasClass('modal--3')) {
					dropdown.closest('.select2-container').addClass('select2-container--in-modal-3');
				} else if (selectWrapper.parents('.modal').hasClass('modal--2')) {
					dropdown.closest('.select2-container').addClass('select2-container--in-modal-2');
				} else {
					dropdown.closest('.select2-container').addClass('select2-container--in-modal');
				}
			}
		}

		function setMetrics() {
			metrics = {
				docHeight: $(document).height(),
				scrollTop: win.scrollTop(),
				windowHeight: window.innerHeight
			}
		}

		function setSearchInput() {
			if (isMultiple) {
				searchInput = selectWrapper.find('.select2-search__field')
			} else {
				searchInput = dropdown.find('.select2-search__field')
			}
		}

		function handleDropdownPosition(dropdown) {
			var 
				select2 = select.siblings('.select2.select2-container'),
				select2Height = select2.outerHeight(),

				select2TopOffset = isInModal ? 
					select2[0].getBoundingClientRect().top : 
					select2.offset().top,

				dropdownHeight = dropdown.outerHeight(),
				dropdownTopOffset = select2Height + select2.offset().top,
				dropdownLeftOffset = select2.offset().left;

				hasSpaceInDoc = (select2TopOffset + select2Height + dropdownHeight) <= metrics.docHeight;
				hasSpaceInViewport = (select2TopOffset + select2Height + dropdownHeight) <= metrics.windowHeight;

				if (isInModal) {
					if (!hasSpaceInViewport) {
						dropdownTopOffset = select2.offset().top - dropdownHeight;
					}
				} else {
					if (!hasSpaceInViewport && !hasSpaceInDoc) {
						dropdownTopOffset = select2.offset().top - dropdownHeight;
					}
				}

				dropdown.parent().css({
					top: dropdownTopOffset + 'px',
					left: dropdownLeftOffset + 'px'
				});
		}

		if (isMultiple) {

			var resetBtn = selectWrapper.find('.select__reset'),
				choiceBox,
				choicesArray,

				totalOptionsArray = [],
				totalOptionsCount,

				selectedOptions = [],
				selectedOptionsCount;

			select.find('option').each(function (index, select) {
				totalOptionsArray.push($(select).val());
			});

			totalOptionsCount = totalOptionsArray.length;

			function setSelectedOptions() {
				selectedOptions = select.val();
				selectedOptionsCount = selectedOptions.length;
			};

			function setChoice() {
				choiceBox = selectWrapper.find('ul.select2-selection__rendered');
				choicesArray = choiceBox.find('li.select2-selection__choice');
			};

			function handleResetBtn() {
				setSelectedOptions();

				resetBtn.css({
					'visibility': selectedOptionsCount ? 'visible' : 'hidden'
				});
			};

			function handleSelectedItem() {
				var dropdown = $('.select2-dropdown');

				setSelectedOptions();
				setChoice();

				if (isNumeric && selectedOptionsCount != 0) {
					choicesArray.hide();
					choiceBox.prepend(
						'<li class="select2-selection__numeric">' +
						'Выбрано ' + selectedOptionsCount +
						'</li>'
					);
				}

				if (selectedOptionsCount == totalOptionsCount) {

					choicesArray.hide();
					choiceBox.find('.select2-selection__numeric').hide();

					choiceBox.prepend(
						'<li class="select2-selection__choice select2-selection__all-choice">' +
						'<span class="select2-selection__choice__remove" role="presentation">×</span>' +
						'Все возможные' +
						'</li>'
					);

					choiceBox.find('.select2-selection__choice__remove').click(function (e) {
						e.preventDefault();

						select.val(null).trigger('change');
					});

					setTimeout(function () {
						handleDropdownPosition(dropdown)
					}, 1);
				}
			};

			handleResetBtn();
			handleSelectedItem();

			select.change(function () {
				handleResetBtn();
				handleSelectedItem();
			});
		}
	});


	// Кнопка "очистить" для селекта
	$(predicateSelector + '.select__reset').click(function (e) {
		e.preventDefault();

		var wrapper = $(this).parents('.select'),
			select = wrapper.find('select'),
			searchInput = wrapper.find('.select2-search__field');

		select.val(null).trigger('change');
		searchInput.attr('placeholder', select.data('placeholder'));
	});


	// Кнопка "выбрать все" для multiple select
	$(predicateSelector + '.select__add-all').click(function (e) {
		e.preventDefault();

		var wrapper = $(this).parents('.select'),
			select = wrapper.find('select'),
			searchInput = wrapper.find('.select2-search__field'),
			options = select.find('option'),
			options_val = [];

		$(options).each(function (index, item) {
			options_val.push($(item).val());
		});

		select.val(options_val).trigger('change');
		searchInput.attr('placeholder', '');
	});


	// Закрыть модальное окно
	$(predicateSelector + '.modal__close, ' + predicateSelector + '.close-modal, ' + predicateSelector + '.btn_close').click(function () {
		$(this).closest('.modal').fadeOut(400);
	});
	// Закрыть первое модальное окно
	$(predicateModal1 + '.modal__close, ' + predicateModal1 + ' .close-modal, ' + predicateModal1 + ' .btn_close').click(function () {
		$('body').css('overflow', 'initial');
	});


	// Change color of placeholded select
	$(predicateSelector + '.select--placeholded').change(function () {
		$(this).find('.select__select').css({
			'color': '#50535b'
		});
	});


	// Select reset button
	$(predicateSelector + '.select__reset').click(function (e) {
		e.preventDefault();

		var resetBtn = $(this),
			selectWrapper = resetBtn.closest('.select'),
			select = resetBtn.siblings('.select__select');

		select.prop('selectedIndex', 0);

		if (selectWrapper.hasClass('select--placeholded')) {
			select.css({
				'color': '#abafba'
			});
		}
	});


	// Общая кнопка Очистить
	$(predicateSelector + '.reset-form').click(function (e) {
		e.preventDefault();

		var form = $(this).parents('form');

		//var extSearch = $(this).parents('.search-form__search');
		var extSearch = form.find(".search-form__search");
		var extElements = $("[extname]");
		extElements.val("");

		for (var i = 0; i < form.length; i++) {
			form[i].reset();
		}

		// очистить все selects
		extSearch.find('select').val(null).trigger('change');

		// очистить блок с названием приложенного документа
		form.find('.input-file__files').text('');

		// Сбросить ошибку у кнопки input-file
		form.find('.input-file__btn').removeClass('btn--red');

		// очистить чекбоксы
		// form.find('.checkbox__input').each(function(index, item) {
		// 	$(item)[0].checked = false;
		// });

		// Очистить тексты ошибок
		form.find('.error-text').text('').hide();

		// Очистить тексты приложенных файлов
		form.find('.file-text').text('').hide();

		// убрать красный бордер у поля ввода текста
		form.find('.input-text').removeClass('input-text--error');

		// очистить все datepickers
		form.find('.datepicker-field__input').val('');

		var $table = form.find('.form-table--search');
		var $tbody = $table.children('tbody.form-table__tbody');
		var countRemoveRows = $tbody.length > 0 ? $tbody[0].rows.length - 2 : 0;

		if (countRemoveRows > 0) {
			for (var i = 0; i < countRemoveRows; i++) {
				$tbody[0].rows[0].remove();
			}
		}
	});


	// Добавить строку формы
	//$(predicateSelector + '.form').on('click', '.add-row', function(e){
	//	e.preventDefault();

	//	var btnRow = $(this).closest('.form-table__tr'),
	//			prevRow = btnRow.prev(),
	//			clone = prevRow.clone();

	//	// прокрутка
	//	if ( $(window).width() < 768) {
	//		$('html, body').stop(true).animate({
	//			scrollTop: btnRow.offset().top - 80
	//		}, 1000);
	//	}

	//	clone.insertBefore(btnRow);
	//});


	// Удалить строку формы
	$(predicateSelector + '.form').on('click', '.delete-btn', function (e) {
		e.preventDefault();

		var $tbody = $(this).closest('tbody');
		if ($tbody.prop('rows').length <= 2) {
			return;
		}

		var btnRow = $(this).closest('.form-table__tr'),
			prevRow = btnRow.prev();

		// прокрутка
		if ($(window).width() < 768) {
			$('html, body').stop(true).animate({
				scrollTop: prevRow.offset().top - 80
			}, 1000);
		}

		btnRow.remove();

		if ($tbody.prop('rows').length <= 2) {
			$.each($($tbody.prop('rows')), function (index, data) {
				var $btn = $(data).find('.delete-btn');

				if ($btn) {
					$btn.css('display', 'none');
				}
			});
		}
	});


	// Раскрывающийся список
	$(predicateSelector + '.expand-list').each(function () {

		var expandList = $(this),
			listArray = expandList.find('li'),
			listLength = listArray.length,
			targetLength = expandList.data('length'),
			isCertificate = expandList.data('isCertificate'),
			isVisible = expandList.data('isVisible'),
			isInModal = expandList.parents('.modal').length ? true : false,
			moreCount = isVisible ? listLength - targetLength : listLength,
			toggler,
			dropdown;

		var hiddenItemsArray = [],
				visibleItemsArray = [];

		expandList.addClass('expand-list--visible');

		if (listLength > targetLength) {

			for (i = (isVisible ? targetLength : 0); i < listLength; i++) {
				hiddenItemsArray.push(listArray[i]);
			}

			for (i = 0; i < targetLength; i++) {
				visibleItemsArray.push(listArray[i]);
			}

			console.log(visibleItemsArray, hiddenItemsArray);

			expandList.append('<div class="expand-list__items">');
			expandList.append('<div class="expand-list__toggler">' + (isCertificate ? 'Количество' : 'Выбрано') + ': ' + moreCount + '</div>');
			expandList.append('<div class="expand-list__dropdown"></div>');
			
			visibleItems = expandList.find('.expand-list__items');
			toggler = expandList.find('.expand-list__toggler');
			dropdown = expandList.find('.expand-list__dropdown');

			$(hiddenItemsArray).each(function (index, item) {
				$(item).appendTo(dropdown);
			});

			$(visibleItemsArray).each(function (index, item) {
				$(item).appendTo(visibleItems);
			});

			if (isInModal) {
				dropdown
					.addClass('expand-list__dropdown--modal')
					.css({
						left: visibleItems.width() > toggler.width() ? visibleItems.width() + 15 : toggler.width(),
						top: 0,
						height: expandList.outerHeight()
					});
			}

			toggler.hover(function() {
				dropdown.fadeToggle('300');
			})
		}
	});


	// Submenu
	$(predicateSelector + '.main-menu__item').hover(
		function () {
			if ($(window).width() > 768) {
				$(this).find('.main-menu__submenu-toggler').stop().addClass('main-menu__submenu-toggler--active');
				$(this).find('.submenu').stop().slideDown(300);
			}
		},
		function () {
			if ($(window).width() > 768) {
				$(this).find('.main-menu__submenu-toggler').stop().removeClass('main-menu__submenu-toggler--active');
				$(this).find('.submenu').stop().slideUp(300);
			}
		}
	);
	$(predicateSelector + '.main-menu__submenu-toggler').click(function () {
		if ($(window).width() <= 767) {
			$(this).stop().toggleClass('main-menu__submenu-toggler--active').siblings('.submenu').stop().slideToggle(300)
		}
	});


	// checkboxlist
	$(predicateSelector + '.checkbox-list__item--all').click(function(e) {
		e.preventDefault();

		var checkboxAll = $(this).find('.checkbox__input')[0],
				siblings = $(this).siblings('.checkbox-list__item').find('.checkbox__input'); 

		if ($(this).find('.checkbox__input')[0].checked) {
			$(this).find('.checkbox__input')[0].checked = false;

			$(siblings).each(function(index, item) {
				item.checked = false;
			});
		} else {
			$(this).find('.checkbox__input')[0].checked = true;

			$(siblings).each(function(index, item) {
				item.checked = true;
			});
		}
	});


	// Расчет максимальной высоты тела и максимальной ширины контейнера модального окна
	function setModalSizes() {
		var windowWidth = $(window).width(),
			windowHeight = window.innerHeight;

		$('.modal').each(function () {
			var modal = $(this),
				modalBoxAll = modal.find('.modal__box');

			modalBoxAll.each(function () {
				var modalBox = $(this),
					modalHead = modalBox.find('.modal__head'),
					modalBody = modalBox.find('.modal__body'),

					modalHeadHeight = modalHead.length ? modalHead.outerHeight() : 0,
					modalBodyHeight = modalBody.outerHeight();

				var modalBodyMaxHeight, modalBoxMaxWidth;

				if (windowWidth > 767) {
					modalBodyMaxHeight = windowHeight - modalHeadHeight - 40;

					// если на десктопах появляется скролл, который влияет на ширину контента, добавляем 20px
					if (modalBodyHeight > modalBodyMaxHeight) {

						if (modalBox.hasClass('modal__box--small')) {
							modalBoxMaxWidth = 720;
						} else if (modalBox.hasClass('modal__box--tiny')) {
							modalBoxMaxWidth = 560;
						} else {
							modalBoxMaxWidth = 1000;
						}

						modalBox.css({
							'max-width': modalBoxMaxWidth + 'px'
						});
					}

				} else {
					modalBodyMaxHeight = windowHeight - modalHeadHeight;
				}

				modalBody.css({
					'max-height': modalBodyMaxHeight + 'px'
				});

			});
		});
	}


	setModalSizes(); // Расчет максимальной высоты тела и максимальной ширины контейнера модального окна

	$(window).resize(function () {
		setModalSizes(); // Расчет максимальной высоты тела и максимальной ширины контейнера модального окна
	});

	/*$(window).scroll(function() {
		console.log($(window).scrollTop(), window.innerHeight, $(document).outerHeight());
	});*/

};