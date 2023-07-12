import { ethers } from 'ethers';
import { useEffect,useLayoutEffect , useState } from 'react';
import deploy, {getContractInstance} from './deploy';
import Escrow from './Escrow';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {create,getEscrows,updateEscrow} from './crudEscrow';
const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  
  async function retrieveEscrows(){
    let _escrows= await getEscrows();
    console.log("escrows:  " , _escrows);
    _escrows.reverse();
    console.log("reversed escrows:  " , _escrows);
    let currentEscrows=[];
    _escrows.forEach(async (_currentEscrow)=>{
      let element=_currentEscrow.val;
      try {
        let contract_instance= await getContractInstance(element.address, provider);
        if(element.isApproved==false)
        {
          element.handleApprove=async () => {
            contract_instance.on('Approved', async () => {
              document.getElementById(contract_instance.address).className =
                'complete';
              document.getElementById(contract_instance.address).innerText =
              "✓ It's been approved!";
               await updateEscrow(_currentEscrow.key, {'isApproved':true})
            });
            await approve(contract_instance, signer);
          }
        }
        currentEscrows.push(element);
    } catch (error) {
        console.log("error when formating existing escrows ", error) 
      }
      
    });
    return currentEscrows;
  }

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
    
  }, [account]);

  useEffect(()=>{
    retrieveEscrows().then((currentEscrows)=>{
        setEscrows(currentEscrows);
    });
    
  },[])

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseEther(document.getElementById('amount').value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);
    console.log("the escrow contract ", escrowContract )

    const newescrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
    };
    
    //setEscrows([...escrows, newescrow]);
    try {
      create(newescrow,false).then(async ()=>{
        retrieveEscrows().then((currentEscrows)=>{
          setEscrows(currentEscrows);
        });
      })
    } catch (error) {
      console.log("error on create escrow ", error);
    }
    
  }

  return (
    <>
      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> */}
        <Box 
          direction="row"
          justifyContent="center"
          alignItems="baseline" sx={{ width: '100%' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs={12} sm={12} md={12}><h1> Escrow contract factory</h1></Grid>
            <Grid item xs={12} sm={6} md={6}>
              <div className="contract">
                <h2> New contract </h2>
                <label>
                  Arbiter Address
                  <input type="text" id="arbiter" />
                </label>

                <label>
                  Beneficiary Address
                  <input type="text" id="beneficiary" />
                </label>

                <label>
                  Deposit Amount (in Ether)
                  <input type="text" id="amount" />
                </label>

                <div
                  className="button"
                  id="deploy"
                  onClick={(e) => {
                    e.preventDefault();

                    newContract();
                  }}
                >
                  Deploy
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <div className="existing-contracts">
                <h2> Existing contracts </h2>
                <div id="container">
                  {escrows && (escrows.map((escrow,index) => {
                    //console.log(escrow)
                    return <Escrow key={index} _escrow={escrow} />;
                  }))}
                  
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      {/* </div> */}
    </>
  );
}

export default App;
