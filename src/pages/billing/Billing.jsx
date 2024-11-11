import React from 'react'
import BuyCredit from '../../components/buyCredit/BuyCredit'
import ChosenPlan from '../../components/chosenPlan/ChosenPlan'
import PlanCards from '../../components/planCards/PlanCards'

function Billing() {
  return (
    <div>
      <h1 className='text-left'>Plans</h1>
      <div className=''>
<BuyCredit />
      </div>
      <div className=''>
<ChosenPlan />
      </div>
      <div className=''>
<PlanCards />
      </div>
    </div>
  )
}

export default Billing
