let calculatorState = {
    selectedServices: {},
    parameters: {
        area: 100,
        complexity: 1,
        objectType: 1,
        expedited: false,
        guarantee: false
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
});

function initializeCalculator() {
    document.querySelectorAll('input[data-service]').forEach(checkbox => {
        checkbox.addEventListener('change', updateCalculation);
    });

    document.getElementById('area').addEventListener('input', function() {
        calculatorState.parameters.area = parseFloat(this.value) || 100;
        updateCalculation();
    });

    document.getElementById('objectType').addEventListener('change', function() {
        calculatorState.parameters.objectType = parseFloat(this.value);
        updateCalculation();
    });

    document.getElementById('expedited').addEventListener('change', function() {
        calculatorState.parameters.expedited = this.checked;
        updateCalculation();
    });

    document.getElementById('guarantee').addEventListener('change', function() {
        calculatorState.parameters.guarantee = this.checked;
        updateCalculation();
    });

    loadSavedState();
}

function calculateComplexity() {
    const area = calculatorState.parameters.area;
    const servicesCount = Object.keys(calculatorState.selectedServices).length;
    
    const categories = new Set();
    Object.values(calculatorState.selectedServices).forEach(service => {
        categories.add(service.category);
    });
    
    let complexity = 1.0;
    
    if (area <= 50) {
        complexity = 1.0;
    } else if (area <= 150) {
        complexity = 1.15;
    } else if (area <= 300) {
        complexity = 1.4;
    } else if (area <= 600) {
        complexity = 1.65;
    } else {
        complexity = 1.95;
    }
    
    if (servicesCount > 1) {
        complexity += (servicesCount - 1) * 0.1;
    }
    
    if (categories.size > 1) {
        complexity += (categories.size - 1) * 0.15;
    }
    
    const hasComplexServices = Object.keys(calculatorState.selectedServices).some(service => 
        ['bio-treatment', 'sewage-install'].includes(service)
    );
    if (hasComplexServices) {
        complexity += 0.2;
    }
    
    complexity = Math.round(complexity * 100) / 100;
    complexity = Math.min(complexity, 2.2);
    
    calculatorState.parameters.complexity = complexity;
    updateComplexityDisplay();
    return complexity;
}

function updateComplexityDisplay() {
    const complexity = calculatorState.parameters.complexity;
    let complexityLabel = '';
    
    if (complexity <= 1.1) {
        complexityLabel = 'Стандартная';
    } else if (complexity <= 1.4) {
        complexityLabel = 'Повышенная';
    } else if (complexity <= 1.8) {
        complexityLabel = 'Высокая';
    } else {
        complexityLabel = 'Очень высокая';
    }
    
    document.getElementById('complexityValue').textContent = 
        `${complexityLabel} (×${complexity.toFixed(1)})`;
}

function toggleCategory(element) {
    const content = element.nextElementSibling;
    const isOpen = content.classList.contains('show');
    
    if (isOpen) {
        content.classList.remove('show');
        element.textContent = element.textContent.replace('↓', '→');
    } else {
        content.classList.add('show');
        element.textContent = element.textContent.replace('→', '↓');
    }
}

function updateCalculation() {
    calculatorState.selectedServices = {};

    document.querySelectorAll('input[data-service]:checked').forEach(checkbox => {
        const service = {
            name: checkbox.parentElement.querySelector('.service-name').textContent,
            basePrice: parseFloat(checkbox.dataset.basePrice),
            service: checkbox.dataset.service,
            category: checkbox.dataset.category
        };
        calculatorState.selectedServices[checkbox.dataset.service] = service;
    });

    calculateComplexity();

    if (Object.keys(calculatorState.selectedServices).length > 0) {
        renderSummary();
        saveSavedState();
    } else {
        document.getElementById('summary-content').innerHTML = 
            '<p class="empty-message">Выберите услуги для расчёта</p>';
        document.getElementById('total-price').textContent = '0 ₸';
    }
}

function calculateServicePrice(service) {
    let price = service.basePrice;

    price = price * (calculatorState.parameters.area / 100);

    return price;
}

function renderSummary() {
    const summary = document.getElementById('summary-content');
    let totalPrice = 0;
    let breakdown = [];

    Object.values(calculatorState.selectedServices).forEach(service => {
        const price = calculateServicePrice(service);
        totalPrice += price;
        breakdown.push({
            name: service.name,
            price: price
        });
    });

    let additionalCharges = 0;
    const charges = [];

    if (calculatorState.parameters.expedited) {
        const expeditedCharge = totalPrice * 0.15;
        additionalCharges += expeditedCharge;
        charges.push(`Ускоренное выполнение: +${formatPrice(expeditedCharge)}`);
    }

    if (calculatorState.parameters.guarantee) {
        const guaranteeCharge = totalPrice * 0.10;
        additionalCharges += guaranteeCharge;
        charges.push(`Гарантия 2 года: +${formatPrice(guaranteeCharge)}`);
    }

    totalPrice += additionalCharges;

    
    let html = '<div class="summary-items">';
    
    breakdown.forEach(item => {
        html += `
            <div class="summary-item">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${formatPrice(item.price)}</span>
            </div>
        `;
    });

    if (charges.length > 0) {
        html += '<div class="summary-divider"></div>';
        html += '<div class="additional-charges">';
        charges.forEach(charge => {
            html += `<div class="charge-item">${charge}</div>`;
        });
        html += '</div>';
    }

    html += '</div>';
    summary.innerHTML = html;
    document.getElementById('total-price').textContent = formatPrice(totalPrice);
}

function formatPrice(price) {
    return Math.round(price).toLocaleString('ru-RU') + ' ₸';
}

function resetCalculator() {
    document.querySelectorAll('input[data-service]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.getElementById('area').value = 100;
    document.getElementById('objectType').value = 1;
    document.getElementById('expedited').checked = false;
    document.getElementById('guarantee').checked = false;

    calculatorState.parameters = {
        area: 100,
        complexity: 1,
        objectType: 1,
        expedited: false,
        guarantee: false
    };

    updateCalculation();
    localStorage.removeItem('calculatorState');
}

function orderServices() {
    if (Object.keys(calculatorState.selectedServices).length === 0) {
        alert('Пожалуйста, выберите хотя бы одну услугу');
        return;
    }

    openCalculatorModal();
}

function openCalculatorModal() {
    const modalWindow = document.getElementById('calculatorModal');
    const shadow = document.getElementById('shadowBack');

    
    let servicesList = '';
    let totalPrice = 0;
    
    Object.values(calculatorState.selectedServices).forEach(service => {
        const price = calculateServicePrice(service);
        totalPrice += price;
        servicesList += `<div style="font-size: 15px; margin-bottom: 12px; color: #2c3e50; display: flex; justify-content: space-between;"><span>• ${service.name}</span><span style="font-weight: 600;">${formatPrice(price)}</span></div>`;
    });

    
    let additionalHtml = '';
    let basePrice = totalPrice;
    let expeditedPrice = 0, guaranteePrice = 0;
    
    if (calculatorState.parameters.expedited) {
        expeditedPrice = basePrice * 0.15;
        totalPrice += expeditedPrice;
        additionalHtml += `<div style="font-size: 14px; margin-bottom: 10px; color: #34495e; display: flex; justify-content: space-between;"><span>✓ Срочное выполнение (+15%)</span><span style="font-weight: 600; color: #2c3e50;">+ ${formatPrice(expeditedPrice)}</span></div>`;
    }
    if (calculatorState.parameters.guarantee) {
        guaranteePrice = basePrice * 0.10;
        totalPrice += guaranteePrice;
        additionalHtml += `<div style="font-size: 14px; margin-bottom: 10px; color: #34495e; display: flex; justify-content: space-between;"><span>✓ Гарантия 2 года (+10%)</span><span style="font-weight: 600; color: #2c3e50;">+ ${formatPrice(guaranteePrice)}</span></div>`;
    }

    
    const objectTypeLabels = ['Квартира', 'Частный дом', 'Коммерческое помещение'];
    const objectTypeIndex = [1, 1.3, 1.6].indexOf(calculatorState.parameters.objectType);
    const objectTypeLabel = objectTypeLabels[objectTypeIndex] || 'Квартира';

    
    const complexity = calculatorState.parameters.complexity;
    let complexityLabel = '';
    if (complexity <= 1.1) {
        complexityLabel = 'Стандартная';
    } else if (complexity <= 1.4) {
        complexityLabel = 'Повышенная';
    } else if (complexity <= 1.8) {
        complexityLabel = 'Высокая';
    } else {
        complexityLabel = 'Очень высокая';
    }

    
    modalWindow.innerHTML = `
        <input type="button" value="X" class="btn" id="modal-btn-close" onclick="calculatorModalClose()">
        <h4>Сводка вашего заказа</h4>
        
        <div id="calc-order-summary" style="width: 100%; text-align: left; margin-bottom: 20px; padding: 20px; background: #f8f9fa; border-radius: 4px; max-height: 400px; overflow-y: auto;">
            <!-- Услуги -->
            <div style="margin-bottom: 20px;">
                <div style="font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 16px; margin-bottom: 12px; color: #2c3e50; text-transform: uppercase;">ВЫБРАННЫЕ УСЛУГИ:</div>
                ${servicesList}
            </div>

            <!-- Параметры работ -->
            <div style="background: #fff; padding: 15px; border-radius: 4px; margin-bottom: 15px; border: 1px solid #ecf0f1;">
                <div style="font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 16px; margin-bottom: 12px; color: #2c3e50; text-transform: uppercase;">ПАРАМЕТРЫ РАБОТ:</div>
                <div style="font-size: 14px; margin-bottom: 10px; display: flex; justify-content: space-between;"><span>Площадь:</span><span style="font-weight: 600; color: #2c3e50;">${calculatorState.parameters.area} м²</span></div>
                <div style="font-size: 14px; margin-bottom: 10px; display: flex; justify-content: space-between;"><span>Тип объекта:</span><span style="font-weight: 600; color: #2c3e50;">${objectTypeLabel}</span></div>
                <div style="font-size: 14px; display: flex; justify-content: space-between;"><span>Сложность работ:</span><span style="font-weight: 600; color: #2c3e50;">${complexityLabel}</span></div>
            </div>

            <!-- Дополнительные услуги -->
            <div style="background: #fff; padding: 15px; border-radius: 4px; border: 1px solid #ecf0f1;">
                <div style="font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 16px; margin-bottom: 12px; color: #2c3e50; text-transform: uppercase;">ДОПОЛНИТЕЛЬНО:</div>
                ${additionalHtml || '<div style="font-size: 14px; color: #95a5a6;">Нет</div>'}
            </div>

            <!-- Итого -->
            <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #ecf0f1;">
                <div style="font-weight: 600; font-size: 18px; color: #2c3e50; display: flex; justify-content: space-between;">
                    <span>ИТОГО:</span>
                    <span style="color: #b30707; font-size: 22px;">${formatPrice(totalPrice)}</span>
                </div>
            </div>
        </div>
        
        <input type="tel" placeholder="Ваш номер телефона" class="phoneMask" id="calculatorPhone" required>
        <button id="btnSubmitCalculator" class="btn" onclick="sendCalculatorOrder()">Отправить заказ</button>
        <p id="warningMessageCalc" style="display: none; color: red; font-size: 14px; margin-top: 10px;"></p>
    `;

    
    modalWindow.classList.add('active');
    shadow.classList.add('active');

    
    const phoneInput = document.getElementById('calculatorPhone');
    new IMask(phoneInput, {
        mask: "+{7}(000)000-00-00"
    });
}

function calculatorModalClose() {
    const modalWindow = document.getElementById('calculatorModal');
    const shadow = document.getElementById('shadowBack');
    
    modalWindow.classList.remove('active');
    shadow.classList.remove('active');
    document.getElementById('warningMessageCalc').style.display = 'none';
}

function sendCalculatorOrder() {
    const phoneInput = document.getElementById('calculatorPhone');
    const warningMsg = document.getElementById('warningMessageCalc');
    const modalWindow = document.getElementById('calculatorModal');

    const phoneValue = phoneInput.value.trim();
    const hasDigits = /\d/.test(phoneValue);
    const hasPlus = phoneValue.includes('+');

    if (!phoneValue || !hasDigits || phoneValue.length < 10) {
        warningMsg.style.display = 'block';
        warningMsg.textContent = 'Пожалуйста, введите корректный номер телефона';
        return;
    }

    if (Object.keys(calculatorState.selectedServices).length === 0) {
        warningMsg.style.display = 'block';
        warningMsg.textContent = 'Пожалуйста, выберите хотя бы одну услугу';
        return;
    }

    
    let servicesText = '';
    let totalPrice = 0;
    
    Object.values(calculatorState.selectedServices).forEach(service => {
        const price = calculateServicePrice(service);
        totalPrice += price;
        servicesText += `${service.name} (${formatPrice(price)}), `;
    });
    servicesText = servicesText.slice(0, -2);

   
    let additionalServices = '';
    let additionalPrice = 0;
    if (calculatorState.parameters.expedited) {
        const expeditedCharge = totalPrice * 0.15;
        additionalPrice += expeditedCharge;
        additionalServices += 'Ускоренное выполнение (+15%), ';
    }
    if (calculatorState.parameters.guarantee) {
        const guaranteeCharge = totalPrice * 0.10;
        additionalPrice += guaranteeCharge;
        additionalServices += 'Гарантия 2 года (+10%), ';
    }
    additionalServices = additionalServices.slice(0, -2) || 'нет';
    totalPrice += additionalPrice;

    
    const complexity = calculatorState.parameters.complexity;
    let complexityLabel = '';
    if (complexity <= 1.1) {
        complexityLabel = 'Стандартная';
    } else if (complexity <= 1.4) {
        complexityLabel = 'Повышенная';
    } else if (complexity <= 1.8) {
        complexityLabel = 'Высокая';
    } else {
        complexityLabel = 'Очень высокая';
    }

   
    const objectTypeLabels = ['Квартира', 'Частный дом', 'Коммерческое помещение'];
    const objectTypeIndex = [1, 1.3, 1.6].indexOf(calculatorState.parameters.objectType);
    const objectTypeLabel = objectTypeLabels[objectTypeIndex] || 'Квартира';

   
    const params = {
        phone: phoneInput.value,
        services: servicesText,
        area: calculatorState.parameters.area,
        objectType: objectTypeLabel,
        complexity: complexityLabel,
        additional: additionalServices,
        total_price: formatPrice(totalPrice)
    };

   
    modalWindow.innerHTML = `
        <input type="button" value="X" class="btn" id="modal-btn-close" onclick="calculatorModalClose()">
        <div style="text-align: center; padding: 20px 0;">
            <div style="font-size: 60px; margin-bottom: 20px; color: #27ae60;">✓</div>
            <h4 style="font-size: 28px; margin-bottom: 10px; color: #2c3e50;">Ваш заказ принят<br>в обработку</h4>
            <p style="font-size: 16px; color: #555; margin-bottom: 20px; line-height: 1.6;">
                Спасибо за ваше обращение!<br>
                Мы получили вашу заявку и начали обработку
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #27ae60;">
                <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 15px; text-align: left;">
                    <div style="margin-bottom: 12px;"><strong>Номер телефона:</strong><br><span style="font-size: 16px; color: #2c3e50; font-weight: 600;">${phoneInput.value}</span></div>
                    <div style="margin-bottom: 12px;"><strong>Сумма заказа:</strong><br><span style="font-size: 18px; color: #b30707; font-weight: 600;">${params.total_price}</span></div>
                    <div><strong>Примерное время обработки:</strong><br><span style="color: #2c3e50;">В течение 2-3 часов</span></div>
                </div>
            </div>
            
            <p style="font-size: 13px; color: #95a5a6; line-height: 1.6;">
                Наш менеджер свяжется с вами<br>
                по указанному номеру телефона<br>
                в ближайшее время
            </p>
        </div>
    `;
    
  
    localStorage.removeItem('calculatorState');
    resetCalculator();
}


function saveSavedState() {
    const stateToSave = {
        selectedServices: calculatorState.selectedServices,
        parameters: {
            area: calculatorState.parameters.area,
            objectType: calculatorState.parameters.objectType,
            complexity: calculatorState.parameters.complexity
           
        }
    };
    localStorage.setItem('calculatorState', JSON.stringify(stateToSave));
}


function loadSavedState() {
    const saved = localStorage.getItem('calculatorState');
    if (saved) {
        try {
            const state = JSON.parse(saved);
       
            if (state.parameters) {
                calculatorState.parameters = state.parameters;
                document.getElementById('area').value = state.parameters.area;
                document.getElementById('objectType').value = state.parameters.objectType;
                updateComplexityDisplay();
            }
         
            if (state.selectedServices) {
                calculatorState.selectedServices = state.selectedServices;
            }
        } catch (e) {
        }
    }
}
