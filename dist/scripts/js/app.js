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
            var $controls = $flap.next().attr('aria-hidden', false).find('.control');
            $controls.removeAttr('tabIndex');
            $controls[0].focus();

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
                var opened = Util.hasOpened(org.date);

                if (opened) {
                    state = OPEN_CLASS + ' ' + OPENED_CLASS;
                } else if (Util.canOpen(org.date)) {
                    state = CAN_OPEN_CLASS;
                } else {
                    state = KEEP_CLOSED_CLASS;
                }

                var ariaHidden = !opened;

                var ariaLabel = state === KEEP_CLOSED_CLASS ? 'This charity will be revealed on ' + org.date_string + '.' : 'Click this button to reveal the recommended charity for ' + org.date_string + '.';

                var CONTROL_TAB_INDEX = opened ? 0 : -1;

                listItem = '<li class="box" data-date="' + org.date + '">\n                                <button class="' + BOX_FLAP + ' ' + state + '" aria-label="' + ariaLabel + '"\n                                aria-controls="box-content-' + org.date + '">\n                                    <div class="box-flap-wrapper">\n                                        <h2>\n                                            <strong class="box-flap__countdown"><span>' + countdown + '</span></strong>\n                                            <em class="box-flap__date">' + org.date_string + '</em>\n                                        </h2>\n                                    </div>\n                                </button>\n                                <div id="box-content-' + org.date + '" class="box-content" aria-hidden=' + ariaHidden + ' aria-live="polite">';

                if (state !== KEEP_CLOSED_CLASS) {
                    listItem += '<div class="box-content__info">\n                                        <h3 class="box-content__name">' + org.name + '</h3>\n                                        <p class="box-content__description">' + org.desc + '</p>\n                                    </div>\n                                    <ul class="box-links">\n                                        <li>\n                                            <a href="' + org.site_url + '" target="_blank" rel="noopener" class="control  control--secondary" tabIndex="' + CONTROL_TAB_INDEX + '" aria-labelledby="site-url-' + org.date + '">Visit Site</a>\n                                            <p id="site-url-' + org.date + '" class="offscreen-text">Today\'s featured charity is ' + org.name + '. Visit their website to learn more about ' + org.name + '. This will open in a new window.</p>\n                                        </li>\n                                        <li>\n                                            <a href="' + org.support_url + '" target="_blank" rel="noopener" class="control control--primary" tabIndex="' + CONTROL_TAB_INDEX + '" aria-labelledby="support-url-' + org.date + '">Support</a>\n                                            <p id="support-url-' + org.date + '" class="offscreen-text">Find out ways to support ' + org.name + '. This will open in a new window.</p>\n                                        </li>\n                                    </ul>';
                }

                listItem += '</div></li>';

                $('.boxes').append(listItem);
                countdown -= 1;
            });

            $('.' + OPENED_CLASS).attr('tabIndex', -1).attr('aria-hidden', true);
        },
        showModal: function showModal() {
            var DATE_AVAILABLE = $(this).find('.' + BOX_FLAP + '__date').text();
            $(this).addClass('modal-trigger');
            $('.modal__message-date').text(DATE_AVAILABLE);
            $('.modal-wrapper').addClass('modal-wrapper--show').attr('aria-hidden', false);
            $('body').addClass('disable-scroll');
            $('.modal__close').focus();
            $('.' + BOX_FLAP).attr('tabIndex', -1);
        },
        closeModal: function closeModal(evt) {
            $('.modal-wrapper').removeClass('modal-wrapper--show').attr('aria-hidden', true);
            $('body').removeClass('disable-scroll');
            $('.' + CAN_OPEN_CLASS + ', .' + KEEP_CLOSED_CLASS).attr('tabIndex', 0);
            $('.modal-trigger').focus();
            $('.modal-trigger').removeClass('modal-trigger');
        },
        closeModalOnEsc: function closeModalOnEsc(evt) {
            var ESC_PRESSED = evt.keyCode === 27;
            var MODAL_OPEN = $('.modal-wrapper').hasClass('modal-wrapper--show');
            if (MODAL_OPEN && !ESC_PRESSED || !MODAL_OPEN && !ESC_PRESSED) {
                return;
            }
            this.closeModal(evt);
        }
    };
});
