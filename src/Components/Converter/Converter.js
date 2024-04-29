import React, { useState } from 'react';
import './Converter.css'; 

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
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

  return (
    <div className="container" >
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount"
        required
      />
      <label id="fromCurrencyName"></label>
      <div>
        <select
          style={{backgroundColor:"#0e0e0f" }}
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          <option value="USD" selected="">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="INR">INR - India Rupee</option>
                    <option value="NZD">NZD - New Zealand Dollar</option>
                    <option value="CHF">CHF - Swiss Franc</option>
                    <option value="ZAR">ZAR - South African Rand</option>
                    <option value="BGN">BGN - Bulgarian Lev</option>
                    <option value="SGD">SGD - Singapore Dollar</option>
                    <option value="HKD">HKD - Hong Kong Dollar</option>
                    <option value="SEK">SEK - Swedish Krona</option>
                    <option value="THB">THB - Thai Baht</option>
                    <option value="HUF">HUF - Hungarian Forint</option>
                    <option value="CNY">CNY - Chinese Yuan Renminbi</option>
                    <option value="NOK">NOK - Norwegian Krone</option>
                    <option value="MXN">MXN - Mexican Peso</option>
                    <option value="GHS">GHS - Ghanians Cedi</option>
                    <option value="NGN">NGN - Nigerian Naira</option>
        </select>
        <select
        style={{backgroundColor:"#0e0e0f" }}
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                    <option value="BNB">Binance Coin (BNB)</option>
                    <option value="USDC">USD Coin (USDC)</option>
                    <option value="XRP">XRP (XRP)</option>
                    <option value="BUSD">Binance USD (BUSD)</option>
                    <option value="ADA">cardano (ADA)</option>
                    <option value="DOGE">Dogecoin (DOGE)</option>
                    <option value="MATIC">Polygon (MATIC)</option>
                    <option value="SOL">Solana (SOL)</option>
                    <option value="DOT">Polkadot (DOT)</option>
                    <option value="SHIB">Shiba Inu (SHIB)</option>
                    <option value="LTC">Litecoin (LTC)</option>
                    <option value="TRX">Tron (TRX)</option>
                    <option value="AVAX">Avalanche (AVAX)</option>
        </select>
      </div>
      <br />
      <button type="button" className="primary-btn" onClick={handleConvert}>
        Convert
      </button>
      {error && <p id="result" style={{ color: 'red' }}>{error}</p>}
      {result && <p id="result">{result}</p>}
    </div>
  );
};

export default CurrencyConverter;