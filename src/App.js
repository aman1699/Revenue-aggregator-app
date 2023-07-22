import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [values, setValue] = useState();
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState("ASC");
  const [total, setTotal] = useState();


  
  useEffect(() => {
    products();
  }, []);
  
  // function for sorting by productName
  const sorting = col => {
    if (order === "ASC") {
      const sorted = [...values].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setValue(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...values].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setValue(sorted);
      setOrder("ASC");
    }
    
  }
  
  //adding total revenue
  const totalPrice = values?.map((item) => item.totalRevenue).reduce((a, b) => a + b, 0);
  
  // updating Total revenue for filtered data
  const updateSubTotal = val => {
    console.log(values)
    const subTotal = values.filter(item => item.productName.toLocaleLowerCase() === val.toLocaleLowerCase());
    console.log(subTotal)
    setTotal(
      subTotal.reduce((acc, curr) => {
        acc += curr.totalRevenue;
        return acc;
      }, 0)
    );
  };
  
  //function for fetching data from json file and populating values
  const products = async () => {
    const res = await axios.get('./branch.json');
    let newState = []; 
    for (var i = 0; i < res.data.products.length; i++){
      newState.push({
        productName: res.data.products[i].name,
        totalRevenue: res.data.products[i].unitPrice * res.data.products[i].sold,
      });
    }
    
    setValue(newState)
  }
  
  
  return (
    <div className="container">
     <form>
        <input type="text" class="form-control"  onChange={(e) => { setSearch(e.target.value); updateSubTotal(e.target.value); }} placeholder="Search for Products"/>
     </form>
      <table class="table table-striped">
      <thead>
        <tr>
        <th scope="col" onClick={()=>sorting("productName")}>ProductName <i class="fas fa-sort text-right"/></th>
         <th scope="col">TotalRevenue</th>
        </tr>
     </thead>
    <tbody>
          {values?.filter((value) => { 
            return search.toLocaleLowerCase() === ''
            ?value
            :value.productName.toLocaleLowerCase().includes(search.toLocaleLowerCase())
       }).map((value) => (<tr key={value.totalRevenue}>
            <td>{value.productName}</td>
            <td>{value.totalRevenue}</td>
       </tr>))}
       <tr>
            <td />
            <td>Total Price  : {totalPrice}</td>
          </tr>
          <tr>
            <td />
            <td>Total Price after filter : {total}</td>
          </tr>
         
    </tbody>
</table>
    </div>
  );
}

export default App;
