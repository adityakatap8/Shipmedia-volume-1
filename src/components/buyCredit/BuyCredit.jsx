import React, { useState } from 'react';
import BlueButton from '../blueButton/BlueButton';
import Submit from '../submit/Submit';
import "./index.css"

const BuyCredit = () => {
    const [count, setCount] = useState(0);

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

    return (
        <div className='flex flex-col container border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 flex'>
            <h1 className='text-3xl text-customBlue text-left pb-3'>Active Plan</h1>
            <div className='border border-lightBlue rounded-3xl p-8 mb-4 flex items-center'>
                <div className='flex items-center flex-grow'>
                    <button
                        className='w-12 h-12 border-2 border-[#3754B9] bg-white text-[#3754B9] rounded-full flex items-center justify-center text-2xl font-bold'
                        onClick={handleDecrement}
                    >
                        -
                    </button>

                    <span className='mx-4 text-xl font-bold'>{count}</span>

                    <button
                        className='w-12 h-12 border-2 border-[#3754B9] bg-white text-[#3754B9] rounded-full flex items-center justify-center text-2xl font-bold'
                        onClick={handleIncrement}
                    >
                        +
                    </button>
                </div>

                {/* Amount Display */}
                <div className='flex flex-col ml-6'>
                    <span className='text-4xl text-lightBlue'>= ${amount} / GB</span>
                    <h5 className='text-lightBlue font-light pt-3 text-center'>1 Credit = $2/GB</h5>
                    <div className='flex space-x-4 mt-4'>
                        <button className='cancel'>Cancel</button>
                    <button  className='buy-credits'>Buy Credits </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyCredit;
