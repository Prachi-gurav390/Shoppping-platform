require('dotenv').config();

const port = process.env.PORT || 8000;
const localhost = process.env.HOST || 'localhost';

const jwt_decode = require('jwt-decode');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { log } = require('util');
const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Database connection successful.');
    }
});

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log("server listening on port 8000");
})

// ROUTES

app.get("/", (req, res) => {
    res.send(`<h1>The api is working properly</h1>`);
})

app.post("/SellerSignup", (req, res) => {
    db.query("Insert into seller_auth values (?,?,?)", [req.body.seller_name, req.body.seller_email, req.body.seller_pass], (err, results) => {
        if (err) { console.log(err); }
        res.send(results);
    })
})
app.post("/UserSignup", (req, res) => {
    db.query("Insert into user_auth values (?,?,?)", [req.body.username, req.body.user_email, req.body.user_pass], (err, results) => {
        if (err) { console.log(err); }
        res.send(results);
    })
})

app.post("/SellerLogin", (req, res) => {
    let seller_pass_db = "";
    const provided_pass = req.body.seller_pass
    provided_email = req.body.seller_email;
    const payload = { "username": provided_email }
    db.query("select seller_password from seller_auth where seller_email = ?", [provided_email], (err, results) => {
        if (err) {
            console.log(err);
            res.send(`<h1>Error accesing user details</h1>`)
        }
        else {
            seller_pass_db = results[0].seller_password

            if (provided_pass == seller_pass_db) {
                //GENERATE JSON WEBTOKEN
                let userAccessToken = jwt.sign(payload, process.env.ECOMM_SECRET_ACCESS_TOKEN_SELLER);
                res.send(userAccessToken);
            }
            else {
                res.status(401).send(`<h1>Invalid credentials</h1>`);
            }
        }
    })
})
app.post("/UserLogin", (req, res) => {
    let user_pass_db = "";
    const provided_pass = req.body.user_pass
    provided_email = req.body.user_email;
    const payload = { "username": provided_email }
    db.query("select user_password from user_auth where user_email = ?", [provided_email], (err, results) => {
        if (err) {
            console.log(err);
            res.send(`<h1>Error accesing user details</h1>`)
        }
        else {
            console.log(results.length);
            if(results.length != 0){
                user_pass_db = results[0].user_password
                if (provided_pass == user_pass_db) {
                    //GENERATE JSON WEBTOKEN
                    let userAccessToken = jwt.sign(payload, process.env.ECOMM_SECRET_ACCESS_TOKEN);
                    res.send(userAccessToken);
                }
                else {
                    res.status(401).send(`<h1>Invalid credentials</h1>`);
                }
            }
            else{
                res.status(401).send(`<h1>Invalid credentials</h1>`);
            }
                
        }
    })
})

app.post("/auth", (req, res) => {
    let authHeader = req.headers['authorization'];
    userTokenFE = authHeader && authHeader.split(' ')[1];
    var decoded = jwt_decode(userTokenFE);
    if (req.body.userID != decoded.username) {
        return res.sendStatus(401);
    }
    if (!userTokenFE) {
        return res.sendStatus(401);
    }

    jwt.verify(userTokenFE, process.env.ECOMM_SECRET_ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user; // ???
        return res.sendStatus(200);
    })
})
app.post("/authSeller", (req, res) => {
    console.log(req.body.userID);
    let authHeader = req.headers['authorization'];
    userTokenFE = authHeader && authHeader.split(' ')[1];
    var decoded = jwt_decode(userTokenFE);
    if (req.body.userID != decoded.username) {
        return res.sendStatus(401);
    }
    if (!userTokenFE) {
        return res.sendStatus(401);
    }

    jwt.verify(userTokenFE, process.env.ECOMM_SECRET_ACCESS_TOKEN_SELLER, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user; // ???
        res.sendStatus(200);
    })
})

app.get("/UserStore/Kitchen", (req, res) => {
    db.query("select * from product where category = 'kitchen'", [], (err, results) => {
        if (err) throw err;
        res.send(results);
    })
})
app.get("/UserStore/Clothing", (req, res) => {
    db.query("select * from product where category = 'Clothing'", [], (err, results) => {
        if (err) throw err;
        res.send(results);
    })
})
app.get("/UserStore/PersonalCare", (req, res) => {
    db.query("select * from product where category = 'PersonalCare'", [], (err, results) => {
        if (err) throw err;
        res.send(results);
    })
})
app.get("/UserStore/Electronics", (req, res) => {
    db.query("select * from product where category = 'Electronics'", [], (err, results) => {
        if (err) throw err;
        res.send(results);
    })
})

app.post("/Kitchen", (req, res) => {

    const seller_id = req.body.seller_ID;
    db.query("select * from product where (seller_id = ? and category = 'kitchen')", [seller_id], (err, results) => {
        if (err) {
            res.send(err);
        }
        res.send(results);
    });
})
app.post("/Clothes", (req, res) => {

    const seller_id = req.body.seller_ID;
    db.query("select * from product where (seller_id = ? and category = 'clothing')", [seller_id], (err, results) => {
        if (err) {
            res.send(err);
        }
        res.send(results);
    });
})
app.post("/PersonalCare", (req, res) => {
    const seller_id = req.body.seller_ID;
    db.query("select * from product where (seller_id = ? and category = 'personalCare')", [seller_id], (err, results) => {
        if (err) {
            res.send(err);
        }
        res.send(results);

    });
})
app.post("/Electronics", (req, res) => {
    const seller_id = req.body.seller_ID;
    db.query("select * from product where (seller_id = ? and category = 'electronics')", [seller_id], (err, results) => {
        if (err) {
            res.send(err);
        }
        res.send(results);
    });
})

app.post("/SellerStore/NewProduct", (req, res) => {
    const kp_pid = Math.random().toString(36).substring(2, 7);
    const seller_id = req.body.seller_ID;
    // const kp_pid = req.body.pid;
    const kp_name = req.body.pname;
    const kp_price = req.body.pprice;
    const kp_descr = req.body.pdescr;
    const category = req.body.category;
    db.query("INSERT INTO product (seller_id, p_id, p_name, p_price, p_descr, category) VALUES (?, ?, ?, ?, ?, ?)", [seller_id, kp_pid, kp_name, kp_price, kp_descr, category], (err, results) => {
        if (err) {
            console.log(err);
            res.status(401).send(err);
        }
        else {
            res.send(results);
        }
    })
})

function createCart(ID) {
    const cart_id = Math.random().toString(36).substring(2, 7);
    db.query("insert into user_cart values (?, ?)", [ID, cart_id], (err, results) => {
        if (err) return err;
    })
    return cart_id;
}

function asyncQuery(sql, values) {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

const checkCart = (req, res, next) => {
    db.query("select * from user_cart where user_id = ?", [req.body.ID], (err, results) => {
        if (results.length == 0) {
            req.body.cart_id = createCart(req.body.ID);
            next();
        } else {
            req.body.cart_id = results[0].cart_id;
            next();
        }
    })
}


async function checkItemInCart(cart_id, p_id) {
    const rows = await asyncQuery("select p_id from cart_items where cart_id = ? and p_id = ?", [cart_id, p_id]);
    if (rows.length == 0) {
        return -1; // RETURNS -1 for Not in cart
    } else {
        return 0; // RETURNS 0 for item in cart
    }
}

async function checkQuantity(cart_id, p_id){
    const result = await asyncQuery("Select quantity from cart_items where cart_id = ? and p_id = ?", [cart_id, p_id]);
    return result[0].quantity;
}

app.post("/AddToCart", checkCart, async (req, res) => {
    const result = await checkItemInCart(req.body.cart_id, req.body.pid);
    if (result == -1) {
        const results = await asyncQuery("insert into cart_items values (?, ?, ?)", [req.body.cart_id, req.body.pid, 1]);
        res.send(results);
    }
    else {
        const results = await asyncQuery("update cart_items set quantity = quantity + 1 where cart_id = ? and p_id = ?", [req.body.cart_id, req.body.pid]);
    }
})

app.post("/ShowCart", checkCart , (req, res) => {
    db.query("select t3.*, t12.* from product t3 inner join (select t1.user_id, t1.cart_id, t2.p_id, t2.quantity from user_cart t1 inner join cart_items t2 on t1.cart_id = t2.cart_id) t12 on t3.p_id = t12.p_id where (cart_id = ?)", [req.body.cart_id], (err, results) => {
        if(err) throw err;
        res.send(results);
    })
})

app.post("/RemoveFromCart", async (req, res) => {
    let quantity = await checkQuantity(req.body.cart_id, req.body.pid);
    if(quantity > 0){
        results = await asyncQuery("update cart_items set quantity = quantity - 1 where cart_id = ? and p_id = ?", [req.body.cart_id, req.body.pid]);
        res.send(results);
    }else if(quantity == 0){
        axios.post("http://localhost:8000/DeleteFromCart", {cart_id: req.body.cart_id, pid: req.body.pid})
    }
})

app.post("/DeleteFromCart", (req, res) => {
    db.query("delete from cart_items where cart_id = ? and p_id = ?", [req.body.cart_id, req.body.pid], (err, results) => {
        if(err) throw err;
        res.send(results);
    })
})

app.post("/PlaceOrder", async (req, res) => {
    const order_id = Math.random().toString(36).substring(2, 7);

    let query1 = await asyncQuery("insert into user_orders values (?, ?, 'pending')", [order_id, req.body.ID]);

    let query2 = await asyncQuery("insert into order_details (order_id, p_id, quantity) select ?, p_id, quantity from (SELECT t1.user_id, t2.p_id, t2.quantity FROM user_cart t1 INNER JOIN cart_items t2 ON t1.cart_id = t2.cart_id) t3 where t3.user_id = ? ", [order_id, req.body.ID]);

    let query3 = await asyncQuery("delete from cart_items where cart_id = ?", [req.body.cart_id])
    res.send(query3);
})

app.post("/GetCartId", (req, res) => {
    db.query("select cart_id from user_cart where user_id = ?", [req.body.ID], (err, results) => {
        res.send(results[0]);
    })
})

app.post("/totalSaleOfProd", (req, res) => {
    db.query("SELECT SUM(quantity) AS total_quantity_ordered FROM order_details WHERE p_id = ?;", [req.body.p_id], (err, results) => {
        if(results.length == 0){
            res.send({
                "total_quantity_ordered": "No Data"
              })
        }
        res.send(results[0]);
    })
})

app.post("/totalSaleOnPlat", (req, res) => [
    db.query("SELECT SUM(quantity) as total_quant FROM order_details", (err, results)=>{
        if(err) res.status(204).send({"total_sale": "No Sales"})
        // if(err) throw err;
        res.send(results[0]);
    })
])

app.post("/totalQuantityBySeller", (req, res) => {
    db.query("SELECT SUM(quantity) as total_quantity_sold FROM product pd JOIN order_details od ON pd.p_id = od.p_id WHERE pd.seller_id = ?;", [req.body.ID], (err, results) => {
        res.send(results[0]);
    })
})

app.post("/totalSaleBySeller", (req, res) => {
    db.query("SELECT SUM(quantity*p_price) as total_value FROM product pd JOIN order_details od ON pd.p_id = od.p_id WHERE pd.seller_id = ?;", [req.body.ID], (err, results) => {
        if(err) res.status(204).send({"total_value": 0})
        // if (err) throw err;
        res.send(results[0]);
    })
})

app.post("/maxSalesProd", (req, res) => {
    db.query("SELECT pd.p_id, pd.p_name, SUM(od.quantity) as total_quantity_sold FROM product pd JOIN order_details od ON pd.p_id = od.p_id WHERE pd.seller_id = ? GROUP BY pd.p_id, pd.p_name ORDER BY total_quantity_sold DESC LIMIT 1;", [req.body.ID], (err, results) => {
        if (err) throw err;
        res.send(results[0]);
    })
})

app.post("/highestSalesLoc", async (req, res) => {
    let result = await asyncQuery("SELECT ad.pincode FROM user_orders uo JOIN order_details od ON uo.order_id = od.order_id JOIN product pd ON od.p_id = pd.p_id JOIN user_address ad ON uo.user_id = ad.user_id WHERE pd.seller_id = ? GROUP BY ad.pincode ORDER BY COUNT(*) DESC LIMIT 1;", [req.body.ID])

    result = result[0].pincode;
    
    db.query("select * from pincode_data where pincode = ?", [result], (err, results) => {
        if (err) throw err;
        res.send(results[0])
    })
})

app.post("/averageOrderValue", (req, res) => {
    db.query("SELECT AVG(pd.p_price * od.quantity) AS average_price FROM user_orders uo JOIN order_details od ON uo.order_id = od.order_id JOIN product pd ON od.p_id = pd.p_id;", (err, results) => {
        if(err) throw err;
        res.send(results[0]);
    })
})

app.post("/competitorAnalysis", (req, res) => {
    db.query("SELECT p.seller_id, SUM(od.quantity * pd.p_price) as total_sales FROM product pd JOIN order_details od ON pd.p_id = od.p_id JOIN product p ON pd.p_id = p.p_id WHERE pd.category = ? AND p.seller_id = ? GROUP BY p.seller_id ORDER BY total_sales DESC", [req.body.category, req.body.ID], (err, results) => {
        if(results.length == 0){
            res.send({
                "seller_id": "No Data",
                "total_sales": "0"
              })
        }
        res.send(results[0]);
    })
})

app.post("/prodList", (req, res) => {
    db.query("SELECT p_id from product", [], (err, results) => {
        if(results.length == 0){
            res.send({
                "p_id": "No Data"
              })
        }
        res.send(results);
    })
})

app.post("/testQuery", async (req, res) => {
    let r1 = await asyncQuery("select * from user_cart where user_id = ?", [req.body.ID])
    console.log(r1);
    res.send(r1);
})