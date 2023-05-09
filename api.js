const jsonData = require('./data.json');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(cors());



//Middleware to parse JSON payloads
app.use(express.json());


// POST endpoint to send JSON data
app.post('/api/data', (req, res) => {
    const jsonData = req.body;
    res.send(jsonData);
});

// POST endpoint to receive JSON data and append it to a local JSON file
app.post('/api/data1', (req, res) => {
    const jsonData = req.body;

    // Read the existing JSON file
    fs.readFile('./data.json', (err, fileData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }

        let existingData = [];
        try {
            existingData = JSON.parse(fileData);
            if (!Array.isArray(existingData)) {
                existingData = [];
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send('Error parsing JSON file');
        }

        // Append the new data to the existing data
        const newData = [...existingData, jsonData];

        // Write the updated JSON data back to the file
        fs.writeFile('data.json', JSON.stringify(newData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing file');
            }
            // console.log('Data appended to file');
            res.send('Data appended to file');
        });
    });
});

//user interactions
app.post('/add_update_cart', (req, res) => {
    fs.readFile('./userToCart.json', (err, fileData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }

        let existingData = [];
        try {
            existingData = JSON.parse(fileData);
        } catch (err) {
            console.error(err);
            return res.status(500).send('Error parsing JSON file');
        }

        const response = req.body;
        
        if (response.type === "add") {
            if(existingData[response.userId] == undefined){
                existingData[''+response.userId] = [];
            }
            existingData[''+response.userId] = [...existingData[''+response.userId], ...response.itemList];
            fs.writeFile('./userToCart.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data appended to file');
                res.send('Data appended to file');
            });
        } else if (response.type === "update") {
            for (let i = 0; i < existingData[response.userId].length; i++) {
                if (existingData[response.userId][i].itemId === response.itemId) {
                    existingData[response.userId][i].quantity = response.quantity;
                    existingData[response.userId][i].pricePerQuantity = response.pricePerQuantity;
                }
            }
            fs.writeFile('./userToCart.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data updated in file');
                res.send('Data updated in file');
            });
        } else if (response.type === "delete") {
            // console.log(JSON.stringify(response) +" ::  "+existingData[response.userId]);
            filteredItems = existingData[response.userId].filter(item => item.itemId !== response.itemId);
            existingData[response.userId] = filteredItems;
            console.log(JSON.stringify(existingData[response.userId]) );
            fs.writeFile('./userToCart.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data deleted in file - cart');
                res.send('Data deleted in file');
            });
        }
        else if (response.type === "viewcart") {
            res.send(existingData[response.userId])
        } else {
            res.send('Invalid request type');
        }
    });
});

//retailer Interaction
app.post('/add_update_inv', (req, res) => {
    fs.readFile('./retailer.json', (err, fileData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }

        let existingData = [];
        try {
            existingData = JSON.parse(fileData);
        } catch (err) {
            console.error(err);
            return res.status(500).send('Error parsing JSON file');
        }

        const response = req.body;

        if (response.type === "add") {

            const temp = response.retailerId;
            if(existingData[temp] == undefined){
                existingData[''+temp] = [];
            }
            existingData[temp] = [...existingData[temp], ...response.itemList];
            fs.writeFile('./retailer.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data appended to file');
                res.send('Data appended to file');
            });
        } else if (response.type === "update") {
            console.log(response);
            for (let i = 0; i < existingData[response.retailerId].length; i++) {
                if (existingData[response.retailerId][i].itemId === response.itemList[0].itemId) {
                    console.log('###');
                    existingData[response.retailerId][i].quantity = response.itemList[0].quantity;
                    existingData[response.retailerId][i].pricePerQuantity = response.itemList[0].pricePerQuantity;
                }
            }
            fs.writeFile('./retailer.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data updated in file');
                res.send('Data updated in file');
            });
        } else if (response.type === "delete") {
            filteredItems = existingData[response.retailerId].filter(item => item.itemId !== response.itemList[0].itemId);
            existingData[response.retailerId] = filteredItems;
            fs.writeFile('./retailer.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data deleted in file - inv');
                res.send('Data deleted in file');
            });
        } else if (response.type === "viewinv") {
            res.send(existingData[response.retailerId])

        } else {
            res.send('Invalid request type');
        }
    });
});

//user retailer order interaction
app.post('/order', (req, res) => {
    fs.readFile('./order.json', (err, fileData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }

        let existingData = [];
        try {
            existingData = JSON.parse(fileData);
        } catch (err) {
            console.error(err);
            return res.status(500).send('Error parsing JSON file');
        }


        const response = req.body;
        //after order completes
        if (response.type === "add") {
            console.log(existingData[response.userId] ==undefined);
            [response.orderId]
            if(existingData[response.userId] == undefined){
                existingData[''+response.userId] = {};
                
            }

            existingData[response.userId][response.orderId] = response.itemList;
            fs.writeFile('./order.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data appended to file');
                res.send('Data appended to file');
            });
        } else if (response.type === "vieworder") {
            res.send(existingData[response.userId])

        } else {
            res.send('Invalid request type');
        }
    });
});

//api to add new user
app.post('/newUser_Retailer', (req, res) => {

    const response = req.body;
    if (response.type === "user") {
        fs.readFile('./userToCart.json', (err, fileData) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading file');
            }

            let existingData = [];
            try {
                existingData = JSON.parse(fileData);
            } catch (err) {
                console.error(err);
                return res.status(500).send('Error parsing JSON file');
            }
            //cretae new cart for user
            existingData[response.userId] = [];

            fs.writeFile('./userToCart.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data appended to file');
                //res.send('Data appended to file');
            });
        });
        //store user details
        // //add retailer details
        fs.readFile('./userDetails.json', (err, fileData) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading file');
            }

            let existingData = [];
            try {
                existingData = JSON.parse(fileData);
            } catch (err) {
                console.error(err);
                return res.status(500).send('Error parsing JSON file');
            }
            //cretae new details for retailer
            // existingData[response.retailerId].retailerId = response.retailerId
               
                
            // existingData[response.retailerId].retailerName = response.retailerName
            // existingData[response.retailerId].retailerImage = response.retailerImage
            // existingData[response.retailerId].homeAddress = response.homeAddress

            existingData[response.userId] = {
                "userId": response.userId,
                "userName": response.userName,
                "homeAddress": response.homeAddress
            }
            
            

            fs.writeFile('./userDetails.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data appended to file');
                res.send('Data appended to file');
            });
        });
    }
    else if (response.type === "retailer"){
        fs.readFile('./retailer.json', (err, fileData) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading file');
            }

            let existingData = [];
            try {
                existingData = JSON.parse(fileData);
            } catch (err) {
                console.error(err);
                return res.status(500).send('Error parsing JSON file');
            }
            //cretae new cart for user
            existingData[response.retailerId] = [];

            fs.writeFile('./retailer.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data appended to file');
                //res.send('Data appended to file');
            });
        });

        // //add retailer details
        fs.readFile('./retailerDetails.json', (err, fileData) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading file');
            }

            let existingData = [];
            try {
                existingData = JSON.parse(fileData);
            } catch (err) {
                console.error(err);
                return res.status(500).send('Error parsing JSON file');
            }
            //cretae new details for retailer
            // existingData[response.retailerId].retailerId = response.retailerId
               
                
            // existingData[response.retailerId].retailerName = response.retailerName
            // existingData[response.retailerId].retailerImage = response.retailerImage
            // existingData[response.retailerId].homeAddress = response.homeAddress

            existingData[response.retailerId] = {
                "retailerId": response.retailerId,
                "retailerName": response.retailerName,
                "retailerImage": "https://i.pinimg.com/originals/66/f7/72/66f77296282b5ab7c2780724802614c0.png",
                "homeAddress": response.homeAddress
            }
            
            

            fs.writeFile('./retailerDetails.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data appended to file');
                res.send('Data appended to file');
            });
        });
    }
});

//view all retailers
app.post('/retailers', (req, res) => {
    const jsonData = require('./retailerDetails.json');
    fs.readFile('./retailerDetails.json', (err, fileData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }

        let existingData = [];
        try {
            existingData = JSON.parse(fileData);
            res.send(existingData);
        } catch (err) {
            console.error(err);
            return res.status(500).send('Error parsing JSON file');
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
