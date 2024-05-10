import React, {useState} from 'react';
import './Converter.css';
import Input from "../Input/Input";

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('BTC');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleConvert = () => {
        const apiKey = "685419b6bedfb725bb6af07ed3dd6fef8f20a83f05c066d1eb20a10c563c7801";
        const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${toCurrency}&tsyms=${fromCurrency}&api_key=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const rate = data[fromCurrency];
                const convertedResult = amount / rate;
                setResult(`${amount} ${fromCurrency} is equal to ${convertedResult.toFixed(8)} ${toCurrency}`);
                setError('');
            })
            .catch(error => {
                setResult('');
                setError('Error: Unable to fetch exchange rate.');
                console.error(error);
            });
    };

    const handleCurrencyChange = (e) => {
        setFromCurrency(e.target.value);
    }


    return (
        <div className="container">

            <div>
                <Input type="dropdown" label='From' value={fromCurrency} onChange={setFromCurrency}
                       options={[
                           {value: 'EUR', label: 'EUR - Euro'},
                           {value: 'USD', label: 'USD - US Dollar'},
                       ]}
                />

                <Input type="dropdown" label='To' value={toCurrency} onChange={setToCurrency}
                       options={[
                           {value: 'ETH', label: 'Ethereum (ETH)'},
                           {value: 'USDT', label: 'Tether (USDT)'},
                       ]}
                />

            </div>

            <Input type="number"  label='Amount' defaultValue={1} min={0}  onChange={(value) => {setAmount(value || 1)  }}/>

            <p id="result" style={ !(error) ? {height: "25px", fontWeight:'bold'} : {height: "25px", color: 'red'}}>
                {!error ? result : error}
            </p>

            <Input type="button" value="Convert" onClick={handleConvert} />
        </div>
    );
};

export default CurrencyConverter;
