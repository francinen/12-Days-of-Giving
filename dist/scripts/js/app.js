'use strict';

var BOX_FLAP = 'box-flap';
var OPEN_CLASS = BOX_FLAP + '--open';
var OPENED_CLASS = BOX_FLAP + '--opened';
var CAN_OPEN_CLASS = BOX_FLAP + '--can-open';
var KEEP_CLOSED_CLASS = BOX_FLAP + '--keep-closed';

define(['collection', 'util'], function (Collection, Util) {
    return {
        init: function init() {
            this.renderBoxes();
            $('.' + CAN_OPEN_CLASS).on('click', this.openBox);
            $('.' + KEEP_CLOSED_CLASS).on('click', this.showModal);
            $('.modal__close').on('click', this.closeModal);
            $('.modal-wrapper').on('click', this.closeModal);
            $(document).on('keyup', this.closeModalOnEsc.bind(this));
        },
        openBox: function openBox(evt) {
            evt.preventDefault();
            var $flap = $(this);
            $flap.removeClass(CAN_OPEN_CLASS).addClass(OPEN_CLASS);
            $flap[0].tabIndex = -1;
            setTimeout(function () {
                $flap.addClass(OPENED_CLASS);
            }, 350);

            var boxDate = $flap.parent().data('date');
            localStorage.setItem('days_of_giving_' + boxDate, 'opened');
        },
        renderBoxes: function renderBoxes() {
            var listItem = '';
            var countdown = Collection.list.length;

            Collection.list.forEach(function (org, index) {
                var state = void 0;

                if (Util.hasOpened(org.date)) {
                    state = OPEN_CLASS + ' ' + OPENED_CLASS;
                } else if (Util.canOpen(org.date)) {
                    state = CAN_OPEN_CLASS;
                } else {
                    state = KEEP_CLOSED_CLASS;
                }

                listItem = '<li class="box" data-date="' + org.date + '">\n                                <button class="' + BOX_FLAP + ' ' + state + '">\n                                    <div class="box-flap-wrapper">\n                                        <h2>\n                                            <strong class="box-flap__countdown"><span>' + countdown + '</span></strong>\n                                            <em class="box-flap__date">' + org.date_string + '</em>\n                                        </h2>\n                                    </div>\n                                </button>\n                                <div class="box-content">';

                if (state !== KEEP_CLOSED_CLASS) {
                    listItem += '<div class="box-content__info">\n                                        <h3 class="box-content__name">' + org.name + '</h3>\n                                        <p class="box-content__description">' + org.desc + '</p>\n                                    </div>\n                                    <ul class="box-links">\n                                        <li>\n                                            <a href="' + org.site_url + '" class="control  control--underline">Visit Site</a>\n                                        </li>\n                                        <li>\n                                            <a href="' + org.support_url + '" class="control control--button">Support</a>\n                                        </li>\n                                    </ul>';
                }

                listItem += '</div></li>';

                $('.boxes').append(listItem);
                $('.box-flap-opened').attr('tabIndex', -1);
                countdown -= 1;
            });
        },
        showModal: function showModal() {
            var DATE_AVAILABLE = $(this).find('.' + BOX_FLAP + '__date').text();
            $('.modal__message-date').text(DATE_AVAILABLE);
            $('.modal-wrapper').addClass('modal-wrapper--show');
            $('body').addClass('disable-scroll');
        },
        closeModal: function closeModal() {
            $('.modal-wrapper').removeClass('modal-wrapper--show');
            $('body').removeClass('disable-scroll');
        },
        closeModalOnEsc: function closeModalOnEsc(evt) {
            var ESC_PRESSED = evt.keyCode === 27;
            var MODAL_OPEN = $('.modal-wrapper').hasClass('modal-wrapper--show');
            if (!MODAL_OPEN && ESC_PRESSED) {
                return;
            }
            this.closeModal();
        }
    };
});
