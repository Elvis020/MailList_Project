const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/signup.html");
});

app.post("/", (req, res) => {
    const fname = req.body.i_fname;
    const lname = req.body.i_lname;
    const email = req.body.i_email;
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname,
            },
        }, ],
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/17f2d640ba";
    const options = {
        method: "POST",
        auth: "elvis7:16ec589f13e9e558dccaf31959ddcc85f-us17",
    };

    // Making our request  to mailchimp
    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/html/success.html");
        } else {
            res.sendFile(__dirname + "/html/failure.html");
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(port, () => {
    console.log("Server is running at http://localhost:" + port);
});