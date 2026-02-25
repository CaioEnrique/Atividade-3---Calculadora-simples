class CalculadoraCientifica {
    constructor() {
        this.display = document.getElementById('display');
        this.history = document.getElementById('history');
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = '';
        this.shouldResetDisplay = false;
        this.scientificMode = false;
        
        this.init();
    }
    
    init() {
        // Modo básico/científico
        document.getElementById('basicMode').addEventListener('click', () => this.toggleMode(false));
        document.getElementById('scientificMode').addEventListener('click', () => this.toggleMode(true));
        
        // Botões numéricos
        document.querySelectorAll('.number').forEach(btn => {
            btn.addEventListener('click', (e) => this.addNumber(e.target.dataset.value));
        });
        
        // Botões de operadores
        document.querySelectorAll('.operator').forEach(btn => {
            btn.addEventListener('click', (e) => this.setOperator(e.target.dataset.value));
        });
        
        // Botões de função
        document.querySelector('.btn[data-value="C"]').addEventListener('click', () => this.clear());
        document.querySelector('.btn[data-value="⌫"]').addEventListener('click', () => this.backspace());
        document.querySelector('.btn[data-value="%"]').addEventListener('click', () => this.percentage());
        
        // Botão de igual
        document.querySelector('.btn[data-value="="]').addEventListener('click', () => this.calculate());
        
        // Botões científicos
        document.querySelectorAll('.sci-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.scientificFunction(e.target.dataset.value));
        });
        
        // Teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    toggleMode(isScientific) {
        this.scientificMode = isScientific;
        const sciPanel = document.getElementById('scientificPanel');
        const basicBtn = document.getElementById('basicMode');
        const sciBtn = document.getElementById('scientificMode');
        
        if (isScientific) {
            sciPanel.classList.add('show');
            basicBtn.classList.remove('active');
            sciBtn.classList.add('active');
        } else {
            sciPanel.classList.remove('show');
            sciBtn.classList.remove('active');
            basicBtn.classList.add('active');
        }
    }
    
    addNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentValue = num;
            this.shouldResetDisplay = false;
        } else {
            if (this.currentValue === '0' && num !== '.') {
                this.currentValue = num;
            } else if (num === '.' && this.currentValue.includes('.')) {
                return;
            } else {
                this.currentValue += num;
            }
        }
        this.updateDisplay();
    }
    
    setOperator(op) {
        if (this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }
        this.previousValue = this.currentValue;
        this.operator = this.getOperatorSymbol(op);
        this.shouldResetDisplay = true;
        this.updateHistory();
    }
    
    getOperatorSymbol(op) {
        const symbols = {
            '/': '÷',
            '*': '×',
            '-': '−',
            '+': '+'
        };
        return symbols[op] || op;
    }
    
    calculate() {
        if (!this.operator || !this.previousValue) return;
        
        let result;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        
        switch(this.operator) {
            case '÷':
                result = prev / current;
                break;
            case '×':
                result = prev * current;
                break;
            case '−':
                result = prev - current;
                break;
            case '+':
                result = prev + current;
                break;
            default:
                return;
        }
        
        if (isNaN(result) || !isFinite(result)) {
            result = 'Erro';
        } else {
            result = this.roundResult(result);
        }
        
        this.updateHistory(this.previousValue + ' ' + this.operator + ' ' + this.currentValue);
        this.currentValue = result.toString();
        this.operator = '';
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }
    
    scientificFunction(func) {
        let value = parseFloat(this.currentValue);
        let result;
        
        switch(func) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case '^':
                this.previousValue = this.currentValue;
                this.operator = '^';
                this.shouldResetDisplay = true;
                this.updateHistory();
                return;
            case '!':
                result = this.factorial(value);
                break;
            case '(':
                this.addNumber('(');
                return;
            case ')':
                this.addNumber(')');
                return;
            case 'pi':
                this.currentValue = Math.PI.toString();
                this.shouldResetDisplay = true;
                this.updateDisplay();
                return;
            case 'e':
                this.currentValue = Math.E.toString();
                this.shouldResetDisplay = true;
                this.updateDisplay();
                return;
            default:
                return;
        }
        
        if (func === '^' && this.operator === '^' && this.previousValue) {
            result = Math.pow(parseFloat(this.previousValue), value);
            this.updateHistory(this.previousValue + ' ^ ' + value);
            this.currentValue = this.roundResult(result).toString();
            this.operator = '';
            this.previousValue = '';
        } else if (func !== '^') {
            this.updateHistory(func + '(' + value + ')');
            this.currentValue = this.roundResult(result).toString();
        }
        
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }
    
    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    percentage() {
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
        this.updateDisplay();
    }
    
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = '';
        this.history.textContent = '';
        this.updateDisplay();
    }
    
    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }
    
    roundResult(result) {
        return Math.round(result * 10000000000) / 10000000000;
    }
    
    updateDisplay() {
        this.display.textContent = this.currentValue;
    }
    
    updateHistory(text = '') {
        if (text) {
            this.history.textContent = text;
        } else if (this.previousValue && this.operator) {
            this.history.textContent = this.previousValue + ' ' + this.operator;
        } else {
            this.history.textContent = '';
        }
    }
    
    handleKeyboard(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.addNumber(key);
        } else if (key === '.') {
            this.addNumber('.');
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            this.setOperator(key);
        } else if (key === 'Enter' || key === '=') {
            this.calculate();
        } else if (key === 'Escape') {
            this.clear();
        } else if (key === 'Backspace') {
            this.backspace();
        } else if (key === '%') {
            this.percentage();
        }
    }
}

// Inicializar a calculadora quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new CalculadoraCientifica();
});