import {db} from './firebase';

export const create = async (escrow, status = false) => {
    // Store an Escrow Smart Contract
    db.ref('escrows').push({
      address: escrow.address,
      arbiter: escrow.arbiter,
      beneficiary: escrow.beneficiary,
      value: escrow.value,
      isApproved: status,
    }).then((snapshot) => {
      console.log('Escrow Smart Contract stored with key: ', snapshot.key);
    }).catch((error) => {
      console.error('Error storing Escrow Smart Contract: ', error);
    });
  };

export const updateEscrow = async(snapshotKey, updates) =>{
    // Update the data
    const snapshotRef = db.ref('escrows').child(snapshotKey);
    // Update the snapshot
    snapshotRef.update(updates)
    .then(() => {
        console.log('Snapshot updated successfully');
    })
    .catch((error) => {
        console.error('Error updating snapshot:', error);
    });
}

  export const getEscrows = async () => {
    return db.ref('escrows').once('value')
      .then((snapshot) => {
        const escrows = [];
        snapshot.forEach((childSnapshot) => {    
          let escrow={}
          escrow.val=childSnapshot.val();
          escrow.key=childSnapshot.key;
          escrows.push(escrow);
        });
        return escrows;
      })
      .catch((error) => {
        console.error('Error retrieving escrows:', error);
        throw error;
      });
  };
//goerli_arbitrer is deployer: 0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352
//goerli_beneficiary is arbitrer: 0x6F70A6A4E007e976a6363c347108D2Eb7ff4b173
//goerli_deployer is beneficiary: 0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b
