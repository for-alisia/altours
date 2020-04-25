const popupDateInputTemplate = (elemDate, elemText, index) => {
    return `
    <div class="form__radio-group">
        <input type="radio" class="form__radio-input" id="date${index}" name="date"/>
        <label for="date${index}" class="form__radio-label">
            <span class="form__radio-button"></span>
            ${elemDate}
            <span class="popup__date-detail">${elemText}</span>
        </label>
    </div>     
    `;
};

const formNameInputTemplate = () => {
    return `
    <input type="text"  class="form__input" placeholder="Ваше имя" required id="name"/>
    <label for="name" class="form__label">Ваше имя</label>`;
};

const formPhoneInputTemplate = () => {
    return `
    <input type="tel" class="form__input" placeholder="(923)234-56-78" required id="phone"/>
    <label for="phone" class="form__label">Телефон</label>
    `;
};

export {
    popupDateInputTemplate,
    formNameInputTemplate,
    formPhoneInputTemplate
};
