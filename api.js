const jsonData = require('./data.json');

const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

//Middleware to parse JSON payloads
app.use(express.json());


// POST endpoint to send JSON data
app.post('/api/data', (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
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
            console.log('Data appended to file');
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
            existingData[response.userId] = [...existingData[response.userId], ...response.itemList];
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
            filteredItems = existingData[response.userId].filter(item => item.itemId !== response.itemId);
            existingData[response.userId] = filteredItems;
            fs.writeFile('./userToCart.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data deleted in file');
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
            existingData[response.retailerId] = [...existingData[response.retailerId], ...response.itemList];
            fs.writeFile('./retailer.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data appended to file');
                res.send('Data appended to file');
            });
        } else if (response.type === "update") {
            for (let i = 0; i < existingData[response.retailerId].length; i++) {
                if (existingData[response.retailerId][i].itemId === response.itemId) {
                    existingData[response.retailerId][i].quantity = response.quantity;
                    existingData[response.retailerId][i].pricePerQuantity = response.pricePerQuantity;
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
            filteredItems = existingData[response.retailerId].filter(item => item.itemId !== response.itemId);
            existingData[response.retailerId] = filteredItems;
            fs.writeFile('./retailer.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing file');
                }
                console.log('Data deleted in file');
                res.send('Data deleted in file');
            });
        } else if (response.type === "viewinv") {
            res.send(existingData[response.retailerId])
            
        } else {
            res.send('Invalid request type');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//api to 