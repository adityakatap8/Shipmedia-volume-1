import React, { useState } from 'react'
import BuyCredit from '../buyCredit/BuyCredit';
function ChosenPlan() {
    const [count, setCount] = useState(0);
    const [showBuyCredits, setShowBuyCredits] = useState(false);

    // Calculate the amount based on the number of credits
    const amount = count * 2; // 2 dollars per credit

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        if (count > 0) { // Prevent going below 0
            setCount(count - 1);
        }
    };

    const handleButtonClick = () => {
        if (showBuyCredits) {
           
            setShowBuyCredits(false);
        } else {
           
            setShowBuyCredits(true);
        }
    };

    return (
        <div className='flex flex-col container text-left border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 flex'>
            <h1 className='text-3xl text-customBlue text-left pb-3'>Standard Monthly Plan</h1>
            <div className='border border-lightBlue rounded-3xl p-8 mb-4 flex items-center'>
                <div className='flex flex-col flex-grow text-left'>
                    <span className='text-4xl text-lightBlue'>= $199/Month</span>
                    <h5 className='text-lightBlue font-light pt-3 pl-10 text-left'>1 Credit = $2/GB</h5>
                </div>
                <div className='flex items-center ml-6'>
                <button
                        onClick={handleButtonClick}
                        className='bg-[#ff7f00] text-white border-2 border-white rounded-full px-4 py-2 text-lg font-bold'
                    >
                        {showBuyCredits ? 'Cancel' : 'Buy Credits'}
                    </button>
                </div>
            </div>
            {showBuyCredits && <BuyCredit />}
        </div>
        

    );
};

export default ChosenPlan

