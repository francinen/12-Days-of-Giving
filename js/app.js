// http://www.womenscollegehospital.ca/programs-and-services/crossroads-clinic

const ORGANIZATIONS = [
    {
        name: 'SKETCH',
        site_url: 'http://sketch.ca/',
        support_url: 'http://sketch.ca/support-sketch/',
        desc: 'Support creative programs that empower impoverished, homeless, and marginalized youth',
        date: 1481605200000,
        date_string: 'December 13'
    },
    {
        name: 'Romero House',
        site_url: 'https://romerohouse.org/',
        support_url: 'https://romerohouse.org/financial-donations/',
        desc: 'Give financial or in-kind donations to a shelter that welcomes and supports refugees in Toronto',
        date: 1481691600000,
        date_string: 'December 14'
    },
    {
        name: 'Native Canadian Centre of Toronto',
        site_url: 'http://ncct.on.ca/',
        support_url: 'http://ncct.on.ca/donations/',
        desc: 'Make a donation to Toronto\'s oldest Indigenous community organization',
        date: 1481778000000,
        date_string: 'December 15'
    },
    {
        name: 'Sistering',
        site_url: 'http://www.sistering.org/',
        support_url: 'http://www.sistering.org/Ways_to_Give/Ways_to_Give.aspx',
        desc: 'Drop off clothes, toiletries, or even grocery gift cards for women who are homeless or facing the risk of becoming homeless',
        date: 1481950800000,
        date_string: 'December 16'
    },
    {
        name: 'Rainbow Railroad',
        site_url: 'http://rainbowrailroad.ca/',
        support_url: 'http://rainbowrailroad.ca/donate',
        desc: 'Donate funds or your aeroplan miles to help LGBT individuals seeking asylum in Canada',
        date: 1482037200000,
        date_string: 'December 17'
    },
    {
        name: 'Centre for Addiction and Mental Health',
        site_url: 'http://www.camh.ca/en/hospital/Pages/home.aspx',
        support_url: 'http://give.camh.ca/site/PageNavigator/giftsoflight_2013_home?_ga=1.180121700.1112915103.1480777939',
        desc: 'Look through their Gifts of Light catelogue and select a gift that can enrich the life of a CAMH patient',
        date: 1482123600000,
        date_string: 'December 18'
    },
    {
        name: 'Native Women\'s Resource Centre',
        site_url: 'http://nwrct.ca/',
        support_url: 'http://nwrct.ca/get-involved/support-nwrct/',
        desc: 'Give financial or in-kind donations to support urban Indigenous women and their families',
        date: 1482210000000,
        date_string: 'December 19'
    },
    {
        name: 'The 519',
        site_url: 'http://www.the519.org/',
        support_url: 'http://www.the519.org/support-the-519',
        desc: 'Get involved with a long-standing agency that builds an inclusive and empowering space for Toronto\'s LGBTQ2IA community',
        date: 1482296400000,
        date_string: 'December 20'
    },
    {
        name: 'LOFT Community Services',
        site_url: 'http://www.loftcs.org/',
        support_url: 'http://www.loftcs.org/support-loft/ways-to-give/',
        desc: 'Make a donation to provide safe and stable housing and mental health services for people in marginalized or vulnerable circumstances',
        date: 1482382800000,
        date_string: 'December 21'
    },
    {
        name: 'The Gatehouse',
        site_url: 'http://thegatehouse.org/',
        support_url: 'https://www.canadahelps.org/en/charities/the-gatehouse-child-abuse-investigation-support-site/',
        desc: 'Support a safe space for people affected by childhood abuse',
        date: 1482469200000,
        date_string: 'December 22'
    },
    {
        name: 'Na-Me-Res',
        site_url: 'http://www.nameres.org/',
        support_url: 'http://www.nameres.org/support/',
        desc: 'Contribute funds, clothing, or toiletries to improve the lives of Aboriginal men in Toronto',
        date: 1482555600000,
        date_string: 'December 23'
    },
    {
        name: 'The Stop Community Food Centre',
        site_url: 'http://thestop.org/',
        support_url: 'http://thestop.org/get-involved/give-gifts-that-matter/',
        desc: 'Donate $35 to provide a hamper full of healthy food to a family in the Davenport West community',
        date: 1482642000000,
        date_string: 'December 24'
    }
];

const BOX_FLAP = 'box-flap';
const OPEN_CLASS = `${BOX_FLAP}--open`;
const OPENED_CLASS = `${BOX_FLAP}--opened`;
const CAN_OPEN_CLASS = `${BOX_FLAP}--can-open`;
const KEEP_CLOSED_CLASS = `${BOX_FLAP}--keep-closed`;

function init() {
    renderBoxes();
    $(`.${CAN_OPEN_CLASS}`).on('click', function(e) {
        e.preventDefault();
        $(this).removeClass(CAN_OPEN_CLASS).addClass(OPEN_CLASS);
        this.tabIndex = -1;
        setTimeout(() => {
            $(this).addClass(OPENED_CLASS);
        }, 350);

        const boxDate = $(this).parent().data('date');
        localStorage.setItem(`days_of_giving_${boxDate}`, 'opened');
    });
    $(`.${KEEP_CLOSED_CLASS}`).on('click', function(e) {
        const DATE_AVAILABLE = $(this).find(`.${BOX_FLAP}__date`).text();
        $('.modal__message-date').text(DATE_AVAILABLE);
        $('.modal-wrapper').addClass('modal-wrapper--show');
        $('body').addClass('disable-scroll');
    });
    $('.modal__close').on('click', closeModal);
    $('.modal-wrapper').on('click', closeModal);

    $(document).on('keyup', function(e) {
        const ESC_PRESSED = e.keyCode === 27;
        const MODAL_OPEN = $('.modal-wrapper').hasClass('modal-wrapper--show');
        if (!MODAL_OPEN && ESC_PRESSED) {
            return;
        }
        closeModal();
    });
}

function closeModal(e) {
    $('.modal-wrapper').removeClass('modal-wrapper--show');
    $('body').removeClass('disable-scroll');
}

function canOpen(timestamp) {
    const TODAY = new Date().getTime();
    return TODAY >= timestamp;
}

function hasOpened(timestamp) {
    return localStorage.getItem(`days_of_giving_${timestamp}`);
}

function renderBoxes() {
    let listItem = '';
    let countdown = ORGANIZATIONS.length;

    ORGANIZATIONS.forEach((org, index) => {
        let state;

        if (hasOpened(org.date)) {
            state = `${OPEN_CLASS} ${OPENED_CLASS}`;
        }
        else if (canOpen(org.date)) {
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
}

$(function() {
    init();
});
