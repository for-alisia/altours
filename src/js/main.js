import toursConf from './toursConf';
import {
    popupDateInputTemplate,
    formNameInputTemplate,
    formPhoneInputTemplate
} from './templates';

document.addEventListener('DOMContentLoaded', () => {
    const showMoreTours = document.getElementById('showMoreTours');
    const cards = document.querySelectorAll('.card');
    const popup = document.getElementById('popup');
    const nextStepBtn = document.getElementById('nextTourStep');

    // Show or hide additional block with tours
    showMoreTours.addEventListener('click', e => {
        e.preventDefault();

        const moreToursBlock = document.getElementById('moreToursBlock');

        if (moreToursBlock.classList.contains('opened')) {
            moreToursBlock.classList.remove('opened');
            showMoreTours.textContent = 'Смотреть все туры';
        } else {
            moreToursBlock.classList.add('opened');
            showMoreTours.textContent = 'Популярные туры';
        }
    });

    // Open tours popup
    [...cards].forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn')) {
                return;
            }

            const currentId = this.id;
            const currentTour = getTourById(currentId);

            fillPopup(currentTour, popup);
            popup.classList.add('popup-open');
        });
    });

    // Close tour popup
    popup.querySelector('.popup__close').addEventListener('click', () => {
        popup.classList.remove('popup-open');
    });

    document.addEventListener('click', function(e) {
        if (
            !e.target.closest('.popup__content') &&
            e.target.classList.contains('popup')
        ) {
            popup.classList.remove('popup-open');
        }
    });

    // Click on next step button in popup
    nextStepBtn.addEventListener('click', e => {
        e.preventDefault();

        const radioInputs = popup.querySelectorAll('.form__radio-input');
        const checkedInput = [...radioInputs].filter(
            radioInput => radioInput.checked
        )[0];

        if (checkedInput) {
            addInputsToPopup(popup);
        } else {
            showErrorPopup();
        }
    });

    // Click on book now button
});

// Get tours data by card's id
function getTourById(id) {
    return toursConf.filter(elem => elem.tour === id)[0];
}

// fill tour popup with tour's details
function fillPopup(tour = {}, popup) {
    const title = popup.querySelector('.popup__right .heading-secondary');
    const text = popup.querySelector('.popup__right .popup__text');
    const fragmentList = document.createDocumentFragment();
    const detailsList = popup.querySelector('.popup__list');
    const formGroup = popup.querySelector('.popup__form .form__group');
    const routeLink = document.getElementById('routeLink');

    // Fill text fields (title, description and route link)
    title.textContent = tour.heading;
    text.textContent = tour.description;
    detailsList.innerHTML = '';
    routeLink.href = tour.route;

    // Fill details List
    if (tour.details) {
        tour.details.forEach(elem => {
            const li = document.createElement('li');

            li.classList.add('popup__item');
            li.textContent = elem;
            fragmentList.appendChild(li);
        });
    }

    detailsList.appendChild(fragmentList);

    // Fill Form with Date Inputs
    if (tour.dates && tour.dates.length) {
        let layout = '';
        tour.dates.forEach((elem, index) => {
            const inputBlock = popupDateInputTemplate(elem[0], elem[1], index);
            layout += inputBlock;
        });

        formGroup.innerHTML = layout;
    }
}

// Add inputs for name and phone to popup
function addInputsToPopup(popup) {
    const formContent = popup.querySelector('.popup__form-content');
    formContent.classList.add('visible');
}

// Show error message for popup
function showErrorPopup(popup) {
    console.log('nothing checked');
}
