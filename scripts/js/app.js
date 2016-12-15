const BOX_FLAP = 'box-flap';
const OPEN_CLASS = `${BOX_FLAP}--open`;
const OPENED_CLASS = `${BOX_FLAP}--opened`;
const CAN_OPEN_CLASS = `${BOX_FLAP}--can-open`;
const KEEP_CLOSED_CLASS = `${BOX_FLAP}--keep-closed`;

define(['collection', 'util'], function(Collection, Util) {
    return {
        init() {
            this.renderBoxes();
            $(`.${CAN_OPEN_CLASS}`).on('click', this.openBox);
            $(`.${KEEP_CLOSED_CLASS}`).on('click', this.showModal);
            $('.modal__close').on('click', this.closeModal);
            $('.modal-wrapper').on('click', this.closeModal);
            $(document).on('keyup', this.closeModalOnEsc.bind(this));
        },

        openBox(evt) {
            evt.preventDefault();
            let $flap = $(this);
            $flap.removeClass(CAN_OPEN_CLASS).addClass(OPEN_CLASS);
            $flap[0].tabIndex = -1;
            setTimeout(() => {
                $flap.addClass(OPENED_CLASS);
            }, 350);

            const boxDate = $flap.parent().data('date');
            localStorage.setItem(`days_of_giving_${boxDate}`, 'opened');
        },

        renderBoxes() {
            let listItem = '';
            let countdown = Collection.list.length;

            Collection.list.forEach((org, index) => {
                let state;

                if (Util.hasOpened(org.date)) {
                    state = `${OPEN_CLASS} ${OPENED_CLASS}`;
                }
                else if (Util.canOpen(org.date)) {
                    state = CAN_OPEN_CLASS;
                }
                else {
                    state = KEEP_CLOSED_CLASS;
                }

                listItem = `<li class="box" data-date="${org.date}">
                                <button class="${BOX_FLAP} ${state}">
                                    <div class="box-flap-wrapper">
                                        <h2>
                                            <strong class="box-flap__countdown"><span>${countdown}</span></strong>
                                            <em class="box-flap__date">${org.date_string}</em>
                                        </h2>
                                    </div>
                                </button>
                                <div class="box-content">`

                                if (state !== KEEP_CLOSED_CLASS) {
                                    listItem += `<div class="box-content__info">
                                        <h3 class="box-content__name">${org.name}</h3>
                                        <p class="box-content__description">${org.desc}</p>
                                    </div>
                                    <ul class="box-links">
                                        <li>
                                            <a href="${org.site_url}" class="control  control--underline">Visit Site</a>
                                        </li>
                                        <li>
                                            <a href="${org.support_url}" class="control control--button">Support</a>
                                        </li>
                                    </ul>`
                                }

                                listItem += `</div></li>`;

                $('.boxes').append(listItem);
                $('.box-flap-opened').attr('tabIndex', -1);
                countdown -= 1;
            });
        },

        showModal() {
            const DATE_AVAILABLE = $(this).find(`.${BOX_FLAP}__date`).text();
            $('.modal__message-date').text(DATE_AVAILABLE);
            $('.modal-wrapper').addClass('modal-wrapper--show');
            $('body').addClass('disable-scroll');
        },

        closeModal() {
            $('.modal-wrapper').removeClass('modal-wrapper--show');
            $('body').removeClass('disable-scroll');
        },

        closeModalOnEsc(evt) {
            const ESC_PRESSED = evt.keyCode === 27;
            const MODAL_OPEN = $('.modal-wrapper').hasClass('modal-wrapper--show');
            if (!MODAL_OPEN && ESC_PRESSED) {
                return;
            }
            this.closeModal();
        }
    }
});
