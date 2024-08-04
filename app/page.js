"use client";

import Image from "next/image";
import {useState, useEffect} from "react";
import { firestore } from "@/firebase";
import { collection, getDocs, getDoc, doc, query, setDoc } from "firebase/firestore";
import { Box, Modal, Stack, TextField, Typography, Button } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
const modalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const removeQuant = {
  bgcolor: '#b71c1c', // Slightly darker red
  color: 'white',
  fontWeight: 'bold',
  '&:hover': {
    bgcolor: '#8e0000', // Even darker red on hover
  },
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open , setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const updateIventory = async () => {
    /// Collect all the relevant items that we have in the pantry
    const snapshot = query(collection(firestore, 'inventory')); // get the collection of items
    const docs = await getDocs(snapshot); // get each document insdie this collection of items
    const inventoryList = [] // ahve an intial list of items
    // Iterate and add each item to the list
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      }
      );
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  }
  const addItem = async (itemName) => {
    const docRef = doc(collection(firestore, 'inventory'), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity + 1});
    } else {
      await setDoc(docRef, {quantity: 1});
    }
    await updateIventory();
  }


  const removeItem = async (itemName) => {
    const docRef = doc(collection(firestore, 'inventory'), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data();
      if (quantity > 1) {
        await updateDoc(docRef, {
          quantity: quantity - 1,
        });
      } else {
        await deleteDoc(docRef);
      }
    }
    await updateIventory();
  }

  useEffect(() => {
    updateIventory()
  }, [])

  //Helper functions to open and close the modal
  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Box width = "100vw" height= "100vh" display="flex" justifyContent="center" alignItems={"center"} flexDirection={"column"} gap={2}>
      <Modal open={open} onClose={handleClose} style={modalStyle}>
        <Box   
        width={400} 
        bgcolor={"white"}
        border="2px solid #000" 
        boxShadow={24} p={2} 
        display="flex" 
        flexDirection={"column"}
        gap={3}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e)=> setItemName(e.target.value)}></TextField> 
            <button variant="outlined" bgcolor="black" onClick={() => {addItem(itemName)
            setItemName("")
            handleClose()
            }}>Add</button>
            </Stack>
        </Box>

      </Modal>
      
      
      <Box display="flex" alignItems="left" width="90vw" justifyContent={"center"} flexDirection={"column"} border="1px solid #000" bgcolor="#ADD8E6">
        <Typography variant="h1" align="top"> Inventory Management</Typography>
        <Button variant="contained" onClick={handleOpen}>Add Item</Button>
        <Box bgcolor={"grey"}>
        <Stack direction="column" spacing={2}>
        {inventory.map((item) => (
          <Box key={item.name} display="flex" alignItems="left" justifyContent={"space-between"}  width="50vh" padding="16px 8px" margin="4px 4px" >
            <Typography variant="h6" paddingRight="16px">{item.name} <b>|</b> Quantity: {item.quantity}</Typography>
            <Box display={"flex"} gap="8px">
            <Button variant="contained" onClick={() => addItem(item.name)}>+</Button>
            <Button variant="contained" sx={removeQuant} onClick={() => removeItem(item.name)}>-</Button>
            </Box>
            
            
          </Box>
        ))}
        </Stack>
        </Box>
      </Box>
    </Box>
  );
}
