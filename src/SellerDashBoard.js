import { useEffect, useState } from 'react'
import './SellerDashboard.css'
import { Link } from 'react-router-dom'

const liveUrl = "https://shoppingappserver.onrender.com/";

export function SellerDashboardBtn(){
    return <>
        <Link to="/SellerDashboard" className='fixedBtn'>Seller Dashboard</Link>
    </>
}

export function SellerDashboard(){

    const [pid, SetPid] = useState("");

    const [totalQuantOnPlat, SetTotalQuantOnPlat] = useState("");
    const [totalSaleBySeller, SetTotalSaleBySeller] = useState("");
    const [totalQuantBySeller, SetTotalQuantBySeller] = useState("");
    const [totalSaleOfProd, SetTotalSaleOfProd] = useState("");
    const [maxSoldProdQuant, SetMaxSoldProdQuant] = useState(0);
    const [maxSoldProdName, SetMaxSoldProdName] = useState("");
    const [highestSalesLoc, SetHighestSalesLoc] = useState(0);
    const [highestSalesCity, SetHighestSalesCity] = useState("");
    const [highestSalesState, SetHighestSalesState] = useState("");
    const [averageOrderValue, SetAverageOrderValue] = useState(0);
    const [category, SetCategory] = useState("");
    const [topSeller, SetTopSeller] = useState("");
    const [topSellerSales, SetTopSellerSales] = useState("");
    const [pids, SetPids] = useState([]);

    const seller_id = localStorage.getItem("ID");

    function totalSaleOfProdReq(){
        fetch(liveUrl + "totalSaleOfProd", {method: "post", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ ID: seller_id, p_id: pid })})
        .then(res => res.json())
        .then(res => SetTotalSaleOfProd(res.total_quantity_ordered))
        .catch(err => console.log(err))
    }
    function totalQuantBySellerReq(){
        fetch(liveUrl + "totalQuantityBySeller", {method: "post", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ ID: seller_id, p_id: pid })})
        .then(res => res.json())
        .then(res=> (res.total_quantity_sold))
        .then(res => SetTotalQuantBySeller(res))
        .catch(err => console.log(err))
    }
    function totalQuantOnPlatReq(){
        fetch(liveUrl + "totalSaleOnPlat", {method: "post", headers: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .then(res => res.total_quant)
        .then(res => SetTotalQuantOnPlat(res))
    }
    function totalSaleBySellerReq(){
        fetch(liveUrl + "totalSaleBySeller", {method: "post", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ ID: seller_id, p_id: pid })})
        .then(res => res.json())
        .then(res => res.total_value)
        .then(res => SetTotalSaleBySeller(res))
    }
    function maxSalesProdReq(){
        fetch(liveUrl + "maxSalesProd", {method: "post", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ ID: seller_id, p_id: pid })})
        .then(res => res.json())
        .then(res => {SetMaxSoldProdName(res.p_name);
                    SetMaxSoldProdQuant(res.total_quantity_sold);
                    return res;             
        })
    }
    function highestSalesLocReq(){
        fetch(liveUrl + "highestSalesLoc", {method: "post", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ ID: seller_id, p_id: pid })})
        .then(res => res.json())
        .then(res => {
            SetHighestSalesLoc(res.pincode);
            SetHighestSalesCity(res.city_name);
            SetHighestSalesState(res.state_name);
            return res;
        })
    }
    function averageOrderValueReq(){

        fetch(liveUrl + "averageOrderValue", {method: "post", headers: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .then(res => parseFloat(res.average_price))
        .then(res => SetAverageOrderValue(res))
    }
    function competitorAnalysis(){
        fetch(liveUrl + "competitorAnalysis", {method: "post", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ ID: seller_id, category: category })})
        .then(res => res.json())
        .then(res => {
            SetTopSeller(res.seller_id);
            SetTopSellerSales(res.total_sales);
            return res;
        })
    }

    function prodList(){
        fetch(liveUrl + "prodList", {method: "post", headers: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .then(res => {SetPids(res)})
    }

    useEffect(()=>{   
        prodList();
        totalQuantBySellerReq();
        totalSaleBySellerReq();
        totalQuantOnPlatReq();
        maxSalesProdReq();
        highestSalesLocReq();
        averageOrderValueReq();
    }, [])

    return <>
        <div className='pIDs'>
            <h4>Product IDs</h4>
            {pids.map(pid => (
                <p>{pid.p_id}</p>
            ))}
        </div>
        <div className='SDBcont'>
            <div className='SDBitem'>
                <div className='flexItem'>Total sale of product: {totalSaleOfProd?totalSaleOfProd:0}</div>
                <input onChange={(e) => SetPid(e.target.value)} className='flexItem' placeholder='      enter product id'/>
                <button className='flexItem' onClick={totalSaleOfProdReq}>Submit</button>
            </div>
            <div className='SDBitem'>
                <div className='flexItem'>Total Quantity Sold On Platform: {totalQuantOnPlat}</div>
            </div>
            <div className='SDBitem'>
                <div className='flexItem'>Total Sales By Seller: ₹{totalSaleBySeller}</div>
            </div>
            <div className='SDBitem'>
                <div className='flexItem'>Total Quantity sold By Seller: </div>
                <div className='flexItem'>{totalQuantBySeller}</div>
            </div>
            <div className='SDBitem'>
                <div className='flexItem'>Most Popular Product: </div>
                <div className='flexItem'>{maxSoldProdName}</div>
                <div className='flexItem'>Quantity: {maxSoldProdQuant}</div>
            </div>
            <div className='SDBitem'>
                <div className='flexItem'>Location With Highest Sales: {highestSalesLoc}</div>
                <div className='flexItem'>{highestSalesCity} {highestSalesState}</div>
            </div>
            <div className='SDBitem'>
                <div className='flexItem'>Average Order Value On Shompify: </div>
                <div className='flexItem'>{averageOrderValue}</div>
            </div>
            <div className='SDBitem'>
                <div className='flexItem'>Top Competitor: {topSeller}</div>
                <div className='flexItem'>Total Sales: ₹{topSellerSales}</div>
                <input className='flexItems' placeholder='Enter category' onChange={(e) => SetCategory(e.target.value)}/>
                <button className='flexItem' onClick={competitorAnalysis}>Submit</button>
            </div>
        </div>
    </>
}