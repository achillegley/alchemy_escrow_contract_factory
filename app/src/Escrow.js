import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export default function Escrow({
    _escrow
  }) {
    const [escrow,setEscrow]=useState();
    useEffect(()=>{
      setEscrow(_escrow);
    },[]);

    return (
      <div className="existing-contract">
        { _escrow && (
        <ul className="fields">
          <li>
            <div> Arbiter </div>
            <div> {_escrow.arbiter} </div>
          </li>
          <li>
            <div> Beneficiary </div>
            <div> {_escrow.beneficiary} </div>
          </li>
          <li>
            <div> Value </div>
            <div> {ethers.utils.formatEther(_escrow.value)} ETH </div>
          </li>
          {_escrow.isApproved==false? (<div
            className="button"
            id={_escrow.address}
            onClick={(e) => {
              e.preventDefault();
              _escrow.handleApprove();
            }}
          >Approve</div>):(<div className='complete'>✓ It's been approved!</div>)
          }
        </ul>
        )}
      </div>
    );
  }