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
            let $controls = $flap.next().attr('aria-hidden', false).find('.control');
            $controls.removeAttr('tabIndex');
            $controls[0].focus();

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
                let opened = Util.hasOpened(org.date);

                if (opened) {
                    state = `${OPEN_CLASS} ${OPENED_CLASS}`;
                }
                else if (Util.canOpen(org.date)) {
                    state = CAN_OPEN_CLASS;
                }
                else {
                    state = KEEP_CLOSED_CLASS;
                }

                let ariaHidden = !opened;

                let ariaLabel = state === KEEP_CLOSED_CLASS ? `This organization will be revealed on ${org.date_string}.` : `Click this button to reveal the featured organization for ${org.date_string}.`;

                const CONTROL_TAB_INDEX = opened ? 0 : -1;

                listItem = `<li class="box" data-date="${org.date}">
                                <button class="${BOX_FLAP} ${state}" aria-label="${ariaLabel}"
                                aria-controls="box-content-${org.date}">
                                    <div class="box-flap-wrapper">`

                                    if (state === KEEP_CLOSED_CLASS) {
                                        listItem += `<i class="fa fa-lock ${KEEP_CLOSED_CLASS}__icon" aria-hidden="true"></i>`;
                                    }

                                        listItem += `<h2>
                                            <strong class="box-flap__countdown"><span>${countdown}</span></strong>
                                            <em class="box-flap__date">${org.date_string}</em>
                                        </h2>
                                    </div>
                                </button>
                                <div id="box-content-${org.date}" class="box-content" aria-hidden=${ariaHidden} aria-live="polite">`

                                if (state !== KEEP_CLOSED_CLASS) {
                                    listItem += `<div class="box-content__info">
                                        <h3 class="box-content__name">${org.name}</h3>
                                        <p class="box-content__description">${org.desc}</p>
                                    </div>
                                    <ul class="box-links">
                                        <li>
                                            <a href="${org.site_url}" target="_blank" rel="noopener" class="control  control--secondary" tabIndex="${CONTROL_TAB_INDEX}" aria-labelledby="site-url-${org.date}">Visit Site</a>
                                            <p id="site-url-${org.date}" class="offscreen-text">Today's featured charity is ${org.name}. Visit their website to learn more about ${org.name}. This will open in a new window.</p>
                                        </li>
                                        <li>
                                            <a href="${org.support_url}" target="_blank" rel="noopener" class="control control--primary" tabIndex="${CONTROL_TAB_INDEX}" aria-labelledby="support-url-${org.date}">Support</a>
                                            <p id="support-url-${org.date}" class="offscreen-text">Find out ways to support ${org.name}. This will open in a new window.</p>
                                        </li>
                                    </ul>`
                                }

                                listItem += `</div></li>`;

                $('.boxes').append(listItem);
                countdown -= 1;
            });

            $(`.${OPENED_CLASS}`).attr('tabIndex', -1).attr('aria-hidden', true);
        },

        showModal() {
            const DATE_AVAILABLE = $(this).find(`.${BOX_FLAP}__date`).text();
            $(this).addClass('modal-trigger');
            $('.modal__message-date').text(DATE_AVAILABLE);
            $('.modal-wrapper').addClass('modal-wrapper--show').attr('aria-hidden', false);
            $('body').addClass('disable-scroll');
            $('.modal__close').focus();
            $(`.${BOX_FLAP}`).attr('tabIndex', -1);
        },

        closeModal(evt) {
            $('.modal-wrapper').removeClass('modal-wrapper--show').attr('aria-hidden', true);
            $('body').removeClass('disable-scroll');
            $(`.${CAN_OPEN_CLASS}, .${KEEP_CLOSED_CLASS}`).attr('tabIndex', 0);
            $('.modal-trigger').focus();
            $('.modal-trigger').removeClass('modal-trigger');
        },

        closeModalOnEsc(evt) {
            const ESC_PRESSED = evt.keyCode === 27;
            const MODAL_OPEN = $('.modal-wrapper').hasClass('modal-wrapper--show');
            if (MODAL_OPEN && !ESC_PRESSED || !MODAL_OPEN && !ESC_PRESSED) {
                return;
            }
            this.closeModal(evt);
        }
    }
});
