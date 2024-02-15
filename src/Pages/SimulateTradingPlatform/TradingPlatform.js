import React from 'react'
import BasicPage from '../../Components/BasicPage/BasicPage';
import {TradingChart} from "../../Components/SimulateChart/TradingChart";
import SidePanelWithContainer from "../../Components/SidePanel/SidePanelWithContainer";
import CoinBar from "../../Components/SimulateChart/CoinBar";
import './TradingPlatForm.css'
import ButtonSet from "../../Components/SimulateChart/ButtonSet";
import Input from "../../Components/Input/Input";
import NumberInput from "../../Components/Input/NumberInput/NumberInput";
import SliderInput from "../../Components/Input/SliderInput/SliderInput";
import ButtonComponent from "../../Components/Buttons/ButtonComponent";

export default function Portfolio() {

    const Tabs = [
        {label: "Spot", path: "/simulate"},
        {label: "Future", path: "/"},
    ];

    const priceLimits = ['Limit', 'Market', 'Stop Limit'];


    return (
        <BasicPage tabs={Tabs}>
            <SidePanelWithContainer
                line={false}
                style={{height: '530px'}}
                sidePanel={
                    <div>
                        <h1 className="tradeHeader">Trade</h1>
                        <ButtonSet priceLimits={priceLimits}/>
                        <Input type={"switch"} buttons={["Buy","Sell"]}/>

                        <div className='input-field-container'>
                            <label htmlFor="" className='label'>Price</label>
                            <NumberInput icon={"$"}/>
                        </div>
                        <div className='input-field-container'>
                            <label htmlFor="" className='label'>Quantity</label>
                            <NumberInput icon={"BTC"}/>
                        </div>

                        <SliderInput/>

                        <div className='input-field-container'>
                            <label htmlFor="" className='label'>Total</label>
                            <Input type={"text"} placehalder={"Total"}/>
                        </div>

                        <ButtonComponent>Buy</ButtonComponent>

                    </div>
                }
            >
                <CoinBar/>
                <TradingChart/>
            </SidePanelWithContainer>
        </BasicPage>
    )
}
