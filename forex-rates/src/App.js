import './App.css';
 import { useState, useEffect } from 'react';
 import Table from '@mui/material/Table';
 import TableBody from '@mui/material/TableBody';
 import TableCell from '@mui/material/TableCell';
 import TableContainer from '@mui/material/TableContainer';
 import TableHead from '@mui/material/TableHead';
 import TableRow from '@mui/material/TableRow';
 import Paper from '@mui/material/Paper';




async function fetchData(){
  var myHeaders = new Headers();
  myHeaders.append("apikey", process.env.BACKUP_FOREX_FIXER_API_KEY);
  
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };
 
  const response =  await  fetch(`https://api.apilayer.com/fixer/latest?symbols=&base=`, requestOptions)
  const data = await response.json();

  const newRates = {};

  for(const [key, value] of Object.entries(data.rates)){
    newRates[key] = Number(value) + 10.0002;
  }

  return {originalRates: data.rates, newRates: newRates};
}



function App() {
  const [originalRates, setOriginalRates] = useState(null);
  const [newRates, setNewRates] = useState(null);

  useEffect(() => {
    fetchData().then(data => {
      setOriginalRates(data.originalRates);
      setNewRates(data.newRates);
    }).catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);

  const isEven = (number) => {
   
  const decimalPart = number % 1;
  return Math.round(decimalPart * 100) % 2 === 0;
  };

  const renderRows = () => {
    if (!originalRates || !newRates) return null;

    return Object.keys(originalRates).map(currency => (
      <TableRow key={currency} sx={{ 
        '&:nth-of-type(odd)': {
          border: currency === 'HKD'|| isEven(originalRates[currency]) ? '2px solid red' : 'none',
        },
        '&:last-child td, &:last-child th': { 
          border: 0 
        },
       
      }}>
        <TableCell component="th" scope="row">
          {currency}  
        </TableCell>
        <TableCell align="right">{originalRates[currency]}</TableCell>
        <TableCell align="right">{newRates[currency]}</TableCell>
      </TableRow>
    ));
  };

  return (
   
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Currency</TableCell>
            <TableCell align="right">Original Rate</TableCell>
            <TableCell align="right">New Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderRows()}
        </TableBody>
      </Table>
    </TableContainer>
      
  );
}

export default App;



