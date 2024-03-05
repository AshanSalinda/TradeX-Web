import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BasicPage from '../../../Components/BasicPage/BasicPage'
import SidePanelWithContainer from '../../../Components/SidePanel/SidePanelWithContainer'
import Input from '../../../Components/Input/Input'
import ValueBar from '../../../Components/ValueBar/ValueBar'
import Table, { TableRow } from '../../../Components/Table/Table'
import axios from 'axios';
import './PortfolioWallet.css'

export default function FundingWallet() {
    const currentWallet = new URLSearchParams(useLocation().search).keys().next().value;
    const [ wallet, setWallet ] = useState(currentWallet);
    const [ selectedCoin, setSelectedCoin ] = useState('');
    const [ selectedQty, setSelectedQty ] = useState(null);
    const [ selectedWallet, setSelectedWallet ] = useState(null);
    const [ walletAddress, setWalletAddress ] = useState(null);
    const [ assets, setAssets ] = useState([]);
    const [ usdBalance, setUsdBalance ] = useState(0);
    const [ portfolioValue, setPortfolioValue ] = useState(0);
    const [isInvalid, setIsInvalid] = useState([true, null]);
    const backendApiEndpoint = 'http://localhost:8004/portfolio/asset/';
    const userId = 1;


    useEffect(() => {

        if(wallet === 'tradingWallet') {

            if ( (selectedCoin && selectedQty) ) {
                setIsInvalid([false, null]);

                const asset = assets.find(asset => asset.symbol === selectedCoin);

                if (selectedQty > asset.tradingBalance) {
                    setIsInvalid([true, "Insufficient Balance"]);
                }
            } else {
                if ((!(!selectedCoin && !selectedQty))) {
                    setIsInvalid([true, "Please fill all the fields"]);
                } else {
                    setIsInvalid([true, null]);
                }
            }

        } else if (wallet === 'fundingWallet') {

            if ( selectedCoin && selectedQty && selectedWallet ) {

                if  ( selectedWallet === 'tradingWallet' || 
                    ( selectedWallet === 'externalWallet' && 
                    walletAddress )
                ) {
                    setIsInvalid([false, null]);
                } else {
                    setIsInvalid([true, "Please fill all the fields"]);
                }

                const asset = assets.find(asset => asset.symbol === selectedCoin);
                
                if (selectedQty > asset.fundingBalance) {
                    setIsInvalid([true, "Insufficient Balance"]);
                }
            } else {
                if((!(!selectedCoin && !selectedQty  && !selectedWallet))) {
                    setIsInvalid([true, "Please fill all the fields"]);
                } else {
                    setIsInvalid([true, null]);
                }
            }
        }

    }, [assets, selectedCoin, selectedQty, selectedWallet, walletAddress, wallet]);


    useEffect(() => {
        wallet === 'fundingWallet' ?  
            setSelectedWallet(null) :
            setSelectedWallet('fundingWallet');

        axios
            .get(
                wallet === "tradingWallet" ? 
                backendApiEndpoint + "trading" :
                backendApiEndpoint + "funding",
                {
                    params: {
                        userId: userId
                    }
                }
            )
    
            .then(res => {
                setAssets(res.data.assets);
                setUsdBalance( res.data.usdBalance );
                setPortfolioValue( res.data.portfolioValue);
            })
    
            .catch(error => {
                error.response ? alert(error.response.data.message) :
                console.log("error", error);
            });
    }, [wallet]);


    const transfer = () => {
        const data = {
            userId: userId,
            coin: selectedCoin,
            quantity: selectedQty,
            date: new Date().toLocaleDateString(),
            sendingWallet: wallet,
            receivingWallet: selectedWallet === 'externalWallet' ? 
            document.getElementById('walletAddress').value : selectedWallet
        };


        axios
            .put(
                backendApiEndpoint,
                data
            )
    
            .then(res => {
                console.log(res.data);
            })
    
            .catch(error => {
                error.response ? alert(error.response.data.message) :
                console.log("error", error);
            });
    }

    
    return (
        <BasicPage
            tabs={[
                { label:"Overview", path:"/portfolio"},
                { label:"History", path:"/portfolio/history"},
            ]}

            subPages={{
                onClick: setWallet,
                selectedPage: wallet,
                pages: [
                    { label:"Trading Wallet", value:"tradingWallet"},
                    { label:"Funding Wallet", value:"fundingWallet"},
                ],
            }}> 
            
            <SidePanelWithContainer 
                style={{height:"91vh"}}
                header="Transfer"
                sidePanel = {
                    <div>
                        <Input type="dropdown" label='Coin' onChange={setSelectedCoin} options={
                            assets.map(asset => ({
                                value: asset.symbol, 
                                label: asset.symbol
                            }))
                        } />


                        <Input type="number" label='Quantity' onChange={setSelectedQty} />


                        { 
                            wallet === "fundingWallet" &&
                            <div className={'hidden-input'} >
                                <Input type="dropdown" label='Receiving Wallet' defaultValue={selectedWallet} onChange={setSelectedWallet} 
                                    options={[
                                            { value: 'tradingWallet', label: 'Trading Wallet' },
                                            { value: 'externalWallet', label: 'External Wallet' },
                                        ]}
                                />
                            </div> 
                        }



                        <div className={`traveling-input ${wallet === "fundingWallet" ? "goDown" : ""}`}>
                        { 
                            wallet === "fundingWallet" && selectedWallet === 'externalWallet' &&
                            <div className={'hidden-input'} >
                                <Input type="text" label='Wallet Address' id="walletAddress" onChange={setWalletAddress} style={{width:"calc(100% + 70px)"}}/> 
                            </div> 
                        }
                            <div className={`traveling-input ${wallet === "fundingWallet" && selectedWallet === 'externalWallet' ? "goDown" : ""}`}>
                                <Input type="button" value="Transfer" onClick={transfer} disabled={isInvalid[0]} style={{marginTop:"50px"}}/> 

                                <p className={`alert-invalid-message ${isInvalid[1] ? 'show' : ''}`} > { isInvalid[1] } </p>                            
                            </div>
                        </div>
                    </div>
                }>

                    
                <ValueBar 
                    portfolioValue={ portfolioValue }
                    usdBalance={ usdBalance }
                />

               
                <Table emptyMessage="No Assets to show" restart={wallet}>
                    <TableRow data={ wallet === "tradingWallet" ? 
                        [
                            'Coin', 
                            'Trading Balance',
                            'Holding Balance',
                            'Market Price', 
                            'Value', 
                            'ROI'
                        ] :
                        [
                            'Coin', 
                            'Funding Balance',
                            'Market Price', 
                            'Value', 
                            'ROI'
                        ]
                    }/>
 
                    { assets && (wallet === "tradingWallet" ? assets : assets.slice(1)).map(asset => (  
                        <TableRow 
                            key={asset.symbol} 
                            data={ wallet === "tradingWallet" ?
                            [
                                [ asset.symbol ], 
                                asset.tradingBalance,
                                asset.holdingBalance,
                                asset.marketPrice, 
                                `$ ${asset.value.toFixed(2)}`,
                                <span style={{ color: asset.RoiColor }}>{asset.ROI}</span>
                            ] :
                            [
                                [ asset.symbol ], 
                                asset.fundingBalance,
                                asset.marketPrice, 
                                `$ ${asset.value.toFixed(2)}`,
                                <span style={{ color: asset.RoiColor }}>{asset.ROI}</span>
                            ]
                        }/>
                    ))}
                </Table> 


            </SidePanelWithContainer>
        </BasicPage>
    )
}