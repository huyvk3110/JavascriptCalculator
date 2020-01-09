import './index.css';
import React from "react";
import ReactDOM from "react-dom";

const CONFIG = [
    { key: "clear", string: 'AC' },
    { key: "divide", string: '/' },
    { key: "seven", string: '7' },
    { key: "eight", string: '8' },
    { key: "nine", string: '9' },
    { key: "mutiply", string: '×' },
    { key: "four", string: '4' },
    { key: "five", string: '5' },
    { key: "six", string: '6' },
    { key: "subtract", string: '-' },
    { key: "one", string: '1' },
    { key: "two", string: '2' },
    { key: "three", string: '3' },
    { key: "plus", string: '+' },
    { key: "equal", string: '=' },
    { key: "zero", string: '0' },
    { key: "decimal", string: '.' },
]

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            display: '',
            chain: '',
        }

        this.onClickButton = this.onClickButton.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', (event) => {
            if (CONFIG.find(o => o.string === event.key)) this.handle(event.key)
            else if (event.key === '*') this.handle('×');
            else if (event.keyCode === 27) this.handle('AC');
            else if (event.keyCode === 13) this.handle('=');
        })
    }

    onClickButton(event) {
        let data = CONFIG.find(o => event.target.id === o.key);
        if (data) this.handle(data.string);
    }

    handle(key) {
        const data = CONFIG.find(o => o.string === key);
        if (!data) return console.error('Error', key);
        //Update view
        const target = document.getElementById(data.key);
        const baseColor = target.style['background-color'];
        //Set new color
        target.style['background-color'] = '#fdd835'
        //Reset color
        setTimeout(() => {
            if (target && target.style) target.style['background-color'] = baseColor
        }, 100);
        //Logic
        let { display, chain } = this.state;
        if (key === 'AC') {
            display = '';
            chain = '';
        } else if (key === '=' && !chain.includes('=')) {
            //Pre caculate
            chain = chain.replace(/\W*$/, '')
            //Caculate
            const result = eval(chain.replace(/×/g, '*'));
            //Set view
            display = result.toString();
            chain += `=${result}`;
        } else if ('0123456789.'.includes(key) && !chain.includes('=')) {
            display = isNaN(parseInt(display)) ? key : display + key;
            chain += key;
        } else if ('+-×/'.includes(key) && chain.length) {
            //Set display
            display = key;
            //Check if equal exist
            if (chain.includes('=')) {
                chain = chain.match(/\d*$/)[0];
            }
            //Check chain
            const lastSymbol = chain.match(/\W*$/);
            if (chain.match(/.$/)) chain.replace(/.$/, '');
            if (key === '-' && !lastSymbol.includes('-')) {
                chain += key;
            } else if (!(key === '-' && lastSymbol.includes('-'))) {
                chain = chain.replace(/\W*$/, key);
            }
        }

        this.setState({ display, chain })
    }

    render() {
        const { display, chain } = this.state;
        return (
            <div id="caculator">
                <div id="display">
                    <div id="display-chain">{chain}</div>
                    <div id="display-text">{display}</div>
                </div>
                <div id="control">
                    {CONFIG.map((o, i) => (
                        <button className={`control-button ${['divide', 'mutiply', 'subtract', 'plus', 'equal'].find(oo => o.key === oo) ? 'control-mathematical' : ''} ${['clear', 'percent'].find(oo => o.key === oo) ? 'control-top' : ''} `}
                            onClick={this.onClickButton}
                            id={o.key}
                            key={i}>
                            {o.string}
                        </button>))}
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));